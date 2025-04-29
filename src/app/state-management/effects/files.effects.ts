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

@Injectable()
export class FilesEffects {
  fetchAllOrigDatablocks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchAllOrigDatablocksAction),
      mergeMap(({ limit, search, skip, sortColumn, sortDirection }) => {
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
          .origDatablocksControllerFullqueryFiles(
            JSON.stringify(limitsParam),
            JSON.stringify(queryParams),
          )
          .pipe(
            mergeMap((origDatablocks: OrigDatablock[]) => [
              fromActions.fetchAllOrigDatablocksCompleteAction({
                origDatablocks,
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

  fetchCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchCountAction),
      switchMap(({ fields }) =>
        // TODO: Fix and test this when we can generate the correct types from the API.
        // At the moment this is blocked because of changes in the API that needs to be addressed after latest sdk update.
        this.origDataBlocksService
          .origDatablocksControllerFullfacetFiles
          // JSON.stringify({
          //   fields,
          // }) as any,
          ()
          .pipe(
            map((res) => {
              const { all } = res[0] as any;
              const count = all && all.length > 0 ? all[0].totalSets : 0;

              return fromActions.fetchCountCompleteAction({ count });
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
