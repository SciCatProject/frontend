import { DOCUMENT } from "@angular/common";
import { Component, OnInit, Inject } from "@angular/core";
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
import { Router } from "@angular/router";

@Component({
  selector: "app-app-header",
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.scss"],
})
export class AppHeaderComponent implements OnInit {
  config = this.appConfigService.getConfig();
  facility = this.config.facility ?? "";
  status = this.appConfig.production ? "" : "test";
  siteIcon = this.config.siteIcon ?? "site-logo.png";

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
  ) {}

  logout(): void {
    this.store.dispatch(logoutAction());
  }

  login(): void {
    if (!this.config.scicatLoginEnabled) {
      for (const endpoint of this.oAuth2Endpoints) {
        this.document.location.href = `${this.config.lbBaseURL}/${endpoint.authURL}`;
      }
    } else {
      this.router.navigateByUrl("/login");
    }
  }

  ngOnInit() {
    this.store.dispatch(fetchCurrentUserAction());
    this.oAuth2Endpoints = this.config.oAuth2Endpoints;
  }
}
