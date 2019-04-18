import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of, Observable } from "rxjs";
import { map, mergeMap, catchError } from "rxjs/operators";
import { LogbookService } from "logbooks/logbook.service";
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
  FetchSearchedEntriesOutcomeAction,
  FetchSearchedEntriesAction,
  FetchSearchedEntriesCompleteAction,
  FetchSearchedEntriesFailedAction,
  FetchFilteredEntriesOutcomeActions,
  FetchFilteredEntriesAction,
  FetchFilteredEntriesCompleteAction,
  FetchFilteredEntriesFailedAction
} from "state-management/actions/logbooks.actions";
import {
  getSearchedEntries,
  getFilteredEntries
} from "state-management/selectors/logbooks.selector";

@Injectable()
export class LogbookEffect {
  @Effect()
  getLogbooks: Observable<FetchLogbooksOutcomeAction> = this.actions$.pipe(
    ofType<FetchLogbooksAction>(ActionTypes.FETCH_LOGBOOKS),
    mergeMap(() =>
      this.logbookService.getLogbooks().pipe(
        map(logbooks => new FetchLogbooksCompleteAction(logbooks)),
        catchError(() => of(new FetchLogbooksFailedAction()))
      )
    )
  );

  @Effect()
  getLogbook: Observable<FetchLogbookOutcomeAction> = this.actions$.pipe(
    ofType<FetchLogbookAction>(ActionTypes.FETCH_LOGBOOK),
    mergeMap(action =>
      this.logbookService.getLogbook(action.name).pipe(
        map(logbook => new FetchLogbookCompleteAction(logbook)),
        catchError(() => of(new FetchLogbookFailedAction()))
      )
    )
  );

  @Effect()
  getSearchedEntries: Observable<
    FetchSearchedEntriesOutcomeAction
  > = this.actions$.pipe(
    ofType<FetchSearchedEntriesAction>(ActionTypes.FETCH_SEARCHED_ENTRIES),
    mergeMap(action =>
      this.logbookService.getSearchedEntries(action.name, action.query).pipe(
        map(logbook => new FetchSearchedEntriesCompleteAction(logbook)),
        catchError(() => of(new FetchSearchedEntriesFailedAction()))
      )
    )
  );

  @Effect()
  getFilteredEntries: Observable<
    FetchFilteredEntriesOutcomeActions
  > = this.actions$.pipe(
    ofType<FetchFilteredEntriesAction>(ActionTypes.FETCH_FILTERED_ENTRIES),
    mergeMap(action =>
      this.logbookService.getFilteredEntries(action.name, action.query).pipe(
        map(logbook => new FetchFilteredEntriesCompleteAction(logbook)),
        catchError(() => of(new FetchFilteredEntriesFailedAction()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private logbookService: LogbookService
  ) {}
}
