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
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { JobsEffects } from "state-management/effects/jobs.effects";
import { NgModule } from "@angular/core";
import { NguiDatetimePickerModule } from "@ngui/datetime-picker";
import { PoliciesEffects } from "state-management/effects/policies.effects";
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
import { localStorageSync } from "ngrx-store-localstorage";
import { rootReducer } from "state-management/reducers/root.reducer";
import { routerReducer } from "@ngrx/router-store";
import { LoginService } from "users/login.service";

import {
  MatCardModule,
  MatDatepickerModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule,
  MatButtonToggleModule
} from "@angular/material";
import { SamplesEffects } from "./state-management/effects/samples.effects";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";
import { LogbooksModule } from "./logbooks/logbooks.module";
import { LogbookEffect } from "state-management/effects/logbooks.effects";
import { AboutModule } from "about/about.module";
import { HelpModule } from "help/help.module";
import { PublisheddataModule } from "publisheddata/publisheddata.module";
import { AppLayoutComponent } from "./_layout/app-layout/app-layout.component";
import { AppHeaderComponent } from "./_layout/app-header/app-header.component";
import { LoginHeaderComponent } from "./_layout/login-header/login-header.component";
import { LoginLayoutComponent } from "./_layout/login-layout/login-layout.component";
import { JobsModule } from "jobs/jobs.module";

export function localStorageSyncWrapper(reducer: any) {
  return localStorageSync({ keys: ["root"], rehydrate: true })(reducer);
}

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
    FontAwesomeModule,
    FormsModule,
    HelpModule,
    HttpClientModule,
    JobsModule,
    MatCardModule,
    MatDatepickerModule,
    MatDialogModule,
    MatGridListModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule,
    NguiDatetimePickerModule,
    PoliciesModule,
    ProposalsModule,
    PublisheddataModule,
    ReactiveFormsModule,
    SamplesModule,
    SatDatepickerModule,
    SatNativeDateModule,
    SharedCatanieModule,
    UsersModule,
    MatButtonToggleModule,
    LogbooksModule,

    SDKBrowserModule.forRoot(),
    // StoreModule.forRoot({router: routerReducer, root: rootReducer}, {metaReducers: [localStorageSyncWrapper]}),
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
      JobsEffects,
      PoliciesEffects,
      SamplesEffects,
      LogbookEffect,
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
    LoginService,
    RedirectGuard
    //      {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
