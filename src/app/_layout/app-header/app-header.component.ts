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
import { AppConfigService, MainMenuConfiguration, MainMenuOptions, OAuth2Endpoint } from "app-config.service";
import { Router } from "@angular/router";
import { AppState } from "state-management/state/app.store";
import { Subscription } from "rxjs";

@Component({
  selector: "app-app-header",
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.scss"],
  standalone: false,
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  config = this.appConfigService.getConfig();
  facility = this.config.facility ?? "";
  siteTitle = this.config.siteTitle ?? "Vanilla SciCat";  
  siteSciCatLogo = this.config.siteSciCatLogo == "icon" ? "scicat-header-logo-icon.png" : "scicat-header-logo-full.png";
  siteHeaderLogo = this.config.siteHeaderLogo ?? "site-header-logo.png";

  oAuth2Endpoints: OAuth2Endpoint[] = [];
  username$ = this.store.select(selectCurrentUserName);
  profileImage$ = this.store.select(selectThumbnailPhoto);
  inBatchIndicator$ = this.store.select(selectDatasetsInBatchIndicator);
  //loggedIn$ = this.store.select(selectIsLoggedIn);
  isLoggedIn = false;

  mainMenuConfig: MainMenuOptions | null = this.config.mainMenu?.nonAuthenticatedUser || null;

  private sub: Subscription;
  
  constructor(
    public appConfigService: AppConfigService,
    private router: Router,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private store: Store<AppState>,
    @Inject(DOCUMENT) public document: Document,
  ) {}

  logout(): void {
    this.store.dispatch(logoutAction());
  }

  login(): void {
    if (this.config.skipSciCatLoginPageEnabled) {
      const returnUrl = encodeURIComponent(this.router.url);
      for (const endpoint of this.oAuth2Endpoints) {
        this.document.location.href = `${this.config.lbBaseURL}/${endpoint.authURL}?returnUrl=${returnUrl}`;
      }
    } else {
      this.router.navigateByUrl("/login");
    }
  }

  ngOnInit() {
    this.store.dispatch(fetchCurrentUserAction());
    this.oAuth2Endpoints = this.config.oAuth2Endpoints;

    this.sub = this.store.select(selectIsLoggedIn).subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) {
        this.mainMenuConfig = this.config.mainMenu?.authenticatedUser || null;
      } else {
        this.mainMenuConfig = this.config.mainMenu?.nonAuthenticatedUser || null;
      };
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
