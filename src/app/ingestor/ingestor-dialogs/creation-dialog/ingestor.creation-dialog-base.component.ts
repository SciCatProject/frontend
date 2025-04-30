import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  DialogDataObject,
  IngestionRequestInformation,
  IngestorHelper,
  ScientificMetadata,
} from "../../ingestor-page/helper/ingestor.component-helper";
import {
  selectIngestionObject,
  selectIngestorEndpoint,
} from "state-management/selectors/ingestor.selector";
import { Store } from "@ngrx/store";
import { IngestorMetadataSSEService } from "ingestor/ingestor-page/helper/ingestor.metadata-sse-service";
import { HttpParams } from "@angular/common/http";
import { PostDatasetRequest } from "shared/sdk/models/ingestor/models";
import * as fromActions from "state-management/actions/ingestor.actions";
import { selectUserSettingsPageViewModel } from "state-management/selectors/user.selectors";
import { fetchScicatTokenAction } from "state-management/actions/user.actions";
import { INGESTOR_API_ENDPOINTS_V1 } from "shared/sdk/apis/ingestor.service";

export type dialogStep =
  | "NEW_TRANSFER"
  | "USER_METADATA"
  | "EXTRACTOR_METADATA"
  | "CONFIRM_TRANSFER";

@Component({
  selector: "ingestor.creation-dialog-base",
  templateUrl: "ingestor.creation-dialog-base.html",
  styleUrls: ["../../ingestor-page/ingestor.component.scss"],
})
export class IngestorCreationDialogBaseComponent implements OnInit {
  vm$ = this.store.select(selectUserSettingsPageViewModel);

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  ingestionObject$ = this.store.select(selectIngestionObject);
  ingestorBackend$ = this.store.select(selectIngestorEndpoint);

  currentDialogStep: dialogStep = "NEW_TRANSFER";
  connectedFacilityBackend = "";
  tokenValue = "";

  constructor(
    public dialog: MatDialog,
    private store: Store,
    private sseService: IngestorMetadataSSEService,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataObject,
  ) {}

  ngOnInit() {
    this.ingestionObject$.subscribe((ingestionObject) => {
      if (ingestionObject) {
        this.createNewTransferData = ingestionObject;
      }
    });

    this.ingestorBackend$.subscribe((ingestorBackend) => {
      if (ingestorBackend) {
        this.connectedFacilityBackend = ingestorBackend;
      }
    });

    // Fetch the API token that the ingestor can authenticate to scicat as the user
    this.vm$.subscribe((settings) => {
      this.tokenValue = settings.scicatToken;

      if (this.tokenValue === "") {
        this.store.dispatch(fetchScicatTokenAction());
      }
    });
  }

  resetExtractedMetadata(): void {
    this.createNewTransferData.extractorMetaData = {
      instrument: {},
      acquisition: {},
    };
  }

  async startMetadataExtraction(): Promise<boolean> {
    this.createNewTransferData.apiInformation.metaDataExtractionFailed = false;

    if (this.createNewTransferData.apiInformation.extractMetaDataRequested) {
      return false;
    }

    this.createNewTransferData.apiInformation.extractorMetaDataReady = false;
    this.createNewTransferData.apiInformation.extractMetaDataRequested = true;

    const params = new HttpParams()
      .set("filePath", this.createNewTransferData.selectedPath)
      .set("methodName", this.createNewTransferData.selectedMethod.name);

    const sseUrl = `${this.connectedFacilityBackend + "/" + INGESTOR_API_ENDPOINTS_V1.METADATA}?${params.toString()}`;
    this.sseService.connect(sseUrl);
    this.sseService.getMessages().subscribe({
      next: (data) => {
        //console.log("Received SSE data:", data);
        this.createNewTransferData.apiInformation.extractorMetaDataStatus =
          data.message;
        this.createNewTransferData.apiInformation.extractorMetadataProgress =
          data.progress;

        if (data.result) {
          this.createNewTransferData.apiInformation.extractorMetaDataReady =
            true;
          const extractedScientificMetadata = JSON.parse(
            data.resultMessage,
          ) as ScientificMetadata;

          this.createNewTransferData.extractorMetaData.instrument =
            extractedScientificMetadata.instrument ?? {};
          this.createNewTransferData.extractorMetaData.acquisition =
            extractedScientificMetadata.acquisition ?? {};
        } else if (data.error) {
          this.createNewTransferData.apiInformation.metaDataExtractionFailed =
            true;
          this.createNewTransferData.apiInformation.extractMetaDataRequested =
            false;
          this.createNewTransferData.apiInformation.extractorMetaDataStatus =
            data.message;
          this.createNewTransferData.apiInformation.extractorMetadataProgress =
            data.progress;
        }
      },
      error: (error) => {
        console.error("Error receiving SSE data:", error);
        this.createNewTransferData.apiInformation.metaDataExtractionFailed =
          true;
        this.createNewTransferData.apiInformation.extractMetaDataRequested =
          false;
      },
    });

    return true;
  }

  onClickNext(nextStep: dialogStep): void {
    switch (nextStep) {
      case "NEW_TRANSFER":
        this.resetExtractedMetadata();
        break;
      case "USER_METADATA":
        this.createNewTransferData.apiInformation.extractMetaDataRequested =
          false;
        this.createNewTransferData.apiInformation.extractorMetaDataReady =
          false;

        if (this.createNewTransferData.editorMode === "INGESTION") {
          this.startMetadataExtraction().catch((error) => {
            console.error("Metadata extraction error", error);
          });
        } else if (this.createNewTransferData.editorMode === "EDITOR") {
          this.createNewTransferData.apiInformation.extractorMetaDataReady =
            true;
        }

        break;
      case "EXTRACTOR_METADATA":
        break;
      case "CONFIRM_TRANSFER":
        break;
      default:
        console.error("Unknown step", nextStep);
        return;
    }
    this.currentDialogStep = nextStep;
  }

  onClickStartIngestion(): void {
    const payload: PostDatasetRequest = {
      metaData: this.createNewTransferData.mergedMetaDataString,
      userToken: this.tokenValue,
    };

    this.store.dispatch(
      fromActions.ingestDataset({
        ingestionDataset: payload,
      }),
    );
  }
}
