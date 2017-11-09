import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {OrigDatablock, RawDataset} from 'shared/sdk/models';
import {
  AccessUserApi,
  DatasetLifecycleApi,
  OrigDatablockApi,
  RawDatasetApi
} from 'shared/sdk/services';
import {LoopBackAuth} from 'shared/sdk/services';
import * as ua from 'state-management/actions/user.actions';

@Injectable()
export class DatasetService {
  limit = 1000;

  loading = false;

  selected: RawDataset = null;

  datasets: Array<RawDataset> = [];

  datasetChange: Subject<string> = new Subject<string>();

  facetSubject = new BehaviorSubject<object>({});

  detailFilter = {
    limit : this.limit,

    include :
        [ {relation : 'origdatablocks'}, {relation : 'datasetlifecycle'} ]
  };

  filter = {
    limit : this.limit,

    include : [ {relation : 'datasetlifecycle'} ]
  };

  nullLifecycle = {
    archiveRetentionTime : 'unknown',

    archiveStatusMessage : 'unknown',

    dateOfLastMessage : 'unknown',

    doi : 'unknown',

    exportedTo : 'unknown',

    id : null,

    isExported : 'unknown',

    isOnDisk : 'unknown',

    isOnTape : 'unknown',

    isPublished : 'unknown',

    publishingDate : 'unknown',

    retrieveStatusMessage : 'unknown'
  };

  userID;

  userGroups = null;

  constructor(private rds: RawDatasetApi, private dlSrv: DatasetLifecycleApi,
              private db: OrigDatablockApi, private acSrv: AccessUserApi,
              private auth: LoopBackAuth, private store: Store<any>) {}

  /**



   * Search datasets with search terms,



   * defaults to just limiting search size.



   * @param {any} [terms={limit: this.limit}]



   * @memberof DatasetService



   */

  searchDatasets(terms: object = this.filter) {
    this.loading = true;

    const filter = Object.assign(terms, this.filter);

    this.rds.find(filter).subscribe(
        ret => {
          this.loading = false;

          this.datasets = <Array<RawDataset>>ret;

          if (this.datasets.length > 0) {
            // this.updateStatus(0, 10);

            this.datasetChange.next('reload');
          }
        },
        error => { console.error(error); }, () => {});
  }

  getDataset(id: string) { return this.rds.findById(id, this.detailFilter); }

  getUserGroups(userID: String): Observable<any> {
    return this.acSrv.findById(userID);

    // TODO this should be in a different service? Maybe called when the user
    // logs in
  }

  searchDatasetsObservable(terms: object = this.filter) {
    const filter = Object.assign(terms, this.filter);

    return this.rds.find(filter);
  }

  /**



   * Load blocks based on dataset ID



   * @param set



   */

  getDatasetBlocks(set) {
    const datasetSearch = {where : {datasetId : set.pid}};

    this.db.find(datasetSearch)
        .subscribe(
            bl => {
              console.log(bl);

              set['datablocks'] = <Array<OrigDatablock>>bl;
            },
            error => {
              this.store.dispatch({
                type : ua.SHOW_MESSAGE,
                payload : {
                  content : error.message,
                  type : 'error',
                  title: 'Error searching for datablocks'
                }
              });
            });
  }

  /**



   * Returns observable to sub to



   * of datablock retrieval



   * @param id



   * @returns {Observable<T[]>}



   */

  getBlockObservable(id): Observable<Array<any>> {
    const datasetSearch = {where : {datasetId : id}};

    return this.db.find(datasetSearch);
  }
}
