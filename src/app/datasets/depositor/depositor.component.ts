import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
} from "@angular/forms";
import { AppConfigService, AppConfig } from "app-config.service";
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

import * as ingestorActions from "state-management/actions/ingestor.actions";
import { MethodItem } from "../../shared/sdk/models/ingestor/models"
import { selectExtractionMethods} from "state-management/selectors/ingestor.selector";

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

  config: AppConfig;
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

  methods$: Observable<MethodItem[]> = this.store.select(selectExtractionMethods);

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
    this.store.dispatch(ingestorActions.getExtractionMethods({ page: 1, pageNumber: 10 }));

    this.methods$.pipe(
      take(1),
    ).subscribe(methods => {
      const selectedMethod = methods.find(m => m.name === 'spa');
      if (selectedMethod) {
        const parsedSchema: JsonSchema = JSON.parse(selectedMethod.schema);
        this.metadataSchema = parsedSchema;
        this.showMetadataEditor = false; //needs tuning
      }
    });

    this.showMetadataEditor = true
    console.log("Ingestor metadata changes");
  }

  onMetadataChange(newData: any) {
    this.metadata= newData;
  }

  onMetadataErrors(errors: any[]) {
    console.warn('Metadata validation errors:', errors);
  }

}
