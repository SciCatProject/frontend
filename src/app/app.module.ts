import { AppComponent } from "./app.component";
import { AppConfigModule } from "app-config.module";
import { AppRoutingModule, routes } from "app-routing/app-routing.module";
import { RedirectGuard } from "app-routing/redirect-guard";
import { AuthCheck } from "./AuthCheck";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule, Title } from "@angular/platform-browser";
import { DatasetEffects } from "state-management/effects/datasets.effects";
import { DatasetsModule } from "datasets/datasets.module";
import { EffectsModule } from "@ngrx/effects";
import { FlexLayoutModule } from "@angular/flex-layout";
import { HttpClientModule } from "@angular/common/http";
import { JobEffects } from "state-management/effects/jobs.effects";
import { NgModule } from "@angular/core";
import { PolicyEffects } from "state-management/effects/policies.effects";
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
import { UserEffects } from "state-management/effects/user.effects";
import { UsersModule } from "users/users.module";
import { PublishedDataEffects } from "state-management/effects/published-data.effects";
import { rootReducer } from "state-management/reducers/root.reducer";
import { routerReducer } from "@ngrx/router-store";

import {
  MatMenuModule,
  MatNativeDateModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatIconModule
} from "@angular/material";
import { SampleEffects } from "./state-management/effects/samples.effects";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { LogbooksModule } from "./logbooks/logbooks.module";
import { LogbookEffects } from "state-management/effects/logbooks.effects";
import { AboutModule } from "about/about.module";
import { HelpModule } from "help/help.module";
import { PublisheddataModule } from "publisheddata/publisheddata.module";
import { AppLayoutComponent } from "./_layout/app-layout/app-layout.component";
import { AppHeaderComponent } from "./_layout/app-header/app-header.component";
import { LoginHeaderComponent } from "./_layout/login-header/login-header.component";
import { LoginLayoutComponent } from "./_layout/login-layout/login-layout.component";
import { JobsModule } from "jobs/jobs.module";

@NgModule({
  declarations: [
    AppComponent,
    AppLayoutComponent,
    AppHeaderComponent,
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
      { router: routerReducer, root: rootReducer },
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
      maxAge: 25 //  Retains last 25 states
    }),
    EffectsModule.forRoot([
      DatasetEffects,
      UserEffects,
      JobEffects,
      PolicyEffects,
      SampleEffects,
      LogbookEffects,
      PublishedDataEffects
    ]),
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
