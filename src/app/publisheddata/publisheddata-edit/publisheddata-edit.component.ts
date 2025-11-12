import { Component, OnDestroy, OnInit, signal } from "@angular/core";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Store } from "@ngrx/store";
import {
  fetchPublishedDataAction,
  fetchPublishedDataConfigAction,
  resyncPublishedDataAction,
} from "state-management/actions/published-data.actions";
import { ActivatedRoute, Router } from "@angular/router";
import {
  selectCurrentPublishedData,
  selectPublishedDataConfig,
} from "state-management/selectors/published-data.selectors";
import {
  Attachment,
  PublishedData,
} from "@scicatproject/scicat-sdk-ts-angular";
import { tap } from "rxjs/operators";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { fromEvent, Observable, Subscription } from "rxjs";
import { angularMaterialRenderers } from "@jsonforms/angular-material";
import { EditableComponent } from "app-routing/pending-changes.guard";
import { isEmpty } from "lodash-es";
import { AppConfigService } from "app-config.service";
import {
  AccordionArrayLayoutRendererComponent,
  accordionArrayLayoutRendererTester,
} from "shared/modules/jsonforms-custom-renderers/expand-panel-renderer/accordion-array-layout-renderer.component";

@Component({
  selector: "publisheddata-edit",
  templateUrl: "./publisheddata-edit.component.html",
  styleUrls: ["./publisheddata-edit.component.scss"],
})
export class PublisheddataEditComponent
  implements OnInit, OnDestroy, EditableComponent
{
  private _hasUnsavedChanges = false;
  private publishedDataConfig$ = this.store.select(selectPublishedDataConfig);
  renderers = [
    ...angularMaterialRenderers,
    {
      tester: accordionArrayLayoutRendererTester,
      renderer: AccordionArrayLayoutRendererComponent,
    },
  ];
  schema: any = {};
  uiSchema: any = {};
  metadataData: any = {};
  public metadataFormErrors = [];
  readonly panelOpenState = signal(false);
  routeSubscription = new Subscription();
  publishedData$: Observable<PublishedData> = new Observable();
  attachments: Attachment[] = [];

  form: FormGroup = this.formBuilder.group({
    doi: [""],
    title: ["", Validators.required],
    abstract: ["", Validators.required],
    datasetPids: [[""], Validators.minLength(1)],
  });

  public separatorKeysCodes: number[] = [ENTER, COMMA];
  publishedDataConfigSubscription: Subscription;
  beforeUnloadSubscription: Subscription;
  formValueChangesSubscription: Subscription;
  initialMetadata: string;
  appConfig = this.appConfigService.getConfig();

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    private appConfigService: AppConfigService,
  ) {}

  public onPublishedDataUpdate(shouldRedirect = false) {
    if (this.form.valid) {
      const { doi, ...rest } = this.form.value;
      const metadata = {
        ...this.metadataData,
        landingPage: this.appConfig.landingPage,
      };

      if (
        shouldRedirect &&
        this.panelOpenState() &&
        !this.metadataDataIsValid()
      ) {
        return;
      }

      if (doi) {
        this.store.dispatch(
          resyncPublishedDataAction({
            doi,
            data: { ...rest, metadata },
            redirect: shouldRedirect,
          }),
        );
      }

      this._hasUnsavedChanges = false;
    }
  }

  public onCancel() {
    const doi = this.form.get("doi")!.value;
    if (doi) {
      const encodedDoi = encodeURIComponent(doi);
      this.router.navigateByUrl("/publishedDatasets/" + encodedDoi);
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
    if (JSON.stringify(data) !== this.initialMetadata) {
      this._hasUnsavedChanges = true;
    }
  }

  hasUnsavedChanges() {
    return this._hasUnsavedChanges;
  }

  ngOnInit() {
    this.store.dispatch(fetchPublishedDataConfigAction());

    this.routeSubscription = this.route.params.subscribe(({ id }) =>
      this.store.dispatch(fetchPublishedDataAction({ id })),
    );

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
        }
      },
    );

    this.publishedData$ = this.store.select(selectCurrentPublishedData).pipe(
      tap((publishedData) => {
        this.form.patchValue(publishedData);
        this.initialMetadata = JSON.stringify(this.form.value);

        if (publishedData?.metadata) {
          this.initialMetadata = JSON.stringify(publishedData.metadata);
          this.metadataData = publishedData.metadata;
        }
      }),
    );

    // Prevent user from reloading page if there are unsave changes
    this.beforeUnloadSubscription = fromEvent(window, "beforeunload").subscribe(
      (event) => {
        if (this.hasUnsavedChanges()) {
          event.preventDefault();
        }
      },
    );

    this.formValueChangesSubscription = this.form.valueChanges.subscribe(() => {
      if (this.form.dirty) {
        this._hasUnsavedChanges = true;
      }
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    this.publishedDataConfigSubscription.unsubscribe();
    this.beforeUnloadSubscription.unsubscribe();
    this.formValueChangesSubscription.unsubscribe();
  }
}
