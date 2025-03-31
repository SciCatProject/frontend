import { Component, OnDestroy, OnInit } from "@angular/core";
import { JsonSchema } from "@jsonforms/core";
import { angularMaterialRenderers } from "@jsonforms/angular-material";
import { AppConfigService, AppConfig } from "app-config.service";
import { Store, select } from "@ngrx/store";
import {
  OutputDatasetObsoleteDto,
  ReturnedUserDto,
} from "@scicatproject/scicat-sdk-ts-angular";
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
import { EmpiarJson, camelToSnake, snakeToCamel } from "./depositionEMPIAR";
import { customEnumRenderer } from "./customRenderers/enumRenderer";
import { customNameControlRenderer } from "./customRenderers/authorRenderer";
import { customReferenceControlRenderer } from "./customRenderers/referenceRenderer";

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

  generalSchema = generalSchemaAsset;
  imageSets = imageSetsAssets;
  schemaPI = piAsset;
  citationSchema = citationAsset;
  configuredRenderer = [
    ...angularMaterialRenderers,
    customEnumRenderer,
    customNameControlRenderer,
    customReferenceControlRenderer,
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
    console.log("generalSchema", this.generalSchema);
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
    this.data = camelToSnake(this.dataset || createEmptyInstance());
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
  onDataChange(event: EmpiarJson) {
    this.data = event;
  }

  onSubmitClick() {
    this.data = snakeToCamel(this.data);
    this.data["authors"].map((author) => {
      author["orderId"] = this.data["authors"].indexOf(author);
    });
    console.log("Data changed:", this.data);
  }
}

function createEmptyInstance(): EmpiarJson {
  return {
    title: "",
    releaseDate: null,
    experimentType: null,
    scale: undefined,
    crossReferences: [{ name: "EMD-" }],
    biostudiesReferences: [],
    idrReferences: [],
    empiarReferences: [],
    workflows: [],
    authors: [
      {
        name: "",
        orderId: 0,
        authorOrcid: null,
      },
    ],
    correspondingAuthor: {
      authorOrcid: null,
      firstName: "",
      middleName: null,
      lastName: "",
      organization: "",
      street: null,
      townOrCity: "",
      stateOrProvince: null,
      postOrZip: "",
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
