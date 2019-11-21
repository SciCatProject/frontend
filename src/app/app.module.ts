import { userReducer } from 'state-management/reducers/user.reducer';
import { AppComponent } from "./app.component";
import { AppConfigModule } from "app-config.module";
import { AppRoutingModule, routes } from "app-routing/app-routing.module";
import { RedirectGuard } from "app-routing/redirect-guard";
import { AuthCheck } from "./AuthCheck";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule, Title } from "@angular/platform-browser";
import { DatasetsModule } from "datasets/datasets.module";
import { EffectsModule } from "@ngrx/effects";
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { PoliciesModule } from "policies/policies.module";
import { ProposalsModule } from "proposals/proposals.module";
import { RouterModule } from "@angular/router";
import { SampleApi, SDKBrowserModule } from "shared/sdk/index";
import { SamplesModule } from "./samples/samples.module";
import { SatDatepickerModule, SatNativeDateModule } from "saturn-datepicker";
import { SharedCatanieModule } from "shared/shared.module";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { StoreModule } from "@ngrx/store";
import { UserApi } from "shared/sdk/services";
import { UsersModule } from "users/users.module";
import { routerReducer } from "@ngrx/router-store";


import {
  MatMenuModule,
  MatNativeDateModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatIconModule,
  MatBadgeModule
} from "@angular/material";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { LogbooksModule } from "./logbooks/logbooks.module";
import { AboutModule } from "about/about.module";
import { HelpModule } from "help/help.module";
import { PublisheddataModule } from "publisheddata/publisheddata.module";
import { LayoutModule } from "_layout/layout.module";
import { AppLayoutComponent } from "./_layout/app-layout/app-layout.component";
import { LoginHeaderComponent } from "./_layout/login-header/login-header.component";
import { LoginLayoutComponent } from "./_layout/login-layout/login-layout.component";
import { JobsModule } from "jobs/jobs.module";

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    LoginHeaderComponent,
    LoginLayoutComponent
  ],
  imports: [
    AboutModule,
    AppConfigModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    DatasetsModule,
    FlexLayoutModule,
    HelpModule,
    HttpClientModule,
    JobsModule,
    LogbooksModule,
    LayoutModule,
    MatBadgeModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatToolbarModule,
    PoliciesModule,
    ProposalsModule,
    PublisheddataModule,
    SamplesModule,
    SatDatepickerModule,
    SatNativeDateModule,
    SharedCatanieModule,
    UsersModule,
    SDKBrowserModule.forRoot(),
    StoreModule.forRoot(
      { router: routerReducer,
        users: userReducer
      },
      {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false
        }
      }
    ),
    RouterModule.forRoot(routes, { useHash: false }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, //  Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    EffectsModule.forRoot([ ]),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    })
  ],
  exports: [MatNativeDateModule],
  providers: [
    AuthCheck,
    UserApi,
    SampleApi,
    Title,
    MatNativeDateModule,
    RedirectGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
