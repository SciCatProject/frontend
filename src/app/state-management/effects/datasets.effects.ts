import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatLatestFrom } from "@ngrx/operators";
import {
  AttachmentRelationshipsV4Dto,
  AttachmentsV4Service,
  CreateAttachmentV4Dto,
  DatasetsService,
  PartialUpdateAttachmentV4Dto,
  MetadataKeysV4Service,
  DatasetsV4Service,
  DatasetsPublicV4Service,
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
      switchMap(([{ pid, filters }, user]) => {
        const apiCall$ = user
          ? this.datasetsV4Service.datasetsV4ControllerFindByIdV4(pid, filters)
          : this.datasetsPublicV4Service.datasetsPublicV4ControllerFindByIdPublicV4(
              pid,
              filters,
            );

        return apiCall$.pipe(
          map((dataset) => fromActions.fetchDatasetCompleteAction({ dataset })),
          catchError(() => of(fromActions.fetchDatasetFailedAction())),
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
        const { datasetId, ...theRest } = attachment;
        // v4 has no datasetId column on an attachment, the link to the
        // dataset is expressed as a relationship entry instead
        const body: CreateAttachmentV4Dto = {
          ...theRest,
          isPublished: theRest.isPublished ?? false,
          relationships: [
            {
              targetId: datasetId,
              targetType: AttachmentRelationshipsV4Dto.TargetTypeEnum.dataset,
            },
          ],
        } as CreateAttachmentV4Dto;
        return this.attachmentsV4Service
          .attachmentsV4ControllerCreateAttachmentV4(body)
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
      switchMap(({ attachmentId, caption, ownerGroup }) => {
        const data: PartialUpdateAttachmentV4Dto = { caption, ownerGroup };
        return this.attachmentsV4Service
          .attachmentsV4ControllerFindOneAndUpdateV4(attachmentId, data)
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
      switchMap(({ attachmentId }) =>
        this.attachmentsV4Service
          // NOTE: the second argument should be removed on new backend release after v5.2.1
          // It's a temporary workaround for a backend bug that requires a second id to be passed.
          .attachmentsV4ControllerFindOneAttachmentAndRemoveV4(attachmentId, "")
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
    private metadataKeysV4Service: MetadataKeysV4Service,
    private datasetsV4Service: DatasetsV4Service,
    private datasetsPublicV4Service: DatasetsPublicV4Service,
    private attachmentsV4Service: AttachmentsV4Service,
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
