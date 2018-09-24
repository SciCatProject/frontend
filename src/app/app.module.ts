import { AppComponent } from "./app.component";
import { AppConfigModule } from "./app-config.module";
import { AppRoutingModule, routes } from "./app-routing/app-routing.module";
import { ArchivingService } from "./datasets/archiving.service";
import { AuthCheck } from "./AuthCheck";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule, Title } from "@angular/platform-browser";
import { DatasetEffects } from "./state-management/effects/datasets.effects";
import { DatasetService } from "./datasets/dataset.service";
import { DatasetsModule } from "./datasets/datasets.module";
import { EffectsModule } from "@ngrx/effects";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { JobsDetailComponent } from "./jobs/jobs-detail/jobs-detail.component";
import { JobsEffects } from "./state-management/effects/jobs.effects";
import { JobsTableComponent } from "jobs/jobs-table/jobs-table.component";
import { NgModule } from "@angular/core";
import { NguiDatetimePickerModule } from "@ngui/datetime-picker";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { PoliciesEffects } from "./state-management/effects/policies.effects";
import { PoliciesModule } from "./policies/policies.module";
import { ProposalsModule } from "./proposals/proposals.module";
import { RouterModule } from "@angular/router";
import { SDKBrowserModule } from "./shared/sdk/index";
import { SampleDataFormComponent } from "./sample-data-form/sample-data-form.component";
import { SatDatepickerModule, SatNativeDateModule } from "saturn-datepicker";
import { SharedCatanieModule } from "./shared/shared.module";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { StoreModule } from "@ngrx/store";
import { UserApi } from "./shared/sdk/services";
import { UserEffects } from "./state-management/effects/user.effects";
import { UsersModule } from "./users/users.module";
import { localStorageSync } from "ngrx-store-localstorage";
import { rootReducer } from "./state-management/reducers/root.reducer";
import { routerReducer, StoreRouterConnectingModule } from "@ngrx/router-store";
import { PLATFORM_ID, APP_ID, Inject } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

import {
  MatCardModule,
  MatDatepickerModule,
  MatGridListModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatTableModule,
  MatToolbarModule
} from "@angular/material";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "../environments/environment";

export function localStorageSyncWrapper(reducer: any) {
  return localStorageSync({ keys: ["root"], rehydrate: true })(reducer);
}

@NgModule({
  declarations: [
    AppComponent,
    JobsTableComponent,
    SampleDataFormComponent,
    JobsDetailComponent
  ],
  imports: [
    AppConfigModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: "scicat-data" }),
    DatasetsModule,
    FlexLayoutModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatDatepickerModule,
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
    NgxDatatableModule,
    PoliciesModule,
    ProposalsModule,
    ReactiveFormsModule,
    SatDatepickerModule,
    SatNativeDateModule,
    SharedCatanieModule,
    UsersModule,

    SDKBrowserModule.forRoot(),
    // StoreModule.forRoot({router: routerReducer, root: rootReducer}, {metaReducers: [localStorageSyncWrapper]}),
    StoreModule.forRoot({ router: routerReducer, root: rootReducer }),
    RouterModule.forRoot(routes, { useHash: false }),
    StoreDevtoolsModule.instrument({
      maxAge: 25 //  Retains last 25 states
    }),
    EffectsModule.forRoot([
      DatasetEffects,
      UserEffects,
      JobsEffects,
      PoliciesEffects
    ]),
    StoreRouterConnectingModule,
    ServiceWorkerModule.register("ngsw-worker.js", {
      enabled: environment.production
    })
  ],
  exports: [MatNativeDateModule],
  providers: [
    AuthCheck,
    DatasetService,
    ArchivingService,
    UserApi,
    Title,
    MatNativeDateModule
    //      {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string
  ) {
    const platform = isPlatformBrowser(platformId)
      ? "in the browser"
      : "on the server";
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
