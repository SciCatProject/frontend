import { AppComponent } from "./app.component";
import { AppConfigModule } from "app-config.module";
import { AppRoutingModule, routes } from "app-routing/app-routing.module";
import { ArchivingService } from "datasets/archiving.service";
import { AuthCheck } from "./AuthCheck";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule, Title } from "@angular/platform-browser";
import { DatasetEffects } from "state-management/effects/datasets.effects";
import { DatasetService } from "datasets/dataset.service";
import { DatasetsModule } from "datasets/datasets.module";
import { EffectsModule } from "@ngrx/effects";
import { FlexLayoutModule} from "@angular/flex-layout";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { JobsDetailComponent } from "./jobs/jobs-detail/jobs-detail.component";
import { JobsEffects } from "state-management/effects/jobs.effects";
import { JobsTableComponent } from "jobs/jobs-table/jobs-table.component";
import { NgModule } from "@angular/core";
import { NguiDatetimePickerModule } from "@ngui/datetime-picker";
import { PoliciesEffects } from "state-management/effects/policies.effects";
import { PoliciesModule } from "policies/policies.module";
import { ProposalsModule } from "proposals/proposals.module";
import { RouterModule } from "@angular/router";
import { SampleApi, SDKBrowserModule } from "shared/sdk/index";
import { SamplesModule} from "./samples/samples.module";
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
import { routerReducer, StoreRouterConnectingModule } from "@ngrx/router-store";
import { LoginService } from "users/login.service";

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
  MatToolbarModule,
  MatButtonToggleModule,
} from "@angular/material";
import { SampleService } from "./samples/sample.service";
import { SamplesEffects } from "./state-management/effects/samples.effects";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

export function localStorageSyncWrapper(reducer: any) {
  return localStorageSync({ keys: ["root"], rehydrate: true })(reducer);
}

@NgModule({
  declarations: [
    AppComponent,
    JobsTableComponent,
    JobsDetailComponent
  ],
  imports: [
    AppConfigModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
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
    PoliciesModule,
    ProposalsModule,
    ReactiveFormsModule,
    SamplesModule,
    SatDatepickerModule,
    SatNativeDateModule,
    SharedCatanieModule,
    UsersModule,
    MatButtonToggleModule,

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
      PoliciesEffects,
      SamplesEffects,
      PublishedDataEffects
    ]),
    StoreRouterConnectingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  exports: [MatNativeDateModule],
  providers: [
    AuthCheck,
    DatasetService,
    ArchivingService,
    SampleService,
    UserApi,
    SampleApi,
    Title,
    MatNativeDateModule,
    LoginService
    //      {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
