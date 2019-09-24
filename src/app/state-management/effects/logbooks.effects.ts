import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of, Observable } from "rxjs";
import { map, mergeMap, catchError } from "rxjs/operators";
import {
  ActionTypes,
  FetchLogbooksCompleteAction,
  FetchLogbooksFailedAction,
  FetchLogbooksOutcomeAction,
  FetchLogbooksAction,
  FetchLogbookOutcomeAction,
  FetchLogbookAction,
  FetchLogbookCompleteAction,
  FetchLogbookFailedAction,
  FetchFilteredEntriesOutcomeActions,
  FetchFilteredEntriesAction,
  FetchFilteredEntriesCompleteAction,
  FetchFilteredEntriesFailedAction
} from "state-management/actions/logbooks.actions";
import { LogbookApi } from "shared/sdk";
import * as rison from "rison";

@Injectable()
export class LogbookEffect {
  @Effect()
  getLogbooks: Observable<FetchLogbooksOutcomeAction> = this.actions$.pipe(
    ofType<FetchLogbooksAction>(ActionTypes.FETCH_LOGBOOKS),
    mergeMap(() =>
      this.logbookApi.findAll().pipe(
        map(logbooks => new FetchLogbooksCompleteAction(logbooks)),
        catchError(() => of(new FetchLogbooksFailedAction()))
      )
    )
  );

  @Effect()
  getLogbook: Observable<FetchLogbookOutcomeAction> = this.actions$.pipe(
    ofType<FetchLogbookAction>(ActionTypes.FETCH_LOGBOOK),
    mergeMap(action =>
      this.logbookApi.findByName(action.name).pipe(
        map(logbook => new FetchLogbookCompleteAction(logbook)),
        catchError(() => of(new FetchLogbookFailedAction()))
      )
    )
  );

  @Effect()
  getFilteredEntries: Observable<
    FetchFilteredEntriesOutcomeActions
  > = this.actions$.pipe(
    ofType<FetchFilteredEntriesAction>(ActionTypes.FETCH_FILTERED_ENTRIES),
    mergeMap(action => {
      const filter = rison.encode_object(action.filter);
      return this.logbookApi.filter(action.name, filter).pipe(
        map(logbook => new FetchFilteredEntriesCompleteAction(logbook)),
        catchError(() => of(new FetchFilteredEntriesFailedAction()))
      );
    })
  );

  constructor(private actions$: Actions, private logbookApi: LogbookApi) {}
}
