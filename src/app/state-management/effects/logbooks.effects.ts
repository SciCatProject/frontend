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
  FetchFilteredLogbookOutcomeAction,
  FetchFilteredLogbookAction,
  FetchFilteredLogbookCompleteAction,
  FetchFilteredLogbookFailedAction
} from "state-management/actions/logbooks.actions";

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
  getFilteredLogbook: Observable<
    FetchFilteredLogbookOutcomeAction
  > = this.actions$.pipe(
    ofType<FetchFilteredLogbookAction>(ActionTypes.FETCH_FILTERED_LOGBOOK),
    mergeMap(action =>
      this.logbookService.getFilteredLogbook(action.name, action.query).pipe(
        map(logbook => new FetchFilteredLogbookCompleteAction(logbook)),
        catchError(() => of(new FetchFilteredLogbookFailedAction()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private logbookService: LogbookService
  ) {}
}
