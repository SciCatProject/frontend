import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { SampleApi } from "shared/sdk/services";
import { catchError, map, switchMap } from "rxjs/operators";
import {
  FETCH_SAMPLES,
  FetchSamplesCompleteAction,
  FetchSamplesFailedAction
} from "../actions/samples.actions";
import { SampleService } from "../../samples/sample.service";

@Injectable()
export class SamplesEffects {
  @Effect()
  fetchSamples$: Observable<Action> = this.actions$.pipe(
    ofType(FETCH_SAMPLES),
    switchMap(action =>
      this.sampleService.getSamples().pipe(
        map(samples => new FetchSamplesCompleteAction(samples)),
        catchError(err => of(new FetchSamplesFailedAction()))
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<any>,
    private sampleApi: SampleApi,
    private sampleService: SampleService
  ) {}
}
