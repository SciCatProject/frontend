import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ConfirmationService, DataTable } from 'primeng/primeng';
import { Subject } from 'rxjs/Subject';
import { Job, RawDataset } from 'shared/sdk/models';
import { UserApi } from 'shared/sdk/services';
import { ConfigService } from 'shared/services/config.service';
import * as dua from 'state-management/actions/dashboard-ui.actions';
import * as dsa from 'state-management/actions/datasets.actions';
import * as ua from 'state-management/actions/user.actions';
import * as ja from 'state-management/actions/jobs.actions';
import * as utils from 'shared/utils';

import { config  } from '../../../config/config';

@Component({
  selector: 'dataset-table',
  templateUrl: './dataset-table.component.html',
  styleUrls: ['./dataset-table.component.css']
})
export class DatasetTableComponent implements OnInit, OnDestroy {
  @Input() datasets;
  @Output() openDataset = new EventEmitter();
  @ViewChild('ds') dsTable: DataTable;
  selectedSets: Array<RawDataset> = [];
  datasetCount$;

  modeButtons = ['Archive', 'View', 'Retrieve'];

  cols = [];
  loading$: any = false;
  limit$: any = 10;

  mode = 'view';

  aremaOptions = 'archiveretrieve';

  retrieveDisplay = false;
  dest = new Subject<string>();

  subscriptions = [];

  rowStyleMap = {};

  paranms = {};

  archiveable;
  retrievable;

  constructor(
    public http: Http,
    private us: UserApi,
    private router: Router,
    private configSrv: ConfigService,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private store: Store<any>
  ) {
    this.archiveable = config.archiveable;
    this.retrievable = config.retrieveable;
  }

  ngOnInit() {

    this.configSrv.getConfigFile('RawDataset').subscribe(conf => {
      if (conf) {
        for (const prop in conf) {
          if (prop in conf && 'table' in conf[prop]) {
            this.cols.push(conf[prop]['table']);
          }
        }
      }
    });

    this.loading$ = this.store.select(state => state.root.datasets.loading);
    this.datasetCount$ = this.store.select(state => state.root.datasets.totalSets);
    this.limit$ = this.store.select(state => state.root.user.settings.datasetCount);

    this.store.select(state => state.root.dashboardUI.mode).subscribe(mode => {
      this.mode = mode;
      this.updateRowView(mode);
    });

    this.route.queryParams.subscribe(params => {
      const f = utils.filter({'mode': '', 'skip': ''}, params);
      this.mode = f['mode'] || 'view';
      // this.setCurrentPage(f['skip']);
    });


    // NOTE: Typescript picks this key up as the property of the state, but it
    // actually links to the reducer key in app module
    // This could also be subscribed to as an async value but then loading
    // becomes an issue

    this.subscriptions.push(
      this.store.select(state => state.root.datasets.datasets).subscribe(
        data => {
          this.datasets = data;
          if (this.datasets && this.datasets.length > 0) {
            this.store.dispatch({ type: dua.SAVE_MODE, payload: this.mode });
            this.updateRowView(this.mode);
          }
          // this.onModeChange(undefined, this.mode);
        },
        error => {
          console.error(error);
        }
      )
    );

    this.subscriptions.push(
      this.store
        .select(state => state.root.datasets.activeFilters)
        .subscribe(filters => {
          if (filters.skip !== this.dsTable.first) {
            setTimeout(() => {
              this.setCurrentPage(filters.skip);
            }, 1000);
          }
        })
    );

    this.subscriptions.push(
      this.store
        .select(state => state.root.datasets.selectedSets)
        .subscribe(selected => {
          this.selectedSets = selected;
        })
    );

    let msg = {};
    this.subscriptions.push(
      this.store.select(state => state.root.jobs.jobSubmission).subscribe(
        ret => {
          if (ret) {
            console.log(ret);
            this.selectedSets = [];
            msg = {
              type: 'success',
              title: 'Job Created Successfully',
              content: ''
            };
            this.store.dispatch({ type: ua.SHOW_MESSAGE, payload: msg });
          }
        },
        error => {
          console.log(error);
          msg = {
            type: 'error',
            title: error.message,
            content: 'Job not submitted'
          };
          this.store.dispatch({ type: ua.SHOW_MESSAGE, payload: msg });
        }
      )
    );

    this.subscriptions.push(
      this.store.select(state => state.root.jobs.error).subscribe(err => {
        if (err) {
          msg = {
            type: 'error',
            title: err.message,
            content: 'Job not submitted'
          };
          this.store.dispatch({ type: ua.SHOW_MESSAGE, payload: msg });
          this.store.dispatch({
            type: ja.SEARCH_ID_FAILED,
            payload: undefined
          });
        }
      })
    );
  }

