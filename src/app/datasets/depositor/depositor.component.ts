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
import { selectIngestorExtractionMethods} from "state-management/selectors/ingestor.selector";

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
  metadataSchema: JsonSchema = null// ideally i get the schema by uid?

  methods$: Observable<MethodItem[]> = this.store.select(selectIngestorExtractionMethods)["methods"];

  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
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

  onChangeIngestorMetadata(){
    this.store.dispatch(ingestorActions.getExtractionMethods({ page: 0, pageNumber: 50 }));
    this.methods$.pipe(
      take(1),
    ).subscribe(methods => {
      const selectedMethod = methods.find(m => m.name === 'Single Particle'); // that's bad, need to use an actual schema from elsewhere!
      if (selectedMethod) {
        const parsedSchema: JsonSchema = JSON.parse(selectedMethod.schema);
        this.metadataSchema = parsedSchema;
      }
    });
    // now it uses metadata tructure in place of schema 
    this.showMetadataEditor = true
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