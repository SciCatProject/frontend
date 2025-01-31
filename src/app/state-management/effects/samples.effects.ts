import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, concatLatestFrom } from "@ngrx/effects";
import {
  CreateSubAttachmentDto,
  DatasetsService,
  SamplesService,
} from "@scicatproject/scicat-sdk-ts-angular";
import { Store } from "@ngrx/store";
import {
  selectFullqueryParams,
  selectDatasetsQueryParams,
} from "state-management/selectors/samples.selectors";
import * as fromActions from "state-management/actions/samples.actions";
import { mergeMap, map, catchError, switchMap, filter } from "rxjs/operators";
import { of } from "rxjs";
import {
  loadingAction,
  loadingCompleteAction,
} from "state-management/actions/user.actions";

@Injectable()
export class SampleEffects {
  private fullqueryParams$ = this.store.select(selectFullqueryParams);
  private datasetsQueryParams$ = this.store.select(selectDatasetsQueryParams);

  fetchSamples$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchSamplesAction,
        fromActions.changePageAction,
        fromActions.sortByColumnAction,
        fromActions.setTextFilterAction,
      ),
      concatLatestFrom(() => this.fullqueryParams$),
      map(([action, params]) => params),
      mergeMap(({ query, limits }) =>
        this.sampleApi
          .samplesControllerFullquery(JSON.stringify(limits), query)
          .pipe(
            mergeMap((samples) => [
              fromActions.fetchSamplesCompleteAction({ samples }),
              fromActions.fetchSamplesCountAction(),
            ]),
            catchError(() => of(fromActions.fetchSamplesFailedAction())),
          ),
      ),
    );
  });

  fetchCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchSamplesCountAction),
      concatLatestFrom(() => this.fullqueryParams$),
      map(([action, params]) => params),
      mergeMap(({ query }) =>
        this.sampleApi.samplesControllerFullquery(query).pipe(
          map((samples) =>
            fromActions.fetchSamplesCountCompleteAction({
              count: samples.length,
            }),
          ),
          catchError(() => of(fromActions.fetchSamplesCountFailedAction())),
        ),
      ),
    );
  });

  fetchMetadataKeys$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchMetadataKeysAction),
      concatLatestFrom(() => this.fullqueryParams$),
      map(([action, params]) => params),
      mergeMap(({ query }) => {
        const parsedQuery = JSON.parse(query);
        parsedQuery.metadataKey = "";
        return this.sampleApi
          .samplesControllerMetadataKeys(JSON.stringify(parsedQuery))
          .pipe(
            map((metadataKeys) =>
              fromActions.fetchMetadataKeysCompleteAction({ metadataKeys }),
            ),
            catchError(() => of(fromActions.fetchMetadataKeysFailedAction())),
          );
      }),
    );
  });

  fetchSample$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchSampleAction),
      switchMap(({ sampleId }) => {
        return this.sampleApi.samplesControllerFindByIdAccess(sampleId).pipe(
          filter((permission) => permission.canAccess),
          switchMap(() =>
            this.sampleApi.samplesControllerFindById(sampleId).pipe(
              map((sample) =>
                fromActions.fetchSampleCompleteAction({ sample }),
              ),
              catchError(() => of(fromActions.fetchSampleFailedAction())),
            ),
          ),
          catchError(() => of(fromActions.fetchSampleAccessFailedAction())),
        );
      }),
    );
  });

  fetchSampleAttachments$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchSampleAttachmentsAction),
      switchMap(({ sampleId }) => {
        return this.sampleApi
          .samplesControllerFindAllAttachments(sampleId)
          .pipe(
            map((attachments) =>
              fromActions.fetchSampleAttachmentsCompleteAction({ attachments }),
            ),
            catchError(() =>
              of(fromActions.fetchSampleAttachmentsFailedAction()),
            ),
          );
      }),
    );
  });

  fetchSampleDatasets$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchSampleDatasetsAction),
      concatLatestFrom(() => this.datasetsQueryParams$),
      mergeMap(([{ sampleId }, { order, skip, limit }]) =>
        this.datasetApi
          .datasetsControllerFindAll(
            JSON.stringify({
              where: { sampleId },
              order,
              skip,
              limit,
            }),
          )
          .pipe(
            mergeMap((datasets) => [
              fromActions.fetchSampleDatasetsCompleteAction({ datasets }),
              fromActions.fetchSampleDatasetsCountAction({ sampleId }),
            ]),
            catchError(() => of(fromActions.fetchSampleDatasetsFailedAction())),
          ),
      ),
    );
  });

  fetchSampleDatasetsCount$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.fetchSampleDatasetsCountAction),
      switchMap(({ sampleId }) =>
        this.datasetApi
          .datasetsControllerFindAll(JSON.stringify({ where: { sampleId } }))
          .pipe(
            map((datasets) =>
              fromActions.fetchSampleDatasetsCountCompleteAction({
                count: datasets.length,
              }),
            ),
            catchError(() =>
              of(fromActions.fetchSampleDatasetsCountFailedAction()),
            ),
          ),
      ),
    );
  });

  saveCharacteristics$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.saveCharacteristicsAction),
      switchMap(({ sampleId, characteristics }) =>
        this.sampleApi
          .samplesControllerUpdate(sampleId, {
            sampleCharacteristics: characteristics,
          })
          .pipe(
            map((sample) =>
              fromActions.saveCharacteristicsCompleteAction({ sample }),
            ),
            catchError(() => of(fromActions.saveCharacteristicsFailedAction())),
          ),
      ),
    );
  });

  addSample$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.addSampleAction),
      mergeMap(({ sample }) =>
        this.sampleApi.samplesControllerCreate(sample).pipe(
          mergeMap((res) => [
            fromActions.addSampleCompleteAction({ sample: res }),
            fromActions.fetchSamplesAction(),
          ]),
          catchError(() => of(fromActions.addSampleFailedAction())),
        ),
      ),
    );
  });

  addAttachment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.addAttachmentAction),
      switchMap(({ attachment }) => {
        const { id, datasetId, proposalId, ...theRest } = attachment;
        return this.sampleApi
          .samplesControllerCreateAttachments(
            theRest.sampleId,
            theRest as CreateSubAttachmentDto,
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

  removeAttachment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromActions.removeAttachmentAction),
      switchMap(({ sampleId, attachmentId }) =>
        this.sampleApi
          .samplesControllerFindOneAttachmentAndRemove(sampleId, attachmentId)
          .pipe(
            map(() =>
              fromActions.removeAttachmentCompleteAction({ attachmentId }),
            ),
            catchError(() => of(fromActions.removeAttachmentFailedAction())),
          ),
      ),
    );
  });

  loading$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchSamplesAction,
        fromActions.fetchSamplesCountAction,
        fromActions.fetchSampleAction,
        fromActions.fetchSampleDatasetsAction,
        fromActions.fetchSampleDatasetsCountAction,
        fromActions.addSampleAction,
        fromActions.saveCharacteristicsAction,
        fromActions.addAttachmentAction,
        fromActions.updateAttachmentCaptionAction,
        fromActions.removeAttachmentAction,
      ),
      switchMap(() => of(loadingAction())),
    );
  });

  loadingComplete$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        fromActions.fetchSamplesCompleteAction,
        fromActions.fetchSamplesFailedAction,
        fromActions.fetchSamplesCountCompleteAction,
        fromActions.fetchSamplesCountFailedAction,
        fromActions.fetchSampleCompleteAction,
        fromActions.fetchSampleFailedAction,
        fromActions.fetchSampleDatasetsCompleteAction,
        fromActions.fetchSampleDatasetsFailedAction,
        fromActions.fetchSampleDatasetsCountCompleteAction,
        fromActions.fetchSampleDatasetsCountFailedAction,
        fromActions.addSampleCompleteAction,
        fromActions.addSampleFailedAction,
        fromActions.saveCharacteristicsCompleteAction,
        fromActions.saveCharacteristicsFailedAction,
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

  constructor(
    private actions$: Actions,
    private datasetApi: DatasetsService,
    private sampleApi: SamplesService,
    private store: Store,
  ) {}
}
