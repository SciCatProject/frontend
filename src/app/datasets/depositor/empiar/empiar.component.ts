import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { JsonSchema } from "@jsonforms/core";
import { angularMaterialRenderers } from "@jsonforms/angular-material";
import { AppConfigService, AppConfigInterface } from "app-config.service";
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
import piAsset from "./schemasUI/piInfoUI.json";
import correspondingAuthorAsset from "./schemasUI/correspondingAuthorUI.json";
import citationAsset from "./schemasUI/citationUI.json";
import { EmpiarJson, camelToSnake, snakeToCamel } from "./depositionEMPIAR";
import { customEnumRenderer } from "./customRenderers/enumRenderer";
import { customNameControlRenderer } from "./customRenderers/authorRenderer";
import { customReferenceControlRenderer } from "./customRenderers/referenceRenderer";
import { customSemiEnumControlRenderer } from "./customRenderers/imageSetRenderer";

@Component({
  selector: "app-empiar",
  templateUrl: "./empiar.component.html",
  styleUrls: ["./empiar.component.scss"],
  standalone: false,
})
export class EmpiarComponent implements OnChanges, OnDestroy {
  @Input() dataset!: OutputDatasetObsoleteDto | undefined;
  @Input() user!: ReturnedUserDto | undefined;
  @Input() empiarSchemaEncoded!: string; 
  @Input() showFirstCard = true;

  // private subscriptions: Subscription[] = [];
  // dataset: OutputDatasetObsoleteDto | undefined;
  // user: ReturnedUserDto | undefined;
  form: FormGroup;
  data: JsonSchema = createEmptyInstance();
  schema: JsonSchema;

  config: AppConfigInterface;

  empiarSchema$: Observable<string>;
  empiarSchema: string;

  generalSchema = generalSchemaAsset;
  imageSets = imageSetsAssets;
  schemaPI = piAsset;
  schemaCorrespondingAuthor = correspondingAuthorAsset;
  citationSchema = citationAsset;

  configuredRenderer = [
    ...angularMaterialRenderers,
    customEnumRenderer,
    customNameControlRenderer,
    customReferenceControlRenderer,
    customSemiEnumControlRenderer,
  ];

  constructor(
    // public appConfigService: AppConfigService,
    // private store: Store,
    private fb: FormBuilder,
  ) {
    // this.config = this.appConfigService.getConfig();
    this.form = this.fb.group({
      email: [""],
    });
  }

  // ngOnInit() {
  //   // initialize an array for the files to be uploaded
  //   const pid = history.state.pid;
  //   this.store.dispatch(datasetActions.fetchDatasetAction({ pid }));
  //   this.store.select(selectCurrentDataset).subscribe((dataset) => {
  //     this.dataset = dataset;
  //   });
  //   this.subscriptions.push(
  //     this.store.select(selectCurrentUser).subscribe((user) => {
  //       if (user) {
  //         this.user = user;
  //       }
  //     }),
  //   );
  //   this.store.dispatch(fromActions.accessEmpiarSchema());
  //   this.empiarSchema$ = this.store.select(selectEmpiarSchema);

  //   this.empiarSchema$.subscribe((schema) => {
  //     if (schema) {
  //       this.empiarSchema = schema;
  //       try {
  //         const decodedSchema = atob(this.empiarSchema);
  //         this.schema = JSON.parse(decodedSchema);
  //       } catch (error) {
  //         console.error("Failed to decode schema:", error);
  //       }
  //     }
  //   });
  //   this.data = { ...this.data };
  //   this.data = camelToSnake(createEmptyInstance());
  // }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataset'] && this.dataset) {
      this.form.patchValue({
        metadata: this.dataset.scientificMetadata,
      });
    }

    if (changes['user'] && this.user) {
      this.form.patchValue({
        email: this.user.email,
      });
    }

    if (changes['empiarSchemaEncoded'] && this.empiarSchemaEncoded) {
      try {
        const decodedSchema = atob(this.empiarSchemaEncoded);
        this.schema = JSON.parse(decodedSchema);
      } catch (error) {
        console.error("Failed to decode schema:", error);
      }
    }
  }
  
  ngOnDestroy() {
    // this.subscriptions.forEach((subscription) => {
    //   subscription.unsubscribe();
    // });
  }
  onDataChange(event: EmpiarJson) {
    this.data = event;
  }

  onSubmitClick() {
    this.data = snakeToCamel(this.data);
    this.data["authors"].map((author) => {
      author["orderId"] = this.data["authors"].indexOf(author);
    });
    // to do create a json file based on entered data
    console.log(this.data);
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
    principalInvestigator: [
      {
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
    ],
    imagesets: [
      {
        name: "",
        directory: "",
        category: "",
        headerFormat: "",
        dataFormat: "",
        numImagesOrTiltSeries: 0,
        framesPerImage: 0,
        // frameRangeMin?: 0,
        // frameRangeMax?: 0,
        voxelType: "",
        // pixelWidth?: 0,
        // pixelHeight?: 0,
        // details?: "",
        // micrographsFilePattern?: "",
        // pickedParticlesFilePattern?: "",
        // pickedParticlesDirectory?: "",
        // imageWidth?: 0,
        // imageHeight?: 0,
      },
    ],
    citation: [
      {
        authors: [
          {
            name: "",
            orderId: 0,
            authorOrcid: "",
          },
        ],
        editors: [],
        published: false,
        preprint: false,
        jOrNjCitation: false,
        title: "",
        volume: null,
        country: null,
        firstPage: null,
        lastPage: null,
        year: null,
        language: null,
        doi: null,
        pubmedid: null,
        details: null,
        bookChapterTitle: null,
        publisher: null,
        publicationLocation: null,
        journal: null,
        journalAbbreviation: null,
        issue: null,
      },
    ],
  };
}