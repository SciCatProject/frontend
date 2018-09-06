import {Component, Inject, OnDestroy, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {MatCheckboxChange, MatDialog} from "@angular/material";

import {select, Store} from "@ngrx/store";

import {combineLatest, Subscription} from "rxjs";
import {take, first} from "rxjs/operators";

import {DialogComponent} from "shared/modules/dialog/dialog.component";
import {
  faCalendarAlt,
  faCertificate,
  faCoins,
  faDownload,
  faFileAlt,
  faFolder,
  faIdBadge,
  faUpload,
  faUsers
} from "@fortawesome/free-solid-svg-icons";

import {
  AddToBatchAction,
  ChangePageAction,
  ClearSelectionAction,
  DeselectDatasetAction,
  ExportToCsvAction,
  SelectAllDatasetsAction,
  SelectDatasetAction,
  SetViewModeAction,
  SortByColumnAction
} from "state-management/actions/datasets.actions";

import {
  getDatasets,
  getDatasetsInBatch,
  getDatasetsPerPage,
  getFilters,
  getIsEmptySelection,
  getIsLoading,
  getPage,
  getSelectedDatasets,
  getTotalSets,
  getViewMode
} from "state-management/selectors/datasets.selectors";

import {getCurrentEmail} from "../../state-management/selectors/users.selectors";

import * as jobActions from 'state-management/actions/jobs.actions';
import * as jobSelectors from "state-management/selectors/jobs.selectors";

import {Dataset, Job, Message, MessageType, ViewMode, User} from "state-management/models";
import {APP_CONFIG, AppConfig} from "app-config.module";
import { ShowMessageAction } from "state-management/actions/user.actions";

export interface PageChangeEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
}

export interface SortChangeEvent {
  active: keyof Dataset;
  direction: "asc" | "desc" | "";
}

@Component({
  selector: "dataset-table",
  templateUrl: "dataset-table.component.html",
  styleUrls: ["dataset-table.component.scss"]
})
export class DatasetTableComponent implements OnInit, OnDestroy {
  faIdBadge = faIdBadge;
  faFolder = faFolder;
  faCoins = faCoins
  faCalendarAlt = faCalendarAlt;
  faFileAlt = faFileAlt;
  faCertificate = faCertificate;
  faUsers = faUsers;
  faUpload = faUpload;
  faDownload = faDownload;

  private selectedSets$ = this.store.pipe(select(getSelectedDatasets));
  private datasets$ = this.store.pipe(select(getDatasets));
  private batch$ = this.store.pipe(select(getDatasetsInBatch));
  private currentPage$ = this.store.pipe(select(getPage));
  private datasetsPerPage$ = this.store.pipe(select(getDatasetsPerPage));
  private mode$ = this.store.pipe(select(getViewMode));
  private isEmptySelection$ = this.store.pipe(select(getIsEmptySelection));
  private datasetCount$ = this.store.select(getTotalSets);
  private loading$ = this.store.pipe(select(getIsLoading));
  private filters$ = this.store.pipe(select(getFilters));
  private email$ = this.store.pipe(select(getCurrentEmail));

  private allAreSeleted$ = combineLatest(
    this.datasets$,
    this.selectedSets$,
    (datasets, selected) => {
      const pids = selected.map(set => set.pid);
      return (
        datasets.length &&
        datasets.find(dataset => pids.indexOf(dataset.pid) === -1) == null
      );
    }
  );
  private selectedPids: string[] = [];
  private selectedPidsSubscription = this.selectedSets$.subscribe(datasets => {
    this.selectedPids = datasets.map(dataset => dataset.pid);
  });

  private inBatchPids: string[] = [];
  private inBatchPidsSubscription = this.batch$.subscribe(datasets => {
    this.inBatchPids = datasets.map(dataset => dataset.pid);
  });

  private modes = ["view", "archive", "retrieve"];

