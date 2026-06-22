import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import {
  Attachment,
  CreateAttachmentV3Dto,
  Datablock,
  DatasetsService,
  OrigDatablock,
  UpdateAttachmentV3Dto,
  DatasetsV4Service,
  DatasetsPublicV4Service,
  MetadataKeysV4Service,
} from "@scicatproject/scicat-sdk-ts-angular";
import { Store } from "@ngrx/store";
import {
  selectFullqueryParams,
  selectFullfacetParams,
  selectDatasetsInBatch,
  selectCurrentDataset,
  selectRelatedDatasetsFilters,
} from "state-management/selectors/datasets.selectors";
import * as fromActions from "state-management/actions/datasets.actions";
import {
  mergeMap,
  map,
  catchError,
  switchMap,
  tap,
  filter,
} from "rxjs/operators";
import { of } from "rxjs";
import { selectCurrentUser } from "state-management/selectors/user.selectors";
import {
  logoutCompleteAction,
  loadingAction,
  loadingCompleteAction,
  updateUserSettingsAction,
} from "state-management/actions/user.actions";
import { AppConfigService } from "app-config.service";
import { CurrentDataset } from "state-management/state/datasets.store";

@Injectable()
export class DatasetEffects {
  currentDataset$ = this.store.select(selectCurrentDataset);
  relatedDatasetsFilters$ = this.store.select(selectRelatedDatasetsFilters);
  fullqueryParams$ = this.store.select(selectFullqueryParams);
  fullfacetParams$ = this.store.select(selectFullfacetParams);
  datasetsInBatch$ = this.store.select(selectDatasetsInBatch);
  currentUser$ = this.store.select(selectCurrentUser);

