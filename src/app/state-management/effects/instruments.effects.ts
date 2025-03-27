import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, concatLatestFrom } from "@ngrx/effects";
import {
  Instrument,
  InstrumentsService,
} from "@scicatproject/scicat-sdk-ts-angular";
import * as fromActions from "state-management/actions/instruments.actions";
import { switchMap, map, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import { Store } from "@ngrx/store";
import { selectFilters } from "state-management/selectors/instruments.selectors";
import {
  loadingAction,
  loadingCompleteAction,
} from "state-management/actions/user.actions";

@Injectable()
export class InstrumentEffects {
  filters$ = this.store.select(selectFilters);

  fetchInstruments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchInstrumentsAction,
        fromActions.changePageAction,
        fromActions.sortByColumnAction,
      ),
      concatLatestFrom(() => this.filters$),
      map(([action, filters]) => filters),
      switchMap(({ sortField: order, skip, limit }) =>
        this.instrumentsService
          .instrumentsControllerFindAll(JSON.stringify({ order, limit, skip }))
          .pipe(
            mergeMap((instruments: Instrument[]) => [
              fromActions.fetchInstrumentsCompleteAction({ instruments }),
              fromActions.fetchCountAction(),
            ]),
            catchError(() => of(fromActions.fetchInstrumentsFailedAction())),
          ),
      ),
    );
  });

  fetchCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchCountAction),
      switchMap(() =>
        this.instrumentsService.instrumentsControllerFindAll().pipe(
          map((instruments: Instrument[]) =>
            fromActions.fetchCountCompleteAction({ count: instruments.length }),
          ),
          catchError(() => of(fromActions.fetchCountFailedAction())),
        ),
      ),
    );
  });

  fetchInstrument$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchInstrumentAction),
      switchMap(({ pid }) =>
        this.instrumentsService.instrumentsControllerFindById(pid).pipe(
          map((instrument: Instrument) =>
            fromActions.fetchInstrumentCompleteAction({ instrument }),
          ),
          catchError(() => of(fromActions.fetchInstrumentFailedAction())),
        ),
      ),
    );
  });

  saveCustomMetadata$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.saveCustomMetadataAction),
      switchMap(({ pid, customMetadata }) =>
        this.instrumentsService
          .instrumentsControllerUpdate(pid, {
            customMetadata,
          })
          .pipe(
            map((instrument: Instrument) =>
              fromActions.saveCustomMetadataCompleteAction({ instrument }),
            ),
            catchError(() => of(fromActions.saveCustomMetadataFailedAction())),
          ),
      ),
    );
  });

  loading$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchInstrumentsAction,
        fromActions.fetchCountAction,
        fromActions.fetchInstrumentAction,
        fromActions.saveCustomMetadataAction,
      ),
      switchMap(() => of(loadingAction())),
    );
  });

  loadingComplete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchInstrumentsCompleteAction,
        fromActions.fetchInstrumentsFailedAction,
        fromActions.fetchCountCompleteAction,
        fromActions.fetchCountFailedAction,
        fromActions.fetchInstrumentCompleteAction,
        fromActions.fetchInstrumentFailedAction,
        fromActions.saveCustomMetadataCompleteAction,
        fromActions.saveCustomMetadataFailedAction,
      ),
      switchMap(() => of(loadingCompleteAction())),
    );
  });

  constructor(
    private actions$: Actions,
    private instrumentsService: InstrumentsService,
    private store: Store,
  ) {}
}
