// import all rxjs operators that are needed
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';

import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { DatasetService } from 'datasets/dataset.service';
import { Observable } from 'rxjs/Observable';
import * as lb from 'shared/sdk/services';
import * as DatasetActions from 'state-management/actions/datasets.actions';
import * as UserActions from 'state-management/actions/user.actions';

import { Message, MessageType } from 'state-management/models';

// import store state interface
@Injectable()
export class DatasetEffects {

  @Effect()
  protected getDataset$: Observable<Action> =
    this.action$.ofType(DatasetActions.SEARCH_ID)
      .debounceTime(300)
      .map((action: DatasetActions.SearchIDAction) => action.payload)
      .switchMap(payload => {
        const id = payload;
        // TODO separate action for dataBlocks? or retrieve at once?

        return this.ds.findById(encodeURIComponent(id))
          .switchMap(res => {
            return Observable.of(new DatasetActions.SearchIDCompleteAction(res));
          })
          .catch(err => {
            console.log(err);
            return Observable.of(new DatasetActions.SearchIDFailedAction(err));
          });
      });

  @Effect()
  protected getDatablocks$: Observable<Action> =
    this.action$.ofType(DatasetActions.DATABLOCKS)
      .debounceTime(300)
      .map((action: DatasetActions.DatablocksAction) => action.payload)
      .switchMap(payload => {
        const id = payload;

        const blockFilter = {
          include: [
            { relation: 'origdatablocks' },
            { relation: 'datablocks' },
            { relation: 'datasetlifecycle' }
          ]
        };

        // TODO separate action for dataBlocks? or retrieve at once?

        return this.ds.findById(encodeURIComponent(id), blockFilter)
          .switchMap(res => {
            return Observable.of(new DatasetActions.SearchIDCompleteAction(res));
          })
          .catch(err => {
            return Observable.of(new DatasetActions.DatablocksFailedAction(err));
          });
      });

  @Effect()
  protected facet$: Observable<Action> =
    this.action$.ofType(DatasetActions.FILTER_UPDATE)
      .debounceTime(300)
      .map((action: DatasetActions.UpdateFilterAction) => action.payload)
      .switchMap(payload => {
        const fq = Object.assign({}, payload);
        let groups = fq['ownerGroup'];
        if (!groups || groups.length === 0) {
          this.store.select(state => state.root.user.currentUserGroups)
            .take(1)
            .subscribe(user => { groups = user; });
        }
        //              console.log(fq);
        if (fq['text']) {
          fq['text'] = { '$search': '"' + fq['text'] + '"', '$language': 'none' };
        } else {
          delete fq['text'];
        }
        delete fq['mode'];
        const facetObject = {'keywords': [{'$group': {'_id': '$keywords', 'count': {'$sum': 1}}}, {'$sort': {'count': -1, '_id': 1}}]};
        return this.ds
          .facet(fq, facetObject)
          .switchMap(res => {
            const filterValues = res['results'][0];

            const groupsArr = filterValues['groups'] || filterValues['ownerGroup'];
            groupsArr.sort(stringSort);
            const kwArr = filterValues['keywords'] || [];
            kwArr.sort(stringSort);
            const locationArr = filterValues['locations'] || filterValues['creationLocation'];
            locationArr.sort(stringSort);
            const fv = {};
            fv['ownerGroup'] = groupsArr;
            fv['creationLocation'] = locationArr;
            fv['years'] = filterValues['years'];
            fv['keywords'] = kwArr;
            return Observable.of(new DatasetActions.UpdateFilterCompleteAction(fv));
          })
          .catch(err => {
            console.log(err);
            return Observable.of(new DatasetActions.FilterFailedAction(err));
          });
      });

