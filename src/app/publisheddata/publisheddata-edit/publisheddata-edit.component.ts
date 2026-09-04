import { Component, OnDestroy, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { angularMaterialRenderers } from "@jsonforms/angular-material";
import { ActionsSubject, Store } from "@ngrx/store";
import {
  CreatePublishedDataV4Dto,
  PublishedData,
  PublishedDataV4Service,
} from "@scicatproject/scicat-sdk-ts-angular";
import { AppConfigService } from "app-config.service";
import { EditableComponent } from "app-routing/pending-changes.guard";
import { isEmpty } from "lodash-es";
import { fromEvent, Subscription } from "rxjs";
import { first, switchMap, tap } from "rxjs/operators";
import {
  AccordionArrayLayoutRendererComponent,
  accordionArrayLayoutRendererTester,
} from "shared/modules/jsonforms-custom-renderers/expand-panel-renderer/accordion-array-layout-renderer.component";
import { AjvService } from "shared/services/ajv.service";
import { prefillBatchAction } from "state-management/actions/datasets.actions";
import {
  createPublishedDataAction,
  createPublishedDataCompleteAction,
  fetchPublishedDataAction,
  fetchPublishedDataConfigAction,
  resyncPublishedDataAction,
  savePublishedDataAction,
  savePublishedDataCompleteAction,
  updatePublishedDataAction,
} from "state-management/actions/published-data.actions";
import { selectDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import {
  selectCurrentPublishedData,
  selectPublishedDataConfig,
} from "state-management/selectors/published-data.selectors";

/**
 * "create" publishes the datasets currently in the batch, "edit" updates an
 * existing published data record. The mode comes from the route data.
 */
export type PublisheddataEditMode = "create" | "edit";

@Component({
  selector: "publisheddata-edit",
  templateUrl: "./publisheddata-edit.component.html",
  styleUrls: ["./publisheddata-edit.component.scss"],
  standalone: false,
})
export class PublisheddataEditComponent
  implements OnInit, OnDestroy, EditableComponent
{
  private datasets$ = this.store.select(selectDatasetsInBatch);
  private publishedDataConfig$ = this.store.select(selectPublishedDataConfig);
  private currentPublishedData$ = this.store.select(selectCurrentPublishedData);
  private subscriptions = new Subscription();
  private _hasUnsavedChanges = false;

  mode: PublisheddataEditMode = "create";
  /** DOI of the record being edited, or of the draft saved in create mode */
  publishedDataDoi: string | null = null;
  formReady = false;
  datasetCount = 0;

  appConfig = this.appConfigService.getConfig();
  readonly panelOpenState = signal(false);
  renderers = [
    ...angularMaterialRenderers,
    {
      tester: accordionArrayLayoutRendererTester,
      renderer: AccordionArrayLayoutRendererComponent,
    },
  ];
  schema: any = {};
  uiSchema: any = {};
  metadata: any = {};
  metadataFormErrors = [];
  initialMetadata = JSON.stringify({});

  form: FormGroup = this.formBuilder.group({
    title: ["", Validators.required],
    abstract: ["", Validators.required],
    datasetPids: [[] as string[], Validators.minLength(1)],
  });

  constructor(
    private actionsSubj: ActionsSubject,
    private appConfigService: AppConfigService,
    private formBuilder: FormBuilder,
    private publishedDataApi: PublishedDataV4Service,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    protected ajvService: AjvService,
  ) {}

  private initCreateMode() {
    this.formReady = true;
    this.store.dispatch(prefillBatchAction());

    this.subscriptions.add(
      this.datasets$.subscribe((datasets) => {
        this.datasetCount = datasets ? datasets.length : 0;
      }),
    );

    this.subscriptions.add(
      this.datasets$
        .pipe(
          first(),
          tap((datasets) =>
            this.form.patchValue({
              datasetPids: (datasets ?? []).map((dataset) => dataset.pid),
            }),
          ),
          switchMap(() =>
            this.publishedDataApi.publishedDataV4ControllerFormPopulateV4(
              this.form.value.datasetPids,
            ),
          ),
        )
        .subscribe((result) => {
          this.form.patchValue({
            title: result.title,
            abstract: result.abstract,
          });
          this.setMetadata(result.metadata);
        }),
    );

    this.subscriptions.add(
      this.actionsSubj.subscribe((action) => {
        // Saving keeps the user on the form, publishing sends them to the record
        if (action.type === savePublishedDataCompleteAction.type) {
          const { publishedData } = action as {
            type: string;
            publishedData: PublishedData;
          };
          this.publishedDataDoi = publishedData.doi;
        }

        if (action.type === createPublishedDataCompleteAction.type) {
          const { publishedData } = action as {
            type: string;
            publishedData: PublishedData;
          };
          this.navigateToPublishedData(publishedData.doi);
        }
      }),
    );
  }

  private initEditMode() {
    this.subscriptions.add(
      this.route.params.subscribe(({ id }) =>
        this.store.dispatch(fetchPublishedDataAction({ id })),
      ),
    );

    this.subscriptions.add(
      this.currentPublishedData$.subscribe((publishedData) => {
        if (!publishedData) {
          return;
        }
        this.publishedDataDoi = publishedData.doi;
        this.form.patchValue(publishedData);
        this.setMetadata(publishedData.metadata);
        this.formReady = true;
      }),
    );
  }

  private setMetadata(metadata: any) {
    this.metadata = metadata ?? {};
    this.initialMetadata = JSON.stringify(this.metadata);
  }

  private getPublishedData(): CreatePublishedDataV4Dto {
    return {
      ...this.form.value,
      metadata: {
        ...this.metadata,
        landingPage: this.appConfig.landingPage,
      },
    } as CreatePublishedDataV4Dto;
  }

  private navigateToPublishedData(doi: string) {
    this.router.navigateByUrl("/publishedDatasets/" + encodeURIComponent(doi));
  }

  private save(shouldRedirect: boolean) {
    if (!this.form.valid) {
      return;
    }

    const doi = this.publishedDataDoi;
    const data = this.getPublishedData();

    if (!doi) {
      // Nothing has been created yet, only possible while publishing a batch
      if (this.mode === "edit") {
        return;
      }
      this.store.dispatch(
        shouldRedirect
          ? createPublishedDataAction({ data })
          : savePublishedDataAction({ data }),
      );
    } else if (shouldRedirect) {
      this.store.dispatch(
        resyncPublishedDataAction({ doi, data, redirect: true }),
      );
    } else if (this.mode === "create") {
      // The draft is not registered yet, a plain update is enough and it keeps
      // the batch and the stored draft DOI around so the user can come back
      this.store.dispatch(updatePublishedDataAction({ doi, data }));
    } else {
      this.store.dispatch(
        resyncPublishedDataAction({ doi, data, redirect: false }),
      );
    }

    this._hasUnsavedChanges = false;
    this.form.markAsPristine();
  }

  ngOnInit() {
    this.mode = this.route.snapshot.data?.["mode"] ?? "create";

    this.store.dispatch(fetchPublishedDataConfigAction());

    this.subscriptions.add(
      this.publishedDataConfig$.subscribe((publishedDataConfig) => {
        if (!isEmpty(publishedDataConfig)) {
          this.schema = this.ajvService.cleanupSchema(
            publishedDataConfig.metadataSchema,
          );
          this.uiSchema = publishedDataConfig.uiSchema;
        }
      }),
    );

    if (this.mode === "edit") {
      this.initEditMode();
    } else {
      this.initCreateMode();
    }

    this.subscriptions.add(
      this.form.valueChanges.subscribe(() => {
        if (this.form.dirty) {
          this._hasUnsavedChanges = true;
        }
      }),
    );

    // Prevent user from reloading page if there are unsaved changes
    this.subscriptions.add(
      fromEvent(window, "beforeunload").subscribe((event) => {
        if (this.hasUnsavedChanges()) {
          event.preventDefault();
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  isSchemaEmpty(): boolean {
    return isEmpty(this.schema);
  }

  onErrors(errors) {
    this.metadataFormErrors = errors;
  }

  onMetadataChange(data: any) {
    this.metadata = data;

    if (JSON.stringify(data) !== this.initialMetadata) {
      this._hasUnsavedChanges = true;
    }
  }

  hasUnsavedChanges() {
    return this._hasUnsavedChanges;
  }

  public onSaveChanges() {
    this.save(false);
  }

  public onSaveAndContinue() {
    this.save(true);
  }

  public onCancel() {
    if (this.mode === "create") {
      this.router.navigateByUrl("/datasets/selection");
    } else if (this.publishedDataDoi) {
      this.navigateToPublishedData(this.publishedDataDoi);
    }
  }
}
