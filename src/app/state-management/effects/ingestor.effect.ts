import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, takeUntil } from "rxjs/operators"; // Import finalize
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
import { Store } from "@ngrx/store";
import { selectIngestorTransferListRequestOptions } from "state-management/selectors/ingestor.selector";
import { concatLatestFrom } from "@ngrx/operators";

@Injectable()
export class IngestorEffects {
  connectToIngestor$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.connectIngestor),
      switchMap(() => {
        return this.ingestor.getVersion().pipe(
          switchMap((versionResponse) =>
            this.ingestor.getHealth().pipe(
              switchMap((healthResponse) =>
                this.ingestor.getUserInfo().pipe(
                  map((userInfoResponse) =>
                    fromActions.connectIngestorSuccess({
                      versionResponse: versionResponse as OtherVersionResponse,
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
                          healthResponse: healthResponse as OtherHealthResponse,
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
          catchError((err) => {
            if (err.error?.error?.includes("login session has expired")) {
              return of(
                fromActions.setNoRightsError({ noRightsError: true, err: err }),
              );
            }

            return of(fromActions.getExtractionMethodsFailure({ err }));
          }),
          takeUntil(
            this.actions$.pipe(ofType(fromActions.resetIngestorComponent)),
          ),
        );
      }),
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
      concatLatestFrom(() =>
        this.store.select(selectIngestorTransferListRequestOptions),
      ),
      switchMap(([action, requestOptions]) => {
        const { transferId, page, pageNumber } = action;
        const { page: pageRO, pageNumber: pageNumberRO } = requestOptions;

        return this.ingestor
          .getTransferList(
            page ?? pageRO,
            pageNumber ?? pageNumberRO,
            transferId,
          )
          .pipe(
            map((transferList) => {
              if (transferId) {
                return fromActions.updateTransferListDetailSuccess({
                  transferListDetailView: transferList,
                });
              }

              return fromActions.updateTransferListSuccess({
                transferList,
                page: page ?? pageRO,
                pageNumber: pageNumber ?? pageNumberRO,
              });
            }),
            catchError((err) =>
              of(fromActions.updateTransferListFailure({ err })),
            ),
          );
      }),
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
          catchError((err) => {
            if (err.error?.error?.includes("login session has expired")) {
              return of(
                fromActions.setNoRightsError({ noRightsError: true, err: err }),
              );
            }

            return of(fromActions.getExtractionMethodsFailure({ err }));
          }),
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
          catchError((err) => {
            if (err.error?.error?.includes("login session has expired")) {
              return of(
                fromActions.setNoRightsError({ noRightsError: true, err: err }),
              );
            }

            return of(fromActions.getExtractionMethodsFailure({ err }));
          }),
        ),
      ),
    );
  });

  ingestDataset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.ingestDataset),
      switchMap(({ ingestionDataset }) =>
        this.ingestor.startIngestion(ingestionDataset).pipe(
          switchMap((response) => [
            fromActions.ingestDatasetSuccess({ response }),
            fromActions.updateTransferList({}),
          ]),
          catchError((err) => {
            if (err.error?.error?.includes("login session has expired")) {
              return of(
                fromActions.setNoRightsError({ noRightsError: true, err: err }),
              );
            }

            return of(fromActions.getExtractionMethodsFailure({ err }));
          }),
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

  cancelTransfer$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.cancelTransfer),
      switchMap(({ requestBody }) =>
        this.ingestor.cancelTransfer(requestBody).pipe(
          switchMap(() => [
            showMessageAction({
              message: {
                type: MessageType.Success,
                content:
                  "Successfully cancelled transfer: " + requestBody.transferId,
                duration: 5000,
              },
            }),
            fromActions.updateTransferList({}),
          ]),
          catchError((err) => {
            const message = {
              type: MessageType.Error,
              content:
                "Failed to cancel transfer: " + (err.error ?? err.message),
              duration: 5000,
            };
            return of(showMessageAction({ message }));
          }),
        ),
      ),
    );
  });

  setRenderView$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.setRenderViewFromThirdParty),
      switchMap(({ renderView }) => {
        const message = {
          type: MessageType.Success,
          content: "Render view set to: " + renderView,
          duration: 5000,
        };
        return of(showMessageAction({ message }));
      }),
    );
  });

  constructor(
    private actions$: Actions,
    private ingestor: Ingestor,
    private store: Store,
  ) {}
}
