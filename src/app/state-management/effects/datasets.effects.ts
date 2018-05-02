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
import { filter } from 'rxjs/operators';

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
            { relation: 'datasetattachments' },
            { relation: 'datasetlifecycle' }
          ]
        };

        // TODO separate action for dataBlocks? or retrieve at once?

        return this.ds.findById(encodeURIComponent(id), blockFilter)
          .switchMap(res => {
            console.log(res);
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
          console.log("========== Facet call: Payload:",payload)
          // TODO is handleFacetPayload obsolete ?
        // const fq = handleFacetPayload(payload, false);
        // TODO can we avoid these fields in the first place ?
        const fq={}
        // remove fields not relevant for facet filters
        Object.keys(payload).forEach(key => {
           if (['mode','initial','sortField','skip'].indexOf(key)>=0)return
           if (payload[key] === null) return
           if (typeof payload[key] === 'undefined' || payload[key].length == 0) return
           fq[key]=payload[key]
        })
        console.log("=== Facet call: effective filter expression:",fq)
// TODO The following group handling is probably obsolete
        // let groups = fq['ownerGroup'];
        // if (!groups || groups.length === 0) {
        //   this.store.select(state => state.root.user.currentUserGroups)
        //     .take(1)
        //     .subscribe(user => {
        //         groups = user;
        //   });
        // }
        const facetObject = [  "type", "creationTime", "creationLocation", "ownerGroup","keywords"];
        return this.ds
          .fullfacet(JSON.stringify(fq), facetObject)
          .switchMap(res => {
            const filterValues = res[0];
            //console.log("========== Facet call: resulting Filtervalues",filterValues)
            // TODO can I remove all the sorting stuff here ?
            // TODO why 2 different names ?
            // TODO why each value treated explicitly hardwired here ?
            // const groupsArr = filterValues['groups'] || filterValues['ownerGroup'];
            // groupsArr.sort(stringSort);
            // const kwArr = filterValues['keywords'] || [];
            // kwArr.sort(stringSort);
            // const typeArr = filterValues['type'] || [];
            // typeArr.sort(stringSort);
            // // TODO why 2 different names ?
            // const locationArr = filterValues['locations'] || filterValues['creationLocation'];
            // locationArr.sort(stringSort);
            // const fv = {};
            // fv['ownerGroup'] = groupsArr;
            // fv['creationLocation'] = locationArr;
            // // TODO Return the right information for dates:  {"_id": { "year": 2011, "month": 9, day": 14 },"count": 2 }
            // // fv['years'] = filterValues['years'];
            // fv['type'] = typeArr;
            // fv['keywords'] = kwArr;
            console.log(" ========== Facet call Resulting fv array:",filterValues)
            return Observable.of(new DatasetActions.UpdateFilterCompleteAction(filterValues));
          })
          .catch(err => {
            console.log(err);
            return Observable.of(new DatasetActions.FilterFailedAction(err));
          });
      });

  @Effect()
  protected facetDatasets$: Observable<Action> =
    this.action$.ofType(DatasetActions.FILTER_UPDATE)
      .debounceTime(300)
      .map((action: DatasetActions.UpdateFilterAction) => action.payload)
      .switchMap(payload => {
          const limits= {};
          limits['limit'] = payload['limit'] ? payload['limit'] : 30;
          limits['skip'] = payload['skip'] ? payload['skip'] : 0;
          limits['order'] = payload['sortField'] ? payload['sortField'] : "creationTime:desc";
          // remove fields not relevant for facet filters
          // TODO understand what defines the structure of the payload. May be define a better payload structure from beginning, which separates filter conditions and skip parameters etc
          // TODO IMPORTANT Understand why "limit" is not part of Payload
          // TODO What is the meaning of "initial"
          const fq={}
          Object.keys(payload).forEach(key => {
             if (['mode','initial','sortField','skip'].indexOf(key)>=0)return
             if (payload[key] === null) return
             if (typeof payload[key] === 'undefined' || payload[key].length == 0) return
             fq[key]=payload[key]
          })
          console.log("==== Dataset call with input fq,limits:",fq,limits)
          return this.ds.fullquery(fq,limits)
              .switchMap(res => {
                console.log("==== Dataset call result:",res);
                return Observable.of(new DatasetActions.SearchCompleteAction(res));
              })
              .catch(err => {
                console.log(err);
                return Observable.of(new DatasetActions.SearchFailedAction(err));
           });
      });

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

      /*
  @Effect()
  protected fetchDatasetsForProposal$: Observable<Action> =
    this.action$.ofType(DatasetActions.FETCH_DATASETS_FOR_PROPOSAL)
      .map((action: DatasetActions.FetchDatasetsForProposalAction) => action.proposalId)
      .switchMap(proposalId => this.cds
        .searchDatasetsObservable({where: {proposalId}})
        .map(datasets =>
          new DatasetActions.SearchCompleteAction(datasets)
        )
      );*/

  constructor(private action$: Actions, private store: Store<any>,
    private cds: DatasetService, private ds: lb.DatasetApi, private rds: lb.DatasetApi,
    private dls: lb.DatasetLifecycleApi, private dbs: lb.DatablockApi,
    private odbs: lb.OrigDatablockApi,
    private userIdentitySrv: lb.UserIdentityApi,
    private accessUserSrv: lb.AccessUserApi) { }
}

