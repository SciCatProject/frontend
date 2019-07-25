import { APP_CONFIG, AppConfig } from "app-config.module";
import { ArchivingService } from "../archiving.service";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { Dataset, MessageType, ArchViewMode } from "state-management/models";
import { DialogComponent } from "shared/modules/dialog/dialog.component";
import { MatCheckboxChange, MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { ShowMessageAction } from "state-management/actions/user.actions";
import { Subscription } from "rxjs";
import {
  getDisplayedColumns,
  getConfigurableColumns
} from "../../state-management/selectors/users.selectors";
import { getError, submitJob } from "state-management/selectors/jobs.selectors";
import { select, Store } from "@ngrx/store";
import {
  AddToBatchAction,
  ChangePageAction,
  ClearSelectionAction,
  DeselectDatasetAction,
  SelectAllDatasetsAction,
  SelectDatasetAction,
  SetViewModeAction,
  SortByColumnAction
} from "state-management/actions/datasets.actions";

import {
  getDatasets,
  getDatasetsPerPage,
  getIsLoading,
  getPage,
  getSelectedDatasets,
  getTotalSets,
  getViewMode
} from "state-management/selectors/datasets.selectors";

export interface PageChangeEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
}

export interface SortChangeEvent {
  active: keyof Dataset;
  direction: "asc" | "desc" | "";
}

import {
  SelectColumnAction,
  DeselectColumnAction
} from "state-management/actions/user.actions";
import { FormControl } from "@angular/forms";

@Component({
  selector: "dataset-table",
  templateUrl: "dataset-table.component.html",
  styleUrls: ["dataset-table.component.scss"]
})
export class DatasetTableComponent implements OnInit, OnDestroy {
  datasets$ = this.store.pipe(select(getDatasets));
  currentPage$ = this.store.pipe(select(getPage));
  datasetsPerPage$ = this.store.pipe(select(getDatasetsPerPage));
  datasetCount$ = this.store.select(getTotalSets);
  loading$ = this.store.pipe(select(getIsLoading));

  public currentMode: ArchViewMode;
  private selectedSets$ = this.store.pipe(select(getSelectedDatasets));
  private mode$ = this.store.pipe(select(getViewMode));
  private selectedPids: string[] = [];
  private selectedPidsSubscription = this.selectedSets$.subscribe(datasets => {
    this.selectedPids = datasets.map(dataset => dataset.pid);
  });
  private inBatchPids: string[] = [];
  public viewModes = ArchViewMode;
  private modes = [
    ArchViewMode.all,
    ArchViewMode.archivable,
    ArchViewMode.retrievable,
    ArchViewMode.work_in_progress,
    ArchViewMode.system_error,
    ArchViewMode.user_error
  ];
  private modeLabels = [
    ArchViewMode.all,
    ArchViewMode.archivable,
    ArchViewMode.retrievable,
    ArchViewMode.work_in_progress,
    ArchViewMode.system_error,
    ArchViewMode.user_error
  ];
  // compatibility analogs of observables
  private selectedSets: Dataset[] = [];
  private selectedSetsSubscription = this.selectedSets$.subscribe(
    selectedSets => (this.selectedSets = selectedSets)
  );
  private modeSubscription = this.mode$.subscribe((mode: ArchViewMode) => {
    this.currentMode = mode;
  });
  // and eventually be removed.
  private submitJobSubscription: Subscription;
  private jobErrorSubscription: Subscription;
  dispColumns$ = this.store.pipe(select(getDisplayedColumns));
  configCols$ = this.store.pipe(select(getConfigurableColumns));
  configForm = new FormControl();
  $ = this.store.pipe(select(getConfigurableColumns)).subscribe(
    ret => {
      // this is required to set all columns check to true
      // param must match the type defined by the ngFor in template
      this.configForm.setValue(ret);
      });

  constructor(
    private router: Router,
    private store: Store<any>,
    private archivingSrv: ArchivingService,
    public dialog: MatDialog,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.submitJobSubscription = this.store.pipe(select(submitJob)).subscribe(
      ret => {
        if (ret && Array.isArray(ret)) {
          console.log(ret);
          this.store.dispatch(new ClearSelectionAction());
        }
      },
      error => {
        this.store.dispatch(
          new ShowMessageAction({
            type: MessageType.Error,
            content: "Job not Submitted",
            duration: 5000
          })
        );
      }
    );

    this.jobErrorSubscription = this.store
      .pipe(select(getError))
      .subscribe(err => {
        if (err) {
          this.store.dispatch(
            new ShowMessageAction({
              type: MessageType.Error,
              content: err.message,
              duration: 5000
            })
          );
        }
      });
  }

  ngOnDestroy() {
    this.modeSubscription.unsubscribe();
    this.selectedSetsSubscription.unsubscribe();
    this.submitJobSubscription.unsubscribe();
    this.jobErrorSubscription.unsubscribe();
    this.selectedPidsSubscription.unsubscribe();
  }

  onSelectColumn(event: any): void {
    const column = event.source.value;
    if (event.isUserInput) {
      if (event.source.selected) {
        this.store.dispatch(new SelectColumnAction(column));
      } else if (!event.source.selected) {
        this.store.dispatch(new DeselectColumnAction(column));
      }
    }
  }

  onExportClick(): void {
    this.store.dispatch(new ExportToCsvAction());
  }

  /**
   * Handle changing of view mode and disabling selected rows
   * @param event
   * @param mode
   */
  onModeChange(event, mode: ArchViewMode): void {
    this.store.dispatch(new SetViewModeAction(mode));
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
          () => this.store.dispatch(new ClearSelectionAction()),
          err =>
            this.store.dispatch(
              new ShowMessageAction({
                type: MessageType.Error,
                content: err.message,
                duration: 5000
              })
            )
        );
      }
      // this.onClose.emit(result);
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
          () => this.store.dispatch(new ClearSelectionAction()),
          err =>
            this.store.dispatch(
              new ShowMessageAction({
                type: MessageType.Error,
                content: err.message,
                duration: 5000
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

  isInBatch(dataset: Dataset): boolean {
    return this.inBatchPids.indexOf(dataset.pid) !== -1;
  }

  onSelect(event: MatCheckboxChange, dataset: Dataset): void {
    if (event.checked) {
      this.store.dispatch(new SelectDatasetAction(dataset));
    } else {
      this.store.dispatch(new DeselectDatasetAction(dataset));
    }
  }

  onSelectAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.store.dispatch(new SelectAllDatasetsAction());
    } else {
      this.store.dispatch(new ClearSelectionAction());
    }
  }

  onPageChange(event: PageChangeEvent): void {
    this.store.dispatch(new ChangePageAction(event.pageIndex, event.pageSize));
  }

  onSortChange(event: SortChangeEvent): void {
    const { active: column, direction } = event;
    this.store.dispatch(new SortByColumnAction(column, direction));
  }

  onAddToBatch(): void {
    this.store.dispatch(new AddToBatchAction());
    this.store.dispatch(new ClearSelectionAction());
  }

  setWidthColor(datasetSize) {
    let width = 10;
    let color = "red";
    if (datasetSize > 1000000000) {
      width = 10;
      color = "red";
    } else {
      width = 5;
      color = "green";
    }
    const styles = {
      "background-color": "red",
      "width.px": width
    };
    return styles;
  }
}
