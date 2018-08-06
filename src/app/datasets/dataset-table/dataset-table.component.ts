import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Store, select } from '@ngrx/store';
import {MatDialog } from '@angular/material';
import { Job, Dataset } from 'shared/sdk/models';
import { ConfigService } from 'shared/services/config.service';
import { DialogComponent } from 'shared/modules/dialog/dialog.component';
import * as dsa from 'state-management/actions/datasets.actions';
import * as ua from 'state-management/actions/user.actions';
import * as ja from 'state-management/actions/jobs.actions';
import { getDatasets, getSelectedDatasets, getPage, getViewMode, isEmptySelection, getDatasetsPerPage, getIsLoading, getTotalSets, getFilters } from 'state-management/selectors/datasets.selectors';
import { Message, MessageType, ViewMode } from 'state-management/models';
import * as jobSelectors from 'state-management/selectors/jobs.selectors';
import { PageChangeEvent, SortChangeEvent } from '../dataset-table-pure/dataset-table-pure.component';
import { Subscription} from 'rxjs';
import { APP_CONFIG, AppConfig } from 'app-config.module';
import {take} from 'rxjs/operators';

// Needed for compatibility with non-piped RxJS operators

@Component({
  selector: 'dataset-table',
  templateUrl: 'dataset-table.component.html',
  styleUrls: ['dataset-table.component.scss']
})
export class DatasetTableComponent implements OnInit, OnDestroy {
  datasets$ = this.store.pipe(select(getDatasets));
  selectedSets$ = this.store.pipe(select(getSelectedDatasets));
  currentPage$ = this.store.pipe(select(getPage));
  datasetsPerPage$ = this.store.pipe(select(getDatasetsPerPage));
  private mode$ = this.store.pipe(select(getViewMode));
  private isEmptySelection$ = this.store.pipe(select(isEmptySelection));
  datasetCount$ = this.store.select(getTotalSets);
  loading$ = this.store.pipe(select(getIsLoading));
  private filters$ = this.store.pipe(select(getFilters));

  // compatibility analogs of observables
  currentMode: string = 'view';
  private selectedSets: Dataset[] = [];

  private modes: string[] = ['view', 'archive', 'retrieve'];

  // These should be made part of the NgRX state management
  // and eventually be removed.
  private modeSubscription: Subscription;
  private selectedSetsSubscription: Subscription;
  private submitJobSubscription: Subscription;
  private jobErrorSubscription: Subscription;

  disabledColumns: string[] = [];
  archiveWorkflowEnabled: boolean = false;

  constructor(
    private router: Router,
    private configSrv: ConfigService,
    private route: ActivatedRoute,
    private store: Store<any>,
    public dialog: MatDialog,
    @Inject(APP_CONFIG) private appConfig: AppConfig
  ) {
    this.disabledColumns = appConfig.disabledDatasetColumns;
    this.archiveWorkflowEnabled = appConfig.archiveWorkflowEnabled;
  }

  ngOnInit() {
    // Store concrete values of observables for compatibility
    this.modeSubscription = this.mode$.subscribe((mode: ViewMode) => {
      this.currentMode = mode;
    });

    this.selectedSetsSubscription = this.selectedSets$.subscribe(selectedSets =>
      this.selectedSets = selectedSets
    );

    this.submitJobSubscription =
      this.store.select(jobSelectors.submitJob).subscribe(
        ret => {
          if (ret && Array.isArray(ret)) {
            console.log(ret);
            this.store.dispatch(new dsa.ClearSelectionAction());
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
  }

  onExportClick(): void {
    this.store.dispatch(new dsa.ExportToCsvAction());
  }

  /**
   * Handle changing of view mode and disabling selected rows
   * @param event
   * @param mode
   */
  onModeChange(event, mode: ViewMode): void {
    this.store.dispatch(new dsa.SetViewModeAction(mode));
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
      data: { title: 'Really archive?', question: '' }
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
      data: { title: 'Really retrieve?', question: '', input: 'Destination: ' + destPath }
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

          this.store.dispatch(new dsa.ClearSelectionAction());

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
      this.store.dispatch(new dsa.ClearSelectionAction());
    }
  }

  onClick(dataset: Dataset): void {
    const pid = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl('/dataset/' + pid);
  }

  onSelect(dataset: Dataset): void {
    this.store.dispatch(new dsa.SelectDatasetAction(dataset));
  }

  onDeselect(dataset: Dataset): void {
    this.store.dispatch(new dsa.DeselectDatasetAction(dataset));
  }

  onPageChange(event: PageChangeEvent): void {
    this.store.dispatch(new dsa.ChangePageAction(event.pageIndex, event.pageSize));
  }

  onSortChange(event: SortChangeEvent): void {
    const {active: column, direction} = event;
    this.store.dispatch(new dsa.SortByColumnAction(column, direction));
  }
}
