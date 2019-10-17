import { CommonModule } from "@angular/common";
import {
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatButtonModule,
  MatTabsModule
} from "@angular/material";
import { NgModule } from "@angular/core";
import { SampleDetailComponent } from "./sample-detail/sample-detail.component";
import { SampleDataFormComponent } from "./sample-data-form/sample-data-form.component";
import { StoreModule } from "@ngrx/store";
import { samplesReducer } from "../state-management/reducers/samples.reducer";
import { SampleDialogComponent } from "./sample-dialog/sample-dialog.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SampleDashboardComponent } from "./sample-dashboard/sample-dashboard.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { SearchBarModule } from "shared/modules/search-bar/search-bar.module";
import { TableModule } from "shared/modules/table/table.module";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatTabsModule,
    NgxJsonViewerModule,
    ReactiveFormsModule,
    SearchBarModule,
    StoreModule.forFeature("samples", samplesReducer),
    TableModule
  ],
  exports: [
    SampleDetailComponent,
    SampleDataFormComponent,
    SampleDialogComponent
  ],
  declarations: [
    SampleDetailComponent,
    SampleDataFormComponent,
    SampleDialogComponent,
    SampleDashboardComponent
  ],
  providers: [],
  entryComponents: [SampleDialogComponent]
})
export class SamplesModule {}
