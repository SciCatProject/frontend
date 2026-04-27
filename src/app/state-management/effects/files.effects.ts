import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import {
  OrigDatablock,
  OrigdatablocksService,
} from "@scicatproject/scicat-sdk-ts-angular";
import * as fromActions from "state-management/actions/files.actions";
import { mergeMap, map, catchError, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import {
  loadingAction,
  loadingCompleteAction,
} from "state-management/actions/user.actions";
import { FileOrigdatablock } from "state-management/models";

@Injectable()
export class FilesEffects {
  fetchAllOrigDatablocks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchAllOrigDatablocksAction),
      switchMap(({ limit, search, skip, sortColumn, sortDirection }) => {
        const limitsParam = {
          skip: skip,
          limit: limit,
          order: undefined,
        };

        if (sortColumn && sortDirection) {
          limitsParam.order = `${sortColumn}:${sortDirection}`;
        }

        const queryParams = { text: search || undefined };

        return this.origDataBlocksService
          .origDatablocksControllerFullqueryFilesV3(
            JSON.stringify(limitsParam),
            JSON.stringify(queryParams),
          )
          .pipe(
            mergeMap((origDatablocks: OrigDatablock[]) => [
              fromActions.fetchAllOrigDatablocksCompleteAction({
                origDatablocks:
                  origDatablocks as unknown as FileOrigdatablock[],
              }),
              fromActions.fetchCountAction({
                fields: queryParams,
              }),
            ]),
            catchError(() =>
              of(fromActions.fetchAllOrigDatablocksFailedAction()),
            ),
          );
      }),
    );
  });

  fetchDatasetOrigDatablocks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchDatasetOrigDatablocksAction),
      switchMap(
        ({ datasetId, limit, search, skip, sortColumn, sortDirection }) => {
          const limitsParam = {
            skip: skip,
            limit: limit,
            order: undefined,
          };

          if (sortColumn && sortDirection) {
            limitsParam.order = `${sortColumn}:${sortDirection}`;
          }

          const queryParams = {
            datasetId: datasetId,
            text: search || undefined,
          };

          return this.origDataBlocksService
            .origDatablocksControllerFullqueryFilesV3(
              JSON.stringify(limitsParam),
              JSON.stringify(queryParams),
            )
            .pipe(
              mergeMap((origDatablocks: OrigDatablock[]) => [
                fromActions.fetchDatasetOrigDatablocksCompleteAction({
                  currentDatasetOrigDatablocks:
                    origDatablocks as unknown as FileOrigdatablock[],
                }),
                fromActions.fetchCountAction({
                  fields: queryParams,
                }),
              ]),
              catchError(() =>
                of(fromActions.fetchDatasetOrigDatablocksFailedAction()),
              ),
            );
        },
      ),
    );
  });

  fetchCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchCountAction),
      switchMap(({ fields }) =>
        this.origDataBlocksService
          .origDatablocksControllerFullfacetFilesV3({
            fields: JSON.stringify(fields),
          })
          .pipe(
            map((res) => {
              const { all } = res[0] as any;
              const count = all && all.length > 0 ? all[0].totalSets : 0;

              return fromActions.fetchCountCompleteAction({ count, fields });
            }),
            catchError(() => of(fromActions.fetchCountFailedAction())),
          ),
      ),
    );
  });

  loading$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchAllOrigDatablocksAction,
        fromActions.fetchDatasetOrigDatablocksAction,
        fromActions.fetchCountAction,
      ),
      switchMap(() => of(loadingAction())),
    );
  });

  loadingComplete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchAllOrigDatablocksCompleteAction,
        fromActions.fetchAllOrigDatablocksFailedAction,
        fromActions.fetchDatasetOrigDatablocksCompleteAction,
        fromActions.fetchDatasetOrigDatablocksFailedAction,
        fromActions.fetchCountCompleteAction,
        fromActions.fetchCountFailedAction,
      ),
      switchMap(() => of(loadingCompleteAction())),
    );
  });

  constructor(
    private actions$: Actions,
    private origDataBlocksService: OrigdatablocksService,
  ) {}
}
