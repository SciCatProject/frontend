import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatCheckboxChange} from '@angular/material';

import {Store, select} from '@ngrx/store';

import {Subscription, combineLatest} from 'rxjs';
import {take} from 'rxjs/operators';

import {DialogComponent} from 'shared/modules/dialog/dialog.component';

import {
  ExportToCsvAction,
  SelectDatasetAction,
  DeselectDatasetAction,
  SelectAllDatasetsAction,
  ClearSelectionAction,
  ChangePageAction,
  SortByColumnAction,
  SetViewModeAction,
  AddToBatchAction
} from 'state-management/actions/datasets.actions';

import * as ua from 'state-management/actions/user.actions';
import * as ja from 'state-management/actions/jobs.actions';

import {
  getDatasets,
  getSelectedDatasets,
  getPage,
  getViewMode,
  isEmptySelection,
  getDatasetsPerPage,
  getIsLoading,
  getTotalSets,
  getFilters,
  getDatasetsInBatch
} from 'state-management/selectors/datasets.selectors';

import * as jobSelectors from 'state-management/selectors/jobs.selectors';

import { Job, Dataset, Message, MessageType, ViewMode } from 'state-management/models';
import { APP_CONFIG, AppConfig } from 'app-config.module';

export interface PageChangeEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
}

export interface SortChangeEvent {
  active: keyof Dataset;
  direction: 'asc' | 'desc' | '';
}

@Component({
  selector: 'dataset-table',
  templateUrl: 'dataset-table.component.html',
  styleUrls: ['dataset-table.component.scss']
})
export class DatasetTableComponent implements OnInit, OnDestroy {
  
  private selectedSets$ = this.store.pipe(select(getSelectedDatasets));
  private datasets$ = this.store.pipe(select(getDatasets));
  private batch$ = this.store.pipe(select(getDatasetsInBatch));
  private currentPage$ = this.store.pipe(select(getPage));
  private datasetsPerPage$ = this.store.pipe(select(getDatasetsPerPage));
  private mode$ = this.store.pipe(select(getViewMode));
  private isEmptySelection$ = this.store.pipe(select(isEmptySelection));
  private datasetCount$ = this.store.select(getTotalSets);
  private loading$ = this.store.pipe(select(getIsLoading));
  private filters$ = this.store.pipe(select(getFilters));

  private allAreSeleted$ = combineLatest(
    this.datasets$,
    this.selectedSets$,
    (datasets, selected) => {
      const pids = selected.map(set => set.pid);
      return datasets.length && datasets.find(dataset => pids.indexOf(dataset.pid) === -1) == null;
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

  private modes = ['view', 'archive', 'retrieve'];

  // compatibility analogs of observables
  private selectedSets: Dataset[] = [];
  private selectedSetsSubscription = this.selectedSets$.subscribe(selectedSets =>
    this.selectedSets = selectedSets
  );

  private currentMode: string = 'view';
  private modeSubscription = this.mode$.subscribe((mode: ViewMode) => {
    this.currentMode = mode;
  });

  // These should be made part of the NgRX state management
  // and eventually be removed.
  private submitJobSubscription: Subscription;
  private jobErrorSubscription: Subscription;

  private readonly defaultColumns: string[] = [
    'select',
    'pid',
    'sourceFolder',
    'size',
    'creationTime',
    'type',
    'proposalId',
    'ownerGroup',
    'archiveStatus',
    'retrieveStatus'
  ];

  private visibleColumns = this.defaultColumns.filter(
    column => this.appConfig.disabledDatasetColumns.indexOf(column) === -1
  );

  private archiveWorkflowEnabled = this.appConfig.archiveWorkflowEnabled;

  constructor(
    private router: Router,
    private store: Store<any>,
    public dialog: MatDialog,
    @Inject(APP_CONFIG) private appConfig: AppConfig
  ) {
  }

  ngOnInit() {
    this.submitJobSubscription =
      this.store.select(jobSelectors.submitJob).subscribe(
        ret => {
          if (ret && Array.isArray(ret)) {
            console.log(ret);
            this.store.dispatch(new ClearSelectionAction());
          }
        },
        error => {
          this.store.dispatch(new ua.ShowMessageAction({
            type: MessageType.Error,
            content: 'Job not Submitted'
          }));
        }
      );

    this.jobErrorSubscription =
      this.store.select(jobSelectors.getError).subscribe(err => {
        if (err) {
          this.store.dispatch(new ua.ShowMessageAction({
            type: MessageType.Error,
            content: err.message,
          }));
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
      width: 'auto',
      data: {title: 'Really archive?', question: ''}
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
    const destPath = '/archive/retrieve';
    const dialogRef = this.dialog.open(DialogComponent, {
      width: 'auto',
      data: {title: 'Really retrieve?', question: '', input: 'Destination: ' + destPath}
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
  archiveOrRetrieve(archive: boolean, destPath = '/archive/retrieve/'): void {
    const msg = new Message();
    if (this.selectedSets.length > 0) {
      const job = new Job();
      job.jobParams = {};
      job.creationTime = new Date();
      const backupFiles = [];
      this.store.pipe(
        select(state => state.root.user),
        take(1))
        .subscribe(user => {
          job.emailJobInitiator = user['email'];
          user = user['currentUser'];
          job.jobParams['username'] = user['username'] || undefined;
          if (!job.emailJobInitiator) {
            job.emailJobInitiator = user['profile'] ? user['profile']['email'] : user['email'];
          }
          this.selectedSets.forEach(set => {
            // if ('datablocks' in set && set['datablocks'].length > 0) {
            const fileObj = {};
            const fileList = [];
            fileObj['pid'] = set['pid'];
            if (set['datablocks'] && !archive) {
              set['datablocks'].forEach(d => {
                fileList.push(d['archiveId']);
              });
            }
            fileObj['files'] = fileList;
            backupFiles.push(fileObj);
            delete set['$$index'];
          });

          this.store.dispatch(new ClearSelectionAction());

          if (backupFiles.length === 0) {
            msg.type = MessageType.Error;
            msg.content = 'Selected datasets have no datablocks associated with them';
            this.store.dispatch(new ua.ShowMessageAction(msg));
          } else if (!job.emailJobInitiator) {
            msg.type = MessageType.Error;
            msg.content = 'No email for this user could be found, the job will not be submitted';
            this.store.dispatch(new ua.ShowMessageAction(msg));
          } else {
            job.datasetList = backupFiles;
            job.type = archive ? 'archive' : 'retrieve';
            this.store.pipe(
              select(state => state.root.user.settings.tapeCopies),
              take(1))
              .subscribe(copies => {
                job.jobParams['tapeCopies'] = copies;
              });
            // TODO check username in job object
            // job.jobParams['username'] = user['username'];
            if (!archive) {
              // TODO fix the path here
              job.jobParams['destinationPath'] = destPath;
            }
            console.log(job);
            this.store.dispatch(new ja.SubmitAction(job));
          }
        });
    } else {
      msg.type = MessageType.Error;
      msg.content = 'No datasets selected';
      this.store.dispatch(new ua.ShowMessageAction(msg));
      this.store.dispatch(new ClearSelectionAction());
    }
  }

  onClick(dataset: Dataset): void {
    const pid = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl('/dataset/' + pid);
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
    const {active: column, direction} = event;
    this.store.dispatch(new SortByColumnAction(column, direction));
  }

  onAddToBatch(): void {
    this.store.dispatch(new AddToBatchAction());
    this.store.dispatch(new ClearSelectionAction());
  }
}
