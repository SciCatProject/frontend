import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, mergeMap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import * as fromActions from "state-management/actions/onedep.actions";
import { Depositor } from "shared/sdk/apis/onedep-depositor.service";
import { Store } from "@ngrx/store";

@Injectable()
export class OneDepEffects {

  submitJob$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.submitJobAction),
      switchMap(({ job }) =>
        this.jobsServiceV4.jobsControllerCreateV4(job as Job).pipe(
          map((res) => fromActions.submitJobCompleteAction({ job: res as JobInterface })),
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
  

  // sendFile$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(OneDepActions.sendFile),
  //     mergeMap((action) =>
  //       this.http
  //         .post(
  //           `${this.connectedDepositionBackend}onedep/${action.depID}/file`,
  //           action.form
  //         )
  //         .pipe(
  //           map((res) =>
  //             OneDepActions.sendFileSuccess({ fileType: action.fileType, res })
  //           ),
  //           catchError((error) =>
  //             of(OneDepActions.sendFileFailure({ error }))
  //           )
  //         )
  //     )
  //   )
  // );

  // sendCoordFile$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(OneDepActions.sendCoordFile),
  //     mergeMap((action) =>
  //       this.http
  //         .post(
  //           `${this.connectedDepositionBackend}onedep/${action.depID}/pdb`,
  //           action.form
  //         )
  //         .pipe(
  //           map((res) =>
  //             OneDepActions.sendCoordFileSuccess({ res })
  //           ),
  //           catchError((error) =>
  //             of(OneDepActions.sendCoordFileFailure({ error }))
  //           )
  //         )
  //     )
  //   )
  // );

  // sendMetadata$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(OneDepActions.sendMetadata),
  //     mergeMap((action) =>
  //       this.http
  //         .post(
  //           `${this.connectedDepositionBackend}onedep/${action.depID}/metadata`,
  //           action.form
  //         )
  //         .pipe(
  //           map((res) =>
  //             OneDepActions.sendMetadataSuccess({ res })
  //           ),
  //           catchError((error) =>
  //             of(OneDepActions.sendMetadataFailure({ error }))
  //           )
  //         )
  //     )
  //   )
  // );
  constructor(
    private actions$: Actions,
    private onedepDepositor: Depositor,
    private store: Store,
  ) {}
}
