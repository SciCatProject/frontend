import { DOCUMENT } from "@angular/common";
import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { Store } from "@ngrx/store";
import {
  fetchCurrentUserAction,
  logoutAction,
} from "state-management/actions/user.actions";
import {
  selectIsLoggedIn,
  selectCurrentUserName,
  selectThumbnailPhoto,
} from "state-management/selectors/user.selectors";
import { selectDatasetsInBatchIndicator } from "state-management/selectors/datasets.selectors";
import { AppConfigService, OAuth2Endpoint } from "app-config.service";
import { Router, NavigationEnd } from "@angular/router";
import { NomadViewerService } from "shared/services/nomad-buttons-service";
import { filter, Subscription } from "rxjs";

@Component({
  selector: "app-app-header",
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.scss"],
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  isDatasetDetailPage = false;

  config = this.appConfigService.getConfig();
  facility = this.config.facility ?? "";
  status = this.appConfig.production ? "" : "test";
  siteHeaderLogo = this.config.siteHeaderLogo ?? "site-header-logo.png";

  oAuth2Endpoints: OAuth2Endpoint[] = [];
  username$ = this.store.select(selectCurrentUserName);
  profileImage$ = this.store.select(selectThumbnailPhoto);
  inBatchIndicator$ = this.store.select(selectDatasetsInBatchIndicator);
  loggedIn$ = this.store.select(selectIsLoggedIn);

  constructor(
    public appConfigService: AppConfigService,
    private router: Router,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private store: Store,
    @Inject(DOCUMENT) public document: Document,
    private nomadViewerService: NomadViewerService,
  ) {}

  logout(): void {
    this.store.dispatch(logoutAction());
  }

  login(): void {
    if (this.config.skipSciCatLoginPageEnabled) {
      const returnURL = encodeURIComponent(this.router.url);
      for (const endpoint of this.oAuth2Endpoints) {
        this.document.location.href = `${this.config.lbBaseURL}/${endpoint.authURL}?returnURL=${returnURL}`;
      }
    } else {
      this.router.navigateByUrl("/login");
    }
  }

  ngOnInit() {
    this.store.dispatch(fetchCurrentUserAction());
    this.oAuth2Endpoints = this.config.oAuth2Endpoints;
    this.isDatasetDetailPage = /\/datasets\/[^/]+(?:\/.*)?$/.test(
      this.router.url,
    );

    this.subscriptions.push(
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event: NavigationEnd) => {
          this.isDatasetDetailPage = /\/datasets\/[^/]+(?:\/.*)?$/.test(
            event.url,
          );
        }),
    );
  }

  ngOnDestroy() {
    // existing cleanup code
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  openNomadLogs(): void {
    this.nomadViewerService.openNomadLogs();
  }

  openNomadCharts(): void {
    this.nomadViewerService.openNomadCharts();
  }
}
