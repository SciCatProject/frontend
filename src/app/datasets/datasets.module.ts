import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FileHelpersModule } from 'ngx-file-helpers';
import { FilePickerComponent } from './file-picker/file-picker.component';
import { FileDropzoneComponent } from './file-dropzone/file-dropzone.component';
import { AppConfigModule } from 'app-config.module';
import {
  DashboardComponent,
  DatablocksComponent,
  DatafilesComponent,
  DatasetDetailComponent,
  DatasetService,
  DatasetsFilterComponent,
  DatasetTableComponent
} from 'datasets/index';

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  // MatDatepickerModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
  MatFormFieldModule,
  MatOptionModule,
} from '@angular/material';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { SharedCatanieModule } from 'shared/shared.module';
import { SelectedListComponent } from 'datasets/selected-list/selected-list.component';
import { SatDatepickerModule } from 'saturn-datepicker';
import { StoreModule } from '@ngrx/store';
import { datasetsReducer } from 'state-management/reducers/datasets.reducer';
import { FileSizePipe } from './filesize.pipe';
import { BatchViewComponent } from './batch-view/batch-view.component';
import { RouterModule } from '@angular/router';
import { BatchCardComponent } from './batch-card/batch-card.component';

@NgModule({
  imports : [
    MatCardModule, MatDialogModule, MatPaginatorModule, MatCheckboxModule, MatTableModule, MatFormFieldModule, MatAutocompleteModule,
    MatTabsModule, MatInputModule, MatButtonModule, MatSortModule, CommonModule, FormsModule, ReactiveFormsModule,
    SharedCatanieModule, MatSelectModule, MatOptionModule, MatNativeDateModule, MatIconModule,
    MatListModule, SatDatepickerModule, MatTooltipModule, MatButtonToggleModule, MatProgressSpinnerModule, MatChipsModule,
    StoreModule.forFeature('datasets', datasetsReducer),
    FileHelpersModule, AppConfigModule, RouterModule
  ],
  declarations : [
    FilePickerComponent, FileDropzoneComponent,
    DashboardComponent, DatasetTableComponent, DatablocksComponent,
    DatafilesComponent, DatasetsFilterComponent, DatasetDetailComponent, SelectedListComponent,
    FileSizePipe, BatchCardComponent, BatchViewComponent,
  ],
  providers : [ DatasetService ],
  exports : [ DatasetTableComponent, DatasetsFilterComponent ]
})
export class DatasetsModule {
}
