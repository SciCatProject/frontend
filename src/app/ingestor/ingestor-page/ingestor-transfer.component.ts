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
} from "state-management/selectors/ingestor.selectors";
import { IngestorCreationDialogBaseComponent } from "ingestor/ingestor-dialogs/creation-dialog/ingestor.creation-dialog-base.component";
import { INGESTOR_API_ENDPOINTS_V1 } from "shared/sdk/apis/ingestor.service";
import { Subscription } from "rxjs";
import { IngestorConfirmationDialogComponent } from "ingestor/ingestor-dialogs/confirmation-dialog/ingestor.confirmation-dialog.component";
import { IngestorTransferViewDialogComponent } from "ingestor/ingestor-dialogs/transfer-detail-view/ingestor.transfer-detail-view-dialog.component";
import { fetchScicatTokenAction } from "state-management/actions/user.actions";
import { AppConfigService } from "app-config.service";

@Component({
  selector: "ingestor-transfer",
  templateUrl: "./ingestor-transfer.component.html",
  styleUrls: ["./ingestor.component.scss"],
  standalone: false,
})
export class IngestorTransferComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  readonly dialog = inject(MatDialog);
  appConfig = this.appConfigService.getConfig();

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
  noRightsError = false;

  lastUsedFacilityBackends: string[] = [];

  transferDataInformation: GetTransferResponse = null;
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
  tokenValue = "";

  createNewTransferData: IngestionRequestInformation =
    IngestorHelper.createEmptyRequestInformation();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store,
    public appConfigService: AppConfigService,
  ) {}

  ngOnInit() {
    this.lastUsedFacilityBackends =
      IngestorHelper.loadConnectionsFromLocalStorage();

    // Fetch the API token that the ingestor can authenticate to scicat as the user
    this.subscriptions.push(
      this.vm$.subscribe((settings) => {
        this.scicatUserProfile = settings.profile;
        this.tokenValue = settings.scicatToken;

        if (this.tokenValue === "") {
          this.store.dispatch(fetchScicatTokenAction());
        }
      }),
    );

    this.subscriptions.push(
      this.ingestorBackend$.subscribe((ingestorBackend) => {
        if (ingestorBackend !== null && ingestorBackend !== undefined) {
          this.connectedFacilityBackend = ingestorBackend;
        }
      }),
    );

    this.subscriptions.push(
      this.transferList$.subscribe((transferList) => {
        if (transferList !== null && transferList !== undefined) {
          this.transferDataInformation = transferList;
        }
      }),
    );

    this.subscriptions.push(
      this.selectIngestorTransferListRequestOptions$.subscribe(
        (requestOptions) => {
          if (requestOptions !== null && requestOptions !== undefined) {
            this.transferDataPageIndex = requestOptions.page;
            this.transferDataPageSize = requestOptions.pageNumber;
          }
        },
      ),
    );

    this.subscriptions.push(
      this.ingestorConnecting$.subscribe((connecting) => {
        this.connectingToFacilityBackend = connecting;
      }),
    );

    this.subscriptions.push(
      this.ingestorStatus$.subscribe((ingestorStatus) => {
        if (
          ingestorStatus.validEndpoint !== null &&
          !ingestorStatus.validEndpoint
        ) {
          this.connectedFacilityBackend = "";
          this.lastUsedFacilityBackends =
            IngestorHelper.loadConnectionsFromLocalStorage();
          this.onClickForwardToIngestorPage();
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
          } // In case of loosing the connection to the ingestor, the user is logged out
          else if (this.userInfo == null || this.userInfo.logged_in === false) {
            this.selectedTab = 1;
          }
        }
      }),
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

          this.store.dispatch(
            fromActions.setIngestorEndpoint({
              ingestorEndpoint: facilityBackendUrlCleaned,
            }),
          );

          this.store.dispatch(fromActions.connectIngestor());
        } else {
          this.connectingToFacilityBackend = false;
        }
      }),
    );
  }

  onClickForwardToIngestorPage(nextFacilityBackend?: string) {
    if (nextFacilityBackend) {
      IngestorHelper.saveConnectionsToLocalStorage([
        ...this.lastUsedFacilityBackends,
        nextFacilityBackend,
      ]);

      this.router.navigate(["/ingestor"], {
        queryParams: { backendUrl: nextFacilityBackend },
      });
    } else {
      this.router.navigate(["/ingestor"]);
    }
  }

  onClickDisconnectIngestor() {
    // Reset state of the ingestor component
    this.store.dispatch(fromActions.resetIngestorComponent());
    // Remove the GET parameter 'backendUrl' from the URL
    this.router.navigate(["/ingestor"]);
  }

  // Helper functions
  onClickSelectFacilityBackend(facilityBackend: string) {
    this.forwardFacilityBackend = facilityBackend;
  }

  onClickDeleteStoredFacilityBackend(facilityBackend: string) {
    const filteredFacilityBackends = this.lastUsedFacilityBackends.filter(
      (backend) => backend !== facilityBackend,
    );

    IngestorHelper.saveConnectionsToLocalStorage(filteredFacilityBackends);
    this.lastUsedFacilityBackends = filteredFacilityBackends;
  }

  onClickAddIngestion(): void {
    // Clean the current ingestion object
    this.store.dispatch(fromActions.resetIngestionObject({}));
    this.dialog.closeAll();

    let dialogRef = null;
    dialogRef = this.dialog.open(IngestorCreationDialogBaseComponent, {
      disableClose: true,
      width: "75vw",
    });

    // Error if the dialog reference is not set
    if (dialogRef === null) return;
  }

  doRefreshTransferList(page?: number, pageNumber?: number): void {
    this.store.dispatch(
      fromActions.updateTransferList({
        transferId: undefined,
        page: page ? page + 1 : undefined,
        pageNumber: pageNumber,
      }),
    );
  }

  onCancelTransfer(transferId: string) {
    const dialogRef = this.dialog.open(IngestorConfirmationDialogComponent, {
      data: {
        header: "Confirm deletion",
        message: "Cancel the transfer and remove it from the list?",
      },
    });

    const dialogSub = dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.store.dispatch(
          fromActions.cancelTransfer({
            requestBody: {
              transferId: transferId,
              scicatToken: this.tokenValue,
            },
          }),
        );
      }
      dialogSub.unsubscribe();
    });
  }

  onTransferPageChange(event: PageChangeEvent): void {
    this.doRefreshTransferList(event.pageIndex, event.pageSize);
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

  onOpenDetailView(transferId: string): void {
    const dialogRef = this.dialog.open(IngestorTransferViewDialogComponent, {
      data: {
        transferId: transferId,
      },
    });

    const dialogSub = dialogRef.afterClosed().subscribe(() => {
      this.doRefreshTransferList();
      dialogSub.unsubscribe();
    });
  }

  async getFacilityURLByUserInfo(): Promise<string | null> {
    if (this.scicatUserProfile && this.scicatUserProfile.email) {
      const userEmail = this.scicatUserProfile.email;
      const facility = userEmail.split("@")[1]?.toLowerCase();

      const discoveryList = this.appConfig.ingestorComponent.ingestorAutodiscoveryOptions;

      if (discoveryList) {
        for (const discovery of discoveryList) {
          const escapedDomain = discovery.mailDomain
            .toLowerCase()
            .replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const domainPattern = new RegExp(`^([\\w-]+\\.)*${escapedDomain}$`); // <any.sub.domain.uni.ch>
          if (domainPattern.test(facility)) {
            return discovery.facilityBackend;
          }
        }
      }
    }
    return null;
  }
}
