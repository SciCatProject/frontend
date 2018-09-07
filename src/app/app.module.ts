import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule, Title } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { EffectsModule } from "@ngrx/effects";
import { routerReducer, StoreRouterConnectingModule } from "@ngrx/router-store";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { NguiDatetimePickerModule } from "@ngui/datetime-picker";
import { AppRoutingModule, routes } from "app-routing/app-routing.module";
import { DatasetService } from "datasets/dataset.service";
import { DatasetsModule } from "datasets/datasets.module";
import { JobsTableComponent } from "jobs/jobs-table/jobs-table.component";
import { localStorageSync } from "ngrx-store-localstorage";
import { AppConfigModule } from "app-config.module";
import { SampleDataFormComponent } from "sample-data-form/sample-data-form.component";
import { SDKBrowserModule } from "shared/sdk/index";
import { UserApi } from "shared/sdk/services";
import { SharedCatanieModule } from "shared/shared.module";
import { DatasetEffects } from "state-management/effects/datasets.effects";
import { UserEffects } from "state-management/effects/user.effects";
import { JobsEffects } from "state-management/effects/jobs.effects";
import { rootReducer } from "state-management/reducers/root.reducer";
import { UsersModule } from "users/users.module";
import { ProposalsModule } from "proposals/proposals.module";
import { PoliciesModule } from "policies/policies.module";
import { SatDatepickerModule, SatNativeDateModule } from "saturn-datepicker";
import { PoliciesEffects } from "state-management/effects/policies.effects";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

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

import { AppComponent } from "./app.component";
import { AuthCheck } from "./AuthCheck";
import { JobsDetailComponent } from "./jobs/jobs-detail/jobs-detail.component";

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
    BrowserModule,
    DatasetsModule,
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
    StoreRouterConnectingModule
  ],
  exports: [MatNativeDateModule],
  providers: [
    AuthCheck,
    DatasetService,
    UserApi,
    Title,
    MatNativeDateModule
    //      {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
