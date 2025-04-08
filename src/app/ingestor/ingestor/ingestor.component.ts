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
  TransferItem,
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
  ingestorInitialized = false;
  tokenValue: string;

  sourceFolder = "";
  loading = false;
  forwardFacilityBackend = "";

  connectedFacilityBackend = "";
  connectingToFacilityBackend = true;

  lastUsedFacilityBackends: string[] = [];

  transferDataInformation: GetTransferResponse = null;
  transferDetailInformation: TransferItem[] = [];
  transferAutoRefreshIntervalDetail = 3000;
  transferDataPageSize = 100;
  transferDataPageIndex = 0;
  transferDataPageSizeOptions = [5, 10, 25, 100];
  displayedColumns: string[] = [
    "transferId",
    "status",
    "message",
    "progress",
    "actions",
  ];

  versionInfo: OtherVersionResponse = null;
  userInfo: UserInfo = null;
  scicatUserProfile: any = null;
  authIsDisabled = false;
  healthInfo: OtherHealthResponse = null;

  errorMessage = "";

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  autoRefreshInterval: NodeJS.Timeout = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiManager: IngestorAPIManager,
    private sseService: IngestorMetadataSSEService,
    private store: Store,
  ) { }

  ngOnInit() {
    this.lastUsedFacilityBackends = this.loadLastUsedFacilityBackends();

    // Fetch the API token that the ingestor can authenticate to scicat as the user
    this.vm$.subscribe((settings) => {
      this.scicatUserProfile = settings.profile;
      this.tokenValue = settings.scicatToken;

      if (!this.ingestorInitialized) {
        this.ingestorInitialized = true;
        this.loadIngestorConfiguration();
      }

      if (this.tokenValue === "") {
        this.store.dispatch(fetchScicatTokenAction());
      }
    });
    this.store.dispatch(fetchCurrentUserAction());
  }

  loadIngestorConfiguration(): void {
    // Get the GET parameter 'backendUrl' from the URL
    this.route.queryParams.subscribe(async (params) => {
      const backendUrl = params["backendUrl"];
      const discovery = params["discovery"];

      if (discovery === "true" && !backendUrl) {
        const facilityUrl = await this.getFacilityURLByUserInfo();
        if (facilityUrl != null) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: { backendUrl: facilityUrl },
            queryParamsHandling: "",
          });
        }
      }

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
        this.errorMessage += `${new Date().toLocaleString()}: ${error.message}]<br>`;
        this.createNewTransferData.apiInformation.metaDataExtractionFailed =
          true;
        this.createNewTransferData.apiInformation.extractMetaDataRequested =
          false;
      },
    });

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
      '["https://ingestor.development.psi.ch", "http://localhost:8800", "http://localhost:8000", "http://localhost:8888" ]';
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

  resetExtractedMetadata(): void {
    this.createNewTransferData.extractorMetaData = {
      instrument: {},
      acquisition: {},
    };
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
            userInfo: this.userInfo,
          },
          disableClose: true,
        });

        break;
      case 1:
        this.resetExtractedMetadata();
        if (this.createNewTransferData.editorMode === "INGESTION") {
          this.startMetadataExtraction().catch((error) => {
            console.error("Metadata extraction error", error);
          });
        } else if (this.createNewTransferData.editorMode === "EDITOR") {
          this.createNewTransferData.apiInformation.extractorMetaDataReady =
            true;
        }

        dialogRef = this.dialog.open(IngestorUserMetadataDialogComponent, {
          data: {
            onClickNext: this.onClickNext.bind(this),
            createNewTransferData: this.createNewTransferData,
            backendURL: this.connectedFacilityBackend,
            userInfo: this.userInfo,
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
            userInfo: this.userInfo,
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
            userInfo: this.userInfo,
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

  async doRefreshTransferList(transferId?: string): Promise<void> {
    try {
      const response = await this.apiManager.getTransferList(
        this.transferDataPageIndex + 1,
        this.transferDataPageSize,
        transferId,
      );

      if (transferId && response.transfers.length > 0) {
        this.transferDetailInformation.push(response.transfers[0]);
      } else {
        this.transferDataInformation = response;
      }
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

  getTransferDetailInformation(transferId: string): string {
    const detailItem = this.transferDetailInformation.find(
      (item) => item.transferId === transferId,
    );
    if (detailItem) {
      let progressState = "";
      let progressPercent = 0;
      let fileState = "";

      if (detailItem.bytesTransferred && detailItem.bytesTotal) {
        const bytesToGB = (bytes: number) => (bytes / 1024 ** 3).toFixed();
        progressState = `${bytesToGB(detailItem.bytesTransferred)} / ${bytesToGB(detailItem.bytesTotal)} GB`;
        progressPercent =
          (detailItem.bytesTransferred / detailItem.bytesTotal) * 100;
      }

      if (
        detailItem.filesTransferred &&
        detailItem.filesTotal &&
        detailItem.filesTotal > 0
      ) {
        fileState = `${detailItem.filesTransferred} / ${detailItem.filesTotal} Files`;
      }

      return (
        "Progress: " +
        progressPercent +
        "%" +
        " - Data: " +
        progressState +
        " - Files: " +
        fileState
      );
    }
    return "No further information available.";
  }

  reloadTransferDetailInformation(transferId: string): void {
    this.doRefreshTransferList(transferId);
  }

  startAutoRefresh(transferId: string): void {
    this.reloadTransferDetailInformation(transferId);
    this.stopAutoRefresh();
    this.autoRefreshInterval = setInterval(() => {
      this.reloadTransferDetailInformation(transferId);
    }, this.transferAutoRefreshIntervalDetail);
  }

  stopAutoRefresh(): void {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
      this.autoRefreshInterval = null;
    }
  }

  async getFacilityURLByUserInfo(): Promise<string | null> {
    if (this.scicatUserProfile && this.scicatUserProfile.email) {
      const facilityEmail = this.scicatUserProfile.email;
      const facility = facilityEmail.split("@")[1] as string;

      try {
        const facilityName = facility.toLowerCase();
        //const discoveryJson = await this.apiManager.getAutodiscoveryList();
        //const discoveryList = JSON.parse(discoveryJson);
        console.log(facilityName);
        // TODO
        if (facilityName === "unibe.ch") {
          return "http://localhost:8888";
        }
      } catch (error) {
        this.errorMessage += `${new Date().toLocaleString()}: ${error.message}<br>`;
      }
    }
    return null;
  }
}
