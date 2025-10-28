import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { AppConfigService, AppConfigInterface } from "app-config.service";
import { ActivatedRoute } from "@angular/router";
import { JsonSchema } from "@jsonforms/core";
import { Store } from "@ngrx/store";
import {
  OutputDatasetObsoleteDto,
  ReturnedUserDto,
} from "@scicatproject/scicat-sdk-ts-angular";
import { selectCurrentDataset } from "state-management/selectors/datasets.selectors";
// import {
//   selectIsAdmin,
//   selectIsLoading,
//   selectIsLoggedIn,
//   selectProfile,
// } from "state-management/selectors/user.selectors";
import { selectCurrentUser } from "state-management/selectors/user.selectors";
import * as fromActions from "state-management/actions/depositor.actions";
import { accessEmpiarSchema } from "state-management/actions/depositor.actions";
import { selectEmpiarSchema } from "state-management/selectors/depositor.selectors";

import { updatePropertyAction } from "state-management/actions/datasets.actions";

import * as ingestorActions from "state-management/actions/ingestor.actions";
import { GetExtractorResponse, MethodItem } from "../../shared/sdk/models/ingestor/models"

// import { IngestorMetadataEditorComponent} from "../../ingestor/ingestor-metadata-editor/ingestor-metadata-editor.component"

import { Observable, Subscription, take, find } from "rxjs";
import { Router } from "@angular/router";

interface DepositionRepository {
  value: string;
  viewValue: string;
}

@Component({
  selector: "depositor",
  templateUrl: "./depositor.component.html",
  styleUrls: ["./depositor.component.scss"],
  standalone: false,
})
export class DepositorComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  form: FormGroup;

  config: AppConfigInterface;
  supportedDepositionList: DepositionRepository[] = [
    { value: "onedep", viewValue: "OneDep" },
    { value: "empiar", viewValue: "EMPIAR" },
  ];
  depositionRepository: FormControl;
  dataset: OutputDatasetObsoleteDto | undefined;
  user: ReturnedUserDto | undefined;

  
  selectedMethod: string | null = null;
  onedepLink: {
    location: string;
    enabled: boolean;
  } | null = null;

  empiarSchemaEncoded:string | undefined;
  showMetadataEditor = false;

  metadata: any = {}; 
  metadataSchema: JsonSchema = null


  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
    private fb: FormBuilder,
  ) {
    this.config = this.appConfigService.getConfig();
    this.depositionRepository = new FormControl("");
    this.form = this.fb.group({
      datasetName: new FormControl("", [Validators.required]),
      description: new FormControl("", [Validators.required]),
      keywords: this.fb.array([]),
    });
  }
  ngOnInit() {
    this.store.dispatch(fromActions.connectToDepositor());

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
    this.store.select(selectCurrentDataset).subscribe((dataset) => {
      this.dataset = dataset;
      if (dataset) {
        this.metadata = this.dataset.scientificMetadata;
      }
        // this.metadataSchema = this.dataset.scientificMetadataSchema?||null;
    });

    this.store.dispatch(accessEmpiarSchema());
    this.subscriptions.push(
      this.store.select(selectEmpiarSchema).subscribe((schema) => {
        this.empiarSchemaEncoded = schema;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  onChooseRepo() {
    this.selectedMethod = this.depositionRepository.value;
  }
 async onChangeScientificMetadata() {
  const selectedMethod = "https://raw.githubusercontent.com/osc-em/OSCEM_Schemas/refs/heads/main/project/spa/jsonschema/oscem_schemas_spa.schema.json";
  
  try {
    // Fetch the JSON file
    const response = await fetch(selectedMethod);
    const parsedSchema: JsonSchema = await response.json();
    this.metadataSchema = parsedSchema;
    
    // now it uses metadata structure in place of schema 
    this.showMetadataEditor = true;
  } catch (error) {
    console.error('Failed to load schema:', error);
    // Handle error appropriately
  }
}
  onMetadataChange(newData: any) {
    this.metadata= newData;
  }

  onMetadataErrors(errors: any[]) {
    console.warn('Metadata validation errors:', errors);
  }


  onUpdateIngestorMetadata() {
    const pid = this.dataset.pid;
    const property = { scientificMetadata: this.metadata };
    this.store.dispatch(updatePropertyAction({ pid, property }));

    this.showMetadataEditor = false // hide again after the form was submitted
  }

}