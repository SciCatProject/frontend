import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, OnDestroy, OnInit, signal } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { angularMaterialRenderers } from "@jsonforms/angular-material";
import { Store } from "@ngrx/store";
import {
  Attachment,
  PublishedData,
} from "@scicatproject/scicat-sdk-ts-angular";
import { AppConfigService } from "app-config.service";
import { EditableComponent } from "app-routing/pending-changes.guard";
import { isEmpty } from "lodash-es";
import { fromEvent, Observable, Subscription } from "rxjs";
import { tap } from "rxjs/operators";
import {
  AccordionArrayLayoutRendererComponent,
  accordionArrayLayoutRendererTester,
} from "shared/modules/jsonforms-custom-renderers/expand-panel-renderer/accordion-array-layout-renderer.component";
import {
  fetchPublishedDataAction,
  fetchPublishedDataConfigAction,
  resyncPublishedDataAction,
} from "state-management/actions/published-data.actions";
import {
  selectCurrentPublishedData,
  selectPublishedDataConfig,
} from "state-management/selectors/published-data.selectors";

@Component({
  selector: "publisheddata-edit",
  templateUrl: "./publisheddata-edit.component.html",
  styleUrls: ["./publisheddata-edit.component.scss"],
  standalone: false,
})
export class PublisheddataEditComponent
  implements OnInit, OnDestroy, EditableComponent {
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
  ) { }

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
    if (data.creators) {
      for (let creator of data.creators) {
        this.computeFullName(creator);
      }
    }
    this.metadataData = data;
    if (JSON.stringify(data) !== this.initialMetadata) {
      this._hasUnsavedChanges = true;
    }
  }

  private computeFullName(person: { name?: string, givenName?: string, familyName?: string }) {
    person.name =
      person.givenName && person.familyName
        ? `${person.familyName}, ${person.givenName}`
        : person.givenName || person.familyName || person.name;
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
          let updatedMetadata = publishedData.metadata;
          updatedMetadata["relatedItems"] = publishedData.datasetPids.map(pid => {
            return {
              relatedItemType: "Other",
              relationType: "References",
              relatedItemIdentifier: {
                relatedItemIdentifierType: "URL",
                relatedItemIdentifier: `${window.location.protocol}//${window.location.host}/datasets/${encodeURIComponent(pid)}`,
              },
            }
          })
          if (updatedMetadata["publicationYear"] && !updatedMetadata["dates"]) {
            updatedMetadata["dates"] = [
              {
                date: `${publishedData.metadata["publicationYear"]}`,
                dateType: "Available"
              }
            ]
          }
          else {
            updatedMetadata["dates"] = [
              {
                date: `${new Date().getFullYear()}`,
                dateType: "Available"
              }
            ]
          }

          updatedMetadata["language"] = "en";
          updatedMetadata["publisher"] = {
            name: "PSI Open Data Provider",
            publisherIdentifierScheme: "re3data",
            schemeUri: "https://re3data.org/",
            publisherIdentifier: "https://www.re3data.org/repository/r3d100013504",
            lang: "en"
          };
          updatedMetadata["rightsList"] = [
            {
              rights: "Creative Commons Attribution Share Alike 4.0 International",
              rightsUri: "https://creativecommons.org/licenses/by-sa/4.0/",
              schemeUri: "https://spdx.org/licenses/",
              rightsIdentifier: "CC-BY-SA-4.0",
              rightsIdentifierScheme: "SPDX",
              lang: "en"
            }
          ]
          this.metadataData = updatedMetadata;
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