  @Effect()
  protected facetDatasetCount$: Observable<Action> =
    this.action$.ofType(DatasetActions.FILTER_UPDATE)
      .debounceTime(300)
      .map((action: DatasetActions.UpdateFilterAction) => action.payload)
      .switchMap(payload => {
        const fq = Object.assign({}, payload);
        const match = handleFacetPayload(fq);
        let filter = {};
        if (match.length > 1) {
          filter = {};
          filter['and'] = match;
        } else if (match.length === 1) {
          filter = match[0];
        }

        return this.ds.count(filter)
          .switchMap(res => {
            return Observable.of(new DatasetActions.TotalSetsAction(res['count']));
          })
          .catch(err => {
            console.log(err);
            return Observable.of(new DatasetActions.SearchFailedAction(err));
          });

      });

  @Effect()
  protected facetDatasets$: Observable<Action> =
    this.action$.ofType(DatasetActions.FILTER_UPDATE)
      .debounceTime(300)
      .map((action: DatasetActions.UpdateFilterAction) => action.payload)
      .switchMap(payload => {
        const fq = Object.assign({}, payload);
        const match = handleFacetPayload(fq);
        const filter = {};
        if (match.length > 1) {
          filter['where'] = {};

          filter['where']['and'] = match;
        } else if (match.length === 1) {
          filter['where'] = match[0];
        }

        filter['limit'] = fq['limit'] ? fq['limit'] : 30;
        filter['skip'] = fq['skip'] ? fq['skip'] : 0;
        filter['include'] = [{ relation: 'datasetlifecycle' }];
        if (fq['sortField']) {
          filter['order'] = fq['sortField'];
        }
        return this.ds.find(filter)
          .switchMap(res => {
            return Observable.of(new DatasetActions.SearchCompleteAction(res));
          })
          .catch(err => {
            console.log(err);
            return Observable.of(new DatasetActions.SearchFailedAction(err));
          });
      });
  // @Effect()
  // protected getGroups$: Observable<Action> =
  //     this.action$.ofType(DatasetActions.ADD_GROUPS)
  //         .debounceTime(300)
  //         .map(toPayload)
  //         .switchMap(payload => {
  //           return this.userIdentitySrv.findOne({'where': {'userId': payload}})
  //               .switchMap(res => {
  //                 return Observable.of(new DatasetActions.AddGroupsCompleteAction(res['profile']['accessGroups']));
  //               })
  //               .catch(err => {
  //                 console.error(err);
  //                 return Observable.of(new DatasetActions.AddGroupsFailedAction(err));
  //               });
  //         });

  @Effect()
  protected deleteDatablocks$: Observable<Action> =
    this.action$.ofType(DatasetActions.DATABLOCK_DELETE)
      .map((action: DatasetActions.DatablockDeleteAction) => action.payload)
      .switchMap(payload => {
        const block = payload;
        return this.dbs.deleteById(block['id']).switchMap(res => {
          return Observable.of({
            type: DatasetActions.DATABLOCK_DELETE_COMPLETE
          });
        }).catch(err => {
          const msg = new Message();
          msg.content = 'Failed to delete datablock';
          msg.type = MessageType.Error;
          return Observable.of(new UserActions.ShowMessageAction(msg));
        });
      });

  @Effect()
  protected updateSelectedDatablocks$: Observable<Action> =
    this.action$.ofType(DatasetActions.SELECTED_UPDATE)
      .map((action: DatasetActions.UpdateSelectedAction) => action.payload)
      .switchMap(payload => {
        if (payload && payload.length > 0) {
          const dataset = payload[payload.length - 1];
          const datasetSearch = { where: { datasetId: dataset.pid } };
          return this.dbs.find(datasetSearch).switchMap(res => {
            dataset['datablocks'] = res;
            return Observable.of(new DatasetActions.UpdateSelectedDatablocksAction(payload));
          });
        } else {
          return Observable.of(new DatasetActions.UpdateSelectedDatablocksAction(payload));
        }
      });

  // @Effect()
  // protected updateCurrentSetDatablocks$: Observable<Action> =
  //   this.action$.ofType(DatasetActions.SELECT_CURRENT)
  //     .map(toPayload)
  //     .switchMap(payload => {
  //       if (payload) {
  //         const dataset = payload;
  //         const datasetSearch = { where: { datasetId: dataset.pid } };
  //         return this.dbs.find(datasetSearch).switchMap(res => {
  //           dataset['datablocks'] = res;
  //           console.log(res);
  //           return Observable.of(new DatasetActions.UpdateCurrentBlocksAction(payload));
  //         })
  //       } else {
  //         return Observable.of(new DatasetActions.UpdateCurrentBlocksAction(undefined));
  //       }
  //     });

