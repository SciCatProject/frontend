import { Component, inject, OnInit } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { INGESTOR_API_ENDPOINTS_V1 } from "./helper/ingestor-api-endpoints";
import { IngestorNewTransferDialogComponent } from "../ingestor-dialogs/creation-dialog/ingestor.new-transfer-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { IngestorUserMetadataDialogComponent } from "../ingestor-dialogs/creation-dialog/ingestor.user-metadata-dialog.component";
import { IngestorExtractorMetadataDialogComponent } from "../ingestor-dialogs/creation-dialog/ingestor.extractor-metadata-dialog.component";
import { IngestorConfirmTransferDialogComponent } from "../ingestor-dialogs/creation-dialog/ingestor.confirm-transfer-dialog.component";
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
} from "shared/sdk/models/ingestor/models";
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
import * as fromActions from "state-management/actions/ingestor.actions";
import {
  selectIngestorStatus,
  selectIngestorAuth,
  selectIngestorConnecting,
  selectIngestorEndpoint,
  selectIngestorTransferList,
} from "state-management/selectors/ingestor.selector";

@Component({
  selector: "ingestor",
  templateUrl: "./ingestor.component.html",
  styleUrls: ["./ingestor.component.scss"],
})
export class IngestorComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  vm$ = this.store.select(selectUserSettingsPageViewModel);
  sciCatLoggedIn$ = this.store.select(selectIsLoggedIn);
  ingestorStatus$ = this.store.select(selectIngestorStatus);
  ingestorAuthInfo$ = this.store.select(selectIngestorAuth);
  ingestorConnecting$ = this.store.select(selectIngestorConnecting);
  ingestorBackend$ = this.store.select(selectIngestorEndpoint);
  transferList$ = this.store.select(selectIngestorTransferList);

  tokenValue: string;

  sourceFolder = "";
  forwardFacilityBackend = "";

  connectedFacilityBackend = "";
  connectingToFacilityBackend = true;

  lastUsedFacilityBackends: string[] = [];

  transferDataInformation: GetTransferResponse = null;
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
  userInfo: UserInfo | null = null;
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
  ) {}

  ngOnInit() {
    this.lastUsedFacilityBackends = this.loadLastUsedFacilityBackends();

    // Fetch the API token that the ingestor can authenticate to scicat as the user
    this.vm$.subscribe((settings) => {
      this.scicatUserProfile = settings.profile;
      this.tokenValue = settings.scicatToken;

      if (this.tokenValue === "") {
        this.store.dispatch(fetchScicatTokenAction());
      }
    });

    this.ingestorBackend$.subscribe((ingestorBackend) => {
      if (ingestorBackend) {
        this.connectedFacilityBackend = ingestorBackend;
      }
    });

    this.transferList$.subscribe((transferList) => {
      if (transferList) {
        this.transferDataInformation = transferList;
      }
    });

    this.loadIngestorConfiguration();
    this.store.dispatch(fetchCurrentUserAction());
  }

  async loadIngestorConfiguration(): Promise<void> {
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
        // backendUrl should not end with a slash
        const facilityBackendUrlCleaned = backendUrl.replace(/\/$/, "");

        await this.store.dispatch(
          fromActions.setIngestorEndpoint({
            ingestorEndpoint: facilityBackendUrlCleaned,
          }),
        );

        this.initializeIngestorConnection();
      } else {
        this.connectingToFacilityBackend = false;
      }
    });
  }

  async initializeIngestorConnection(): Promise<void> {
    this.store.dispatch(fromActions.connectIngestor());

    this.ingestorConnecting$.subscribe((connecting) => {
      this.connectingToFacilityBackend = connecting;
    });

    this.ingestorStatus$.subscribe((ingestorStatus) => {
      if (!ingestorStatus.validEndpoint) {
        this.connectedFacilityBackend = "";
        this.lastUsedFacilityBackends = this.loadLastUsedFacilityBackends();
      } else if (
        ingestorStatus.versionResponse &&
        ingestorStatus.healthResponse
      ) {
        this.versionInfo = ingestorStatus.versionResponse;
        this.healthInfo = ingestorStatus.healthResponse;
      }
    });

    this.ingestorAuthInfo$.subscribe((authInfo) => {
      if (authInfo) {
        this.userInfo = authInfo.userInfoResponse;
        this.authIsDisabled = authInfo.authIsDisabled;

        // Only refresh if the user is logged in or the auth is disabled
        if (this.authIsDisabled || this.userInfo.logged_in) {
          this.doRefreshTransferList();
        }
      }
    });
  }

  async ingestDataset(): Promise<boolean> {
    const payload: PostDatasetRequest = {
      metaData: this.createNewTransferData.mergedMetaDataString,
      userToken: this.tokenValue,
    };

    try {
      const result = await this.apiManager.startIngestion(payload);
      if (result) {
        this.doRefreshTransferList();
        return true;
      }
    } catch (error) {
      this.errorMessage += `${new Date().toLocaleString()}: ${error.message}<br>`;
      throw error;
    }

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
      this.router.navigate(["/ingestor"], {
        queryParams: { backendUrl: this.forwardFacilityBackend },
      });
    }
  }

  onClickDisconnectIngestor() {
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

  doRefreshTransferList(transferId?: string): void {
    this.store.dispatch(
      fromActions.updateTransferList({
        transferId,
        page: this.transferDataPageIndex + 1,
        pageNumber: this.transferDataPageSize,
      }),
    );
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
      this.connectedFacilityBackend +
      "/" +
      INGESTOR_API_ENDPOINTS_V1.AUTH.LOGIN;
  }

  openIngestorLogout(): void {
    window.location.href =
      this.connectedFacilityBackend +
      "/" +
      INGESTOR_API_ENDPOINTS_V1.AUTH.LOGOUT;
  }

  getTransferDetailInformation(transferId: string): string {
    const detailItem = this.transferDataInformation.transfers?.find(
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

  startAutoRefresh(transferId: string): void {
    this.doRefreshTransferList(transferId);
    this.stopAutoRefresh();
    this.autoRefreshInterval = setInterval(() => {
      this.doRefreshTransferList(transferId);
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
