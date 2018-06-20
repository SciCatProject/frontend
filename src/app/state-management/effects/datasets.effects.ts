import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';

import { Angular5Csv } from 'angular5-csv/Angular5-csv';

import { DatasetApi, DatablockApi } from 'shared/sdk/services';

import * as DatasetActions from 'state-management/actions/datasets.actions';
import * as UserActions from 'state-management/actions/user.actions';

import {
  Dataset,
  Message,
  MessageType,
  DatasetFilters
} from 'state-management/models';

import {
  getRectangularRepresentation,
  getFilters,
  getFullqueryParams,
  getFullfacetsParams
} from '../selectors/datasets.selectors';

import { config } from '../../../config/config';

import { map } from 'rxjs/operators/map';
import { withLatestFrom } from 'rxjs/operators/withLatestFrom';
import { catchError } from 'rxjs/operators/catchError';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { tap } from 'rxjs/operators/tap';

// Returns copy with null/undefined values and empty arrays/strings removed
function restrictFilter(filter: object, allowedKeys?: string[]) {
  function isNully(value: any) {
    const hasLength = typeof value === 'string' || Array.isArray(value);
    return value == null || hasLength && value.length === 0;
  }

  const keys = allowedKeys || Object.keys(filter);
  return keys.reduce((obj, key) => {
    const val = filter[key];
    return isNully(val) ? obj : {...obj, [key]: val};
  }, {});
}

@Injectable()
export class DatasetEffects {
  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private datasetApi: DatasetApi,
    private datablockApi: DatablockApi,
  ) {}
  
  private fullqueryParams$ = this.store.pipe(select(getFullqueryParams));
  private fullfacetParams$ = this.store.pipe(select(getFullfacetsParams));
  private rectangularRepresentation$ = this.store.pipe(select(getRectangularRepresentation));

  @Effect()
  private fetchDatasets$: Observable<Action> = this.actions$.pipe(
    ofType(DatasetActions.FETCH_DATASETS),
    withLatestFrom(this.fullqueryParams$),
    map(([action, params]) => params),
    mergeMap(({query, limits}) =>
      this.datasetApi.fullquery(query, limits).pipe(
        map(datasets => new DatasetActions.FetchDatasetsCompleteAction(datasets as Dataset[])),
        catchError(() => Observable.of(new DatasetActions.FetchDatasetsFailedAction()))    
      )
    ),
  );

  @Effect()
  private fetchFacetCounts$: Observable<Action> = this.actions$.pipe(
    ofType(DatasetActions.FETCH_FACET_COUNTS),
    withLatestFrom(this.fullfacetParams$),
    map(([action, params]) => params),
    mergeMap(({fields, facets}) => {
      return this.datasetApi.fullfacet(fields, facets).pipe(
        map(res => {
          const {all, ...facetCounts} = res[0];
          const allCounts = all && all.length > 0 ? all[0].totalSets : 0;
          return new DatasetActions.FetchFacetCountsCompleteAction(facetCounts, allCounts);
        }),
        catchError(() => Observable.of(new DatasetActions.FetchFacetCountsFailedAction()))
      )
    }),
  );

  @Effect({dispatch: false})
  protected exportToCsv$: Observable<Action> = this.actions$.pipe(
    ofType(DatasetActions.EXPORT_TO_CSV),
    mergeMap(() => this.rectangularRepresentation$),
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
  protected getDatablocks$: Observable<Action> =
    this.actions$.ofType(DatasetActions.DATABLOCKS)
      .debounceTime(300)
      .map((action: DatasetActions.DatablocksAction) => action.id)
      .switchMap(id => {
        const idstring = id;

        const blockFilter = {
          include: [
            { relation: 'origdatablocks' },
            { relation: 'datablocks' },
            { relation: 'datasetattachments' },
            { relation: 'datasetlifecycle' }
          ]
        };

        // TODO separate action for dataBlocks? or retrieve at once?

        return this.datasetApi.findById(encodeURIComponent(id), blockFilter)
          .switchMap((dataset: Dataset) => {
            //console.log(res);
            return Observable.of(new DatasetActions.SearchIDCompleteAction(dataset));
          })
          .catch(err => {
            return Observable.of(new DatasetActions.DatablocksFailedAction(err));
          });
      });

      /*
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
      });*/

  /*
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
      */


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
