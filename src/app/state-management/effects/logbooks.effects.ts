import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType } from "@ngrx/effects";
import { LogbookApi } from "shared/sdk";
import * as fromActions from "state-management/actions/logbooks.actions";
import { mergeMap, catchError, map } from "rxjs/operators";
import { of } from "rxjs";
import * as rison from "rison";

@Injectable()
export class LogbookEffects {
  fetchLogbooks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchLogbooksAction),
      mergeMap(() =>
        this.logbookApi.findAll().pipe(
          map(logbooks =>
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
      mergeMap(({ name }) =>
        this.logbookApi.findByName(name).pipe(
          map(logbook => fromActions.fetchLogbookCompleteAction({ logbook })),
          catchError(() => of(fromActions.fetchLogbookFailedAction()))
        )
      )
    )
  );

  fetchFilteredEntries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchFilteredEntriesAction),
      mergeMap(({ name, filters }) => {
        const logbookFilter = rison.encode_object(filters);
        return this.logbookApi.filter(name, logbookFilter).pipe(
          map(logbook =>
            fromActions.fetchFilteredEntriesCompleteAction({ logbook })
          ),
          catchError(() => of(fromActions.fetchFilteredEntriesFailedAction()))
        );
      })
    )
  );

  constructor(private actions$: Actions, private logbookApi: LogbookApi) {}
}
