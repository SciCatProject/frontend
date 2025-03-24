import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  HostListener,
} from "@angular/core";
import { ENTER, COMMA, SPACE } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { DateTime } from "luxon";

import { MatDialog } from "@angular/material/dialog";
import { DialogComponent } from "shared/modules/dialog/dialog.component";
import { combineLatest, Observable, Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { fetchInstrumentsAction } from "state-management/actions/instruments.actions";
import { showMessageAction } from "state-management/actions/user.actions";
import {
  selectCurrentAttachments,
  selectCurrentDataset,
  selectCurrentDatasetWithoutFileInfo,
  selectCurrentOrigDatablocks,
} from "state-management/selectors/datasets.selectors";
import {
  selectCurrentUser,
  selectIsAdmin,
  selectIsLoading,
  selectProfile,
} from "state-management/selectors/user.selectors";
import { map } from "rxjs/operators";
import {
  addKeywordFilterAction,
  clearFacetsAction,
  updatePropertyAction,
  fetchOrigDatablocksAction,
} from "state-management/actions/datasets.actions";
import { Router } from "@angular/router";
import { selectCurrentProposal } from "state-management/selectors/proposals.selectors";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { AppConfigService } from "app-config.service";
import { selectCurrentSample } from "state-management/selectors/samples.selectors";
import { selectInstruments } from "state-management/selectors/instruments.selectors";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Message, MessageType } from "state-management/models";
import { DOCUMENT } from "@angular/common";
import {
  Instrument,
  OutputDatasetObsoleteDto,
  ProposalClass,
  ReturnedUserDto,
  SampleClass,
} from "@scicatproject/scicat-sdk-ts-angular";
import { AttachmentService } from "shared/services/attachment.service";
import { TranslateService } from "@ngx-translate/core";
import { SearchService } from "../../services/search.service";
import { debounceTime, switchMap, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";

// Define the ScientificMetadata interface
interface ScientificMetadata {
  measurementType?: { value: string; unit?: string };
  sampleType?: { value: string; unit?: string };
  sampleSubtype?: { value: string; unit?: string };
  duration?: {
    value: Record<string, string>;
    unit?: string;
  };
  [key: string]: any;
}

/**
 * Component to show details for a data set, using the
 * form component
 * @export
 * @class DatasetDetailComponent
 */
@Component({
  selector: "dataset-detail",
  templateUrl: "./dataset-detail.component.html",
  styleUrls: ["./dataset-detail.component.scss"],
  standalone: false,
})
export class DatasetDetailComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  private hasLoadedDatablocks = false;
  private searchTermChanged = new Subject<string>();
  private destroy$ = new Subject<void>();

  displayedColumns: string[] = [
    "numor",
    "measurementType",
    "sampleType",
    "sampleSubtype",
    "time",
  ];

  form: FormGroup;
  userProfile$ = this.store.select(selectProfile);
  isAdmin$ = this.store.select(selectIsAdmin);
  accessGroups$: Observable<string[]> = this.userProfile$.pipe(
    map((profile) => (profile ? profile.accessGroups : [])),
  );

  appConfig = this.appConfigService.getConfig();

  dataset: OutputDatasetObsoleteDto | undefined;
  datasetWithout$ = this.store.select(selectCurrentDatasetWithoutFileInfo);
  attachments$ = this.store.select(selectCurrentAttachments);
  loading$ = this.store.select(selectIsLoading);
  dataset$ = this.store.select(selectCurrentDataset);
  datablocks$ = this.store.select(selectCurrentOrigDatablocks);
  instruments: Instrument[] = [];
  proposal: ProposalClass | undefined;
  sample: SampleClass | undefined;
  user: ReturnedUserDto | undefined;
  editingAllowed = false;
  editEnabled = false;
  show = false;
  readonly separatorKeyCodes: number[] = [ENTER, COMMA, SPACE];

  sampleRows: any[] = [];
  pageSize = 500;
  currentPage = 0;
  allDatafiles: string[] = [];
  isLoadingMore = false;
  hasMoreData = true;

  activeFilters: { [key: string]: string } = {};
  numorSearchTerm = "";
  isSearching = false;
  searchResultCount = 0;
  searchTimeout: any = null;
  uniqueMeasurementTypes: string[] = [];
  uniqueSampleTypes: string[] = [];
  uniqueSampleSubtypes: string[] = [];
  filteredSampleRows: any[] = [];
  showMeasurementTypeFilter = false;
  showSampleTypeFilter = false;
  showSampleSubtypeFilter = false;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    public appConfigService: AppConfigService,
    public dialog: MatDialog,
    private attachmentService: AttachmentService,
    private translateService: TranslateService,
    private store: Store,
    private router: Router,
    private fb: FormBuilder,
    private searchService: SearchService,
  ) {
    this.translateService.use("datasetDefault");

    // Setup search term subscription with debounce
    this.searchTermChanged
      .pipe(
        debounceTime(300), // Debounce by 300ms
        switchMap((term: string) => {
          this.isSearching = true;

          if (!term) {
            // No search term, just reset and return
            this.resetSearch();
            this.isSearching = false;
            return [];
          }

          // First apply filters to already loaded data
          this.applyFilters();

          // If there are unloaded files, search them using the service
          if (this.allDatafiles.length > this.sampleRows.length) {
            const loadedFilePaths = new Set(
              this.sampleRows.map((row) => row.numor),
            );
            const unloadedFiles = this.allDatafiles
              .filter((file) => !loadedFilePaths.has(file))
              .map((filename) => {
                // Type cast scientificMetadata to our interface type
                const metadata = (this.dataset?.scientificMetadata ||
                  {}) as ScientificMetadata;
                return {
                  numor: filename || "",
                  measurementType: metadata.measurementType?.value || "",
                  sampleType: metadata.sampleType?.value || "",
                  sampleSubtype: metadata.sampleSubtype?.value || "",
                  time: metadata.duration?.value?.[filename] || "",
                  timeUnit: metadata.duration?.unit || "",
                };
              });

            return this.searchService.searchFiles(
              unloadedFiles,
              term,
              this.activeFilters,
            );
          }

          return [];
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(
        (matchedRows) => {
          if (matchedRows.length > 0) {
            // Add new rows to our sampleRows if they aren't already there
            const existingNumors = new Set(
              this.sampleRows.map((row) => row.numor),
            );
            const newRows = matchedRows.filter(
              (row) => !existingNumors.has(row.numor),
            );

            if (newRows.length > 0) {
              this.sampleRows = [...this.sampleRows, ...newRows];
              // Re-apply filters to update our displayed results
              this.applyFilters();
            }
          }

          this.isSearching = false;
        },
        (error) => {
          console.error("Error during search:", error);
          this.isSearching = false;
        },
      );
  }

  private extractSampleRows(
    metadata: unknown,
    datafiles?: string[],
    page = 0,
    pageSize = 500,
    append = false,
  ): unknown[] {
    if (!metadata || !datafiles?.length) {
      return [];
    }

    // Store all datafiles first time
    if (page === 0) {
      this.allDatafiles = [...datafiles];
      this.currentPage = 0;
      this.hasMoreData = datafiles.length > pageSize;
    }

    const start = page * pageSize;
    const end = Math.min(start + pageSize, datafiles.length);

    if (start >= datafiles.length) {
      this.hasMoreData = false;
      return append ? [...this.sampleRows] : [];
    }

    const meta = metadata as Record<string, { value: string; unit: string }>;
    const filesToProcess = datafiles.slice(start, end);

    const rows = filesToProcess.map((filename) => ({
      numor: filename || "",
      measurementType: meta.measurementType?.value || "",
      sampleType: meta.sampleType?.value || "",
      sampleSubtype: meta.sampleSubtype?.value || "",
      time: meta.duration?.value?.[filename] || "",
      timeUnit: meta.duration?.unit || "",
    }));

    const result = append ? [...this.sampleRows, ...rows] : rows;

    if (page === 0) {
      this.filteredSampleRows = [...result];
      this.activeFilters = {};
      setTimeout(() => this.extractUniqueColumnValues(), 0);
    } else if (append) {
      this.applyFilters();
    }

    return result;
  }

  private extractUniqueColumnValues(): void {
    if (!this.sampleRows?.length) {
      this.uniqueMeasurementTypes = [];
      this.uniqueSampleTypes = [];
      this.uniqueSampleSubtypes = [];
      return;
    }

    const measurementTypes = new Set<string>();
    const sampleTypes = new Set<string>();
    const sampleSubtypes = new Set<string>();

    this.sampleRows.forEach((row) => {
      if (row.measurementType && row.measurementType.trim()) {
        measurementTypes.add(row.measurementType);
      }
      if (row.sampleType && row.sampleType.trim()) {
        sampleTypes.add(row.sampleType);
      }
      if (row.sampleSubtype && row.sampleSubtype.trim()) {
        sampleSubtypes.add(row.sampleSubtype);
      }
    });

    this.uniqueMeasurementTypes = Array.from(measurementTypes).sort();
    this.uniqueSampleTypes = Array.from(sampleTypes).sort();
    this.uniqueSampleSubtypes = Array.from(sampleSubtypes).sort();
  }

  private applyFilters(): void {
    if (Object.keys(this.activeFilters).length === 0 && !this.numorSearchTerm) {
      this.filteredSampleRows = [...this.sampleRows];
      this.searchResultCount = this.filteredSampleRows.length;
      return;
    }

    this.filteredSampleRows = this.sampleRows.filter((row) => {
      if (
        this.numorSearchTerm &&
        !row.numor.toLowerCase().includes(this.numorSearchTerm.toLowerCase())
      ) {
        return false;
      }

      for (const [key, value] of Object.entries(this.activeFilters)) {
        if (row[key] !== value) {
          return false;
        }
      }
      return true;
    });

    this.searchResultCount = this.filteredSampleRows.length;
  }

  private async performDeepSearch(): Promise<void> {
    if (!this.numorSearchTerm || !this.dataset?.scientificMetadata) {
      return;
    }

    this.isSearching = true;

    try {
      const matchingRows: any[] = [];
      const searchTerm = this.numorSearchTerm.toLowerCase();
      const loadedFilePaths = new Set(this.sampleRows.map((row) => row.numor));
      const unloadedFiles = this.allDatafiles.filter(
        (file) => !loadedFilePaths.has(file),
      );

      if (unloadedFiles.length === 0) {
        return;
      }

      for (let i = 0; i < unloadedFiles.length; i += this.pageSize) {
        await new Promise((resolve) => setTimeout(resolve, 0));

        const end = Math.min(i + this.pageSize, unloadedFiles.length);
        const chunk = unloadedFiles.slice(i, end);

        const meta = this.dataset.scientificMetadata as Record<
          string,
          { value: string; unit: string }
        >;

        const matchingFiles = chunk.filter((filename) =>
          filename.toLowerCase().includes(searchTerm),
        );

        const newRows = matchingFiles.map((filename) => ({
          numor: filename || "",
          measurementType: meta.measurementType?.value || "",
          sampleType: meta.sampleType?.value || "",
          sampleSubtype: meta.sampleSubtype?.value || "",
          time: meta.duration?.value?.[filename] || "",
          timeUnit: meta.duration?.unit || "",
        }));

        matchingRows.push(...newRows);
      }

      // If we have active filters, we need to apply them to the search results
      const filteredMatchingRows = matchingRows.filter((row) => {
        for (const [key, value] of Object.entries(this.activeFilters)) {
          if (row[key] !== value) {
            return false;
          }
        }
        return true;
      });

      // Merge with existing search results from loaded data
      this.sampleRows = [...this.sampleRows, ...matchingRows];

      // Update filtered rows with all matching rows (both from loaded data and deep search)
      this.applyFilters();
    } finally {
      this.isSearching = false;
    }
  }

  /**
   * Reset the search and restore original pagination behavior
   */
  private resetSearch(): void {
    this.currentPage = 0;
    this.hasMoreData = this.allDatafiles.length > this.pageSize;

    // Re-extract initial rows to reset the view
    if (this.dataset?.scientificMetadata) {
      this.sampleRows = this.extractSampleRows(
        this.dataset.scientificMetadata,
        this.allDatafiles,
        0,
        this.pageSize,
        false,
      ) as any[];
    }

    this.applyFilters();
  }

  onNumorSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.numorSearchTerm = input.value;

    // Emit the new search term to trigger the search pipeline
    this.searchTermChanged.next(this.numorSearchTerm);

    event.stopPropagation();
  }

  clearNumorSearch(event: Event): void {
    this.numorSearchTerm = "";
    this.searchTermChanged.next("");
    event.stopPropagation();
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    this.showMeasurementTypeFilter = false;
    this.showSampleTypeFilter = false;
    this.showSampleSubtypeFilter = false;
  }

  toggleMeasurementTypeFilter(event: MouseEvent): void {
    event.stopPropagation();
    this.showMeasurementTypeFilter = !this.showMeasurementTypeFilter;
    this.showSampleTypeFilter = false;
    this.showSampleSubtypeFilter = false;
    this.extractUniqueColumnValues();
  }

  toggleSampleTypeFilter(event: MouseEvent): void {
    event.stopPropagation();
    this.showSampleTypeFilter = !this.showSampleTypeFilter;
    this.showMeasurementTypeFilter = false;
    this.showSampleSubtypeFilter = false;
    this.extractUniqueColumnValues();
  }

  toggleSampleSubtypeFilter(event: MouseEvent): void {
    event.stopPropagation();
    this.showSampleSubtypeFilter = !this.showSampleSubtypeFilter;
    this.showMeasurementTypeFilter = false;
    this.showSampleTypeFilter = false;
    this.extractUniqueColumnValues();
  }

  applyMeasurementTypeFilter(type: string | null, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (type === null) {
      delete this.activeFilters["measurementType"];
    } else {
      this.activeFilters["measurementType"] = type;
    }
    this.applyFilters();
    this.showMeasurementTypeFilter = false;
  }

  applySampleTypeFilter(type: string | null, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (type === null) {
      delete this.activeFilters["sampleType"];
    } else {
      this.activeFilters["sampleType"] = type;
    }
    this.applyFilters();
    this.showSampleTypeFilter = false;
  }

  applySampleSubtypeFilter(subtype: string | null, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
    }
    if (subtype === null) {
      delete this.activeFilters["sampleSubtype"];
    } else {
      this.activeFilters["sampleSubtype"] = subtype;
    }
    this.applyFilters();
    this.showSampleSubtypeFilter = false;
  }

  loadMoreRows(): void {
    if (
      !this.hasMoreData ||
      this.isLoadingMore ||
      !this.dataset?.scientificMetadata
    ) {
      return;
    }

    this.isLoadingMore = true;
    this.currentPage++;

    // Small timeout to prevent UI freezing when loading new data
    setTimeout(() => {
      this.sampleRows = this.extractSampleRows(
        this.dataset.scientificMetadata,
        this.allDatafiles,
        this.currentPage,
        this.pageSize,
        true, // append to existing rows
      );
      this.isLoadingMore = false;
    }, 100);
  }

  onVirtualScroll(event: any): void {
    // Load more data when user scrolls near the bottom
    const scrollPosition = event.target.scrollTop + event.target.clientHeight;
    const scrollHeight = event.target.scrollHeight;

    // Load more when user is within 200px of the bottom
    if (
      scrollHeight - scrollPosition < 200 &&
      this.hasMoreData &&
      !this.isLoadingMore
    ) {
      this.loadMoreRows();
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      datasetName: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      keywords: this.fb.array([]),
    });
    this.subscriptions.push(
      combineLatest([
        this.dataset$,
        this.accessGroups$,
        this.isAdmin$,
      ]).subscribe(([dataset, groups, isAdmin]) => {
        this.dataset = dataset;
        if (dataset && !this.hasLoadedDatablocks) {
          this.editingAllowed =
            groups.indexOf(dataset.ownerGroup) !== -1 || isAdmin;
          // Only fetch if we haven't already
          this.store.dispatch(fetchOrigDatablocksAction({ pid: dataset.pid }));

          if (dataset.instrumentIds && dataset.instrumentIds.length > 0) {
            this.store.dispatch(fetchInstrumentsAction());
          }
          this.hasLoadedDatablocks = true;
          this.show = true;
        }
      }),
    );

    this.subscriptions.push(
      this.store.select(selectInstruments).subscribe((instruments) => {
        this.instruments = instruments || [];
      }),
    );

    this.subscriptions.push(
      this.store.select(selectCurrentProposal).subscribe((proposal) => {
        this.proposal = proposal;
      }),
    );

    this.subscriptions.push(
      this.store.select(selectCurrentSample).subscribe((sample) => {
        this.sample = sample;
      }),
    );

    this.subscriptions.push(
      this.store.select(selectCurrentUser).subscribe((user) => {
        if (user) {
          this.user = user;
        }
      }),
    );

    this.subscriptions.push(
      combineLatest([this.dataset$, this.datablocks$]).subscribe(
        ([dataset, datablocks]) => {
          if (dataset && datablocks) {
            // Check both are available
            this.dataset = dataset;
            const files: string[] = [];
            datablocks.forEach((block) => {
              if (block.dataFileList) {
                // Add null check for dataFileList
                block.dataFileList.forEach((file) => {
                  files.push(file.path);
                });
              }
            });

            if (dataset.scientificMetadata && files.length > 0) {
              this.currentPage = 0;
              this.sampleRows = this.extractSampleRows(
                dataset.scientificMetadata,
                files,
                0,
                this.pageSize,
                false,
              );
            }
          }
        },
      ),
    );
  }

  onEditModeEnable() {
    this.form = this.fb.group({
      datasetName: this.dataset.datasetName || "",
      description: this.dataset.description || "",
      keywords: this.fb.array(this.dataset.keywords || []),
    });
    this.editEnabled = true;
  }

  onClickKeyword(keyword: string) {
    this.store.dispatch(clearFacetsAction());
    this.store.dispatch(addKeywordFilterAction({ keyword }));
    this.router.navigateByUrl("/datasets");
  }

  get keywords(): FormArray {
    return this.form.controls.keywords as FormArray;
  }

  onAddKeyword(event: MatChipInputEvent): void {
    const input = event.chipInput.inputElement;
    const value = event.value;

    if ((value || "").trim() && this.dataset) {
      const keyword = value.trim().toLowerCase();
      if (this.keywords.value.indexOf(keyword) === -1) {
        this.keywords.push(this.fb.control(keyword));

        // Reset the input value
        if (input) {
          input.value = "";
        }
      }
    }
  }

  onRemoveKeyword(keyword: string): void {
    const index = this.keywords.value.indexOf(keyword);
    if (index >= 0) {
      this.keywords.removeAt(index);
    }
  }

  onSaveGeneralInformationChanges() {
    const pid = this.dataset.pid;

    if (pid) {
      const property = {
        datasetName: this.form.value.datasetName,
        description: this.form.value.description,
        keywords: this.keywords.value,
      };

      this.store.dispatch(updatePropertyAction({ pid, property }));
    }

    this.editEnabled = false;
  }

  onRemoveShare(share: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "auto",
      data: {
        title: `Really remove ${share}?`,
        question: `If you click 'Ok', ${share} will no longer be able to access this Dataset.`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.dataset) {
        const index = this.dataset.sharedWith.indexOf(share);
        if (index >= 0) {
          const pid = this.dataset.pid;
          const sharedWith: string[] = [...this.dataset.sharedWith];
          sharedWith.splice(index, 1);
          const property = { sharedWith };
          this.store.dispatch(updatePropertyAction({ pid, property }));
        }
      }
    });
  }

  onClickInstrument(instrumentId: string): void {
    const pid = encodeURIComponent(instrumentId);
    this.router.navigateByUrl("/instruments/" + pid);
  }

  onClickProposal(proposalId: string): void {
    const id = encodeURIComponent(proposalId);
    this.router.navigateByUrl("/proposals/" + id);
  }

  onClickSample(sampleId: string): void {
    const id = encodeURIComponent(sampleId);
    this.router.navigateByUrl("/samples/" + id);
  }

  onSlidePublic(event: MatSlideToggleChange) {
    if (this.dataset) {
      const pid = this.dataset.pid;
      const property = { isPublished: event.checked };
      this.store.dispatch(updatePropertyAction({ pid, property }));
    }
  }

  onSaveMetadata(metadata: Record<string, any>) {
    if (this.dataset) {
      const pid = this.dataset.pid;
      const property = { scientificMetadata: metadata };
      this.store.dispatch(updatePropertyAction({ pid, property }));
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });

    // Clean up our observables
    this.destroy$.next();
    this.destroy$.complete();
  }

  onCopy(pid: string) {
    const selectionBox = this.document.createElement("textarea");
    selectionBox.style.position = "fixed";
    selectionBox.style.left = "0";
    selectionBox.style.top = "0";
    selectionBox.style.opacity = "0";
    selectionBox.value = pid;
    this.document.body.appendChild(selectionBox);
    selectionBox.focus();
    selectionBox.select();
    this.document.execCommand("copy");
    this.document.body.removeChild(selectionBox);

    const message = new Message(
      "Dataset PID has been copied to your clipboard",
      MessageType.Success,
      5000,
    );
    this.store.dispatch(showMessageAction({ message }));
  }
  base64MimeType(encoded: string): string {
    return this.attachmentService.base64MimeType(encoded);
  }

  getImageUrl(encoded: string) {
    return this.attachmentService.getImageUrl(encoded);
  }

  openAttachment(encoded: string) {
    this.attachmentService.openAttachment(encoded);
  }

  getObjectKeys(obj: unknown): string[] {
    return Object.keys(obj);
  }

  /**
   * Filters and cleans sample properties, removing any properties that should be excluded
   */
  filterSampleProperties(
    sampleProps: Record<string, unknown>,
  ): Record<string, unknown> {
    if (!sampleProps) {
      return {};
    }

    // Create a copy so we don't modify the original object
    const filteredProps = { ...sampleProps };

    // Remove the property to exclude
    if ("additional_environment" in filteredProps) {
      delete filteredProps["additional_environment"];
    }

    // Also apply the empty values cleaning
    return this.clearEmptyValues(filteredProps);
  }

  /**
   * Removes empty string values from an object (modifies the object in-place)
   */
  clearEmptyValues(obj: Record<string, unknown>): Record<string, unknown> {
    if (!obj || typeof obj !== "object") {
      return obj;
    }

    const queue = [obj];
    while (queue.length > 0) {
      const current = queue.pop();
      for (const key in current) {
        if (
          typeof current[key] === "string" &&
          (current[key] as string).trim() === ""
        ) {
          // Remove empty/whitespace-only strings
          delete current[key];
        } else if (typeof current[key] === "object" && current[key] !== null) {
          // Process nested objects
          queue.push(current[key] as Record<string, unknown>);
        }
      }
    }

    return obj;
  }

  /**
   * Checks if a value is an object (but not an array or null)
   */
  isObject(val: unknown): boolean {
    return val !== null && typeof val === "object" && !Array.isArray(val);
  }

  formatNumberWithDecimals(value: unknown, number_decimals: number): string {
    // Handle null/undefined/empty cases
    if (value === null || value === undefined || value === "") {
      return "";
    }

    const num = parseFloat(String(value));

    // Return original value if not a valid number
    if (isNaN(num) || !isFinite(num)) {
      return String(value);
    }

    // Use scientific notation for specific ranges
    if ((num !== 0 && Math.abs(num) < 1) || Math.abs(num) > 1000) {
      return num.toExponential(number_decimals);
    }

    // Use fixed notation for other numbers
    return num.toFixed(number_decimals);
  }

  openHDF5Viewer(url: string, row: unknown = null): void {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  getInstrumentName(instrumentId: string): string {
    if (!instrumentId) return "-";

    // Just search directly in the instruments array
    const foundInstrument = this.instruments.find(
      (i) => i.pid === instrumentId,
    );
    return foundInstrument?.name || instrumentId;
  }
}
