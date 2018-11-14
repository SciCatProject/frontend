import { Action, Store } from "@ngrx/store";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Sample } from "../../shared/sdk/models";
import { SampleApi } from "shared/sdk/services";
import { SampleService } from "../../samples/sample.service";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import {
  FETCH_SAMPLE,
  FETCH_SAMPLES,
  FetchSampleAction,
  FetchSampleCompleteAction,
  FetchSampleFailedAction,
  FetchSamplesCompleteAction,
  FetchSamplesFailedAction
} from "../actions/samples.actions";

@Injectable()
export class SamplesEffects {
  @Effect()
  fetchSamples$: Observable<Action> = this.actions$.pipe(
    ofType(FETCH_SAMPLES),
    switchMap(action =>
      this.sampleService.getSamples().pipe(
        map(samples => new FetchSamplesCompleteAction(samples)),
        catchError(() => of(new FetchSamplesFailedAction()))
      )
    )
  );

  @Effect()
  protected getSample$: Observable<Action> = this.actions$.pipe(
    ofType(FETCH_SAMPLE),
    map((action: FetchSampleAction) => action.samplelId),
    mergeMap(samplelId =>
      this.sampleService
        .getSample(encodeURIComponent(samplelId))
        .pipe(
          map(
            (currentSample: Sample) =>
              new FetchSampleCompleteAction(currentSample),
            catchError(() => of(new FetchSampleFailedAction()))
          )
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
