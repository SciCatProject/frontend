import { userReducer } from "state-management/reducers/user.reducer";
import { AppComponent } from "./app.component";
import { AppConfigModule } from "app-config.module";
import { AppRoutingModule, routes } from "app-routing/app-routing.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule, Title } from "@angular/platform-browser";
import { EffectsModule } from "@ngrx/effects";
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { NgModule, inject, provideAppInitializer } from "@angular/core";
import { ExtraOptions, provideRouter, RouterModule } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { ApiModule, Configuration } from "@scicatproject/scicat-sdk-ts-angular";
import { routerReducer } from "@ngrx/router-store";
import { extModules } from "./build-specifics";
import { MAT_DATE_FORMATS } from "@angular/material/core";

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
import { AuthService } from "shared/services/auth/auth.service";
import { InternalStorage, SDKStorage } from "shared/services/auth/base.storage";
import { CookieService } from "ngx-cookie-service";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { CustomTranslateLoader } from "shared/loaders/custom-translate.loader";
import { DATE_PIPE_DEFAULT_OPTIONS } from "@angular/common";
import { RouteTrackerService } from "shared/services/route-tracker.service";
import { provideLuxonDateAdapter } from "@angular/material-luxon-adapter";

const appConfigInitializerFn = (appConfig: AppConfigService) => {
  return () => appConfig.loadAppConfig();
};

const appThemeInitializerFn = (appTheme: AppThemeService) => {
  return () => appTheme.loadTheme();
};

const apiConfigurationFn = (
  authService: AuthService,
  configurationService: AppConfigService,
) =>
  new Configuration({
    basePath: configurationService.getConfig().lbBaseURL,
    accessToken: authService.getToken().id,
  });

@NgModule({
  declarations: [AppComponent],
  exports: [],
  bootstrap: [AppComponent],
  imports: [
    AppConfigModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
        deps: [AppConfigService],
      },
    }),
    BrowserAnimationsModule,
    BrowserModule,
    LayoutModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatTabsModule,
    MatChipsModule,
    MatSnackBarModule,
    ApiModule,
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
    EffectsModule.forRoot([]),
  ],
  providers: [
    AppConfigService,
    provideLuxonDateAdapter(),
    provideHttpClient(withInterceptorsFromDi()),
    provideAppInitializer(() => {
      const initializerFn = appConfigInitializerFn(inject(AppConfigService));
      return initializerFn();
    }),
    provideAppInitializer(() => {
      const initializerFn = appThemeInitializerFn(inject(AppThemeService));
      return initializerFn();
    }),
    provideAppInitializer(() => {
      inject(RouteTrackerService);
    }),
    provideRouter(routes),
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
    {
      provide: DATE_PIPE_DEFAULT_OPTIONS,
      useFactory: (appConfigService: AppConfigService) => {
        return {
          dateFormat:
            appConfigService.getConfig().dateFormat || "yyyy-MM-dd HH:mm",
        };
      },
      deps: [AppConfigService],
    },
    {
      provide: MAT_DATE_FORMATS,
      useFactory: (appConfigService: AppConfigService) => {
        const base =
          appConfigService.getConfig().dateFormat || "yyyy-MM-dd HH:mm";
        return {
          parse: { dateInput: base },
          display: {
            dateInput: base,
            monthYearLabel: "MMM yyyy",
            dateA11yLabel: "LL",
            monthYearA11yLabel: "MMMM yyyy",
          },
        };
      },
      deps: [AppConfigService],
    },
    AuthService,
    AppThemeService,
    Title,
    { provide: InternalStorage, useClass: CookieService },
    { provide: SDKStorage, useClass: CookieService },
    {
      provide: Configuration,
      useFactory: apiConfigurationFn,
      deps: [AuthService, AppConfigService],
      multi: false,
    },
  ],
})
export class AppModule {}
