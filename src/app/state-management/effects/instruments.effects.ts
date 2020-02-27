import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { InstrumentApi, Instrument } from "shared/sdk";
import * as fromActions from "state-management/actions/instruments.actions";
import { switchMap, map, catchError, mergeMap } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class InstrumentEffects {
  fetchInstruments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchInstrumentsAction),
      switchMap(() =>
        this.instrumentApi.find().pipe(
          mergeMap((instruments: Instrument[]) => [
            fromActions.fetchInstrumentsCompleteAction({ instruments }),
            fromActions.fetchCountAction()
          ]),
          catchError(() => of(fromActions.fetchInstrumentsFailedAction()))
        )
      )
    )
  );

  fetchCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchCountAction),
      switchMap(() =>
        this.instrumentApi.find().pipe(
          map(instruments =>
            fromActions.fetchCountCompleteAction({ count: instruments.length })
          ),
          catchError(() => of(fromActions.fetchCountFailedAction()))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private instrumentApi: InstrumentApi
  ) {}
}
