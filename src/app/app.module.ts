import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { AppRoutingModule, routes } from 'app-routing/app-routing.module';
import { DatasetService } from 'datasets/dataset.service';
import { DatasetsModule } from 'datasets/datasets.module';
import { JobsTableComponent } from 'jobs/jobs-table/jobs-table.component';
import { localStorageSync } from 'ngrx-store-localstorage';
import { AppConfigModule } from 'app-config.module';
import { SampleDataFormComponent } from 'sample-data-form/sample-data-form.component';
import { SDKBrowserModule } from 'shared/sdk/index';
import { UserApi } from 'shared/sdk/services';
import { SharedCatanieModule } from 'shared/shared.module';
import { DatasetEffects } from 'state-management/effects/datasets.effects';
import { UserEffects } from 'state-management/effects/user.effects';
import { JobsEffects } from 'state-management/effects/jobs.effects';
import { rootReducer } from 'state-management/reducers/root.reducer';
import { UsersModule } from 'users/users.module';
import { ProposalsModule } from 'proposals/proposals.module';
import { FileHelpersModule } from 'ngx-file-helpers';

import { FilePickerComponent } from './datasets/file-picker/file-picker.component';
import { FileDropzoneComponent } from './datasets/file-dropzone/file-dropzone.component';


import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
  MatFormFieldModule,
} from '@angular/material';

import {CdkTableModule} from '@angular/cdk/table';
import { AppComponent } from './app.component';
import { AuthCheck } from './AuthCheck';
import { JobsDetailComponent } from './jobs/jobs-detail/jobs-detail.component';



export function localStorageSyncWrapper(reducer: any) {
  return localStorageSync({keys: ['root'], rehydrate: true}) (reducer);
}

@NgModule({
  declarations : [
    AppComponent,
    JobsTableComponent,
    SampleDataFormComponent,
    JobsDetailComponent,
  ],
  imports : [
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    MatListModule,
    MatGridListModule,
    MatMenuModule,
    MatSidenavModule,
    MatTableModule,
    MatPaginatorModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpModule,
    BrowserAnimationsModule, SharedCatanieModule,
    NguiDatetimePickerModule,

    DatasetsModule,
    UsersModule,
    ProposalsModule,
    AppConfigModule,

    SDKBrowserModule.forRoot(),
    // StoreModule.forRoot({router: routerReducer, root: rootReducer}, {metaReducers: [localStorageSyncWrapper]}),
    StoreModule.forRoot({router: routerReducer, root: rootReducer}),
    RouterModule.forRoot(routes, { useHash: false }),
    StoreDevtoolsModule.instrument({
      maxAge: 25 //  Retains last 25 states
    }),
    EffectsModule.forRoot([DatasetEffects, UserEffects, JobsEffects]),
    StoreRouterConnectingModule,
  ],
  exports: [
  ],
  providers : [
      AuthCheck,
      DatasetService,
      UserApi,
    //      {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
  ],
  bootstrap : [ AppComponent ]
})
export class AppModule {
}
