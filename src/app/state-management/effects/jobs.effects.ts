import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { JobApi, Job } from "shared/sdk";
import { Store, select } from "@ngrx/store";
import { getQueryParams } from "state-management/selectors/jobs.selectors";
import * as fromActions from "state-management/actions/jobs.actions";
import { withLatestFrom, map, switchMap, catchError } from "rxjs/operators";
import { of } from "rxjs";
import { MessageType } from "state-management/models";
import {
  showMessageAction,
  loadingAction,
  loadingCompleteAction
} from "state-management/actions/user.actions";

@Injectable()
export class JobEffects {
  private queryParams$ = this.store.pipe(select(getQueryParams));

  fetchJobs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromActions.fetchJobsAction,
        fromActions.changePageAction,
        fromActions.sortByColumnAction,
        fromActions.setJobViewModeAction
      ),
      withLatestFrom(this.queryParams$),
      map(([action, params]) => params),
      switchMap(params =>
        this.jobApi.find(params).pipe(
          switchMap((jobs: Job[]) => [
            fromActions.fetchJobsCompleteAction({ jobs }),
            fromActions.fetchCountAction()
          ]),
          catchError(() => of(fromActions.fetchJobsFailedAction()))
        )
      )
    )
  );

  fetchCount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchCountAction),
      withLatestFrom(this.queryParams$),
      map(([action, params]) => params),
      switchMap(({ where }) =>
        this.jobApi.count(where).pipe(
          map(res =>
            fromActions.fetchCountCompleteAction({ count: res.count })
          ),
          catchError(() => of(fromActions.fetchCountFailedAction()))
        )
      )
    )
  );

  fetchJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.fetchJobAction),
      switchMap(({ jobId }) =>
        this.jobApi.findById(jobId).pipe(
          map((job: Job) => fromActions.fetchJobCompleteAction({ job })),
          catchError(() => of(fromActions.fetchJobFailedAction()))
        )
      )
    )
  );

  submitJob$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.submitJobAction),
      switchMap(({ job }) =>
        this.jobApi.create(job).pipe(
          map(res => fromActions.submitJobCompleteAction({ job: res })),
          catchError(err => of(fromActions.submitJobFailedAction({ err })))
        )
      )
    )
  );

  submitJobCompleteMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.submitJobCompleteAction),
      switchMap(() => {
        const message = {
          type: MessageType.Success,
          content: "Job Created Successfully",
          duration: 5000
        };
        return of(showMessageAction({ message }));
      })
    )
  );

  submitJobFailedMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.submitJobFailedAction),
      switchMap(({ err }) => {
        const message = {
          type: MessageType.Error,
          content: "Job Not Submitted: " + err.message,
          duration: 5000
        };
        return of(showMessageAction({ message }));
      })
    )
  );

  loading$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromActions.fetchJobsAction,
        fromActions.fetchCountAction,
        fromActions.fetchJobAction,
        fromActions.submitJobAction
      ),
      switchMap(() => of(loadingAction()))
    )
  );

  loadingComplete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        fromActions.fetchJobsCompleteAction,
        fromActions.fetchJobsFailedAction,
        fromActions.fetchCountCompleteAction,
        fromActions.fetchCountFailedAction,
        fromActions.fetchJobCompleteAction,
        fromActions.fetchJobFailedAction,
        fromActions.submitJobCompleteAction,
        fromActions.submitJobFailedAction
      ),
      switchMap(() => of(loadingCompleteAction()))
    )
  );

  constructor(
    private actions$: Actions,
    private jobApi: JobApi,
    private store: Store<Job>
  ) {}
}