  ngOnDestroy() {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }
  /**
   * Navigate to dataset detail page
   * on a row click
   * @param {any} event
   * @memberof DatasetTableComponent
   */
  onRowSelect(event) {
    const pid = encodeURIComponent(event.data.pid);
    // Odd hack to stop click event in column loading dataset view, not needed
    // before 5th July 2017
    if (
      event['originalEvent']['target']['innerHTML'].indexOf('chkbox') === -1
    ) {
      this.router.navigateByUrl(
        '/dataset/' + pid
      );
      // this.store.dispatch(
      //     {type : dsa.SELECT_CURRENT, payload : event.data});
    }
  }

  /**
   * Handle changing of view mode and disabling selected rows
   * @param event
   * @param mode
   */
  onModeChange(event, mode) {
    this.mode = mode.toLowerCase();
    this.store.dispatch({ type: dua.SAVE_MODE, payload: this.mode });
  }

  updateRowView(mode) {
      this.selectedSets = [];
      this.rowStyleMap = {};
      if (this.datasets && this.datasets.length > 0) {
        for (let d = 0; d < this.datasets.length; d++) {
          const set = this.datasets[d];
          let c = '';
          if (this.mode === 'archive' && set.datasetlifecycle
            && (this.archiveable.indexOf(set.datasetlifecycle.archiveStatusMessage) === -1 || set.size === 0)) {
            c = 'disabled-row';
          } else if (this.mode === 'retrieve'
            && set.datasetlifecycle && this.retrievable.indexOf(set.datasetlifecycle.archiveStatusMessage) === -1) {
            c = 'disabled-row';
          } else {
            c = '';
          }
          this.rowStyleMap[set.pid] = c;
        }
      } else {
        this.store.dispatch({ type: dua.SAVE_MODE, payload: this.mode });
      }
      const currentParams = this.route.snapshot.queryParams;
      this.router.navigate(['/datasets'], {
         queryParams: Object.assign({}, currentParams, {'mode': this.mode})
      });
  }

  /**
   * Return the classes for the view buttons based on what is selected
   * @param m
   */
  getModeButtonClasses(m) {
    if (m.toLowerCase() === this.mode.toLowerCase()) {
      return { positive: true };
    } else {
      return {};
    }
  }

  /**
   * Handles selection of checkboxes and retrieves datablocks
   * @param {any} event
   * @memberof DashboardComponent
   */
  onSelect(event) {
    this.store.dispatch({
      type: dsa.SELECTED_UPDATE,
      payload: this.selectedSets
    });
  }

  /**
   * Retrieves all datasets each time a new page
   * is selected in the table
   * @param event
   */
  onPage(event) {
    this.store
      .select(state => state.root.datasets.activeFilters)
      .take(1)
      .subscribe(f => {
        const filters = Object.assign({}, f);
        filters['skip'] = event.first;
        filters['initial'] = false;
        if (event.sortField) {
          const sortOrder = event.sortOrder === 1 ? 'ASC' : 'DESC';
          filters['sortField'] = event.sortField + ' ' + sortOrder;
        } else {
          filters['sortField'] = undefined;
        }
        // TODO reduce calls when not needed (i.e. no change)
        if (f.first !== event.first || this.datasets.length === 0) {
          this.store.dispatch({ type: dsa.FILTER_UPDATE, payload: filters });
        }
      });
  }

  // NOTE: this does not set the page number for the table, there is a
  // `paginate` method but
  // this takes no arguments and requires changing protected vars
  setCurrentPage(n: number) {
    this.dsTable.onPageChange({ first: n, rows: this.dsTable.rows });
  }

  /**
   * Options set based on selected datasets
   * This is used to determine which template to display for
   * archive or retrieval or both
   * @param set
   * @returns {string}
   */
  setOptions(set) {
    let options = '';
    const dl = set['datasetlifecycle'];
    if (dl && dl['isOnDisk']) {
      options += 'archive';
    }
    if (dl && (dl['isOnTape'] || dl['isOnDisk'])) {
      options += 'retrieve';
    }
    return options;
  }

