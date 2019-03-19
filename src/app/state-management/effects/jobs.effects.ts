// import all rxjs operators that are needed

import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { of } from "rxjs";
import * as lb from "shared/sdk/services";
import * as JobActions from "state-management/actions/jobs.actions";
import * as UserActions from "state-management/actions/user.actions";
import { MessageType, Job } from "state-management/models";
import { map, switchMap, catchError, mergeMap } from "rxjs/operators";

// import store state interface

@Injectable()
export class JobsEffects {
  @Effect()
  protected getJob$: Observable<Action> = this.action$.pipe(
    ofType(JobActions.SEARCH_ID),
    map((action: JobActions.SearchIDAction) => action.id),
    switchMap(id =>
      this.jobSrv.findById(encodeURIComponent(id)).pipe(
        map(jobset => new JobActions.SearchIDCompleteAction(jobset)),
        catchError(err => of(new JobActions.SearchIDFailedAction(err)))
      )
    )
  );

  @Effect()
  protected submit$: Observable<Action> = this.action$.pipe(
    ofType(JobActions.SUBMIT),
    map((action: JobActions.SubmitAction) => action.job),
    switchMap(job =>
      this.jobSrv
        .create(job)
        .pipe(
          map(res => new JobActions.SubmitCompleteAction(res)),
          catchError(err => of(new JobActions.FailedAction(err)))
        )
    ),
  );

  @Effect()
  protected submitMessage$: Observable<Action> = this.action$.pipe(
    ofType(JobActions.SUBMIT_COMPLETE),
    switchMap(res => {
      const msg = {
        type: MessageType.Success,
        content: "Job Created Successfully",
        duration: 5000
      };
      return of(new UserActions.ShowMessageAction(msg));
    })
  );

  @Effect()
  // this is the jobs view get effect
  protected get_updated_sort$: Observable<Action> = this.action$.pipe(
    ofType(JobActions.SORT_UPDATE),
    switchMap((action: JobActions.SortUpdateAction) => {
      const filter = {};
      if (action.mode) {
        filter["where"] = action.mode;
      }
      filter["skip"] = action.skip;
      filter["limit"] = action.limit; // items per page
      filter["order"] = "creationTime DESC";
      return this.jobSrv
        .find(filter)
        .pipe(
          map(
            (jobsets: Job[]) => new JobActions.RetrieveCompleteAction(jobsets)
          )
        );
    }),
    catchError(err => of(new JobActions.FailedAction(err)))
  );

  @Effect()
  private getCount$: Observable<Action> = this.action$.pipe(
    ofType(JobActions.SORT_UPDATE),
    mergeMap((action: JobActions.SortUpdateAction) => {
      return this.jobSrv
        .count(action.mode)
        .pipe(
          map(
            jobCount =>
              new JobActions.GetCountCompleteAction(jobCount.count)
          )
        );
    }),
    catchError(err => of(new JobActions.FailedAction(err)))
  );

  constructor(
    private action$: Actions,
    private store: Store<any>,
    private jobSrv: lb.JobApi,
    private dsSrv: lb.DatasetApi
  ) {}
}
