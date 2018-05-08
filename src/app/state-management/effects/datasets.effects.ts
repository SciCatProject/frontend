import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/debounceTime';

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { DatasetService } from 'datasets/dataset.service';
import { Observable } from 'rxjs/Observable';
import * as lb from 'shared/sdk/services';
import * as DatasetActions from 'state-management/actions/datasets.actions';
import * as UserActions from 'state-management/actions/user.actions';

import { Message, MessageType } from 'state-management/models';
import { filter, tap, mergeMap, map } from 'rxjs/operators';
import { getRectangularRepresentation } from '../selectors/datasets.selectors';
import { takeLast } from 'rxjs/operator/takeLast';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';

@Injectable()
export class DatasetEffects {

  @Effect({dispatch: false})
  protected exportToCsv$: Observable<Action> = this.action$.pipe(
    ofType(DatasetActions.EXPORT_TO_CSV),
    mergeMap(() => this.store.pipe(select(getRectangularRepresentation))),
    tap((rect: any) => {
      const options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: false,
        useBom: true,
        headers: Object.keys(rect[0])
      };

      const ts = new Angular5Csv(rect, 'Datasets', options);
    })
  );

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
            //console.log(res);
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
        const fq={}
        // remove fields not relevant for facet filters
        Object.keys(payload).forEach(key => {
           if (['mode','initial','sortField','skip','limit'].indexOf(key)>=0)return
           if (payload[key] === null) return
           if (typeof payload[key] === 'undefined' || payload[key].length == 0) return
           fq[key]=payload[key]
        })
        const facetObject = [  "type", "creationTime", "creationLocation", "ownerGroup","keywords"];
        return this.ds
          .fullfacet(JSON.stringify(fq), facetObject)
          .switchMap(res => {
            const filterValues = res[0];
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
          // TODO understand what defines the structure of the payload.
          // TODO What is the meaning of "initial"
          const fq={}
          Object.keys(payload).forEach(key => {
             // console.log("======key,payload[key]",key,payload[key])
             if (['initial','sortField','skip','limit'].indexOf(key)>=0)return
             if (payload[key] === null) return
             if (typeof payload[key] === 'undefined' || payload[key].length == 0) return
             if (key === 'mode'){
                 if (payload['mode']==='archive'){
                     fq['archiveStatusMessage']=config.archiveable
                 } else if (payload['mode']==='retrieve'){
                     fq['archiveStatusMessage']=config.retrieveable
                 }
             } else {
                 fq[key]=payload[key]
             }
          })
          return this.ds.fullquery(fq,limits)
              .switchMap(res => {
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

  constructor(private action$: Actions, private store: Store<any>,
    private cds: DatasetService, private ds: lb.DatasetApi, private rds: lb.DatasetApi,
    private dls: lb.DatasetLifecycleApi, private dbs: lb.DatablockApi,
    private odbs: lb.OrigDatablockApi,
    private userIdentitySrv: lb.UserIdentityApi,
    private accessUserSrv: lb.AccessUserApi) { }
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
