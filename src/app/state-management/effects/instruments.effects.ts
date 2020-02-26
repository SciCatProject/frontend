import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { InstrumentApi, Instrument } from "shared/sdk";
import * as fromActions from "state-management/actions/instruments.actions";
import { switchMap, map, catchError } from "rxjs/operators";
import { of } from "rxjs";

@Injectable()
export class InstrumentEffects {
  fetchInstruments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchInstrumentsAction),
      switchMap(() =>
        this.instrumentApi.find().pipe(
          map((instruments: Instrument[]) =>
            fromActions.fetchInstrumentsCompleteAction({ instruments })
          ),
          catchError(() => of(fromActions.fetchInstrumentsFailedAction()))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private instrumentApi: InstrumentApi
  ) {}
}
