import { Injectable } from "@angular/core";
import { createEffect, Actions, ofType, concatLatestFrom } from "@ngrx/effects";
import {
  DatasetsService,
  Logbook,
  LogbooksService,
} from "@scicatproject/scicat-sdk-ts-angular";
import * as fromActions from "state-management/actions/logbooks.actions";
import { mergeMap, catchError, map, timeout } from "rxjs/operators";
import { of } from "rxjs";

import {
  loadingAction,
  loadingCompleteAction,
} from "state-management/actions/user.actions";
import { Store } from "@ngrx/store";
import { selectFilters } from "state-management/selectors/logbooks.selectors";

@Injectable()
export class LogbookEffects {
  filters$ = this.store.select(selectFilters);

  fetchLogbooks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchLogbooksAction),
      mergeMap(() =>
        this.logbooksService.logbooksControllerFindAll().pipe(
          map((logbooks: Logbook[]) =>
            fromActions.fetchLogbooksCompleteAction({ logbooks }),
          ),
          catchError(() => of(fromActions.fetchLogbooksFailedAction())),
        ),
      ),
    );
  });

  fetchLogbook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchLogbookAction),
      concatLatestFrom(() => this.filters$),
      mergeMap(([{ name }, filters]) => {
        return this.logbooksService
          .logbooksControllerFindByName(name, JSON.stringify(filters))
          .pipe(
            timeout(3000),
            mergeMap((logbook: Logbook) => [
              fromActions.fetchLogbookCompleteAction({ logbook }),
              fromActions.fetchCountAction({ name }),
            ]),
            catchError(() => of(fromActions.fetchLogbookFailedAction())),
          );
      }),
    );
  });

  fetchDatasetLogbook$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchDatasetLogbookAction),
      concatLatestFrom(() => this.filters$),
      mergeMap(([{ pid }, filters]) =>
        this.datasetsService
          .datasetsControllerFindLogbookByPid(pid, JSON.stringify(filters))
          .pipe(
            timeout(3000),
            mergeMap((logbook) => [
              fromActions.fetchLogbookCompleteAction({ logbook }),
              fromActions.fetchCountAction({ pid }),
            ]),
            catchError(() => of(fromActions.fetchDatasetLogbookFailedAction())),
          ),
      ),
    );
  });

  fetchCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchCountAction),
      concatLatestFrom(() => this.filters$),
      mergeMap(([{ name, pid }, filters]) => {
        const { skip, limit, sortField, ...theRest } = filters;
        return (
          name
            ? this.logbooksService.logbooksControllerFindByName(
                name,
                JSON.stringify(theRest),
              )
            : this.datasetsService.datasetsControllerFindLogbookByPid(
                pid,
                JSON.stringify(theRest),
              )
        ).pipe(
          map((logbook: Logbook) => {
            return fromActions.fetchCountCompleteAction({
              count: logbook.messages.length,
            });
          }),
          catchError(() => of(fromActions.fetchCountFailedAction())),
        );
      }),
    );
  });

  loading$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchLogbooksAction,
        fromActions.fetchLogbookAction,
        fromActions.fetchCountAction,
      ),
      mergeMap(() => of(loadingAction())),
    );
  });

  loadingComplete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchLogbooksCompleteAction,
        fromActions.fetchLogbooksFailedAction,
        fromActions.fetchLogbookCompleteAction,
        fromActions.fetchLogbookFailedAction,
        fromActions.fetchCountCompleteAction,
        fromActions.fetchCountFailedAction,
      ),
      mergeMap(() => of(loadingCompleteAction())),
    );
  });

  constructor(
    private actions$: Actions,
    private logbooksService: LogbooksService,
    private datasetsService: DatasetsService,
    private store: Store,
  ) {}
}
