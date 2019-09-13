import { CommonModule } from "@angular/common";
import {
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatTableModule,
  MatInputModule,
  MatSortModule,
  MatPaginatorModule
} from "@angular/material";
import { NgModule } from "@angular/core";
import { SampleApi } from "../shared/sdk/services/custom";
import { SampleDetailComponent } from "./sample-detail/sample-detail.component";
import { SampleTableComponent } from "./sample-table/sample-table.component";
import { SampleDataFormComponent } from "./sample-data-form/sample-data-form.component";
import { StoreModule } from "@ngrx/store";
import { samplesReducer } from "../state-management/reducers/samples.reducer";
import { SampleDialogComponent } from "./sample-dialog/sample-dialog.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SampleService } from "./sample.service";
import { SampleDashboardComponent } from "./sample-dashboard/sample-dashboard.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { SearchBarModule } from "shared/modules/search-bar/search-bar.module";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    NgxJsonViewerModule,
    ReactiveFormsModule,
    SearchBarModule,
    StoreModule.forFeature("samples", samplesReducer)
  ],
  exports: [
    SampleDetailComponent,
    SampleTableComponent,
    SampleDataFormComponent,
    SampleDialogComponent
  ],
  declarations: [
    SampleDetailComponent,
    SampleTableComponent,
    SampleDataFormComponent,
    SampleDialogComponent,
    SampleDashboardComponent
  ],
  providers: [SampleApi, SampleService],
  entryComponents: [SampleDialogComponent]
})
export class SamplesModule {}
