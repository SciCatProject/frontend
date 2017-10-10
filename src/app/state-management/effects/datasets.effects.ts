// import all rxjs operators that are needed
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';

import {Injectable} from '@angular/core';
import {Actions, Effect, toPayload} from '@ngrx/effects';
import {Action, Store} from '@ngrx/store';
import {DatasetService} from 'datasets/dataset.service';
import {Observable} from 'rxjs/Observable';
import * as lb from 'shared/sdk/services';
import * as DatasetActions from 'state-management/actions/datasets.actions';
// import store state interface
import {AppState} from 'state-management/state/app.store';

@Injectable()
export class DatasetEffects {

  @Effect()
  protected getDataset$: Observable<Action> =
      this.action$.ofType(DatasetActions.SEARCH_ID)
          .debounceTime(300)
          .map(toPayload)
          .switchMap(payload => {
            const id = payload;
            console.log(id);
            // TODO separate action for dataBlocks? or retrieve at once?

            return this.rds.findById(encodeURIComponent(id))
                .switchMap(res => {
                  return Observable.of({
                    type : DatasetActions.SEARCH_ID_COMPLETE,
                    payload : res
                  });
                })
                .catch(err => {
                  console.log(err);

                  return Observable.of(
                      {type : DatasetActions.SEARCH_ID_FAILED, payload : err});
                });
          });

  @Effect()
  protected getDatablocks$: Observable<Action> =
      this.action$.ofType(DatasetActions.DATABLOCKS)
          .debounceTime(300)
          .map(toPayload)
          .switchMap(payload => {
            const id = payload;

            const blockFilter = {
              include : [
                {relation : 'origdatablocks'},
                {relation : 'datasetlifecycle'}
              ]
            };

            // TODO separate action for dataBlocks? or retrieve at once?

            return this.rds.findById(encodeURIComponent(id), blockFilter)
                .switchMap(res => {
                  return Observable.of({
                    type : DatasetActions.SEARCH_ID_COMPLETE,
                    payload : res
                  });
                })
                .catch(err => {
                  return Observable.of(
                      {type : DatasetActions.DATABLOCKS_FAILED, payload : err});
                });
          });

  @Effect()
  protected facet$: Observable<Action> =
      this.action$.ofType(DatasetActions.SEARCH)
          .debounceTime(300)
          .map(toPayload)
          .switchMap(payload => {
            const fq = payload;
            // TODO access state from here?
            const startDate =
                fq['startDate'] ? fq['startDate'].toString() : fq['startDate'];
            const endDate =
                fq['endDate'] ? fq['endDate'].toString() : fq['endDate'];
            let groups = fq['groups'];
            if (!groups || groups.length === 0) {
              this.store.select(state => state.root.user.currentUserGroups)
                  .take(1)
                  .subscribe(user => { groups = user; });
              }
            return this.rds
                .facet(fq['creationLocation'], groups, startDate, endDate,
                       fq['text'])
                .switchMap(res => {
                  const filterValues = res['results'][0];

                  const groupsArr = filterValues['groups'];
                  groupsArr.sort(stringSort);

                  const locationArr = filterValues['locations'];
                  locationArr.sort(stringSort);
                  return Observable.of({
                    type : DatasetActions.FILTER_UPDATE_COMPLETE,
                    payload : filterValues
                  });
                })
                .catch(err => {
                  console.log(err);
                  return Observable.of(
                      {type : DatasetActions.FILTER_FAILED, payload : err});
                });
          });

  @Effect()
  protected facetDatasets$: Observable<Action> =
      this.action$.ofType(DatasetActions.SEARCH)
          .debounceTime(300)
          .map(toPayload)
          .switchMap(payload => {
            const fq = payload;

            let ownerGroup = fq['groups'];
            const startDate = fq['startDate'], endDate = fq['endDate'],
                  text = fq['text'], creationLocation = fq['creationLocation'];

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
                match.push({ownerGroup : {inq : ownerGroup}});
              }
              }

            if (creationLocation) {
              match.push({creationLocation : creationLocation});
              }

            if (startDate && endDate) {
              match.push({creationTime : {gte : startDate}});
              match.push({creationTime : {lte : endDate}});
            } else if ((startDate && !endDate) || (!startDate && endDate)) {
              return Observable.of({
                type : DatasetActions.SEARCH_FAILED,
                payload : {message : 'Start and End Date must be specified'}
              });
              }
            if (text) {
              match.push({'$text' : {'search' : text}});
              }
            // ensure fields have been specified and both dates have been set
            // NOTE: the dollar sign is added by loopback and is not needed here
            // match.push({$text: {"search":"psi"}});
            const filter = {};
            if (match.length > 1) {
              filter['where'] = {};

              filter['where']['and'] = match;
            } else if (match.length === 1) {
              filter['where'] = match[0];
            }
            this.store.select(state => state.root.user.settings.datasetCount)
                .take(1)
                .subscribe(d => { filter['limit'] = d; });
            // filterfilter["limit"] = fq["limit"] ? fq['limit'] : 10;
            filter['skip'] = fq['skip'] ? fq['skip'] : 0;
            filter['include'] = [ {relation : 'datasetlifecycle'} ];
            filter['order'] = fq['sortField'];
            return this.rds.find(filter)
                .switchMap(res => {
                  return Observable.of(
                      {type : DatasetActions.SEARCH_COMPLETE, payload : res});
                })
                .catch(err => {
                  console.log(err);
                  return Observable.of(
                      {type : DatasetActions.SEARCH_FAILED, payload : err});
                });
          });
  @Effect()
  protected getGroups$: Observable<Action> =
      this.action$.ofType(DatasetActions.ADD_GROUPS)
          .debounceTime(300)
          .map(toPayload)
          .switchMap(payload => {
            return this.accessUserSrv.findById(payload)
                .switchMap(res => {
                  return Observable.of({
                    type : DatasetActions.ADD_GROUPS_COMPLETE,
                    payload : res['memberOf']
                  });
                })
                .catch(err => {
                  console.error(err);
                  return Observable.of(
                      {type : DatasetActions.ADD_GROUPS_FAILED, payload : err});
                });
          });

  constructor(private action$: Actions, private store: Store<any>,
              private cds: DatasetService, private rds: lb.RawDatasetApi,
              private accessUserSrv: lb.AccessUserApi) {}
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
