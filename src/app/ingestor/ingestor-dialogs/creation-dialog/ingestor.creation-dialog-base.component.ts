import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  APIInformation,
  DialogDataObject,
  IngestionRequestInformation,
  IngestorHelper,
  ScientificMetadata,
} from "../../ingestor-page/helper/ingestor.component-helper";
import {
  selectIngestionObjectAPIInformation,
  selectIngestionObject,
  selectIngestorEndpoint,
  selectNoRightsError,
} from "state-management/selectors/ingestor.selectors";
import { Store } from "@ngrx/store";
import { IngestorMetadataSSEService } from "ingestor/ingestor-page/helper/ingestor.metadata-sse-service";
import { HttpParams } from "@angular/common/http";
import { PostDatasetRequest } from "shared/sdk/models/ingestor/models";
import * as fromActions from "state-management/actions/ingestor.actions";
import * as datasetActions from "state-management/actions/datasets.actions";
import { selectUserSettingsPageViewModel } from "state-management/selectors/user.selectors";
import { fetchScicatTokenAction } from "state-management/actions/user.actions";
import { INGESTOR_API_ENDPOINTS_V1 } from "shared/sdk/apis/ingestor.service";
import { Subscription } from "rxjs";

export type dialogStep =
  | "NEW_TRANSFER"
  | "USER_METADATA"
  | "EXTRACTOR_METADATA"
  | "CONFIRM_TRANSFER"
  | "CUSTOM_METADATA" // Only in Creation Editor Mode
  | "SCICAT_METADATA"; // Only in Creation Editor Mode