  // compatibility analogs of observables
  private selectedSets: Dataset[] = [];
  private selectedSetsSubscription = this.selectedSets$.subscribe(
    selectedSets => (this.selectedSets = selectedSets)
  );

  // These should be made part of the NgRX state management
  private currentMode: string;
  private modeSubscription = this.mode$.subscribe((mode: ViewMode) => {
    this.currentMode = mode;
  });
  // and eventually be removed.
  private submitJobSubscription: Subscription;
  private jobErrorSubscription: Subscription;
  private readonly defaultColumns: string[] = [
    "select",
    "pid",
    "sourceFolder",
    "size",
    "creationTime",
    "type",
    "proposalId",
    "ownerGroup",
    "archiveStatus",
    "retrieveStatus"
  ];
  visibleColumns = this.defaultColumns.filter(
    column => this.appConfig.disabledDatasetColumns.indexOf(column) === -1
  );

  constructor(
    private router: Router,
    private store: Store<any>,
    public dialog: MatDialog,
    @Inject(APP_CONFIG) private appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.submitJobSubscription = this.store
      .pipe(select(jobSelectors.submitJob))
      .subscribe(
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
              content: "Job not Submitted"
            })
          );
        }
      );

    this.jobErrorSubscription = this.store
      .pipe(select(jobSelectors.getError))
      .subscribe(err => {
        if (err) {
          this.store.dispatch(
            new ShowMessageAction({
              type: MessageType.Error,
              content: err.message
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

  onExportClick(): void {
    this.store.dispatch(new ExportToCsvAction());
  }

  /**
   * Handle changing of view mode and disabling selected rows
   * @param event
   * @param mode
   */
  onModeChange(event, mode: ViewMode): void {
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
        this.archiveOrRetrieve(true);
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
        question: "",
        input: "Destination: " + destPath
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.archiveOrRetrieve(false, destPath);
      }
    });
  }

  /**
   * Handles the archive/retrieve for all datasets in the `selected` array.
   * Needs to feed back to the user if the selected datasets cannot have the
   * action performed
   * @memberof DashboardComponent
   */
  archiveOrRetrieve(archive: boolean, destPath = "/archive/retrieve/"): void {
    
    function createJob(user: User, datasets: Dataset[], archive: boolean, destPath: string, tapeCopies: string): Job {
      const data = {
        jobParams: createJobParams(user, archive, destPath, tapeCopies),
        emailJobInitiator: user.email,
        creationTime: new Date(),
        datasetList: datasets.map(dataset => ({pid: dataset.pid, files: []})), // Revise this, files == []...? See earlier version for context
        type: archive ? 'archive' : 'retrieve'
      };

      return new Job(data);
    }
  
    function createJobParams(user: User, archive: boolean, destinationPath: string, tapeCopies: string) {
      const jobParams = {
        username: user.username,
        tapeCopies,
      };

      return archive ? jobParams : {...jobParams, destinationPath};
    }

    const currentUser$ = this.store.pipe(select(state => state.root.user.currentUser));
    const settings$ = this.store.pipe(select(state => state.root.user.settings.tapeCopies));

    combineLatest(
      currentUser$,
      settings$,
      this.selectedSets$
    ).pipe(first()).subscribe(([
      user,
      tapeCopies,
      datasets,
    ]) => {
      const email = user.email;
      if (!email) {
        this.store.dispatch(new ShowMessageAction({
          type: MessageType.Error,
          content: "No email for this user could be found, the job will not be submitted",
        }));
        return;
      }

      if (datasets.length === 0) {
        this.store.dispatch(new ShowMessageAction({
          type: MessageType.Error,
          content: "No datasets selected",
        }));
        return;
      }

      const job = createJob(user, this.selectedSets, archive, destPath, tapeCopies);
      this.store.dispatch(new ClearSelectionAction());
      this.store.dispatch(new jobActions.SubmitAction(job));
    });
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
}
