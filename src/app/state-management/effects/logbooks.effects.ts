import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { LogbookApi, Logbook } from "shared/sdk";
import * as fromActions from "state-management/actions/logbooks.actions";
import { mergeMap, catchError, map, withLatestFrom } from "rxjs/operators";
import { of } from "rxjs";

import {
  loadingAction,
  loadingCompleteAction
} from "state-management/actions/user.actions";
import { Store, select } from "@ngrx/store";
import { getFilters } from "state-management/selectors/logbooks.selectors";

@Injectable()
export class LogbookEffects {
  filters$ = this.store.pipe(select(getFilters));

  fetchLogbooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchLogbooksAction),
      mergeMap(() =>
        this.logbookApi.find<Logbook>().pipe(
          map((logbooks: Logbook[]) =>
            fromActions.fetchLogbooksCompleteAction({ logbooks })
          ),
          catchError(() => of(fromActions.fetchLogbooksFailedAction()))
        )
      )
    )
  );

  fetchLogbook$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchLogbookAction),
      withLatestFrom(this.filters$),
      mergeMap(([{ name }, filters]) =>
        this.logbookApi
          .findByName(encodeURIComponent(name), JSON.stringify(filters))
          .pipe(
            mergeMap(logbook => [
              fromActions.fetchLogbookCompleteAction({ logbook }),
              fromActions.fetchCountAction({ name })
            ]),
            catchError(() => of(fromActions.fetchLogbookFailedAction()))
          )
      )
    )
  );

  fetchCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchCountAction),
      withLatestFrom(this.filters$),
      mergeMap(([{ name }, filters]) => {
        const { skip, limit, sortField, ...theRest } = filters;
        return this.logbookApi
          .findByName(encodeURIComponent(name), JSON.stringify(theRest))
          .pipe(
            map((logbook: Logbook) =>
              fromActions.fetchCountCompleteAction({
                count: logbook.messages.length
              })
            ),
            catchError(() => of(fromActions.fetchCountFailedAction()))
          );
      })
    )
  );

  loading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromActions.fetchLogbooksAction,
        fromActions.fetchLogbookAction,
        fromActions.fetchCountAction
      ),
      mergeMap(() => of(loadingAction()))
    )
  );

  loadingComplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromActions.fetchLogbooksCompleteAction,
        fromActions.fetchLogbooksFailedAction,
        fromActions.fetchLogbookCompleteAction,
        fromActions.fetchLogbookFailedAction,
        fromActions.fetchCountCompleteAction,
        fromActions.fetchCountFailedAction
      ),
      mergeMap(() => of(loadingCompleteAction()))
    )
  );

  constructor(
    private actions$: Actions,
    private logbookApi: LogbookApi,
    private store: Store<Logbook>
  ) {}
}
