import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import { JobsService } from "@scicatproject/scicat-sdk-ts-angular";
import { Store } from "@ngrx/store";
import { selectQueryParams } from "state-management/selectors/jobs.selectors";
import * as fromActions from "state-management/actions/jobs.actions";
import { map, switchMap, catchError } from "rxjs/operators";
import { of } from "rxjs";
import { MessageType } from "state-management/models";
import {
  showMessageAction,
  loadingAction,
  loadingCompleteAction,
  updateUserSettingsAction,
} from "state-management/actions/user.actions";

@Injectable()
export class JobEffects {
  private queryParams$ = this.store.select(selectQueryParams);

  fetchJobs$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchJobsAction,
        fromActions.changePageAction,
        fromActions.sortByColumnAction,
        fromActions.setJobViewModeAction,
      ),
      concatLatestFrom(() => this.queryParams$),
      map(([action, params]) => params),
      switchMap((params) =>
        this.jobsService.jobsControllerFindAllV3V3(JSON.stringify(params)).pipe(
          switchMap((jobs) => [
            fromActions.fetchJobsCompleteAction({ jobs }),
            fromActions.fetchCountAction(),
          ]),
          catchError(() => of(fromActions.fetchJobsFailedAction())),
        ),
      ),
    );
  });

  updateUserJobsLimit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.changePageAction),
      map(({ limit }) =>
        updateUserSettingsAction({ property: { jobCount: limit } }),
      ),
    );
  });

  fetchJob$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchJobAction),
      switchMap(({ jobId }) =>
        this.jobsService.jobsControllerFindOneV3V3(jobId).pipe(
          map((job) => fromActions.fetchJobCompleteAction({ job })),
          catchError(() => of(fromActions.fetchJobFailedAction())),
        ),
      ),
    );
  });

  submitJob$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.submitJobAction),
      switchMap(({ job }) =>
        this.jobsService.jobsControllerCreateV3V3(job).pipe(
          map((res) => fromActions.submitJobCompleteAction({ job: res })),
          catchError((err) => of(fromActions.submitJobFailedAction({ err }))),
        ),
      ),
    );
  });

  submitJobCompleteMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.submitJobCompleteAction),
      switchMap(() => {
        const message = {
          type: MessageType.Success,
          content: "Job Created Successfully",
          duration: 5000,
        };
        return of(showMessageAction({ message }));
      }),
    );
  });

  submitJobFailedMessage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.submitJobFailedAction),
      switchMap(({ err }) => {
        const message = {
          type: MessageType.Error,
          content: "Job Not Submitted: " + err.message,
          duration: 5000,
        };
        return of(showMessageAction({ message }));
      }),
    );
  });

  loading$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchJobsAction,
        fromActions.fetchCountAction,
        fromActions.fetchJobAction,
        fromActions.submitJobAction,
      ),
      switchMap(() => of(loadingAction())),
    );
  });

  loadingComplete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchJobsFailedAction,
        fromActions.fetchCountCompleteAction,
        fromActions.fetchCountFailedAction,
        fromActions.fetchJobCompleteAction,
        fromActions.fetchJobFailedAction,
        fromActions.submitJobCompleteAction,
        fromActions.submitJobFailedAction,
      ),
      switchMap(() => of(loadingCompleteAction())),
    );
  });

  constructor(
    private actions$: Actions,
    private jobsService: JobsService,
    private store: Store,
  ) {}
}
