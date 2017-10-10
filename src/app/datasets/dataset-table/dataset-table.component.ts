import {DatePipe} from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output, ViewChild, OnDestroy} from '@angular/core';
import {Http} from '@angular/http';
import {Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import {ConfirmationService, DataTable} from 'primeng/primeng';
import {Subject} from 'rxjs/Subject';
import {Job, RawDataset} from 'shared/sdk/models';
import {JobApi, UserApi} from 'shared/sdk/services';
import {ConfigService} from 'shared/services/config.service';
import * as dsa from 'state-management/actions/datasets.actions';
import * as ua from 'state-management/actions/user.actions';

@Component({
  selector : 'dataset-table',
  templateUrl : './dataset-table.component.html',
  styleUrls : [ './dataset-table.component.css' ]
})
export class DatasetTableComponent implements OnInit, OnDestroy {

  @Input() datasets;
  @Output() openDataset = new EventEmitter();
  @ViewChild('ds') dsTable: DataTable;
  selectedSets: Array<RawDataset> = [];
  datasetCount = 1000;

  cols = [];
  loading$: any = false;
  limit$: any = 10;

  aremaOptions = 'archiveretrieve';

  retrieveDisplay = false;
  dest = new Subject<string>();

  subscriptions = [];

  constructor(public http: Http, private us: UserApi, private router: Router,
              private configSrv: ConfigService, private js: JobApi,
              private route: ActivatedRoute,
              private confirmationService: ConfirmationService,
              private store: Store<any>) {
    this.configSrv.getConfigFile('RawDataset').subscribe(conf => {
      for (const prop in conf) {
        if (prop in conf && 'table' in conf[prop]) {
          this.cols.push(conf[prop]['table']);
        }
      }
    });
  }

  ngOnInit() {
    this.loading$ = this.store.select(state => state.root.datasets.loading);
    this.limit$ =
        this.store.select(state => state.root.user.settings.datasetCount);

    this.route.queryParams.subscribe(params => {  
        console.log(params);
        this.store.select(state => state.root.datasets.activeFilters).take(1).subscribe(filters => {
          const newFilters = Object.assign(filters, params);
          this.setCurrentPage(newFilters.skip);
          this.store.dispatch({type : dsa.FILTER_UPDATE, payload : newFilters});
        });
        
    });

    // NOTE: Typescript picks this key up as the property of the state, but it
    // actually links to the reducer key in app module
    // This could also be subscribed to as an async value but then loading
    // becomes an issue
    this.subscriptions.push(this.store.select(state => state.root.datasets.datasets)
        .subscribe(
            data => {
              this.datasets = data;
              // Retrieve the array of locations and use this to calculate the
              // total number
              this.store
                  .select(state => state.root.datasets.filterValues.locations)
                  .take(1)
                  .subscribe(locs => {
                    if (locs) {
                      this.datasetCount = locs.reduce((sum, value) => sum + value['count'], 0);
                    }
                  });
            },
            error => { console.error(error); }));

    this.subscriptions.push(this.store.select(state => state.root.datasets.activeFilters)
        .subscribe(filters => {
          console.log(filters);
          if (filters.skip !== this.dsTable.first) {
            setTimeout(() => {
              this.setCurrentPage(filters.skip);
            }, 1000);
          }
        }));

    this.subscriptions.push(this.store.select(state => state.root.datasets.selectedSets)
        .subscribe(selected => {
          this.selectedSets = selected;

        }));

    this.subscriptions.push(this.store.select(state => state.root.datasets.currentSet).subscribe(ds => {
        if (ds) {
          this.router.navigateByUrl('/dataset/' + encodeURIComponent(ds.pid));
        }
    }));

    

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
    if (event['originalEvent']['target']['innerHTML'].indexOf('chkbox') ===
        -1) {
      this.store.dispatch(
          {type : dsa.SELECT_CURRENT, payload : event.data});
    }
  }

  /**
   * Handles selection of checkboxes and retrieves datablocks
   * @param {any} event
   * @memberof DashboardComponent
   */
  onSelect(event) {
    // annoying hack to ensure the selected set has been added to the selected
    // array
    setTimeout(() => {
      const selected = this.selectedSets.slice(0);
      // const dl = event.data['datasetlifecycle'];
      for (let i = 0; i < selected.length; i++) {
        const dl = selected[i]['datasetlifecycle'];

        if (selected[i]['size'] === 0 || !dl || (dl && (dl['isOnDisk'] === 'unknown' &&
                           dl['isOnTape'] === 'unknown') ||
                    dl['archiveStatusMessage'].toLowerCase().indexOf(
                        'archive') !== -1)) {
          selected.splice(i, 1);
          this.store.dispatch({
            type : ua.SHOW_MESSAGE,
            payload : {
              content :
                  'Cannot select datasets already archived or with unknown status',
              class : 'ui negative message',
              timeout : 2
            }
          });
        }
      }
      if (selected.length > 0) {
        this.aremaOptions =
            this.setOptions(this.selectedSets[this.selectedSets.length - 1]);
      } else {
        this.aremaOptions = '';
      }
      this.store.dispatch({type : dsa.SELECTED_UPDATE, payload : selected});
      this.selectedSets = selected;
    }, 600);
  }

  /**
   * Retrieves all datasets each time a new page
   * is selected in the table
   * @param event
   */
  onPage(event) {
    this.store.select(state => state.root.datasets)
        .take(1)
        .subscribe(dStore => {
          const data = dStore.activeFilters;
          //        if (dStore.datasets.length === 0 ||
          //           (dStore.datasets.length !== 0 &&
          //             dStore.activeFilters.skip !== event.first)) {
          if (data) {
            data['skip'] = event.first;
            data['initial'] = false;
            if (event.sortField) {
              const sortOrder = event.sortOrder === 1 ? 'ASC' : 'DESC';
              data['sortField'] = event.sortField + ' ' + sortOrder;
            } else {
              data['sortField'] = undefined;
            }
            this.store.dispatch({type : dsa.FILTER_UPDATE, payload : data});
            this.store.dispatch({type : dsa.SEARCH, payload : data});
          }
          //        }
        });
  }

  // NOTE: this does not set the page number for the table, there is a
  // `paginate` method but
  // this takes no arguments and requires changing protected vars
  setCurrentPage(n: number) {
    this.dsTable.onPageChange({'first' : n, 'rows' : this.dsTable.rows});
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
    let message = '';
    this.selectedSets.forEach(element => {
      const size = element.size ? element.size : 'Size unknown';
      message += element.sourceFolder + ': ' + size + '\n';
    });
    this.confirmationService.confirm({
      header : 'Archive ' + this.selectedSets.length + ' Datasets?',
      message : message,
      accept : () => { this.archiveOrRetrieve(true); }
    });
  }

  /**
   * Sends retrieve command for selected datasets
   * @param {any} event - click handler (not currently used)
   * @memberof DashboardComponent
   */
  retrieveClickHandle(event) { this.retrieveDisplay = true; }

  retrieveSets(f) {
    const destPath = f.form.value['path'];
    if (destPath.length > 0) {
      this.retrieveDisplay = false;
      this.archiveOrRetrieve(false, destPath);
    } else {
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
      job.creationTime = Date.now();
      const backupFiles = [];
      this.store.select(state => state.root.user.currentUser).take(1).subscribe(user => {
//      this.us.getCurrent().subscribe(user => {
        if ('realm' in user) {
          job.emailJobInitiator = this.selectedSets[0].ownerEmail;
        } else {
          job.emailJobInitiator = user['email'];
          this.store.select(state => state.root.user.currentUser)
              .take(1)
              .subscribe(current => {
                if ('accessEmail' in current) {
                  job.emailJobInitiator = current['accessEmail'];
                } else {
                  console.log('cannot find user email');
                }
              });
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
            class : 'ui message negative',
            content :
                'Selected datasets have no datablocks associated with them',
            timeout : 3
          };
          this.store.dispatch({type : ua.SHOW_MESSAGE, payload : msg});
          this.selectedSets = [];
        } else {
          job.datasetList = backupFiles;
          job.type = archive ? 'archive' : 'retrieve';
          this.store.select(state => state.root.user.settings.tapeCopies)
              .take(1)
              .subscribe(copies => {job.jobParams = {'tapeCopies' : copies}; });
          if (!archive) {
            // TODO number of copies from settings table
            job.jobParams['destinationPath'] = destPath;
          } else {
            for (let i = 0; i < this.selectedSets.length; i++) {
              const ds = <RawDataset>this.selectedSets[i];
              const loc = { 'userTargetLocation' : destPath };
              // TODO job params - retrieve, userTarget - archive
              // this.rds.updateAttributes(encodeURIComponent(ds.pid), loc)
              //     .subscribe(
              //         res => { console.log(res); },
              //         err => {
              //           console.error(err);
              //           msg = {class : 'ui message negative', text : err};
              //           this.uMsg.sendMessage(msg, 3);
              //         },
              //         () => {});
            }
          }
          this.js.create(job).subscribe(
              ret => {
                this.selectedSets = [];
                this.aremaOptions = '';
                msg = {
                  class : 'ui message positive',
                  content : 'Job Created Successfully',
                  timeout : 3
                };
                this.store.dispatch({type : ua.SHOW_MESSAGE, payload : msg});
              },
              error => {
                console.log(error);
                msg = {
                  class : 'ui message negative',
                  content : error.message,
                  timeout : 3
                };
                this.store.dispatch({type : ua.SHOW_MESSAGE, payload : msg});
              });
        }

      });
    } else {
      msg = {
        class : 'ui message negative',
        content : 'No Datasets selected',
        timeout : 3
      };
      this.store.dispatch({type : ua.SHOW_MESSAGE, payload : msg});
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
    } else if ((key === 'archiveStatus' || key === 'retrieveStatus') &&
               ds['datasetlifecycle']) {
      return ds['datasetlifecycle'][key + 'Message'];
    } else if (key in ds) {
      return value;
    } else {
      return key;
    }
  }
}
