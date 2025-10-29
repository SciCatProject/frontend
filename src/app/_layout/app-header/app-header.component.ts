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
import {
  AppConfigService,
  MainMenuOptions,
  MainPageOptions,
  OAuth2Endpoint,
} from "app-config.service";
import { Router } from "@angular/router";
import { map, Observable, Subscription } from "rxjs";

@Component({
  selector: "app-app-header",
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.scss"],
  standalone: false,
})
export class AppHeaderComponent implements OnInit {
  private sub: Subscription;

  config = this.appConfigService.getConfig();
  facility = this.config.facility ?? "";
  siteTitle = this.config.siteTitle ?? "Vanilla SciCat";
  siteSciCatLogo =
    this.config.siteSciCatLogo == "icon"
      ? "scicat-header-logo-icon.png"
      : "scicat-header-logo-full.png";
  siteHeaderLogo = this.config.siteHeaderLogo ?? "site-header-logo.png";

  oAuth2Endpoints: OAuth2Endpoint[] = [];
  username$ = this.store.select(selectCurrentUserName);
  profileImage$ = this.store.select(selectThumbnailPhoto);
  inBatchIndicator$ = this.store.select(selectDatasetsInBatchIndicator);
  isLoggedIn$ = this.store.select(selectIsLoggedIn);
  mainMenuConfig$: Observable<MainMenuOptions>;
  defaultMainPage$: Observable<string>;
  siteHeaderLogoUrl$: Observable<string>;
  isSiteHeaderLogoUrlExternal$: Observable<boolean>;

  constructor(
    public appConfigService: AppConfigService,
    private router: Router,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private store: Store,
    @Inject(DOCUMENT) public document: Document,
  ) {
    // Compute derived observables
    this.mainMenuConfig$ = this.isLoggedIn$.pipe(
      map((isLoggedIn) =>
        isLoggedIn
          ? this.config.mainMenu?.authenticatedUser || null
          : this.config.mainMenu?.nonAuthenticatedUser || null,
      ),
    );

    this.defaultMainPage$ = this.isLoggedIn$.pipe(
      map((isLoggedIn) =>
        isLoggedIn
          ? MainPageOptions[
              this.config.defaultMainPage?.authenticatedUser || "DATASETS"
            ]
          : MainPageOptions[
              this.config.defaultMainPage?.nonAuthenticatedUser || "DATASETS"
            ],
      ),
    );

    this.siteHeaderLogoUrl$ = this.defaultMainPage$.pipe(
      map((defaultMainPage) =>
        this.config.siteHeaderLogoUrl
          ? this.config.siteHeaderLogoUrl
          : defaultMainPage,
      ),
    );

    this.isSiteHeaderLogoUrlExternal$ = this.siteHeaderLogoUrl$.pipe(
      map((siteHeaderLogoUrl) => this.isFullUrl(siteHeaderLogoUrl)),
    );
  }

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
    // this.store.dispatch(fetchCurrentUserAction());
    this.oAuth2Endpoints = this.config.oAuth2Endpoints;
  }

  isFullUrl(url: string): boolean {
    return url.startsWith("http://") || url.startsWith("https://");
  }
}
