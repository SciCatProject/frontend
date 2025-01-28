import { Component, inject, OnInit } from "@angular/core";
import { AppConfigService } from "app-config.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import {
  apiGetHealth,
  INGESTOR_API_ENDPOINTS_V1,
  PostDatasetEndpoint,
} from "./helper/ingestor-api-endpoints";
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
  connectedFacilityBackendVersion = "";
  connectingToFacilityBackend = false;
  ingestorHealthStatus = [];

  lastUsedFacilityBackends: string[] = [];

  transferDataSource: TransferDataListEntry[] = []; // List of files to be transferred
  displayedColumns: string[] = ["transferId", "status", "actions"];

  errorMessage = "";
  returnValue = "";

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  metadataExtractionStatus = "";

  constructor(
    public appConfigService: AppConfigService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private sseService: IngestorMetadataSSEService,
  ) {}

  ngOnInit() {
    this.connectingToFacilityBackend = true;
    this.lastUsedFacilityBackends = this.loadLastUsedFacilityBackends();
    this.transferDataSource = [];
    // Get the GET parameter 'backendUrl' from the URL
    this.route.queryParams.subscribe((params) => {
      const backendUrl = params["backendUrl"];
      if (backendUrl) {
        this.apiConnectToFacilityBackend(backendUrl);
      } else {
        this.connectingToFacilityBackend = false;
      }
    });
  }

  apiConnectToFacilityBackend(facilityBackendUrl: string): boolean {
    let facilityBackendUrlCleaned = facilityBackendUrl.slice();
    // Check if last symbol is a slash and add version endpoint
    if (!facilityBackendUrlCleaned.endsWith("/")) {
      facilityBackendUrlCleaned += "/";
    }

    const facilityBackendUrlVersion =
      facilityBackendUrlCleaned + INGESTOR_API_ENDPOINTS_V1.OTHER.VERSION;

    // Try to connect to the facility backend/version to check if it is available
    console.log("Connecting to facility backend: " + facilityBackendUrlVersion);
    this.http
      .get(facilityBackendUrlVersion, { withCredentials: true })
      .subscribe(
        (response) => {
          console.log("Connected to facility backend", response);
          // If the connection is successful, store the connected facility backend URL
          this.connectedFacilityBackend = facilityBackendUrlCleaned;
          this.connectingToFacilityBackend = false;
          this.connectedFacilityBackendVersion = response["version"];

          // TODO Do Health check
          apiGetHealth();
        },
        (error) => {
          this.errorMessage += `${new Date().toLocaleString()}: ${error.message}<br>`;
          console.error("Request failed", error);
          this.connectedFacilityBackend = "";
          this.connectingToFacilityBackend = false;
          this.lastUsedFacilityBackends = this.loadLastUsedFacilityBackends();
        },
      );

    return true;
  }

  apiGetTransferList(
    page: number,
    pageSize: number,
    transferId?: string,
  ): void {
    const params: any = {
      page: page.toString(),
      pageSize: pageSize.toString(),
    };
    if (transferId) {
      params.transferId = transferId;
    }
    this.http
      .get(this.connectedFacilityBackend + INGESTOR_API_ENDPOINTS_V1.TRANSFER, {
        params,
        withCredentials: true,
      })
      .subscribe(
        (response) => {
          console.log("Transfer list received", response);
          this.transferDataSource = response["transfers"];
        },
        (error) => {
          this.errorMessage += `${new Date().toLocaleString()}: ${error.type}]<br>`;
          console.error("Request failed", error);
        },
      );
  }

  apiUpload() {
    this.loading = true;

    const payload: PostDatasetEndpoint = {
      metaData: this.createNewTransferData.mergedMetaDataString,
    };

    this.http
      .post(this.connectedFacilityBackend + INGESTOR_API_ENDPOINTS_V1.DATASET, {
        payload,
        withCredentials: true,
      })
      .subscribe(
        (response) => {
          console.log("Upload successfully started", response);
          this.returnValue = JSON.stringify(response);
          this.loading = false;
        },
        (error) => {
          this.errorMessage += `${new Date().toLocaleString()}: ${error.message}]<br>`;
          console.error("Upload failed", error);
          this.loading = false;
        },
      );
  }

  async apiStartMetadataExtraction(): Promise<boolean> {
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
        // TODO Remove logging
        console.log("Received SSE data:", data);
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
        console.error("Error receiving SSE data:", error);
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
        this.apiConnectToFacilityBackend(this.forwardFacilityBackend);
        return;
      }

      this.router.navigate(["/ingestor"], {
        queryParams: { backendUrl: this.forwardFacilityBackend },
      });
    }
  }

  onClickDisconnectIngestor() {
    this.returnValue = "";
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
        this.apiStartMetadataExtraction()
          .then((response: boolean) => {
            if (response) console.log("Metadata extraction started");
            else console.error("Metadata extraction failed");
          })
          .catch((error) => {
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
            createNewTransferData: this.createNewTransferData,
            backendURL: this.connectedFacilityBackend,
          },
          disableClose: true,
        });
        break;
      case 4:
        this.apiUpload();
        break;
      default:
        console.error("Unknown step", step);
    }

    // Error if the dialog reference is not set
    if (dialogRef === null) return;
  }

  onClickRefreshTransferList(): void {
    this.apiGetTransferList(1, 100);
  }

  onCancelTransfer(transferId: string) {
    console.log("Cancel transfer", transferId);
    this.http
      .delete(
        this.connectedFacilityBackend +
          INGESTOR_API_ENDPOINTS_V1.TRANSFER +
          "/" +
          transferId,
        { withCredentials: true },
      )
      .subscribe(
        (response) => {
          console.log("Transfer cancelled", response);
          this.apiGetTransferList(1, 100);
        },
        (error) => {
          this.errorMessage += `${new Date().toLocaleString()}: ${error.message}<br>`;
          console.error("Cancel transfer failed", error);
        },
      );
  }

  openIngestorLogin(): void {
    window.location.href =
      this.connectedFacilityBackend + INGESTOR_API_ENDPOINTS_V1.AUTH.LOGIN;
  }
}
