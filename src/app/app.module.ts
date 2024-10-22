import { userReducer } from "state-management/reducers/user.reducer";
import { AppComponent } from "./app.component";
import { AppConfigModule } from "app-config.module";
import { AppRoutingModule, routes } from "app-routing/app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule, Title } from "@angular/platform-browser";
import { EffectsModule } from "@ngrx/effects";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { ExtraOptions, RouterModule } from "@angular/router";
import { SDKBrowserModule } from "shared/sdk/index";
import { StoreModule } from "@ngrx/store";
import { routerReducer } from "@ngrx/router-store";
import { extModules } from "./build-specifics";
import { MatNativeDateModule } from "@angular/material/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldModule,
} from "@angular/material/form-field";
import { MatTabsModule } from "@angular/material/tabs";
import { MatChipsModule } from "@angular/material/chips";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { LayoutModule } from "_layout/layout.module";
import { AppConfigService } from "app-config.service";
import { AppThemeService } from "app-theme.service";
import { SnackbarInterceptor } from "shared/interceptors/snackbar.interceptor";
import { ApiModule, Configuration } from "shared/sdk-new";
import { InternalStorage, SDKStorage } from "shared/services/auth/base.storage";
import { AuthService } from "shared/services/auth/auth.service";
import { CookieBrowser } from "shared/services/auth/cookie.browser";

const appConfigInitializerFn = (appConfig: AppConfigService) => {
  return () => appConfig.loadAppConfig();
};

const apiConfigurationFn = (
  authService: AuthService,
  configurationService: AppConfigService,
) =>
  new Configuration({
    basePath: configurationService.getConfig().lbBaseURL,
    accessToken: authService.getToken().id,
  });

const appThemeInitializerFn = (appTheme: AppThemeService) => {
  return () => appTheme.loadTheme();
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppConfigModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    LayoutModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatTabsModule,
    MatChipsModule,
    MatSnackBarModule,
    ApiModule,
    SDKBrowserModule.forRoot(),
    StoreModule.forRoot(
      { router: routerReducer, users: userReducer },
      {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        },
      },
    ),
    extModules,
    RouterModule.forRoot(routes, {
      useHash: false,
    } as ExtraOptions),
    EffectsModule.forRoot([]),
  ],
  exports: [MatNativeDateModule],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appConfigInitializerFn,
      multi: true,
      deps: [AppConfigService],
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appThemeInitializerFn,
      multi: true,
      deps: [AppThemeService],
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SnackbarInterceptor,
      multi: true,
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        subscriptSizing: "dynamic",
      },
    },
    AuthService,
    AppThemeService,
    Title,
    MatNativeDateModule,
    { provide: InternalStorage, useClass: CookieBrowser },
    { provide: SDKStorage, useClass: CookieBrowser },
    {
      provide: Configuration,
      useFactory: apiConfigurationFn,
      deps: [AuthService, AppConfigService],
      multi: false,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
