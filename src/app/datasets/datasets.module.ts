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
import { MatDatepickerModule } from 'saturn-datepicker';
import { DatasetTablePureComponent } from './dataset-table-pure/dataset-table-pure.component';
import { StoreModule } from '@ngrx/store';
import { datasetsReducer } from 'state-management/reducers/datasets.reducer';
import { FileSizePipe } from './filesize.pipe';

@NgModule({
  imports : [
    MatCardModule, MatDialogModule, MatPaginatorModule, MatCheckboxModule, MatTableModule, MatFormFieldModule, MatAutocompleteModule,
    MatTabsModule, MatInputModule, MatButtonModule, MatSortModule, CommonModule, FormsModule, ReactiveFormsModule,
    SharedCatanieModule, MatSelectModule, MatOptionModule, MatNativeDateModule, MatIconModule,
    MatListModule, MatDatepickerModule, MatTooltipModule, MatButtonToggleModule, MatProgressSpinnerModule, MatChipsModule,
    StoreModule.forFeature('datasets', datasetsReducer),
    FileHelpersModule, AppConfigModule
  ],
  declarations : [
    FilePickerComponent, FileDropzoneComponent,
    DashboardComponent, DatasetTableComponent, DatablocksComponent,
    DatafilesComponent, DatasetsFilterComponent, DatasetDetailComponent, SelectedListComponent,
    DatasetTablePureComponent, FileSizePipe
  ],
  providers : [ DatasetService ],
  exports : [ DatasetTableComponent, DatasetsFilterComponent ]
})
export class DatasetsModule {
}