@Component({
  selector: "ingestor.creation-dialog-base",
  templateUrl: "ingestor.creation-dialog-base.html",
  styleUrls: ["../../ingestor-page/ingestor.component.scss"],
  standalone: false,
})
export class IngestorCreationDialogBaseComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  vm$ = this.store.select(selectUserSettingsPageViewModel);

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();
  createNewTransferDataApiInformation: APIInformation =
    IngestorHelper.createEmptyAPIInformation();

  ingestionObject$ = this.store.select(selectIngestionObject);
  ingestionObjectApiInformation$ = this.store.select(
    selectIngestionObjectAPIInformation,
  );
  ingestorBackend$ = this.store.select(selectIngestorEndpoint);
  selectNoRightsError$ = this.store.select(selectNoRightsError);

  showNoRightsDialog = false;
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
    this.subscriptions.push(
      this.ingestionObject$.subscribe((ingestionObject) => {
        if (ingestionObject) {
          this.createNewTransferData = ingestionObject;
        }
      }),
    );

    this.subscriptions.push(
      this.ingestionObjectApiInformation$.subscribe((apiInformation) => {
        if (apiInformation) {
          this.createNewTransferDataApiInformation = apiInformation;
        }
      }),
    );

    this.subscriptions.push(
      this.ingestorBackend$.subscribe((ingestorBackend) => {
        if (ingestorBackend) {
          this.connectedFacilityBackend = ingestorBackend.facilityBackend;
        }
      }),
    );

    // Fetch the API token that the ingestor can authenticate to scicat as the user
    this.subscriptions.push(
      this.vm$.subscribe((settings) => {
        this.tokenValue = settings.scicatToken;

        if (this.tokenValue === "") {
          this.store.dispatch(fetchScicatTokenAction());
        }
      }),
    );

    this.subscriptions.push(
      this.selectNoRightsError$.subscribe((selectNoRightsError) => {
        this.showNoRightsDialog = selectNoRightsError;
      }),
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  resetScientificMetadata(): void {
    this.createNewTransferData.extractorMetaData = {
      instrument: {},
      acquisition: {},
    };

    this.createNewTransferData.userMetaData = {
      organizational: {},
      sample: {},
    };

    this.createNewTransferData.selectedMethod = { name: "", schema: "" };

    this.store.dispatch(
      fromActions.updateIngestionObject({
        ingestionObject: this.createNewTransferData,
      }),
    );
  }

  async startMetadataExtraction(): Promise<boolean> {
    this.createNewTransferDataApiInformation.metaDataExtractionFailed = false;

    if (this.createNewTransferDataApiInformation.extractMetaDataRequested) {
      return false;
    }

    this.createNewTransferDataApiInformation.extractorMetaDataReady = false;
    this.createNewTransferDataApiInformation.extractMetaDataRequested = true;

    this.store.dispatch(
      fromActions.updateIngestionObjectAPIInformation({
        ingestionObjectApiInformation: this.createNewTransferDataApiInformation,
      }),
    );

    const params = new HttpParams()
      .set("filePath", this.createNewTransferData.selectedPath)
      .set("methodName", this.createNewTransferData.selectedMethod.name);

    const sseUrl = `${this.connectedFacilityBackend + "/" + INGESTOR_API_ENDPOINTS_V1.METADATA}?${params.toString()}`;
    this.sseService.connect(sseUrl);
    this.subscriptions.push(
      this.sseService.getMessages().subscribe({
        next: (data) => {
          //console.log("Received SSE data:", data);
          this.createNewTransferDataApiInformation.extractorMetaDataStatus =
            data.message;
          this.createNewTransferDataApiInformation.extractorMetadataProgress =
            data.progress;

          if (data.result) {
            this.createNewTransferDataApiInformation.extractorMetaDataReady = true;
            const extractedScientificMetadata = JSON.parse(
              data.resultMessage,
            ) as ScientificMetadata;

            this.createNewTransferData.extractorMetaData.instrument =
              extractedScientificMetadata.instrument ?? {};
            this.createNewTransferData.extractorMetaData.acquisition =
              extractedScientificMetadata.acquisition ?? {};

            this.store.dispatch(
              fromActions.updateIngestionObject({
                ingestionObject: this.createNewTransferData,
              }),
            );
          } else if (data.error) {
            this.createNewTransferDataApiInformation.metaDataExtractionFailed = true;
            this.createNewTransferDataApiInformation.extractMetaDataRequested = false;
            this.createNewTransferDataApiInformation.extractorMetaDataStatus =
              data.message;
            this.createNewTransferDataApiInformation.extractorMetadataProgress =
              data.progress;
          }

          this.store.dispatch(
            fromActions.updateIngestionObjectAPIInformation({
              ingestionObjectApiInformation:
                this.createNewTransferDataApiInformation,
            }),
          );
        },
        error: (error) => {
          console.error("Error receiving SSE data:", error);
          this.createNewTransferDataApiInformation.metaDataExtractionFailed = true;
          this.createNewTransferDataApiInformation.extractMetaDataRequested = false;

          this.store.dispatch(
            fromActions.updateIngestionObjectAPIInformation({
              ingestionObjectApiInformation:
                this.createNewTransferDataApiInformation,
            }),
          );
        },
      }),
    );

    return true;
  }

  onClickNext(nextStep: dialogStep): void {
    switch (nextStep) {
      case "NEW_TRANSFER":
        this.resetScientificMetadata();

        // Reset metadata extractor
        this.sseService.disconnect();
        this.createNewTransferDataApiInformation.extractMetaDataRequested = false;
        this.createNewTransferDataApiInformation.extractorMetaDataReady = false;
        this.store.dispatch(
          fromActions.updateIngestionObjectAPIInformation({
            ingestionObjectApiInformation:
              this.createNewTransferDataApiInformation,
          }),
        );
        break;
      case "USER_METADATA":
        if (this.createNewTransferData.editorMode === "INGESTION") {
          this.startMetadataExtraction().catch((error) => {
            console.error("Metadata extraction error", error);
          });
        } else if (
          this.createNewTransferData.editorMode === "EDITOR" ||
          this.createNewTransferData.editorMode === "CREATION"
        ) {
          this.createNewTransferDataApiInformation.extractorMetaDataReady = true;
          this.store.dispatch(
            fromActions.updateIngestionObjectAPIInformation({
              ingestionObjectApiInformation:
                this.createNewTransferDataApiInformation,
            }),
          );
        }

        break;
      case "EXTRACTOR_METADATA":
        break;
      case "CONFIRM_TRANSFER":
        break;
      case "SCICAT_METADATA":
        break;
      case "CUSTOM_METADATA":
        break;
      default:
        console.error("Unknown step", nextStep);
        return;
    }
    this.currentDialogStep = nextStep;
  }

  onClickStartIngestion(): void {
    if (this.createNewTransferData.editorMode === "CREATION") {
      this.store.dispatch(
        datasetActions.addDatasetAction({
          dataset: JSON.parse(this.createNewTransferData.mergedMetaDataString),
        }),
      );
    } else if (this.createNewTransferData.editorMode === "INGESTION") {
      const payload: PostDatasetRequest = {
        metaData: this.createNewTransferData.mergedMetaDataString,
        userToken: this.tokenValue,
        autoArchive: this.createNewTransferData.autoArchive,
      };

      this.store.dispatch(
        fromActions.ingestDataset({
          ingestionDataset: payload,
        }),
      );
    }
  }
}
