// import all rxjs operators that are needed
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';

import {Injectable} from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {Observable} from 'rxjs/Observable';
import * as lb from 'shared/sdk/services';
import * as JobActions from 'state-management/actions/jobs.actions';
import * as UserActions from 'state-management/actions/user.actions';

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
            return Observable.of(new JobActions.SearchIDCompleteAction(res));
          })
          .catch(err => {
            console.log(err);
            return Observable.of(new JobActions.SearchIDFailedAction(err));
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
            return Observable.of(new JobActions.SubmitCompleteAction(res));
          });
      })
      .catch(err => {
        console.log(err);
        return Observable.of(new JobActions.FailedAction(err));
      });

  @Effect()
  protected submitMessage$: Observable<Action> =
    this.action$.ofType(JobActions.SUBMIT_COMPLETE)
      .map(toPayload)
      .switchMap((res) => {
        const msg = {
          type: 'success',
          title: 'Job Created Successfully',
          content: ''
        };
        return Observable.of(new UserActions.ShowMessageAction(msg));
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
        return Observable.of(new JobActions.ChildRetrieveCompleteAction(node.children));
      })
      .catch(err => {
        console.log(err);
        return Observable.of(new JobActions.FailedAction(err));
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
        filter['limit'] = fq['limit'] ? fq['limit'] : 50;
        filter['order'] = 'creationTime DESC';
        return this.jobSrv.find(filter)
          .switchMap(res => {
            return Observable.of(new JobActions.RetrieveCompleteAction(res));
          });
      })
      .catch(err => {
        console.log(err);
        return Observable.of(new JobActions.FailedAction(err));
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
