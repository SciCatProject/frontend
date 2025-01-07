import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of, from } from "rxjs";
import { catchError, map, switchMap, concatMap, last } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { MessageType } from "state-management/models";
import { showMessageAction } from "state-management/actions/user.actions";
import * as fromActions from "state-management/actions/onedep.actions";
import { Depositor } from "shared/sdk/apis/onedep-depositor.service";
import {
  OneDepUserInfo,
  OneDepCreated,
  UploadedFile,
} from "shared/sdk/models/OneDep";
import { EmFile } from "../../datasets/onedep/types/methods.enum";
@Injectable()
export class OneDepEffects {
  submitDeposition$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.submitDeposition),
      switchMap(({ deposition, files }) =>
        this.onedepDepositor.createDep(deposition).pipe(
          switchMap((dep) =>
            from(files).pipe(
              concatMap((file) =>
                file.fileType === EmFile.Coordinates
                  ? this.onedepDepositor.sendCoordFile(dep.depID, file.form)
                  : this.onedepDepositor.sendFile(dep.depID, file.form),
              ),

              last(), // Ensures the final emission happens only after all uploads are complete
              map(() =>
                fromActions.submitDepositionSuccess({
                  deposition: dep as OneDepCreated,
                }),
              ),
            ),
          ),
          catchError((err) => of(fromActions.submitDepositionFailure({ err }))),
        ),
      ),
    );
  });

  submitDepositionSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.submitDepositionSuccess),
      switchMap(({ deposition }) => {
        const message = {
          type: MessageType.Success,
          content:
            "Deposition Created Successfully. Deposition ID: " +
            deposition.depID,
          duration: 5000,
        };
        return of(showMessageAction({ message }));
      }),
    );
  });

  submitDepositionFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.submitDepositionFailure),
      switchMap(({ err }) => {
        const errorMessage =
          err instanceof HttpErrorResponse
            ? (err.error?.message ?? err.message ?? "Unknown error")
            : err.message || "Unknown error";
        const message = {
          type: MessageType.Error,
          content: "Deposition to OneDep failed: " + errorMessage,
          duration: 10000,
        };
        return of(showMessageAction({ message }));
      }),
    );
  });

  // createDeposition$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fromActions.createDepositionAction),
  //     switchMap(({ deposition }) =>
  //       this.onedepDepositor.createDep(deposition as OneDepUserInfo).pipe(
  //         map((res) =>
  //           fromActions.createDepositionSuccess({
  //             deposition: res as OneDepCreated,
  //           }),
  //         ),
  //         catchError((err) => of(fromActions.createDepositionFailure({ err }))),
  //       ),
  //     ),
  //   );
  // });

  // createDepositionSuccessMessage$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fromActions.createDepositionSuccess),
  //     switchMap(({ deposition }) => {
  //       const message = {
  //         type: MessageType.Success,
  //         content:
  //           "Deposition Created Successfully. Deposition ID: " +
  //           deposition.depID,
  //         duration: 5000,
  //       };
  //       return of(showMessageAction({ message }));
  //     }),
  //   );
  // });

  // createDepositionFailureMessage$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fromActions.createDepositionFailure),
  //     switchMap(({ err }) => {
  //       const errorMessage =
  //         err instanceof HttpErrorResponse
  //           ? (err.error?.message ?? err.message ?? "Unknown error")
  //           : err.message || "Unknown error";
  //       const message = {
  //         type: MessageType.Error,
  //         content: "Deposition to OneDep failed: " + errorMessage,
  //         duration: 10000,
  //       };
  //       return of(showMessageAction({ message }));
  //     }),
  //   );
  // });
  // uploadFiles$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fromActions.uploadFilesAction),
  //     mergeMap(({ depID, files }) =>
  //       from(files).pipe(
  //         mergeMap((file) =>
  //           this.onedepDepositor.sendFile(depID, file.form).pipe(
  //             map((res) =>
  //               fromActions.sendFileSuccess({
  //                 uploadedFile: res as UploadedFile,
  //               }),
  //             ),
  //             catchError((err) => of(fromActions.sendFileFailure({ err }))),
  //           ),
  //         ),
  //       ),
  //     ),
  //   );
  // });
  // sendFile$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fromActions.sendFile),
  //     switchMap(({ depID, form }) =>
  //       this.onedepDepositor.sendFile(depID, form).pipe(
  //         map((res) =>
  //           fromActions.sendFileSuccess({
  //             uploadedFile: res as UploadedFile,
  //           }),
  //         ),
  //         catchError((err) => of(fromActions.sendFileFailure({ err }))),
  //       ),
  //     ),
  //   );
  // });

  // sendFileSuccessMessage$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fromActions.sendFileSuccess),
  //     switchMap(({ uploadedFile }) => {
  //       const message = {
  //         type: MessageType.Success,
  //         content:
  //           "File Upladed to Deposition ID: " +
  //           uploadedFile.depID +
  //           " with File ID: " +
  //           uploadedFile.fileID,
  //         duration: 5000,
  //       };
  //       return of(showMessageAction({ message }));
  //     }),
  //   );
  // });

  // sendFileFailureMessage$ = createEffect(() => {
  //   return this.actions$.pipe(
  //     ofType(fromActions.sendFileFailure),
  //     switchMap(({ err }) => {
  //       const errorMessage =
  //         err instanceof HttpErrorResponse
  //           ? (err.error?.message ?? err.message ?? "Unknown error")
  //           : err.message || "Unknown error";
  //       const message = {
  //         type: MessageType.Error,
  //         content: "Deposition to OneDep failed: " + errorMessage,
  //         duration: 10000,
  //       };
  //       return of(showMessageAction({ message }));
  //     }),
  //   );
  // });

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
  ) {}
}
