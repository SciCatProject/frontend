import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileHelpersModule } from "ngx-file-helpers";
import { FilePickerComponent } from "./file-picker/file-picker.component";
import { FileDropzoneComponent } from "./file-dropzone/file-dropzone.component";
import { FlexLayoutModule} from "@angular/flex-layout";
import { AppConfigModule } from "app-config.module";
import {
  DashboardComponent,
  DatablocksComponent,
  DatafilesComponent,
  DatasetDetailComponent,
  DatasetService,
  DatasetsFilterComponent,
  DatasetTableComponent
} from "datasets/index";

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatOptionModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule
} from "@angular/material";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { SharedCatanieModule } from "shared/shared.module";
import { SelectedListComponent } from "datasets/selected-list/selected-list.component";
import { SatDatepickerModule } from "saturn-datepicker";
import { StoreModule } from "@ngrx/store";
import { datasetsReducer } from "state-management/reducers/datasets.reducer";
import { FileSizePipe } from "./filesize.pipe";
import { BatchViewComponent } from "./batch-view/batch-view.component";
import { RouterModule } from "@angular/router";
import { BatchCardComponent } from "./batch-card/batch-card.component";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import ArchivingService from "./archiving.service";

@NgModule({
  imports: [
    AppConfigModule,
    CommonModule,
    FileHelpersModule,
    FlexLayoutModule,
    FontAwesomeModule,
    FormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    MatOptionModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    ReactiveFormsModule,
    RouterModule,
    SatDatepickerModule,
    SharedCatanieModule,
    StoreModule.forFeature("datasets", datasetsReducer)
  ],
  declarations: [
    BatchCardComponent,
    BatchViewComponent,
    DashboardComponent,
    DatablocksComponent,
    DatafilesComponent,
    DatasetDetailComponent,
    DatasetTableComponent,
    DatasetsFilterComponent,
    FileDropzoneComponent,
    FilePickerComponent,
    FileSizePipe,
    SelectedListComponent
  ],
  providers: [DatasetService, ArchivingService],
  exports: [DatasetTableComponent, DatasetsFilterComponent]
})
export class DatasetsModule {}
