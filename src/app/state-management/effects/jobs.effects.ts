// import all rxjs operators that are needed
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import {Injectable} from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import * as lb from 'shared/sdk/services';
import * as JobActions from 'state-management/actions/jobs.actions';

// import store state interface

@Injectable()
export class JobsEffects {


  @Effect()
  protected getJob$: Observable<Action> =
    this.action$.ofType(JobActions.SEARCH_ID)
      .debounceTime(300)
      .map(toPayload)
      .switchMap(payload => {
        const id = payload;
        // TODO separate action for dataBlocks? or retrieve at once?

        return this.jobSrv.findById(encodeURIComponent(id))
          .switchMap(res => {
            return Observable.of({
              type: JobActions.SEARCH_ID_COMPLETE,
              payload: res
            });
          })
          .catch(err => {
            console.log(err);
            return Observable.of(
              {type: JobActions.SEARCH_ID_FAILED, payload: err});
          });
      });

  @Effect()
  protected submit$: Observable<Action> =
    this.action$.ofType(JobActions.SUBMIT)
      .map(toPayload)
      .switchMap((job) => {
        return this.jobSrv.create(job)
          .switchMap(res => {
            console.log(res);
            return Observable.of(
              {type: JobActions.SUBMIT_COMPLETE, payload: res});
          });
      })
      .catch(err => {
        console.log(err);
        return Observable.of(
          {type: JobActions.SUBMIT_COMPLETE, payload: err});
      });

  @Effect()
  protected retrieve$: Observable<Action> =
    this.action$.ofType(JobActions.RETRIEVE)
      .map(toPayload)
      .switchMap((filters) => {
        console.log(filters);
        return this.jobSrv.find({'order': 'creationTime DESC', 'limit': filters.limit, 'skip': filters.skip})
          .switchMap(res => {
            console.log(res);
            return Observable.of(
              {type: JobActions.RETRIEVE_COMPLETE, payload: res});
          });
      })
      .catch(err => {
        console.log(err);
        return Observable.of(
          {type: JobActions.FAILED, payload: err});
      });

  @Effect()
  protected childRetrieve$: Observable<Action> =
    this.action$.ofType(JobActions.CHILD_RETRIEVE)
      .map(toPayload)
      .switchMap((node) => {
        console.log(node);
        node.children = [];
        if (node.data.datasetList.length > 0) {
          node.data.datasetList.map(ds => {
            if (ds.pid && ds.pid.length > 0) {
              this.dsSrv
                .findById(encodeURIComponent(ds.pid),
                  {'include': 'datasetlifecycle'})
                .subscribe(dataset => {
                  const entry = {
                    'data': {
                      'creationTime': ds.pid,
                      'emailJobInitiator': '',
                      'type':
                        dataset['datasetlifecycle']['archiveStatusMessage'],
                      'jobStatusMessage':
                        dataset['datasetlifecycle']['retrieveStatusMessage']
                    }
                  };
                  node.children.push(entry);
                });
            }
          });
        } else {
          node.children.push(
            {'data': {'type': 'No datasets could be found'}});
        }
        return Observable.of({type: JobActions.CHILD_RETRIEVE_COMPLETE, payload: node.children});
      })
      .catch(err => {
        console.log(err);
        return Observable.of(
          {type: JobActions.RETRIEVE_COMPLETE, payload: err});
      });

  @Effect()
  protected get_updated_sort$: Observable<Action> =
    this.action$.ofType(JobActions.SORT_UPDATE)
      .debounceTime(300)
      .map(toPayload)
      .switchMap(payload => {
        const fq = payload;
        const filter = {};
        filter['skip'] = fq['skip'] ? fq['skip'] : 0;
        filter['order'] = 'creationTime DESC';
        return this.jobSrv.find(filter)
          .switchMap(res => {
            return Observable.of(
              {type: JobActions.RETRIEVE_COMPLETE, payload: res});
          });
      })
      .catch(err => {
        console.log(err);
        return Observable.of(
          {type: JobActions.RETRIEVE_COMPLETE, payload: err});
      });


  constructor(private action$: Actions, private store: Store<any>,
              private jobSrv: lb.JobApi, private dsSrv: lb.RawDatasetApi) {
  }


}


function stringSort(a, b) {
  const val_a = a._id,
    val_b = b._id;
  if (val_a < val_b) {
    return -1;
  }
  if (val_a > val_b) {
    return 1;
  }
  return 0;
}
