import { userReducer } from "state-management/reducers/user.reducer";
import { AppComponent } from "./app.component";
import { AppConfigModule } from "app-config.module";
import { AppRoutingModule, routes } from "app-routing/app-routing.module";
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
import { StoreModule } from "@ngrx/store";
import { UserApi } from "shared/sdk/services";
import { UsersModule } from "users/users.module";
import { routerReducer } from "@ngrx/router-store";
import { extModules } from "./build-specifics";

import { MatBadgeModule } from "@angular/material/badge";
import { MatNativeDateModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { LogbooksModule } from "./logbooks/logbooks.module";
import { AboutModule } from "about/about.module";
import { HelpModule } from "help/help.module";
import { PublisheddataModule } from "publisheddata/publisheddata.module";
import { LayoutModule } from "_layout/layout.module";
import { JobsModule } from "jobs/jobs.module";
import { InstrumentsModule } from "./instruments/instruments.module";
import { FilesModule } from "files/files.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    AboutModule,
    AppConfigModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    DatasetsModule,
    FilesModule,
    FlexLayoutModule,
    HelpModule,
    HttpClientModule,
    InstrumentsModule,
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
      { router: routerReducer, users: userReducer },
      {
        runtimeChecks: {
          strictStateImmutability: false,
          strictActionImmutability: false,
          strictStateSerializability: false,
          strictActionSerializability: false,
        },
      }
    ),
    extModules,
    RouterModule.forRoot(routes, { useHash: false }),
    EffectsModule.forRoot([]),
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production,
    }),
  ],
  exports: [MatNativeDateModule],
  providers: [UserApi, SampleApi, Title, MatNativeDateModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