  fetchDatasets$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchDatasetsAction,
        fromActions.setPublicViewModeAction,
        fromActions.sortByColumnAction,
        fromActions.setArchiveViewModeAction,
      ),
      concatLatestFrom(() => [this.fullqueryParams$, this.currentUser$]),
      mergeMap(([, params, user]) => {
        const config = this.appConfigService.getConfig();
        const defaultConfigColumns =
          config?.defaultDatasetsListSettings?.columns;
        let defaultColumn = "createdAt";
        let defaultDirection = "desc";

        if (defaultConfigColumns) {
          const sortCol = defaultConfigColumns.find((col) => col.sort);
          if (sortCol) {
            defaultColumn = sortCol.name;
            defaultDirection = sortCol.sort;
          }
        }

        if (Object.keys(params.limits.sort).length === 0) {
          params.limits.sort = { [defaultColumn]: defaultDirection };
        }

        const filter = {
          where: params.query,
          limits: params.limits,
        };

        const apiCall$ = user
          ? this.datasetsV4Service.datasetsV4ControllerFindAllV4(
              JSON.stringify(filter),
            )
          : this.datasetsPublicV4Service.datasetsPublicV4ControllerFindAllPublicV4(
              JSON.stringify(filter),
            );

        return apiCall$.pipe(
          map((datasets) =>
            fromActions.fetchDatasetsCompleteAction({ datasets: datasets }),
          ),
          catchError(() => of(fromActions.fetchDatasetsFailedAction())),
        );
      }),
    );
  });

  fetchFacetCounts$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchFacetCountsAction,
        fromActions.setPublicViewModeAction,
        fromActions.sortByColumnAction,
      ),
      concatLatestFrom(() => [this.fullfacetParams$, this.currentUser$]),
      mergeMap(([, params, user]) => {
        const { fields, facets } = params;

        const filter = {
          fields: JSON.stringify(fields),
          facets: JSON.stringify(facets),
        };

        const apiCall$ = user
          ? this.datasetsV4Service.datasetsV4ControllerFullfacetV4(filter)
          : this.datasetsPublicV4Service.datasetsPublicV4ControllerFullfacetV4(
              filter,
            );

        return apiCall$.pipe(
          map((res) => {
            const { all, ...facetCounts } = res[0];

            const allCounts = all && all.length > 0 ? all[0].totalSets : 0;
            return fromActions.fetchFacetCountsCompleteAction({
              facetCounts,
              allCounts,
            });
          }),
          catchError(() => of(fromActions.fetchFacetCountsFailedAction())),
        );
      }),
    );
  });

  fetchMetadataKeys$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchMetadataKeysAction),
      switchMap(({ searchTerm }) => {
        const filter = {
          where: {},
          fields: ["key", "humanReadableName"],
        };

        if (searchTerm && searchTerm.trim()) {
          filter.where = {
            $or: [
              { key: { $regex: searchTerm, $options: "i" } },
              { humanReadableName: { $regex: searchTerm, $options: "i" } },
            ],
          };
        }

        return this.metadataKeysV4Service
          .metadataKeysV4ControllerFindAllV4(JSON.stringify(filter))
          .pipe(
            map((metadataKeys) => {
              const keys = metadataKeys.map((dto) => dto.key);
              return fromActions.fetchMetadataKeysCompleteAction({
                metadataKeys: keys,
              });
            }),
            catchError(() => of(fromActions.fetchMetadataKeysFailedAction())),
          );
      }),
    );
  });

  updateUserDatasetsLimit$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.changePageAction),
      map(({ limit }) =>
        updateUserSettingsAction({ property: { datasetCount: limit } }),
      ),
    );
  });

  updateMetadataKeys$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.addScientificConditionAction,
        fromActions.removeScientificConditionAction,
        fromActions.clearFacetsAction,
      ),
      map(() => fromActions.fetchMetadataKeysAction({})),
    );
  });

  fetchDataset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchDatasetAction),
      concatLatestFrom(() => this.currentUser$),
      switchMap(([{ pid }, user]) => {
        const apiCall$ = user
          ? this.datasetsV4Service.datasetsV4ControllerFindByIdV4(pid)
          : this.datasetsPublicV4Service.datasetsPublicV4ControllerFindByIdPublicV4(
              pid,
            );

        return apiCall$.pipe(
          map((dataset) => fromActions.fetchDatasetCompleteAction({ dataset })),
          catchError(() => of(fromActions.fetchDatasetFailedAction())),
        );
      }),
    );
  });
  fetchDatablocksOfDataset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchDatablocksAction),
      switchMap(({ pid, filters }) => {
        return this.datasetsService
          .datasetsControllerFindAllDatablocksV3(pid, filters)
          .pipe(
            map((datablocks: Datablock[]) =>
              fromActions.fetchDatablocksCompleteAction({ datablocks }),
            ),
            catchError(() => of(fromActions.fetchDatablocksFailedAction())),
          );
      }),
    );
  });

  fetchOrigDatablocksOfDataset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchOrigDatablocksAction),
      switchMap(({ pid }) => {
        return this.datasetsService
          .datasetsControllerFindAllOrigDatablocksV3(pid)
          .pipe(
            map((origdatablocks: OrigDatablock[]) =>
              fromActions.fetchOrigDatablocksCompleteAction({ origdatablocks }),
            ),
            catchError(() => of(fromActions.fetchOrigDatablocksFailedAction())),
          );
      }),
    );
  });

  fetchAttachmentsOfDataset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchAttachmentsAction),
      switchMap(({ pid, filters }) => {
        return this.datasetsService
          .datasetsControllerFindAllAttachmentsV3(pid, filters)
          .pipe(
            map((attachments: Attachment[]) =>
              fromActions.fetchAttachmentsCompleteAction({ attachments }),
            ),
            catchError(() => of(fromActions.fetchAttachmentsFailedAction())),
          );
      }),
    );
  });

  fetchRelatedDatasets$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchRelatedDatasetsAction),
      concatLatestFrom(() => [
        this.currentDataset$,
        this.relatedDatasetsFilters$,
        this.currentUser$,
      ]),
      switchMap(([, dataset, filters, user]) => {
        const queryFilter = {
          where: {},
          limits: {
            skip: filters.skip,
            limit: filters.limit,
          },
        };
        if (dataset.type === "raw") {
          queryFilter.where = {
            type: "derived",
            inputDatasets: dataset.pid,
          };
        }
        if (dataset.type === "derived") {
          queryFilter.where = {
            pid: { $in: dataset.inputDatasets },
          };
        }
        const apiCall$ = user
          ? this.datasetsV4Service.datasetsV4ControllerFindAllV4(
              JSON.stringify(queryFilter),
            )
          : this.datasetsPublicV4Service.datasetsPublicV4ControllerFindAllPublicV4(
              JSON.stringify(queryFilter),
            );

        return apiCall$.pipe(
          map((relatedDatasets) =>
            fromActions.fetchRelatedDatasetsCompleteAction({
              relatedDatasets,
            }),
          ),
          catchError(() => of(fromActions.fetchRelatedDatasetsFailedAction())),
        );
      }),
    );
  });

  fetchRelatedDatasetsCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchRelatedDatasetsAction),
      concatLatestFrom(() => [this.currentDataset$, this.currentUser$]),
      switchMap(([, dataset, user]) => {
        const queryFilter = {
          where: {},
        };
        if (dataset.type === "raw") {
          queryFilter.where = {
            type: "derived",
            inputDatasets: dataset.pid,
          };
        }
        if (dataset.type === "derived") {
          queryFilter.where = {
            pid: { $in: dataset.inputDatasets },
          };
        }
        const apiCall$ = user
          ? this.datasetsV4Service.datasetsV4ControllerCountV4(
              JSON.stringify(queryFilter),
            )
          : this.datasetsPublicV4Service.datasetsPublicV4ControllerCountPublicV4(
              JSON.stringify(queryFilter),
            );

        return apiCall$.pipe(
          map(({ count }) =>
            fromActions.fetchRelatedDatasetsCountCompleteAction({
              count,
            }),
          ),
          catchError(() =>
            of(fromActions.fetchRelatedDatasetsCountFailedAction()),
          ),
        );
      }),
    );
  });

  addDataset$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.addDatasetAction),
      mergeMap(({ dataset }) =>
        this.datasetsV4Service.datasetsV4ControllerCreateV4(dataset).pipe(
          mergeMap((res) => [
            fromActions.addDatasetCompleteAction({
              dataset: res,
            }),
            fromActions.fetchDatasetsAction(),
            fromActions.fetchDatasetAction({ pid: res.pid }),
          ]),
          catchError(() => of(fromActions.addDatasetFailedAction())),
        ),
      ),
    );
  });

  updateProperty$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.updatePropertyAction),
      switchMap(({ pid, property }) =>
        this.datasetsV4Service
          .datasetsV4ControllerFindByIdAndUpdateV4(pid, property)
          .pipe(
            switchMap(() => [
              fromActions.updatePropertyCompleteAction(),
              fromActions.fetchDatasetAction({ pid }),
            ]),
            catchError(() => of(fromActions.updatePropertyFailedAction())),
          ),
      ),
    );
  });

  updatePropertyInline$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.updatePropertyInlineAction),
      switchMap(({ pid, property }) =>
        this.datasetsV4Service
          .datasetsV4ControllerFindByIdAndUpdateV4(pid, property)
          .pipe(
            map(() => fromActions.updatePropertyCompleteAction()),
            catchError(() => of(fromActions.updatePropertyFailedAction())),
          ),
      ),
    );
  });

  addAttachment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.addAttachmentAction),
      switchMap(({ attachment }) => {
        const { id, proposalId, sampleId, ...theRest } = attachment;
        return this.datasetsService
          .datasetsControllerCreateAttachmentV3(
            theRest.datasetId,
            theRest as CreateAttachmentV3Dto,
          )
          .pipe(
            map((res) =>
              fromActions.addAttachmentCompleteAction({ attachment: res }),
            ),
            catchError(() => of(fromActions.addAttachmentFailedAction())),
          );
      }),
    );
  });

  updateAttachmentCaption$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.updateAttachmentCaptionAction),
      switchMap(({ datasetId, attachmentId, caption, ownerGroup }) => {
        const data = { caption, ownerGroup };
        return this.datasetsService
          .datasetsControllerFindOneAttachmentAndUpdateV3(
            datasetId,
            attachmentId,
            data as UpdateAttachmentV3Dto,
          )
          .pipe(
            map((attachment) =>
              fromActions.updateAttachmentCaptionCompleteAction({ attachment }),
            ),
            catchError(() =>
              of(fromActions.updateAttachmentCaptionFailedAction()),
            ),
          );
      }),
    );
  });

  removeAttachment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.removeAttachmentAction),
      switchMap(({ datasetId, attachmentId }) =>
        this.datasetsService
          .datasetsControllerFindOneAttachmentAndRemoveV3(
            datasetId,
            attachmentId,
          )
          .pipe(
            map(() =>
              fromActions.removeAttachmentCompleteAction({ attachmentId }),
            ),
            catchError(() => of(fromActions.removeAttachmentFailedAction())),
          ),
      ),
    );
  });

  appendToArrayField$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.appendToDatasetArrayFieldAction),
      mergeMap(({ pid, fieldName, data }) =>
        this.datasetsService
          .datasetsControllerAppendToArrayFieldV3(pid, fieldName, data)
          .pipe(
            map(() => fromActions.appendToDatasetArrayFieldCompleteAction()),
            catchError(() =>
              of(fromActions.appendToDatasetArrayFieldFailedAction()),
            ),
          ),
      ),
    );
  });

  loading$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchDatasetsAction,
        fromActions.fetchFacetCountsAction,
        fromActions.fetchMetadataKeysAction,
        fromActions.fetchDatasetAction,
        fromActions.fetchOrigDatablocksAction,
        fromActions.fetchDatablocksAction,
        fromActions.fetchAttachmentsAction,
        fromActions.addDatasetAction,
        fromActions.updatePropertyAction,
        fromActions.updatePropertyInlineAction,
        fromActions.addAttachmentAction,
        fromActions.updateAttachmentCaptionAction,
        fromActions.removeAttachmentAction,
        fromActions.setPublicViewModeAction,
      ),
      switchMap(() => of(loadingAction())),
    );
  });

  loadingComplete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchDatasetsCompleteAction,
        fromActions.fetchDatasetsFailedAction,
        fromActions.fetchRelatedDatasetsCompleteAction,
        fromActions.fetchRelatedDatasetsFailedAction,
        fromActions.fetchFacetCountsCompleteAction,
        fromActions.fetchFacetCountsFailedAction,
        fromActions.fetchMetadataKeysCompleteAction,
        fromActions.fetchMetadataKeysFailedAction,
        fromActions.fetchDatasetCompleteAction,
        fromActions.fetchDatasetFailedAction,
        fromActions.fetchOrigDatablocksCompleteAction,
        fromActions.fetchOrigDatablocksFailedAction,
        fromActions.fetchDatablocksCompleteAction,
        fromActions.fetchDatablocksFailedAction,
        fromActions.fetchOrigDatablocksCompleteAction,
        fromActions.fetchOrigDatablocksFailedAction,
        fromActions.fetchAttachmentsCompleteAction,
        fromActions.fetchAttachmentsFailedAction,
        fromActions.addDatasetCompleteAction,
        fromActions.addDatasetFailedAction,
        fromActions.updatePropertyCompleteAction,
        fromActions.updatePropertyFailedAction,
        fromActions.addAttachmentCompleteAction,
        fromActions.addAttachmentFailedAction,
        fromActions.updateAttachmentCaptionCompleteAction,
        fromActions.updateAttachmentCaptionFailedAction,
        fromActions.removeAttachmentCompleteAction,
        fromActions.removeAttachmentFailedAction,
      ),
      switchMap(() => of(loadingCompleteAction())),
    );
  });

  prefillBatch$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.prefillBatchAction),
      concatLatestFrom(() => this.currentUser$),
      filter(([, user]) => user != null),
      map(([, user]) => this.retrieveBatch(user?.id)),
      map((batch) => fromActions.prefillBatchCompleteAction({ batch })),
    );
  });

  storeBatch$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          fromActions.addToBatchAction,
          fromActions.addCurrentToBatchAction,
          fromActions.storeBatchAction,
          fromActions.removeFromBatchAction,
          fromActions.clearBatchAction,
        ),
        concatLatestFrom(() => [this.datasetsInBatch$, this.currentUser$]),
        tap(([, batch, user]) => this.storeBatch(batch, user?.id)),
      );
    },
    { dispatch: false },
  );

  clearBatchOnLogout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(logoutCompleteAction),
        tap(() => this.storeBatch([], "")),
      );
    },
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private datasetsService: DatasetsService,
    private store: Store,
    private appConfigService: AppConfigService,
    private datasetsV4Service: DatasetsV4Service,
    private datasetsPublicV4Service: DatasetsPublicV4Service,
    private metadataKeysV4Service: MetadataKeysV4Service,
  ) {}

  private storeBatch(batch: CurrentDataset[], userId: string) {
    const json = JSON.stringify(batch);
    localStorage.setItem("batch", json);
    localStorage.setItem("batchUser", userId);
  }

  private retrieveBatch(ofUserId: string): CurrentDataset[] {
    const json = localStorage.getItem("batch");
    const userId = localStorage.getItem("batchUser");

    if (json != null && userId === ofUserId) {
      return JSON.parse(json);
    } else {
      return [];
    }
  }
}