  /**
   * Sends archive command for selected datasets (default includes all
   * datablocks for now) to Dacat API
   * @param {any} event - click handler (not currently used)
   * @memberof DashboardComponent
   */
  archiveClickHandle(event) {
    this.confirmationService.confirm({
      header: 'Archive ' + this.selectedSets.length + ' Datasets?',
      message: 'The selected datasets will be scheduled for archive',
      accept: () => {
        this.archiveOrRetrieve(true);
      }
    });
  }

  /**
   * Sends retrieve command for selected datasets
   * @param {any} event - click handler (not currently used)
   * @memberof DashboardComponent
   */
  retrieveClickHandle(event) {
    this.retrieveDisplay = true;
  }

  retrieveSets(f) {
    const destPath = f.form.value['path'];
    if (destPath.length > 0) {
      this.retrieveDisplay = false;
      this.archiveOrRetrieve(false, destPath);
    }
  }

  /**
   * Handles the archive/retrieve for all datasets in the `selected` array.
   * Needs to feed back to the user if the selected datasets cannot have the
   * action performed
   * @memberof DashboardComponent
   */
  archiveOrRetrieve(archive: boolean, destPath = null) {
    let msg = {};
    if (this.selectedSets.length > 0) {
      this.dest = new Subject<string>();
      const job = new Job();
      job.creationTime = new Date();
      const backupFiles = [];
      this.store
        .select(state => state.root.user)
        .take(1)
        .subscribe(user => {
          job.emailJobInitiator = user['email'];
          if (!user['email']) {
            job.emailJobInitiator = user['currentUser']['email'] || user['currentUser']['accessEmail'];
          }
          this.selectedSets.map(set => {
            // if ('datablocks' in set && set['datablocks'].length > 0) {
            const fileObj = {};
            fileObj['pid'] = set['pid'];
            fileObj['files'] = [];
            backupFiles.push(fileObj);
            //   set['datablocks'].map(file => {
            //     const id = encodeURIComponent(set.pid);
            //     backupFiles.push({[set['pid']] : file['dataFileList']}); });
            // }
            // Removing keys added by PrimeNG, no real need yet but could impact
            // if written to DB
            delete set['$$index'];
          });
          if (backupFiles.length === 0) {
            msg = {
              type: 'error',
              content:
                'Selected datasets have no datablocks associated with them',
              title: 'Job not submitted'
            };
            this.store.dispatch({ type: ua.SHOW_MESSAGE, payload: msg });
            this.selectedSets = [];
          } else if (!job.emailJobInitiator) {
            msg = {
              type: 'error',
              content:
                'No email for this user could be found, the job will not be submitted',
              title: 'Job not submitted'
            };
            this.store.dispatch({ type: ua.SHOW_MESSAGE, payload: msg });
            this.selectedSets = [];
          } else {
            job.datasetList = backupFiles;
            job.type = archive ? 'archive' : 'retrieve';
            this.store
              .select(state => state.root.user.settings.tapeCopies)
              .take(1)
              .subscribe(copies => {
                job.jobParams = { tapeCopies: copies };
              });
            job.jobParams['username'] = user['username'];
            if (!archive) {
              // TODO number of copies from settings table
              job.jobParams['destinationPath'] = destPath;
            }
            this.store.dispatch({ type: ja.SUBMIT, payload: job });
          }
        });
    } else {
      msg = {
        type: 'error',
        title: 'No Datasets selected',
        content: ''
      };
      this.store.dispatch({ type: ua.SHOW_MESSAGE, payload: msg });
    }
  }

  /**
   * Handles submission of form and subscription
   * of submitted value
   * @param form
   */
  onDestSubmit(form) {
    // TODO maybe wipe the value when submitted?
    this.dest.next(form.value['dest']);
    this.dest.complete();
    this.dest.unsubscribe();
    this.dest = null;
  }

  /**
 * Checks type against config and
 * fallback to type if not available
 * @param {any} key
 * @param {any} value
 * @returns
 * @memberof ConfigFormComponent
 */
  getFormat(key, value, ds) {
    if (key === 'creationTime') {
      const date = new Date(value);
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(date, 'dd/MM/yyyy HH:mm');
      return formattedDate;
    } else if (
      (key === 'archiveStatus' || key === 'retrieveStatus') &&
      ds['datasetlifecycle']
    ) {
      return ds['datasetlifecycle'][key + 'Message'];
    } else if (key === 'size') {
      return (ds[key] / 1024 / 1024 / 1024).toFixed(2);
    } else if (key in ds) {
      return value;
    } else {
      return key;
    }
  }
}
