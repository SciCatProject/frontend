import { Component, inject, OnInit } from "@angular/core";
import { AppConfigService } from "app-config.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { INGESTOR_API_ENDPOINTS_V1 } from "./helper/ingestor-api-endpoints";
import { IngestorNewTransferDialogComponent } from "./dialog/ingestor.new-transfer-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { IngestorUserMetadataDialogComponent } from "./dialog/ingestor.user-metadata-dialog.component";
import { IngestorExtractorMetadataDialogComponent } from "./dialog/ingestor.extractor-metadata-dialog.component";
import { IngestorConfirmTransferDialogComponent } from "./dialog/ingestor.confirm-transfer-dialog.component";
import {
  IngestionRequestInformation,
  IngestorHelper,
  ScientificMetadata,
  TransferDataListEntry,
} from "./helper/ingestor.component-helper";
import { IngestorMetadataSSEService } from "./helper/ingestor.metadata-sse-service";
import { IngestorAPIManager } from "./helper/ingestor-api-manager";
import {
  UserInfo,
  OtherHealthResponse,
  OtherVersionResponse,
  PostDatasetRequest,
} from "ingestor/model/models";

@Component({
  selector: "ingestor",
  templateUrl: "./ingestor.component.html",
  styleUrls: ["./ingestor.component.scss"],
})
export class IngestorComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  sourceFolder = "";
  loading = false;
  forwardFacilityBackend = "";

  connectedFacilityBackend = "";
  connectingToFacilityBackend = true;

  lastUsedFacilityBackends: string[] = [];

  transferDataSource: TransferDataListEntry[] = []; // List of files to be transferred
  displayedColumns: string[] = ["transferId", "status", "actions"];

  versionInfo: OtherVersionResponse = null;
  userInfo: UserInfo = null;
  healthInfo: OtherHealthResponse = null;

  errorMessage = "";

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  metadataExtractionStatus = "";

  constructor(
    public appConfigService: AppConfigService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private apiManager: IngestorAPIManager,
    private sseService: IngestorMetadataSSEService,
  ) { }

  ngOnInit() {
    this.lastUsedFacilityBackends = this.loadLastUsedFacilityBackends();
    this.transferDataSource = [];

    // Get the GET parameter 'backendUrl' from the URL
    this.route.queryParams.subscribe((params) => {
      const backendUrl = params["backendUrl"];
      if (backendUrl) {
        this.initializeIngestorConnection(backendUrl);
      } else {
        this.connectingToFacilityBackend = false;
      }
    });
  }

  async initializeIngestorConnection(
    facilityBackendUrl: string,
  ): Promise<boolean> {
    this.connectingToFacilityBackend = true;
    let facilityBackendUrlCleaned = facilityBackendUrl.slice();
    // Check if last symbol is a slash and add version endpoint
    if (!facilityBackendUrlCleaned.endsWith("/")) {
      facilityBackendUrlCleaned += "/";
    }

    this.apiManager.connect(facilityBackendUrlCleaned);

    this.connectedFacilityBackend = facilityBackendUrlCleaned;

    try {
      this.versionInfo = await this.apiManager.getVersion();
    } catch (error) {
      this.errorMessage += `${new Date().toLocaleString()}: ${error.message}<br>`;
      this.connectedFacilityBackend = "";
      this.connectingToFacilityBackend = false;
      this.lastUsedFacilityBackends = this.loadLastUsedFacilityBackends();
      return false;
    }

    try {
      this.userInfo = await this.apiManager.getUserInfo();
    } catch (error) {
      this.errorMessage += `${new Date().toLocaleString()}: ${error.message}<br>`;
    }

    try {
      this.healthInfo = await this.apiManager.getHealth();
    } catch (error) {
      this.errorMessage += `${new Date().toLocaleString()}: ${error.message}<br>`;
    }

    this.connectingToFacilityBackend = false;
    return true;
  }

  async ingestDataset(): Promise<boolean> {
    this.loading = true;

    const payload: PostDatasetRequest = {
      metaData: this.createNewTransferData.mergedMetaDataString,
    };

    try {
      const result = await this.apiManager.startIngestion(payload);
      if (result) {
        this.loading = false;
        this.onClickRefreshTransferList();
        return true;
      }
    } catch (error) {
      this.errorMessage += `${new Date().toLocaleString()}: ${error.message}<br>`;
      this.loading = false;
      throw error;
    }

    this.loading = false;
    return false;
  }

  async startMetadataExtraction(): Promise<boolean> {
    this.createNewTransferData.apiErrorInformation.metaDataExtraction = false;

    if (this.createNewTransferData.extractMetaDataRequested) {
      console.log(
        this.createNewTransferData.extractMetaDataRequested,
        " already requested",
      ); // Debugging
      return false;
    }

    this.createNewTransferData.extractorMetaDataReady = false;
    this.createNewTransferData.extractMetaDataRequested = true;

    const params = new HttpParams()
      .set("filePath", this.createNewTransferData.selectedPath)
      .set("methodName", this.createNewTransferData.selectedMethod.name);

    const sseUrl = `${this.connectedFacilityBackend + INGESTOR_API_ENDPOINTS_V1.METADATA}?${params.toString()}`;

    this.sseService.connect(sseUrl);

    this.sseService.getMessages().subscribe(
      (data) => {
        //console.log("Received SSE data:", data);
        if (data.result) {
          this.createNewTransferData.extractorMetaDataReady = true;
          const extractedScientificMetadata = JSON.parse(
            data.resultMessage,
          ) as ScientificMetadata;

          this.createNewTransferData.extractorMetaData.instrument =
            extractedScientificMetadata.instrument ?? {};
          this.createNewTransferData.extractorMetaData.acquisition =
            extractedScientificMetadata.acquisition ?? {};
          this.createNewTransferData.extractorMetaDataReady = true;
        }
      },
      (error) => {
        //console.error("Error receiving SSE data:", error);
        this.errorMessage += `${new Date().toLocaleString()}: ${error.message}]<br>`;
        this.createNewTransferData.apiErrorInformation.metaDataExtraction =
          true;
      },
    );

    return true;
  }

  onClickForwardToIngestorPage() {
    if (this.forwardFacilityBackend) {
      this.connectingToFacilityBackend = true;

      // If current route is equal to the forward route, the router will not navigate to the new route
      if (this.connectedFacilityBackend === this.forwardFacilityBackend) {
        this.initializeIngestorConnection(this.forwardFacilityBackend);
        return;
      }

      this.router.navigate(["/ingestor"], {
        queryParams: { backendUrl: this.forwardFacilityBackend },
      });
    }
  }

  onClickDisconnectIngestor() {
    this.connectedFacilityBackend = "";
    // Remove the GET parameter 'backendUrl' from the URL
    this.router.navigate(["/ingestor"]);
  }

  // Helper functions
  onClickSelectFacilityBackend(facilityBackend: string) {
    this.forwardFacilityBackend = facilityBackend;
  }

  loadLastUsedFacilityBackends(): string[] {
    // Load the list from the local Storage
    const lastUsedFacilityBackends =
      '["http://localhost:8000", "http://localhost:8888"]';
    if (lastUsedFacilityBackends) {
      return JSON.parse(lastUsedFacilityBackends);
    }
    return [];
  }

  clearErrorMessage(): void {
    this.errorMessage = "";
  }

  onClickAddIngestion(): void {
    this.createNewTransferData = IngestorHelper.createEmptyRequestInformation();
    this.onClickNext(0); // Open first dialog to start the ingestion process
  }

  onClickNext(step: number): void {
    this.dialog.closeAll();

    let dialogRef = null;

    switch (step) {
      case 0:
        this.createNewTransferData.extractMetaDataRequested = false;
        this.createNewTransferData.extractorMetaDataReady = false;
        dialogRef = this.dialog.open(IngestorNewTransferDialogComponent, {
          data: {
            onClickNext: this.onClickNext.bind(this),
            createNewTransferData: this.createNewTransferData,
            backendURL: this.connectedFacilityBackend,
          },
          disableClose: true,
        });

        break;
      case 1:
        this.startMetadataExtraction().catch((error) => {
          console.error("Metadata extraction error", error);
        });

        dialogRef = this.dialog.open(IngestorUserMetadataDialogComponent, {
          data: {
            onClickNext: this.onClickNext.bind(this),
            createNewTransferData: this.createNewTransferData,
            backendURL: this.connectedFacilityBackend,
          },
          disableClose: true,
        });
        break;
      case 2:
        dialogRef = this.dialog.open(IngestorExtractorMetadataDialogComponent, {
          data: {
            onClickNext: this.onClickNext.bind(this),
            createNewTransferData: this.createNewTransferData,
            backendURL: this.connectedFacilityBackend,
          },
          disableClose: true,
        });
        break;
      case 3:
        dialogRef = this.dialog.open(IngestorConfirmTransferDialogComponent, {
          data: {
            onClickNext: this.onClickNext.bind(this),
            onStartUpload: this.ingestDataset.bind(this),
            createNewTransferData: this.createNewTransferData,
            backendURL: this.connectedFacilityBackend,
          },
          disableClose: true,
        });
        break;
      case 4:
        break;
      default:
        console.error("Unknown step", step);
    }

    // Error if the dialog reference is not set
    if (dialogRef === null) return;
  }

  async onClickRefreshTransferList(): Promise<void> {
    try {
      const transferList = await this.apiManager.getTransferList(1, 100);
      this.transferDataSource = transferList;
    } catch (error) {
      this.errorMessage += `${new Date().toLocaleString()}: ${error.message}<br>`;
    }
  }

  async onCancelTransfer(transferId: string) {
    try {
      await this.apiManager.cancelTransfer(transferId);
      this.onClickRefreshTransferList();
    } catch (error) {
      this.errorMessage += `${new Date().toLocaleString()}: ${error.message}<br>`;
    }
  }

  openIngestorLogin(): void {
    window.location.href =
      this.connectedFacilityBackend + INGESTOR_API_ENDPOINTS_V1.AUTH.LOGIN;
  }

  openIngestorLogout(): void {
    window.location.href =
      this.connectedFacilityBackend + INGESTOR_API_ENDPOINTS_V1.AUTH.LOGOUT;
  }
}
