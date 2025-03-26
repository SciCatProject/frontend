import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { JsonSchema } from "@jsonforms/core";
import { angularMaterialRenderers } from "@jsonforms/angular-material";
import { AppConfigService, AppConfig } from "app-config.service";
import { Store, select } from "@ngrx/store";
import {
  OutputDatasetObsoleteDto,
  ReturnedUserDto,
} from "@scicatproject/scicat-sdk-ts";
import { selectCurrentDataset } from "state-management/selectors/datasets.selectors";
import { selectCurrentUser } from "state-management/selectors/user.selectors";
import { selectEmpiarSchema } from "state-management/selectors/depositor.selectors";
import * as fromActions from "state-management/actions/depositor.actions";
import { Subscription, Observable } from "rxjs";
import * as datasetActions from "state-management/actions/datasets.actions";
import { FormGroup, FormBuilder } from "@angular/forms";
import generalSchemaAsset from "./schemasUI/generalQuestionUI.json";
import imageSetsAssets from "./schemasUI/imageSetsUI.json";
import piAsset from "./schemasUI/authorInfoUI.json";
import citationAsset from "./schemasUI/citationUI.json";
import {EmpiarJson, ReleaseDate, ExperimentType, GetEnumTitles} from "./depositionEMPIAR";
import { customEnumRenderer } from "./customRenderers/rendererGeneral";

@Component({
  selector: "app-empiar",
  templateUrl: "./empiar.component.html",
  styleUrls: ["./empiar.component.scss"],
})
export class EmpiarComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  form: FormGroup;
  config: AppConfig;
  dataset: OutputDatasetObsoleteDto | undefined;
  user: ReturnedUserDto | undefined;

  empiarSchema$: Observable<string>;
  empiarSchema: string;
  data: JsonSchema = createEmptyInstance();
  schema: JsonSchema;

  // materialRenderers = angularMaterialRenderers;
  generalSchema = generalSchemaAsset;
  imageSets = imageSetsAssets;
  schemaPI = piAsset;
  citationSchema = citationAsset;
  releaseDateTitles = Object.values(ReleaseDate);  

  configuredRenderer = [
    // releaseDateRendererEntry,
    // emdbRefRendererEntry,
    ...angularMaterialRenderers,
    customEnumRenderer
  ];

  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
    private fb: FormBuilder,
  ) {
    this.config = this.appConfigService.getConfig();
    this.form = this.fb.group({
      email: [""],
    });
  }

  ngOnInit() {
    // initialize an array for the files to be uploaded
    const pid = history.state.pid;
    this.store.dispatch(datasetActions.fetchDatasetAction({ pid }));
    this.store.select(selectCurrentDataset).subscribe((dataset) => {
      this.dataset = dataset;
    });

    this.subscriptions.push(
      this.store.select(selectCurrentUser).subscribe((user) => {
        if (user) {
          this.user = user;
        }
      }),
    );
    this.store.dispatch(fromActions.accessEmpiarSchema());
    this.empiarSchema$ = this.store.pipe(select(selectEmpiarSchema));

    this.empiarSchema$.subscribe((schema) => {
      if (schema) {
        this.empiarSchema = schema;
        try {
          const decodedSchema = atob(this.empiarSchema);
          this.schema = JSON.parse(decodedSchema);
        } catch (error) {
          console.error("Failed to decode schema:", error);
        }
      }
    });
    this.data = { ...this.data };
    this.updateReleaseDateControl();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
  onDataChange(event: any) {
    this.data = event;
    console.log(event, this.data)
  }

  onSubmitClick() {
    console.log(this.data);
  }
 
  updateReleaseDateControl() {
    const releaseDateControl = this.findControlInSchema(this.generalSchema, '#/properties/release_date');

    if (releaseDateControl) {
      releaseDateControl.options = releaseDateControl.options || {};
      releaseDateControl.options.enum = Object.keys(ReleaseDate); // Enum values (short codes)
      releaseDateControl.options.enumTitles = Object.values(ReleaseDate); // Enum titles (human-readable)
    }
  }

  findControlInSchema(schema: any, scope: string) {
    // Recursive function to find the control based on scope
    if (schema.scope === scope) {
      return schema;
    }
    if (schema.elements) {
      for (const element of schema.elements) {
        const result = this.findControlInSchema(element, scope);
        if (result) return result;
      }
    }
    return null;
  }

}

function createEmptyInstance(): EmpiarJson {
  return {
    title: "",
    release_date: null,
    experiment_type: null,
    scale: undefined,
    crossReferences: [],
    biostudiesReferences: [],
    idrReferences: [],
    empiarReferences: [],
    workflows: [],
    authors: [],
    correspondingAuthor: {
      author_orcid: null,
      first_name: "",
      middle_name: null,
      last_name: "",
      organization: "",
      street: null,
      town_or_city: "",
      state_or_province: null,
      post_or_zip: "",
      telephone: null,
      fax: null,
      email: "",
      country: null, 
    },
    principalInvestigator: [],
    imagesets: [],
    citations: [],
  };
}


// authors and pi render propoerly
// good-looking renderers