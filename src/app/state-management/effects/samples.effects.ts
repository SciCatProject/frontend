import { Action, Store } from "@ngrx/store";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Sample } from "../../shared/sdk/models";
import { SampleApi } from "shared/sdk/services";
import { SampleService } from "../../samples/sample.service";
import { catchError, map, mergeMap, withLatestFrom, switchMap } from "rxjs/operators";
import {
  FETCH_SAMPLE,
  FETCH_SAMPLES,
  FetchSampleAction,
  FetchSampleCompleteAction,
  FetchSampleFailedAction,
  FetchSamplesCompleteAction,
  FetchSamplesFailedAction,
  ADD_SAMPLE,
  AddSampleAction,
  AddSampleCompleteAction,
  AddSampleFailedAction,
  FETCH_SAMPLE_COUNT,
  FetchSampleCountAction,
  FetchSampleCountCompleteAction,
  FetchSampleCountFailedAction,
  SEARCH_SAMPLES
} from "../actions/samples.actions";
import { getQuery, getFullqueryParams } from "state-management/selectors/samples.selectors";

@Injectable()
export class SamplesEffects {
  private query$ = this.store.select(getQuery);
  private fullquery$ = this.store.select(getFullqueryParams);
  @Effect()
  fetchSamples$: Observable<Action> = this.actions$.pipe(
    ofType(FETCH_SAMPLES),
    withLatestFrom(this.query$),
    map(([action, params]) => params),
    mergeMap(params =>
      this.sampleApi.find(params).pipe(
        map((samples: Sample[]) => new FetchSamplesCompleteAction(samples)),
        catchError(() => of(new FetchSamplesFailedAction()))
      )
    )
  );

  @Effect()
  private searchSamples$: Observable<Action> = this.actions$.pipe(
    ofType(SEARCH_SAMPLES),
    withLatestFrom(this.fullquery$),
    map(([action, params]) => params),
    mergeMap(({ query, limits }) => {
      console.log("gm query", query);
      console.log("gm limits", limits);
      return this.sampleApi.fullquery(query, limits).pipe(
        map(
          samples =>
            new FetchSamplesCompleteAction(
              samples as Sample[]
            )
        ),
        catchError(() => of(new FetchSamplesFailedAction()))
      );
    })
  );

  @Effect()
  protected getSample$: Observable<Action> = this.actions$.pipe(
    ofType(FETCH_SAMPLE),
    map((action: FetchSampleAction) => action.sampleId),
    switchMap(sampleId =>
      this.sampleApi
        .findById(sampleId)
        .pipe(
          map(
            (currentSample: Sample) =>
              new FetchSampleCompleteAction(currentSample),
            catchError(() => of(new FetchSampleFailedAction()))
          )
        )
    )
  );

  @Effect()
  protected addSample$: Observable<Action> = this.actions$.pipe(
    ofType(ADD_SAMPLE),
    map((action: AddSampleAction) => action.sample),
    mergeMap(sample =>
      this.sampleService
        .addSample(sample)
        .pipe(
          map(
            res => new AddSampleCompleteAction(res[0]),
            catchError(() => of(new AddSampleFailedAction(new Sample())))
          )
        )
    )
  );

  @Effect()
  protected getSampleCount$: Observable<Action> = this.actions$.pipe(
    ofType(FETCH_SAMPLE_COUNT),
    map((action: FetchSampleCountAction) => action.sampleCount),
    mergeMap(sample =>
      this.sampleService
        .getSampleCount()
        .pipe(
          map(
            res => new FetchSampleCountCompleteAction(res.count),
            catchError(() => of(new FetchSampleCountFailedAction()))
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
