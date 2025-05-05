import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  IngestionRequestInformation,
  IngestorHelper,
} from "./helper/ingestor.component-helper";
import {
  UserInfo,
  OtherHealthResponse,
  OtherVersionResponse,
  GetTransferResponse,
} from "shared/sdk/models/ingestor/models";
import { PageChangeEvent } from "shared/modules/table/table.component";
import { Store } from "@ngrx/store";
import {
  selectIsLoggedIn,
  selectUserSettingsPageViewModel,
} from "state-management/selectors/user.selectors";
import { fetchCurrentUserAction } from "state-management/actions/user.actions";
import * as fromActions from "state-management/actions/ingestor.actions";
import {
  selectIngestorStatus,
  selectIngestorAuth,
  selectIngestorConnecting,
  selectIngestorEndpoint,
  selectIngestorTransferList,
  selectIngestorTransferListRequestOptions,
} from "state-management/selectors/ingestor.selector";
import { IngestorCreationDialogBaseComponent } from "ingestor/ingestor-dialogs/creation-dialog/ingestor.creation-dialog-base.component";
import { INGESTOR_API_ENDPOINTS_V1 } from "shared/sdk/apis/ingestor.service";
import { Subscription } from "rxjs";

@Component({
  selector: "ingestor",
  templateUrl: "./ingestor.component.html",
  styleUrls: ["./ingestor.component.scss"],
})
export class IngestorComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  readonly dialog = inject(MatDialog);

  vm$ = this.store.select(selectUserSettingsPageViewModel);
  sciCatLoggedIn$ = this.store.select(selectIsLoggedIn);
  ingestorStatus$ = this.store.select(selectIngestorStatus);
  ingestorAuthInfo$ = this.store.select(selectIngestorAuth);
  ingestorConnecting$ = this.store.select(selectIngestorConnecting);
  ingestorBackend$ = this.store.select(selectIngestorEndpoint);
  transferList$ = this.store.select(selectIngestorTransferList);
  selectIngestorTransferListRequestOptions$ = this.store.select(
    selectIngestorTransferListRequestOptions,
  );

  sourceFolder = "";
  forwardFacilityBackend = "";
  selectedTab = 1;

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

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  autoRefreshInterval: NodeJS.Timeout = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
  ) { }

  ngOnInit() {
    this.lastUsedFacilityBackends = this.loadLastUsedFacilityBackends();

    // Fetch the API token that the ingestor can authenticate to scicat as the user
    this.subscriptions.push(
      this.vm$.subscribe((settings) => {
        this.scicatUserProfile = settings.profile;
      }),
    );

    this.subscriptions.push(
      this.ingestorBackend$.subscribe((ingestorBackend) => {
        if (ingestorBackend) {
          this.connectedFacilityBackend = ingestorBackend;
        }
      }),
    );

    this.subscriptions.push(
      this.transferList$.subscribe((transferList) => {
        if (transferList) {
          this.transferDataInformation = transferList;
        }
      }),
    );

    this.subscriptions.push(
      this.selectIngestorTransferListRequestOptions$.subscribe(
        (requestOptions) => {
          if (requestOptions) {
            this.transferDataPageIndex = requestOptions.page;
            this.transferDataPageSize = requestOptions.pageNumber;
          }
        },
      ),
    );

    this.loadIngestorConfiguration();
    this.store.dispatch(fetchCurrentUserAction());
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  async loadIngestorConfiguration(): Promise<void> {
    // Get the GET parameter 'backendUrl' from the URL
    this.subscriptions.push(
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
      }),
    );
  }

  async initializeIngestorConnection(): Promise<void> {
    this.store.dispatch(fromActions.connectIngestor());

    this.subscriptions.push(
      this.ingestorConnecting$.subscribe((connecting) => {
        this.connectingToFacilityBackend = connecting;
      }),
    );

    this.subscriptions.push(
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
      }),
    );

    this.subscriptions.push(
      this.ingestorAuthInfo$.subscribe((authInfo) => {
        if (authInfo) {
          this.userInfo = authInfo.userInfoResponse;
          this.authIsDisabled = authInfo.authIsDisabled;

          // Only refresh if the user is logged in or the auth is disabled
          if (this.authIsDisabled || this.userInfo.logged_in) {
            // Activate Transfer Tab when ingestor is ready for actions
            this.selectedTab = 0;
            this.doRefreshTransferList();
          }
        }
      }),
    );
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
    // Clean the current ingestion object
    this.store.dispatch(
      fromActions.updateIngestionObject({
        ingestionObject: IngestorHelper.createEmptyRequestInformation(),
      }),
    );

    this.dialog.closeAll();

    let dialogRef = null;
    dialogRef = this.dialog.open(IngestorCreationDialogBaseComponent, {
      disableClose: true,
    });

    // Error if the dialog reference is not set
    if (dialogRef === null) return;
  }

  doRefreshTransferList(
    transferId?: string,
    page?: number,
    pageNumber?: number,
  ): void {
    this.store.dispatch(
      fromActions.updateTransferList({
        transferId,
        page: page ? page + 1 : undefined,
        pageNumber: pageNumber,
      }),
    );
  }

  onCancelTransfer(transferId: string) {
    this.store.dispatch(
      fromActions.cancelTransfer({
        transferId: transferId,
      }),
    );
    this.doRefreshTransferList();
  }

  onTransferPageChange(event: PageChangeEvent): void {
    this.doRefreshTransferList(undefined, event.pageIndex, event.pageSize);
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
    //this.doRefreshTransferList(transferId);
    /*this.stopAutoRefresh();
    this.autoRefreshInterval = setInterval(() => {
      this.doRefreshTransferList(transferId);
    }, this.transferAutoRefreshIntervalDetail);*/
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
        console.error("Error fetching autodiscovery list", error);
      }
    }
    return null;
  }
}
