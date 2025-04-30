import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, finalize } from "rxjs/operators"; // Import finalize
import * as fromActions from "state-management/actions/ingestor.actions";
import { Ingestor } from "shared/sdk/apis/ingestor.service";
import {
  OtherHealthResponse,
  OtherVersionResponse,
  UserInfo,
} from "shared/sdk/models/ingestor/models";
import { MessageType } from "state-management/models";
import { HttpErrorResponse } from "@angular/common/http";
import { showMessageAction } from "state-management/actions/user.actions";

@Injectable()
export class IngestorEffects {
  connectToIngestor$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.connectIngestor),
      switchMap(() =>
        of(fromActions.startConnectingIngestor()).pipe(
          switchMap(() => {
            return this.ingestor.getVersion().pipe(
              switchMap((versionResponse) =>
                this.ingestor.getHealth().pipe(
                  switchMap((healthResponse) =>
                    this.ingestor.getUserInfo().pipe(
                      map((userInfoResponse) =>
                        fromActions.connectIngestorSuccess({
                          versionResponse:
                            versionResponse as OtherVersionResponse,
                          healthResponse: healthResponse as OtherHealthResponse,
                          userInfoResponse: userInfoResponse as UserInfo,
                          authIsDisabled: false,
                        }),
                      ),
                      catchError((err) => {
                        const errorMessage =
                          err instanceof HttpErrorResponse
                            ? (err.error?.message ?? err.error ?? err.message)
                            : err.message;

                        if (errorMessage.includes("disabled")) {
                          return of(
                            fromActions.connectIngestorSuccess({
                              versionResponse:
                                versionResponse as OtherVersionResponse,
                              healthResponse:
                                healthResponse as OtherHealthResponse,
                              userInfoResponse: null, // Kein UserInfo verfügbar
                              authIsDisabled: true,
                            }),
                          );
                        }
                        return of(fromActions.connectIngestorFailure({ err }));
                      }),
                    ),
                  ),
                ),
              ),
              catchError((err) =>
                of(fromActions.connectIngestorFailure({ err })),
              ),
              finalize(() => {
                // Dispatch stopConnectingIngestor after the process is complete
                of(fromActions.stopConnectingIngestor());
              }),
            );
          }),
        ),
      ),
    );
  });

  connectToIngestorSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.connectIngestorSuccess),
      switchMap(({ versionResponse }) => {
        const message = {
          type: MessageType.Success,
          content:
            "Successfully connected to ingestor version " +
            versionResponse.version,
          duration: 5000,
        };
        return of(showMessageAction({ message }));
      }),
    );
  });

  connectToIngestorFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.connectIngestorFailure),
      switchMap(({ err }) => {
        const errorMessage =
          err instanceof HttpErrorResponse
            ? (err.error?.message ?? err.message ?? "Unknown error")
            : err.message || "Unknown error";
        const message = {
          type: MessageType.Error,
          content:
            "Failed to connect to the ingestor service: " +
            errorMessage +
            " Are you sure service is running?",
          duration: 5000,
        };
        return of(showMessageAction({ message }));
      }),
    );
  });

  updateTransferList$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.updateTransferList),
      switchMap(({ transferId, page, pageNumber }) =>
        this.ingestor.getTransferList(page, pageNumber, transferId).pipe(
          map((transferList) =>
            fromActions.updateTransferListSuccess({ transferList }),
          ),
          catchError((err) =>
            of(fromActions.updateTransferListFailure({ err })),
          ),
        ),
      ),
    );
  });

  getExtractionMethods$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.getExtractionMethods),
      switchMap(({ page, pageNumber }) =>
        this.ingestor.getExtractionMethods(page, pageNumber).pipe(
          map((extractionMethods) =>
            fromActions.getExtractionMethodsSuccess({ extractionMethods }),
          ),
          catchError((err) =>
            of(fromActions.getExtractionMethodsFailure({ err })),
          ),
        ),
      ),
    );
  });

  getBrowseFilePath$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.getBrowseFilePath),
      switchMap(({ path, page, pageNumber }) =>
        this.ingestor.getBrowseFilePath(page, pageNumber, path).pipe(
          map((ingestorBrowserActiveNode) =>
            fromActions.getBrowseFilePathSuccess({ ingestorBrowserActiveNode }),
          ),
          catchError((err) =>
            of(fromActions.getBrowseFilePathFailure({ err })),
          ),
        ),
      ),
    );
  });

  ingestDataset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.ingestDataset),
      switchMap(({ ingestionDataset }) =>
        this.ingestor.startIngestion(ingestionDataset).pipe(
          map((response) => fromActions.ingestDatasetSuccess({ response })),
          catchError((err) => of(fromActions.ingestDatasetFailure({ err }))),
        ),
      ),
    );
  });

  ingestDatasetSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.ingestDatasetSuccess),
      switchMap(({ response }) => {
        const message = {
          type: MessageType.Success,
          content:
            "Request ingestion dataset successfully: " + response.transferId,
          duration: 5000,
        };
        return of(showMessageAction({ message }));
      }),
    );
  });

  ingestDatasetFailure$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.ingestDatasetFailure),
      switchMap(({ err }) => {
        const errorMessage =
          err instanceof HttpErrorResponse
            ? (err.error?.message ??
              err.error ??
              err.message ??
              "Unknown error")
            : err.message || "Unknown error";
        const message = {
          type: MessageType.Error,
          content: "Failed to ingest dataset: " + errorMessage,
          duration: 5000,
        };
        return of(showMessageAction({ message }));
      }),
    );
  });

  constructor(
    private actions$: Actions,
    private ingestor: Ingestor,
  ) { }
}
