import { Component, OnInit, OnDestroy, Output, signal } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

import { Store, ActionsSubject } from "@ngrx/store";
import { first, tap } from "rxjs/operators";

import { selectDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { prefillBatchAction } from "state-management/actions/datasets.actions";
import {
  createDataPublicationAction,
  fetchPublishedDataCompleteAction,
  fetchPublishedDataConfigAction,
} from "state-management/actions/published-data.actions";

import {
  OutputDatasetObsoleteDto,
  PublishedDataService,
} from "@scicatproject/scicat-sdk-ts-angular";
import { Router } from "@angular/router";
import {
  selectCurrentPublishedData,
  selectPublishedDataConfig,
} from "state-management/selectors/published-data.selectors";
import { fromEvent, Subscription } from "rxjs";
import { AppConfigService } from "app-config.service";
import { angularMaterialRenderers } from "@jsonforms/angular-material";
import { isEmpty } from "lodash-es";
import { EditableComponent } from "app-routing/pending-changes.guard";

@Component({
  selector: "publish",
  templateUrl: "./publish.component.html",
  styleUrls: ["./publish.component.scss"],
  standalone: false,
})
export class PublishComponent implements OnInit, OnDestroy, EditableComponent {
  private _hasUnsavedChanges = false;
  renderers = angularMaterialRenderers;
  schema: any = {};
  uiSchema: any = {};
  metadataData: any = {};
  private datasets$ = this.store.select(selectDatasetsInBatch);
  private publishedDataConfig$ = this.store.select(selectPublishedDataConfig);
  private countSubscription: Subscription;
  private publishedDataConfigSubscription: Subscription;
  private beforeUnloadSubscription: Subscription;
  readonly panelOpenState = signal(false);

  appConfig = this.appConfigService.getConfig();

  public separatorKeysCodes: number[] = [ENTER, COMMA];
  public datasetCount: number;
  public datasets: OutputDatasetObsoleteDto[] = [];
  today: number = Date.now();
  public metadataFormErrors = [];

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

  public metadataDataIsValid() {
    return this.metadataFormErrors.length === 0;
  }

  onErrors(errors) {
    this.metadataFormErrors = errors;
  }

  onMetadataChange(data: any) {
    this.metadataData = data;
    if (JSON.stringify(data) !== "{}") {
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
          this.schema.required.splice(
            this.schema.required.indexOf("publicationYear"),
            1,
          );
          this.uiSchema = publishedDataConfig.uiSchema;
        }
      },
    );

    this.countSubscription = this.datasets$.subscribe((datasets) => {
      if (datasets) {
        this.datasetCount = datasets.length;
        this.datasets = datasets;
      }
    });

    this.publishedDataApi
      .publishedDataControllerFormPopulateV3(this.form.datasetPids[0])
      .subscribe((result) => {
        this.form.abstract = result.abstract;
        this.form.title = result.title;
      });

    this.actionSubjectSubscription = this.actionsSubj.subscribe((data) => {
      if (data.type === fetchPublishedDataCompleteAction.type) {
        this.store
          .select(selectCurrentPublishedData)
          .subscribe((publishedData) => {
            const doi = encodeURIComponent(publishedData.doi);
            this.router.navigateByUrl("/publishedDatasets/" + doi);
          })
          .unsubscribe();
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

  public onCreateDataPublication() {
    const { title, abstract, datasetPids } = this.form;
    const metadata = {
      ...this.metadataData,
      landingPage: this.appConfig.landingPage,
    };

    // TODO: Fix the types here
    const publishedData: any = {
      title: title,
      abstract: abstract,
      datasetPids: datasetPids,
      metadata: metadata,
    };

    this._hasUnsavedChanges = false;

    this.store.dispatch(createDataPublicationAction({ data: publishedData }));
  }

  hasUnsavedChanges() {
    return this._hasUnsavedChanges;
  }
}
