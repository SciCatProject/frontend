import { Component, inject, OnInit } from "@angular/core";
import { HttpParams } from "@angular/common/http";
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
} from "./helper/ingestor.component-helper";
import { IngestorMetadataSSEService } from "./helper/ingestor.metadata-sse-service";
import { IngestorAPIManager } from "./helper/ingestor-api-manager";
import {
  UserInfo,
  OtherHealthResponse,
  OtherVersionResponse,
  PostDatasetRequest,
  GetTransferResponse,
} from "ingestor/model/models";
import { PageChangeEvent } from "shared/modules/table/table.component";
import { Store } from "@ngrx/store";
import {
  selectIsLoggedIn,
  selectUserSettingsPageViewModel,
} from "state-management/selectors/user.selectors";
import {
  fetchCurrentUserAction,
  fetchScicatTokenAction,
} from "state-management/actions/user.actions";

@Component({
  selector: "ingestor",
  templateUrl: "./ingestor.component.html",
  styleUrls: ["./ingestor.component.scss"],
})
export class IngestorComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  vm$ = this.store.select(selectUserSettingsPageViewModel);
  sciCatLoggedIn$ = this.store.select(selectIsLoggedIn);
  tokenValue: string;

  sourceFolder = "";
  loading = false;
  forwardFacilityBackend = "";

  connectedFacilityBackend = "";
  connectingToFacilityBackend = true;

  lastUsedFacilityBackends: string[] = [];

  transferDataInformation: GetTransferResponse = null;
  transferDataPageSize = 100;
  transferDataPageIndex = 0;
  transferDataPageSizeOptions = [5, 10, 25, 100];
  displayedColumns: string[] = ["transferId", "status", "actions"];

  versionInfo: OtherVersionResponse = null;
  userInfo: UserInfo = null;
  authIsDisabled = false;
  healthInfo: OtherHealthResponse = null;

  errorMessage = "";

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiManager: IngestorAPIManager,
    private sseService: IngestorMetadataSSEService,
    private store: Store,
  ) {}

  ngOnInit() {
    this.lastUsedFacilityBackends = this.loadLastUsedFacilityBackends();

    // Get the GET parameter 'backendUrl' from the URL
    this.route.queryParams.subscribe((params) => {
      const backendUrl = params["backendUrl"];
      if (backendUrl) {
        this.initializeIngestorConnection(backendUrl);
      } else {
        this.connectingToFacilityBackend = false;
      }
    });

    // Fetch the API token that the ingestor can authenticate to scicat as the user
    this.vm$.subscribe((settings) => {
      this.tokenValue = settings.scicatToken;

      if (this.tokenValue === "") {
        this.store.dispatch(fetchScicatTokenAction());
      }
    });
    this.store.dispatch(fetchCurrentUserAction());
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

    this.apiManager.connect(facilityBackendUrlCleaned, !this.authIsDisabled);

    this.connectedFacilityBackend = facilityBackendUrlCleaned;

    // Try to connect - get ingestor version
    try {
      this.versionInfo = await this.apiManager.getVersion();
    } catch (error) {
      this.errorMessage += `${new Date().toLocaleString()}: ${error.message}<br>`;
      this.connectedFacilityBackend = "";
      this.connectingToFacilityBackend = false;
      this.lastUsedFacilityBackends = this.loadLastUsedFacilityBackends();
      return false;
    }

    // If connected, get User Info
    try {
      this.userInfo = await this.apiManager.getUserInfo();
    } catch (error) {
      if (String(error.error).includes("disabled")) {
        this.authIsDisabled = true;
      } else {
        this.errorMessage += `${new Date().toLocaleString()}: ${error.message}<br>`;
      }
    }

    // Only refresh if the user is logged in or the auth is disabled
    if (this.authIsDisabled || this.userInfo.logged_in) {
      this.doRefreshTransferList();
    }

    // Get health state
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
      userToken: this.tokenValue,
    };

    try {
      const result = await this.apiManager.startIngestion(payload);
      if (result) {
        this.loading = false;
        this.doRefreshTransferList();
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
    this.createNewTransferData.apiInformation.metaDataExtractionFailed = false;

    if (this.createNewTransferData.apiInformation.extractMetaDataRequested) {
      return false;
    }

    this.createNewTransferData.apiInformation.extractorMetaDataReady = false;
    this.createNewTransferData.apiInformation.extractMetaDataRequested = true;

    const params = new HttpParams()
      .set("filePath", this.createNewTransferData.selectedPath)
      .set("methodName", this.createNewTransferData.selectedMethod.name);

    const sseUrl = `${this.connectedFacilityBackend + INGESTOR_API_ENDPOINTS_V1.METADATA}?${params.toString()}`;

    this.sseService.connect(sseUrl);

    this.sseService.getMessages().subscribe(
      (data) => {
        //console.log("Received SSE data:", data);
        this.createNewTransferData.apiInformation.extractorMetaDataStatus =
          data.message;

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
          this.createNewTransferData.apiInformation.extractorMetaDataReady =
            true;
        } else if (data.error) {
          this.createNewTransferData.apiInformation.metaDataExtractionFailed =
            true;
          this.createNewTransferData.apiInformation.extractMetaDataRequested =
            false;
          this.createNewTransferData.apiInformation.extractorMetaDataStatus =
            data.message;
        }
      },
      (error) => {
        console.error("Error receiving SSE data:", error);
        this.errorMessage += `${new Date().toLocaleString()}: ${error.message}]<br>`;
        this.createNewTransferData.apiInformation.metaDataExtractionFailed =
          true;
        this.createNewTransferData.apiInformation.extractMetaDataRequested =
          false;
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
        this.createNewTransferData.apiInformation.extractMetaDataRequested =
          false;
        this.createNewTransferData.apiInformation.extractorMetaDataReady =
          false;
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

  async doRefreshTransferList(): Promise<void> {
    try {
      this.transferDataInformation = await this.apiManager.getTransferList(
        this.transferDataPageIndex + 1,
        this.transferDataPageSize,
      );
    } catch (error) {
      this.errorMessage += `${new Date().toLocaleString()}: ${error.message}<br>`;
    }
  }

  async onCancelTransfer(transferId: string) {
    try {
      await this.apiManager.cancelTransfer(transferId);
      this.doRefreshTransferList();
    } catch (error) {
      this.errorMessage += `${new Date().toLocaleString()}: ${error.message}<br>`;
    }
  }

  onTransferPageChange(event: PageChangeEvent): void {
    this.transferDataPageIndex = event.pageIndex;
    this.transferDataPageSize = event.pageSize;
    this.doRefreshTransferList();
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
