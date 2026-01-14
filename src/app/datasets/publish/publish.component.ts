import { Component, OnDestroy, OnInit, signal } from "@angular/core";

import { ActionsSubject, Store } from "@ngrx/store";
import { first, tap } from "rxjs/operators";

import { prefillBatchAction } from "state-management/actions/datasets.actions";
import {
  createPublishedDataAction,
  createPublishedDataCompleteAction,
  fetchPublishedDataConfigAction,
  resyncPublishedDataAction,
  savePublishedDataAction,
  savePublishedDataCompleteAction,
  updatePublishedDataAction,
} from "state-management/actions/published-data.actions";
import { selectDatasetsInBatch } from "state-management/selectors/datasets.selectors";

import { Router } from "@angular/router";
import { angularMaterialRenderers } from "@jsonforms/angular-material";
import {
  CreatePublishedDataV4Dto,
  PublishedData,
  PublishedDataService,
} from "@scicatproject/scicat-sdk-ts-angular";
import { AppConfigService } from "app-config.service";
import { EditableComponent } from "app-routing/pending-changes.guard";
import { cloneDeep, isEmpty } from "lodash-es";
import { fromEvent, Subscription } from "rxjs";
import {
  AccordionArrayLayoutRendererComponent,
  accordionArrayLayoutRendererTester,
} from "shared/modules/jsonforms-custom-renderers/expand-panel-renderer/accordion-array-layout-renderer.component";
import { selectPublishedDataConfig } from "state-management/selectors/published-data.selectors";

@Component({
  selector: "publish",
  templateUrl: "./publish.component.html",
  styleUrls: ["./publish.component.scss"],
  standalone: false,
})
export class PublishComponent implements OnInit, OnDestroy, EditableComponent {
  private _hasUnsavedChanges = false;
  private datasets$ = this.store.select(selectDatasetsInBatch);
  private publishedDataConfig$ = this.store.select(selectPublishedDataConfig);
  private countSubscription: Subscription;
  private publishedDataConfigSubscription: Subscription;
  private beforeUnloadSubscription: Subscription;
  readonly panelOpenState = signal(false);

  appConfig = this.appConfigService.getConfig();
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
  public datasetCount: number;
  today: number = Date.now();
  public metadataFormErrors = [];
  savedPublishedDataDoi: string | null = null;
  initialMetadata = JSON.stringify({});

  public form = {
    title: undefined,
    abstract: undefined,
    datasetPids: [],
  };

  public formData = null;
  actionSubjectSubscription: Subscription;

  constructor(
    private appConfigService: AppConfigService,
    private store: Store,
    private publishedDataApi: PublishedDataService,
    private actionsSubj: ActionsSubject,
    private router: Router,
  ) {}

  public formIsValid() {
    if (!Object.values(this.form).includes(undefined)) {
      return this.form.title.length > 0 && this.form.abstract.length > 0;
    } else {
      return false;
    }
  }

  public metadataIsValid() {
    return this.metadataFormErrors.length === 0;
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

  onFormFieldChange() {
    this._hasUnsavedChanges = true;
  }

  ngOnInit() {
    this.store.dispatch(prefillBatchAction());
    this.store.dispatch(fetchPublishedDataConfigAction());

    this.datasets$
      .pipe(
        first(),
        tap((datasets) => {
          if (datasets) {
            this.form.datasetPids = datasets.map((dataset) => dataset.pid);
          }
        }),
      )
      .subscribe();

    this.publishedDataConfigSubscription = this.publishedDataConfig$.subscribe(
      (publishedDataConfig) => {
        if (!isEmpty(publishedDataConfig)) {
          this.schema = publishedDataConfig.metadataSchema;
          // NOTE: We set the publicationYear by the system, so we remove it from the required fields in the frontend
          this.schema?.required.splice(
            this.schema.required.indexOf("publicationYear"),
            1,
          );
          this.uiSchema = publishedDataConfig.uiSchema;
          this.metadata = cloneDeep(publishedDataConfig.defaultValues) ?? {};
        }
      },
    );

    this.countSubscription = this.datasets$.subscribe((datasets) => {
      if (datasets) {
        this.datasetCount = datasets.length;
      }
    });

    this.publishedDataApi
      .publishedDataControllerFormPopulateV3(this.form.datasetPids[0])
      .subscribe((result) => {
        this.form.abstract = result.abstract;
        this.form.title = result.title;
      });

    this.actionSubjectSubscription = this.actionsSubj.subscribe((data) => {
      if (data.type === createPublishedDataCompleteAction.type) {
        const { publishedData } = data as {
          type: string;
          publishedData: PublishedData;
        };

        const doi = encodeURIComponent(publishedData.doi);
        this.router.navigateByUrl("/publishedDatasets/" + doi);
      }

      if (data.type === savePublishedDataCompleteAction.type) {
        const { publishedData } = data as {
          type: string;
          publishedData: PublishedData;
        };

        this.savedPublishedDataDoi = publishedData.doi;
      }
    });

    // Prevent user from reloading page if there are unsave changes
    this.beforeUnloadSubscription = fromEvent(window, "beforeunload").subscribe(
      (event) => {
        if (this.hasUnsavedChanges()) {
          event.preventDefault();
        }
      },
    );
  }

  ngOnDestroy() {
    this.actionSubjectSubscription.unsubscribe();
    this.countSubscription.unsubscribe();
    this.publishedDataConfigSubscription.unsubscribe();
    this.beforeUnloadSubscription.unsubscribe();
  }

  getPublishedDataForCreation() {
    const { title, abstract, datasetPids } = this.form;
    const metadata = {
      ...this.metadata,
      landingPage: this.appConfig.landingPage,
    };
    return {
      title: title,
      abstract: abstract,
      datasetPids: datasetPids,
      metadata: metadata,
    } as CreatePublishedDataV4Dto;
  }

  public onSaveAndContinue() {
    const publishedData = this.getPublishedDataForCreation();

    this._hasUnsavedChanges = false;

    if (this.savedPublishedDataDoi) {
      this.store.dispatch(
        resyncPublishedDataAction({
          doi: this.savedPublishedDataDoi,
          data: publishedData,
          redirect: true,
        }),
      );
    } else {
      this.store.dispatch(createPublishedDataAction({ data: publishedData }));
    }
  }

  public onSaveChanges() {
    const publishedData = this.getPublishedDataForCreation();

    if (this.savedPublishedDataDoi) {
      this.store.dispatch(
        updatePublishedDataAction({
          doi: this.savedPublishedDataDoi,
          data: publishedData,
        }),
      );
    } else {
      this.store.dispatch(savePublishedDataAction({ data: publishedData }));
    }

    this._hasUnsavedChanges = false;
  }

  public onCancel() {
    this.router.navigateByUrl("/datasets/selection");
  }

  hasUnsavedChanges() {
    return this._hasUnsavedChanges;
  }
}
