import { AppConfigModule } from "app-config.module";
import { LinkyModule } from "ngx-linky";
import { ArchivingService } from "./archiving.service";
import { BatchCardComponent } from "./batch-card/batch-card.component";
import { BatchViewComponent } from "./batch-view/batch-view.component";
import { CommonModule } from "@angular/common";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatChipsModule } from "@angular/material/chips";
import { NgModule } from "@angular/core";
import { NgxJsonViewerModule } from "ngx-json-viewer";
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
  MatRadioModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatTooltipModule,
  MatStepperModule
} from "@angular/material";

import { PublishComponent } from "./publish/publish.component";
import { DatasetFormComponent } from "./dataset-form/dataset-form.component";
import { ScientificConditionDialogComponent } from "./scientific-condition-dialog/scientific-condition-dialog.component";
import { jobsReducer } from "../state-management/reducers/jobs.reducer";
import { LogbooksModule } from "logbooks/logbooks.module";
import { ReduceComponent } from "./reduce/reduce.component";
import { MetadataTableComponent } from "./metadata-table/metadata-table.component";
import { DatasetDetailsDashboardComponent } from "./dataset-details-dashboard/dataset-details-dashboard.component";

@NgModule({
  imports: [
    AppConfigModule,
    CommonModule,
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
    MatRadioModule,
    MatSelectModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    NgxJsonViewerModule,
    ReactiveFormsModule,
    RouterModule,
    SatDatepickerModule,
    SharedCatanieModule,
    StoreModule.forFeature("datasets", datasetsReducer),
    StoreModule.forFeature("jobs", jobsReducer),
    LogbooksModule
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
    DatasetFormComponent,
    SelectedListComponent,
    PublishComponent,
    DatasetFormComponent,
    ScientificConditionDialogComponent,
    ReduceComponent,
    MetadataTableComponent,
    DatasetDetailsDashboardComponent
  ],
  entryComponents: [ScientificConditionDialogComponent],
  providers: [DatasetService, ArchivingService],
  exports: [DatasetTableComponent, DatasetsFilterComponent]
})
export class DatasetsModule {}
