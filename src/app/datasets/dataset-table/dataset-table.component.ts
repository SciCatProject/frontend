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
import { Subject } from 'rxjs/Subject';
import { Job, RawDataset } from 'shared/sdk/models';
import { UserApi } from 'shared/sdk/services';
import { ConfigService } from 'shared/services/config.service';
import * as dua from 'state-management/actions/dashboard-ui.actions';
import * as dsa from 'state-management/actions/datasets.actions';
import * as selectors from 'state-management/selectors';
import * as ua from 'state-management/actions/user.actions';
import * as ja from 'state-management/actions/jobs.actions';
import { Message, MessageType } from 'state-management/models';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import * as utils from 'shared/utils';

import { config } from '../../../config/config';
import { last } from 'rxjs/operator/last';
import { Observable } from 'rxjs/Observable';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { SelectionModel } from '@angular/cdk/collections';

import { DialogComponent } from 'shared/modules/dialog/dialog.component';
import * as rison from 'rison';
import * as filesize from 'filesize';

@Component({
  selector: 'dataset-table',
  templateUrl: './dataset-table.component.html',
  styleUrls: ['./dataset-table.component.scss']
})
export class DatasetTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() datasets = [];
  @Output() openDataset = new EventEmitter();
  @Output() selectedSet = new EventEmitter<Array<any>>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  selection = new SelectionModel<Element>(true, []);
  datasetCount$;
  dataSource: MatTableDataSource<any> | null;
  displayedColumns = ['select'];

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

  filters = {};

  archiveable;
  retrievable;

  constructor(
    public http: Http,
    private us: UserApi,
    private router: Router,
    private configSrv: ConfigService,
    private route: ActivatedRoute,
    private store: Store<any>,
    public dialog: MatDialog
  ) {
    this.archiveable = config.archiveable;
    this.retrievable = config.retrieveable;
    this.datasetCount$ = this.store.select(selectors.datasets.getTotalSets);
    this.loading$ = this.store.select(selectors.datasets.getLoading);
  }

  getRowValue(row, col) {
    const field = col.field;
    const value = row[field];

    if (field === 'creationTime') {
      const date = new Date(value);
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(date, 'dd/MM/yyyy HH:mm');
      return formattedDate;
    }

    if (field === 'size') {
      return filesize(value || 0);
    }

    const split = field.split('.');
    if (split.length > 1) {
      if (row[split[0]]) {
        // TODO handle undefined and nesting > 1 layer
        return row[split[0]][split[1]];
      }
      return 'Unknown';
    }
    return value;
  }

  ngOnInit() {

    this.configSrv.getConfigFile('Dataset').subscribe(conf => {
      if (conf) {
        for (const prop in conf) {
          if (prop in conf && 'table' in conf[prop]) {
            this.cols.push(conf[prop]['table']);
            this.displayedColumns.push(conf[prop]['table']['field']);
          }
        }
      }
    });

    this.limit$ = this.store.select(state => state.root.user.settings.datasetCount);

    this.subscriptions.push(this.store.select(state => state.root.dashboardUI.mode).subscribe(mode => {
      this.mode = mode;
      this.updateRowView(mode);
    }));



    // NOTE: Typescript picks this key up as the property of the state, but it
    // actually links to the reducer key in app module
    // This could also be subscribed to as an async value but then loading
    // becomes an issue

    this.subscriptions.push(
      this.store.select(selectors.datasets.getDatasets).subscribe(
        data => {
          this.datasets = data;
          this.dataSource = new MatTableDataSource(this.datasets);
          this.dataSource.sort = this.sort;
          this.updateRowView(this.mode);
        },
        error => {
          console.error(error);
        }
      )
    );

    this.subscriptions.push(
      this.store
        .select(selectors.datasets.getActiveFilters)
        .subscribe(filters => {
          // if (filters.skip !== this.dsTable.first) {
          setTimeout(() => {
            this.setCurrentPage(filters.skip);
          }, 1000);
          // }
        })
    );

    // this.subscriptions.push(
    //   this.store
    //     .select(selectors.datasets.getSelectedSets)
    //     .subscribe(selected => {
    //       this.selection.clear();
    //       this.selection.select(selected);
    //     })
    // );

    const msg = new Message();
    this.subscriptions.push(
      this.store.select(selectors.jobs.submitJob).subscribe(
        ret => {
          if (ret && Array.isArray(ret)) {
            console.log(ret);
            this.selection.clear();
          }
        },
        error => {
          console.log(error);
          msg.type = MessageType.Error;
          msg.content = 'Job not Submitted';
          this.store.dispatch(new ua.ShowMessageAction(msg));
        }
      )
    );

    this.subscriptions.push(
      this.store.select(selectors.jobs.getError).subscribe(err => {
        if (err) {
          msg.type = MessageType.Error;
          msg.content = err.message;
          this.store.dispatch(new ua.ShowMessageAction(msg));
        }
      })
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
  onRowSelect(event, row) {
    const pid = encodeURIComponent(row.pid);
    this.router.navigateByUrl(
      '/dataset/' + pid
    );
  }

  onRowCheck(row) {
    this.selection.toggle(row);
    this.store.dispatch({
      type: dsa.SELECTED_UPDATE,
      payload: this.selection.selected
    });
    // this.selectedSet.emit(this.selection.selected);
  }

  onExportClick() {
    if (this.datasets.length > 0) {
      // loop over all objects and find all keys
      const allKeys = [];
      this.datasets.map(function (obj) {
        const ks = Object.keys(obj);
        ks.map(function (k) {
          if (allKeys.indexOf(k) < 0) {
            allKeys.push(k);
          }
        });
      });


      // create "rectangular" dataset representation
      const output = this.datasets.map(function (obj) {
        const row = [];
        allKeys.map(function (col) {
          if (col in obj) {
            row[col] = JSON.stringify(obj[col]);
          } else {
            row[col] = '';
          }
        });
        return row;
      });

      const options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: false,
        useBom: true,
        headers: allKeys
      };


      const ts = new Angular5Csv(output, 'Datasets ' + this.paginator.pageIndex + 1, options);
    } else {
      const msg = new Message();
      msg.content = 'No Datasets Loaded';
      msg.type = MessageType.Error;
      this.store.dispatch(new ua.ShowMessageAction(msg));
    }
  }

  calculateRowClasses(row) {
    if (row.datasetlifecycle && this.mode === 'archive'
      && (this.archiveable.indexOf(row.datasetlifecycle.archiveStatusMessage) !== -1) && row.size !== 0) {
      return {
        'row-archiveable': true
      };
    } else if (row.datasetlifecycle && this.mode === 'retrieve'
      && this.retrievable.indexOf(row.datasetlifecycle.archiveStatusMessage) !== -1 && row.size !== 0) {
      return {
        'row-retrievable': true
      };
    } else if (row.size === 0) {
      return {
        'row-empty': true
      };
    } else {
      return {
        'row-generic': true
      };
    }
  }

  /**
   * Handle changing of view mode and disabling selected rows
   * @param event
   * @param mode
   */
  onModeChange(event, mode) {
    if (mode) {
      this.mode = mode.toLowerCase();
      this.store.dispatch(new dua.SaveModeAction(this.mode));
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    this.store.dispatch({
      type: dsa.SELECTED_UPDATE,
      payload: this.selection.selected
    });
  }

  updateRowView(mode) {
    this.selection.clear();
    this.rowStyleMap = {};
    const activeSets = [];
    if (this.datasets && this.datasets.length > 0 && (this.mode === 'archive' || this.mode === 'retrieve')) {
      for (let d = 0; d < this.datasets.length; d++) {
        const set = this.datasets[d];
        const msg = (set.datasetlifecycle && set.datasetlifecycle.archiveStatusMessage) || '';
        if (this.mode === 'archive'
          && set.datasetlifecycle
          && (this.archiveable.indexOf(set.datasetlifecycle.archiveStatusMessage) !== -1) && set.size > 0) {
          activeSets.push(set);
        } else if (this.mode === 'retrieve'
          && set.datasetlifecycle && this.retrievable.indexOf(set.datasetlifecycle.archiveStatusMessage) !== -1 && set.size > 0) {
          activeSets.push(set);
        }
      }
      this.dataSource = new MatTableDataSource(activeSets);
    } else {
      this.dataSource = new MatTableDataSource(this.datasets);
    }
  }

  /**
   * Return the classes for the view buttons based on what is selected
   * @param m
   */
  getModeButtonClasses(m) {
    const ret = {};
    ret[m.toLowerCase()] = true;
    if (m.toLowerCase() === this.mode) {
      ret['positive'] = true;
    }
    return ret;
  }

  /**
   * Retrieves all datasets each time a new page
   * is selected in the table
   * @param event
   */
  onPage(event) {
    const index = this.paginator.pageIndex;
    const size = this.paginator.pageSize;
    this.store
      .select(state => state.root.datasets.activeFilters)
      .take(1)
      .subscribe(f => {
        const filters = Object.assign({}, f);
        filters['skip'] = index * size;
        filters['initial'] = false;
        filters['limit'] = size;
        if (event && event.active && event.direction) {
          filters['sortField'] = event.active + ' ' + event.direction;
        } else {
          filters['sortField'] = undefined;
        }
        // TODO reduce calls when not needed (i.e. no change)
        // if (f.first !== event.first || this.datasets.length === 0) {
        this.store.dispatch(new dsa.UpdateFilterAction(filters));
        // }
      });
  }

  // NOTE: this does not set the page number for the table, there is a
  // `paginate` method but
  // this takes no arguments and requires changing protected vars
  setCurrentPage(n: number) {
    // this.dsTable.onPageChange({ first: n, rows: this.dsTable.rows });
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
  retrieveClickHandle(event) {
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
  archiveOrRetrieve(archive: boolean, destPath = '/archive/retrieve/') {
    const msg = new Message();
    if (this.selection.selected.length > 0) {
      this.dest = new Subject<string>();
      const job = new Job();
      job.jobParams = {};
      job.creationTime = new Date();
      const backupFiles = [];
      this.store
        .select(state => state.root.user)
        .take(1)
        .subscribe(user => {
          job.emailJobInitiator = user['email'];
          user = user['currentUser'];
          job.jobParams['username'] = user['username'] || undefined;
          if (!job.emailJobInitiator) {
            job.emailJobInitiator = user['profile'] ? user['profile']['email'] : user['email'];
          }
          this.selection.selected.map(set => {
            // if ('datablocks' in set && set['datablocks'].length > 0) {
            const fileObj = {};
            const fileList = [];
            fileObj['pid'] = set['pid'];
            if (set['datablocks'] && !archive) {
              set['datablocks'].map(d => {
                fileList.push(d['archiveId']);
              });
            }
            fileObj['files'] = fileList;
            backupFiles.push(fileObj);
            delete set['$$index'];
          });
          this.selection.clear();
          this.store.dispatch({
            type: dsa.SELECTED_UPDATE,
            payload: this.selection.selected
          });

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
            this.store
              .select(state => state.root.user.settings.tapeCopies)
              .take(1)
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
      this.selection.clear();
      this.store.dispatch({
        type: dsa.SELECTED_UPDATE,
        payload: this.selection.selected
      });
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
    } else if ((key === 'archiveStatus' || key === 'retrieveStatus') &&
      !ds['datasetlifecycle']) {
      return 'Unknown';
    } else if (key === 'size') {
      return (ds[key] / 1024 / 1024 / 1024).toFixed(2);
    } else if (key in ds) {
      return value;
    } else {
      return key;
    }
  }
}