  // @Effect()
  // protected updateCurrentSetOrigDatablocks$: Observable<Action> =
  //   this.action$.ofType(DatasetActions.SELECT_CURRENT)
  //     .map(toPayload)
  //     .switchMap(payload => {
  //       if (payload) {
  //         const dataset = payload;
  //         const datasetSearch = { where: { datasetId: dataset.pid } };
  //         return this.odbs.find(datasetSearch).switchMap(res => {
  //           dataset['origdatablocks'] = res;
  //           console.log(res);
  //           return Observable.of(new DatasetActions.UpdateCurrentBlocksAction(payload));
  //         })
  //       } else {
  //         return Observable.of(new DatasetActions.UpdateCurrentBlocksAction(undefined));
  //       }
  //     });

  @Effect()
  protected resetStatus$: Observable<Action> =
    this.action$.ofType(DatasetActions.RESET_STATUS)
      .map((action: DatasetActions.ResetStatusAction) => action.payload)
      .switchMap(payload => {
        const msg = new Message();
        return this.ds.reset(encodeURIComponent(payload['id'])).switchMap(res => {
          msg.content = 'Dataset Status Reset';
          msg.type = MessageType.Success;
          return Observable.of(new UserActions.ShowMessageAction(msg));
          // return Observable.of({type: DatasetActions.RESET_STATUS_COMPLETE, payload: res});
        }).catch(err => {
          console.error(err);
          msg.content = 'Dataset Status Reset Failed';
          msg.type = MessageType.Error;
          return Observable.of(new UserActions.ShowMessageAction(msg));
        });
      });

  constructor(private action$: Actions, private store: Store<any>,
    private cds: DatasetService, private ds: lb.DatasetApi, private rds: lb.RawDatasetApi,
    private dls: lb.DatasetLifecycleApi, private dbs: lb.DatablockApi,
    private odbs: lb.OrigDatablockApi,
    private userIdentitySrv: lb.UserIdentityApi,
    private accessUserSrv: lb.AccessUserApi) { }
}

function handleFacetPayload(fq) {
  let ownerGroup = fq['ownerGroup'];
  const text = fq['text'], creationLocation = fq['creationLocation'];

  // TODO access state from here?

  const match = [];
  if (ownerGroup) {
    if (ownerGroup.length > 0 && ownerGroup.constructor !== Array &&
      typeof ownerGroup[0] === 'object') {
      const groupsArray = [];
      console.log('Converting object');
      const keys = Object.keys(ownerGroup[0]);

      for (let i = 0; i < keys.length; i++) {
        groupsArray.push(ownerGroup[0][keys[i]]);
      }

      ownerGroup = groupsArray;
    }
    if (ownerGroup.length > 0) {
      match.push({ ownerGroup: { inq: ownerGroup } });
    }
  }

  if (creationLocation && creationLocation.length > 0) {
    match.push({ creationLocation: { inq: creationLocation } });
  }
  if (fq['creationTime']) {
    const start = fq['creationTime']['start'] || undefined;
    const end = fq['creationTime']['end'] || undefined;
    if (start) {
      match.push({ creationTime: { gte: start } });
    }
    if (end) {
      match.push({ creationTime: { lte: end } });
    }
  }
  if (fq['type']) {
    match.push({ type: fq['type'] });
  }
  /*  else if ((startDate && !endDate) || (!startDate && endDate)) {
     return Observable.of({
       type : DatasetActions.SEARCH_FAILED,
       payload : {message : 'Start and End Date must be specified'}
     });
     }*/
  if (text) {
    match.push({ '$text': { 'search': '"' + text + '"', 'language': 'none' } });
  }
  return match;
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
