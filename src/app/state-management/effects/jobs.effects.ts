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
import { map, switchMap, catchError } from "rxjs/operators";

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
    switchMap(job => {
      return this.jobSrv
        .create(job)
        .pipe(map(res => new JobActions.SubmitCompleteAction(res)));
    }),
    catchError(err => of(new JobActions.FailedAction(err)))
  );

  @Effect()
  protected submitMessage$: Observable<Action> = this.action$.pipe(
    ofType(JobActions.SUBMIT_COMPLETE),
    switchMap(res => {
      const msg = {
        type: MessageType.Success,
        content: "Job Created Successfully"
      };
      return of(new UserActions.ShowMessageAction(msg));
    })
  );

  @Effect()
  protected childRetrieve$: Observable<Action> = this.action$.pipe(
    ofType(JobActions.CHILD_RETRIEVE),
    switchMap(pl => {
      const node = pl["payload"];
      node.children = [];
      if (node.data.datasetList.length > 0) {
        node.data.datasetList.map(ds => {
          if (ds.pid && ds.pid.length > 0) {
            this.dsSrv // Hur gör man här?
              .findById(encodeURIComponent(ds.pid), {
                include: "datasetlifecycle"
              })
              .subscribe(dataset => {
                const entry = {
                  data: {
                    creationTime: ds.pid,
                    emailJobInitiator: "",
                    type: dataset["datasetlifecycle"]["archiveStatusMessage"],
                    jobStatusMessage:
                      dataset["datasetlifecycle"]["retrieveStatusMessage"]
                  }
                };
                node.children.push(entry);
              });
          }
        });
      } else {
        node.children.push({ data: { type: "No datasets could be found" } });
      }
      return of(new JobActions.ChildRetrieveCompleteAction(node.children));
    }),
    catchError(err => {
      console.log(err);
      return of(new JobActions.FailedAction(err));
    })
  );

  @Effect()
  protected get_updated_sort$: Observable<Action> = this.action$.pipe(
    ofType(JobActions.SORT_UPDATE),
    switchMap((action: JobActions.SortUpdateAction) => {
      const filter = {};
      filter["skip"] = action.skip;
      filter["limit"] = action.limit;
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

  constructor(
    private action$: Actions,
    private store: Store<any>,
    private jobSrv: lb.JobApi,
    private dsSrv: lb.DatasetApi
  ) {}
}