/**
 * Create a filter query to be handled by loopback for datasets and facets
 * @param fq The fields to construct the query from
 * @param loopback If using Loopback or mongo syntax. Check the docs for differences but mainly on array vs object structure
 */
// function handleFacetPayload(fq, loopback = false) {
//   const match: any = loopback ? [] : {};
//   const f = Object.assign({}, fq);
//   delete f['mode'];
//   delete f['initial'];
//   delete f['sortField'];
//   delete f['skip'];
//
// console.log(" ==== handlefacetpayload: fq at start:",f)
//   Object.keys(f).forEach(key => {
//     let facet = f[key];
//     //console.log("key,facet:",key,facet)
//     if (facet) {
//       switch (key) {
//         case 'ownerGroup':
//           if (facet.length > 0 && facet.constructor !== Array &&
//             typeof facet[0] === 'object') {
//             const groupsArray = [];
//             const keys = Object.keys(facet[0]);
//
//             for (let i = 0; i < keys.length; i++) {
//               groupsArray.push(facet[0][keys[i]]);
//             }
//
//             facet = groupsArray;
//           }
//           if (facet.length > 0) {
//             if (loopback) {
//               match.push({ ownerGroup: { inq: facet } });
//             } else {
//               match[key] = facet;
//             }
//           }
//           break;
//         case 'text':
//           if (loopback) {
//             match.push({ '$text': { 'search': '"' + facet + '"', 'language': 'none' } });
//           } else {
//             match[key] = facet;
//           }
//           break;
//         case 'creationTime':
//           const start = facet['begin'] || undefined;
//           const end = facet['end'] || undefined;
//           if (start && end) {
//             if (loopback) {
//               match.push({ creationTime: {gte: start} });
//               match.push({ creationTime: {lte: end} });
//             } else {
//               match['creationTime'] = { start: start, end: end };
//             }
//           }
//           break;
//         case 'type':
//           if (loopback) {
//             match.push({'type': facet});
//           } else {
//               // TODO how to distinguish fields with single allowed values and multiple
//               // do I need the array construct as above for ownerGroup to return an array ?
//               // or should I change the syntax if arrray has only one field from $in syntax ?
//             match['type'] = [facet];
//           }
//           break;
//         default:
//           // TODO handle default case for array and text types in Mongo (defaults to array)
//           const obj = {};
//           if (loopback && facet.length > 0) {
//             obj[key] = {inq: facet};
//             match.push(obj);
//           } else if(facet.length > 0) {
//             match[key] = facet;
//           }
//           break;
//       }
//     }
//   });
//   console.log("=== handlefacetpayload Resulting match expression:",match)
//   return match;
// }


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
