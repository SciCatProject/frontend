import { APP_CONFIG, AppConfig } from "app-config.module";
import { ArchivingService } from "../archiving.service";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { Dataset, MessageType, ArchViewMode } from "state-management/models";
import { DialogComponent } from "shared/modules/dialog/dialog.component";
import { MatCheckboxChange, MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import {
  showMessageAction,
  selectColumnAction,
  deselectColumnAction
} from "state-management/actions/user.actions";
import { Subscription } from "rxjs";
import {
  getColumns,
  getIsLoading
} from "../../state-management/selectors/user.selectors";
import { getSubmitError } from "state-management/selectors/jobs.selectors";
import { select, Store } from "@ngrx/store";
import {
  clearSelectionAction,
  setArchiveViewModeAction,
  setPublicViewModeAction,
  selectDatasetAction,
  deselectDatasetAction,
  selectAllDatasetsAction,
  changePageAction,
  sortByColumnAction,
  addToBatchAction
} from "state-management/actions/datasets.actions";

import {
  getDatasets,
  getDatasetsPerPage,
  getPage,
  getSelectedDatasets,
  getTotalSets,
  getArchiveViewMode,
  getPublicViewMode
} from "state-management/selectors/datasets.selectors";
import { FormControl } from "@angular/forms";
import { PageChangeEvent } from "shared/modules/table/table.component";

export interface SortChangeEvent {
  active: keyof Dataset;
  direction: "asc" | "desc" | "";
}

interface DatasetDerivationsMap {
  datasetPid: string;
  derivedDatasetsNum: number;
}

@Component({
  selector: "dataset-table",
  templateUrl: "dataset-table.component.html",
  styleUrls: ["dataset-table.component.scss"]
})
export class DatasetTableComponent implements OnInit, OnDestroy {
  datasets: Dataset[];
  currentPage$ = this.store.pipe(select(getPage));
  datasetsPerPage$ = this.store.pipe(select(getDatasetsPerPage));
  datasetCount$ = this.store.select(getTotalSets);
  loading$ = this.store.pipe(select(getIsLoading));

  private subscriptions: Subscription[] = [];

  configForm = new FormControl();
  configColumns: string[] = [];
  displayedColumns: string[] = [];

  private selectedPids: string[] = [];
  selectedSets: Dataset[] = [];
  private inBatchPids: string[] = [];

  public currentArchViewMode: ArchViewMode;
  public viewModes = ArchViewMode;
  private modes = [
    ArchViewMode.all,
    ArchViewMode.archivable,
    ArchViewMode.retrievable,
    ArchViewMode.work_in_progress,
    ArchViewMode.system_error,
    ArchViewMode.user_error
  ];

  searchPublicDataEnabled = this.appConfig.searchPublicDataEnabled;
  currentPublicViewMode = false;

  datasetPids: string[] = [];
  datasetDerivationsMaps: DatasetDerivationsMap[] = [];
  derivationMapPids: string[] = [];

  onSelectColumn(event: any): void {
    const column = event.source.value;
    if (event.isUserInput) {
      if (event.source.selected) {
        this.store.dispatch(selectColumnAction({ column }));
      } else if (!event.source.selected) {
        this.store.dispatch(deselectColumnAction({ column }));
      }
    }
  }

  /**
   * Handle changing of view mode and disabling selected rows
   * @param event
   * @param mode
   */
  onModeChange(event, mode: ArchViewMode): void {
    this.store.dispatch(setArchiveViewModeAction({ modeToggle: mode }));
  }

  onViewPublicChange(value: boolean): void {
    this.currentPublicViewMode = value;
    this.store.dispatch(
      setPublicViewModeAction({ isPublished: this.currentPublicViewMode })
    );
  }

  /**
   * Sends archive command for selected datasets (default includes all
   * datablocks for now) to Dacat API
   * @param {any} event - click handler (not currently used)
   * @memberof DashboardComponent
   */
  archiveClickHandle(event): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "auto",
      data: { title: "Really archive?", question: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.archivingSrv.archive(this.selectedSets).subscribe(
          () => this.store.dispatch(clearSelectionAction()),
          err =>
            this.store.dispatch(
              showMessageAction({
                message: {
                  type: MessageType.Error,
                  content: err.message,
                  duration: 5000
                }
              })
            )
        );
      }
    });
  }

  /**
   * Sends retrieve command for selected datasets
   * @param {any} event - click handler (not currently used)
   * @memberof DashboardComponent
   */
  retrieveClickHandle(event): void {
    const destPath = "/archive/retrieve";
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "auto",
      data: {
        title: "Really retrieve?",
        question: ""
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.archivingSrv.retrieve(this.selectedSets, destPath).subscribe(
          () => this.store.dispatch(clearSelectionAction()),
          err =>
            this.store.dispatch(
              showMessageAction({
                message: {
                  type: MessageType.Error,
                  content: err.message,
                  duration: 5000
                }
              })
            )
        );
      }
    });
  }

  // conditional to asses dataset status and assign correct icon ArchViewMode.work_in_progress
  // TODO: when these concepts stabilise, we should move the definitions to site config
  wipCondition(dataset: Dataset): boolean {
    if (
      !dataset.datasetlifecycle.archivable &&
      !dataset.datasetlifecycle.retrievable &&
      dataset.datasetlifecycle.archiveStatusMessage !==
        "scheduleArchiveJobFailed" &&
      dataset.datasetlifecycle.retrieveStatusMessage !==
        "scheduleRetrieveJobFailed"
    ) {
      return true;
    }
    return false;
  }

  systemErrorCondition(dataset: Dataset): boolean {
    if (
      (dataset.datasetlifecycle.retrievable &&
        dataset.datasetlifecycle.archivable) ||
      dataset.datasetlifecycle.archiveStatusMessage ===
        "scheduleArchiveJobFailed" ||
      dataset.datasetlifecycle.retrieveStatusMessage ===
        "scheduleRetrieveJobFailed"
    ) {
      return true;
    }
    return false;
  }

  userErrorCondition(dataset: Dataset): boolean {
    if (dataset.datasetlifecycle.archiveStatusMessage === "missingFilesError") {
      return true;
    }
    return false;
  }

  archivableCondition(dataset: Dataset): boolean {
    if (
      dataset.datasetlifecycle.archivable &&
      !dataset.datasetlifecycle.retrievable &&
      dataset.datasetlifecycle.archiveStatusMessage !== "missingFilesError"
    ) {
      return true;
    }
    return false;
  }

  retrievableCondition(dataset: Dataset): boolean {
    if (
      !dataset.datasetlifecycle.archivable &&
      dataset.datasetlifecycle.retrievable
    ) {
      return true;
    }
    return false;
  }

  onClick(dataset: Dataset): void {
    const pid = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl("/datasets/" + pid);
  }

  isSelected(dataset: Dataset): boolean {
    return this.selectedPids.indexOf(dataset.pid) !== -1;
  }

  isAllSelected(): boolean {
    const numSelected = this.selectedSets ? this.selectedSets.length : 0;
    const numRows = this.datasets ? this.datasets.length : 0;
    return numSelected === numRows;
  }

  isInBatch(dataset: Dataset): boolean {
    return this.inBatchPids.indexOf(dataset.pid) !== -1;
  }

  onSelect(event: MatCheckboxChange, dataset: Dataset): void {
    if (event.checked) {
      this.store.dispatch(selectDatasetAction({ dataset }));
    } else {
      this.store.dispatch(deselectDatasetAction({ dataset }));
    }
  }

  onSelectAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.store.dispatch(selectAllDatasetsAction());
    } else {
      this.store.dispatch(clearSelectionAction());
    }
  }

  onPageChange(event: PageChangeEvent): void {
    this.store.dispatch(
      changePageAction({ page: event.pageIndex, limit: event.pageSize })
    );
  }

  onSortChange(event: SortChangeEvent): void {
    const { active: column, direction } = event;
    this.store.dispatch(sortByColumnAction({ column, direction }));
  }

  onAddToBatch(): void {
    this.store.dispatch(addToBatchAction());
    this.store.dispatch(clearSelectionAction());
  }

  countDerivedDatasets(dataset: Dataset): number {
    let derivedDatasetsNum = 0;
    if (dataset.history) {
      dataset.history.forEach(item => {
        if (
          item.hasOwnProperty("derivedDataset") &&
          this.datasetPids.includes(item.derivedDataset.pid)
        ) {
          derivedDatasetsNum++;
        }
      });
    }
    return derivedDatasetsNum;
  }

  constructor(
    private router: Router,
    private store: Store<any>,
    private archivingSrv: ArchivingService,
    public dialog: MatDialog,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(select(getDatasets)).subscribe(datasets => {
        this.datasets = datasets;
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getSubmitError)).subscribe(err => {
        if (!err) {
          this.store.dispatch(clearSelectionAction());
        }
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getColumns)).subscribe(tableColumns => {
        this.configColumns = tableColumns
          .filter(column => column.name !== "select")
          .map(column => column.name);

        const setTrue = tableColumns
          .filter(column => column.enabled)
          .filter(column => column.name !== "select")
          .map(column => column.name);

        this.displayedColumns = tableColumns
          .filter(column => column.enabled)
          .map(column => column.name);

        this.configForm.setValue(setTrue);
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getDatasets)).subscribe(datasets => {
        this.datasetPids = datasets.map(dataset => dataset.pid);
        this.derivationMapPids = this.datasetDerivationsMaps.map(
          datasetderivationMap => datasetderivationMap.datasetPid
        );
        datasets.forEach(dataset => {
          if (!this.derivationMapPids.includes(dataset.pid)) {
            const map: DatasetDerivationsMap = {
              datasetPid: dataset.pid,
              derivedDatasetsNum: this.countDerivedDatasets(dataset)
            };
            this.datasetDerivationsMaps.push(map);
          }
        });
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getSelectedDatasets)).subscribe(selectedSets => {
        this.selectedSets = selectedSets;
        this.selectedPids = selectedSets.map(dataset => dataset.pid);
      })
    );

    this.subscriptions.push(
      this.store
        .pipe(select(getArchiveViewMode))
        .subscribe((mode: ArchViewMode) => {
          this.currentArchViewMode = mode;
        })
    );

    this.subscriptions.push(
      this.store.pipe(select(getPublicViewMode)).subscribe(publicViewMode => {
        this.currentPublicViewMode = publicViewMode;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
