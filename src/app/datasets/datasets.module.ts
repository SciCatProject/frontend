import { AppConfigModule } from "app-config.module";
import { LinkyModule } from "ngx-linky";
import { ArchivingService } from "./archiving.service";
import { BatchCardComponent } from "./batch-card/batch-card.component";
import { BatchViewComponent } from "./batch-view/batch-view.component";
import { CommonModule } from "@angular/common";
import { DatasetFormComponent } from "./dataset-form/dataset-form.component";
import { FileDropzoneComponent } from "./file-dropzone/file-dropzone.component";
import { FileHelpersModule } from "ngx-file-helpers";
import { FilePickerComponent } from "./file-picker/file-picker.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SatDatepickerModule } from "saturn-datepicker";
import { SelectedListComponent } from "datasets/selected-list/selected-list.component";
import { SharedCatanieModule } from "shared/shared.module";
import { StoreModule } from "@ngrx/store";
import { datasetsReducer } from "state-management/reducers/datasets.reducer";
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
import { ScientificConditionDialogComponent } from "./scientific-condition-dialog/scientific-condition-dialog.component";
import { jobsReducer } from "../state-management/reducers/jobs.reducer";

@NgModule({
  imports: [
    AppConfigModule,
    CommonModule,
    FileHelpersModule,
    FlexLayoutModule,
    FontAwesomeModule,
    FormsModule,
    LinkyModule, 
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
    StoreModule.forFeature("datasets", datasetsReducer),
    StoreModule.forFeature("jobs", jobsReducer)
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
    SelectedListComponent,
    DatasetFormComponent,
    ScientificConditionDialogComponent,
  ],
  entryComponents: [
    ScientificConditionDialogComponent
  ],
  providers: [DatasetService, ArchivingService],
  exports: [DatasetTableComponent, DatasetsFilterComponent]
})
export class DatasetsModule {}
