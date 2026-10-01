import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {
  Instrument,
  InstrumentsService,
} from "@scicatproject/scicat-sdk-ts-angular";
import * as fromActions from "state-management/actions/instruments.actions";
import { switchMap, map, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";
import {
  loadingAction,
  loadingCompleteAction,
} from "state-management/actions/user.actions";

@Injectable()
export class InstrumentEffects {
  fetchInstruments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchInstrumentsAction),
      switchMap(({ limit, skip, sortColumn, sortDirection }) => {
        const limitsParam = {
          skip: skip,
          limit: limit,
          order: undefined,
        };

        if (sortColumn && sortDirection) {
          limitsParam.order = `${sortColumn}:${sortDirection}`;
        }

        return this.instrumentsService
          .instrumentsControllerFindAllV3(
            JSON.stringify({ limits: limitsParam }),
          )
          .pipe(
            mergeMap((instruments: Instrument[]) => [
              fromActions.fetchInstrumentsCompleteAction({ instruments }),
              fromActions.fetchCountAction(),
            ]),
            catchError(() => of(fromActions.fetchInstrumentsFailedAction())),
          );
      }),
    );
  });

  fetchCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchCountAction),
      switchMap(() =>
        this.instrumentsService.instrumentsControllerCountV3().pipe(
          map(({ count }) => fromActions.fetchCountCompleteAction({ count })),
          catchError(() => of(fromActions.fetchCountFailedAction())),
        ),
      ),
    );
  });

  fetchInstrument$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchInstrumentAction),
      switchMap(({ pid }) =>
        this.instrumentsService.instrumentsControllerFindByIdV3(pid).pipe(
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
          .instrumentsControllerUpdateV3(pid, {
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
  ) {}
}
