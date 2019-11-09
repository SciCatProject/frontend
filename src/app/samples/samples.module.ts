import { CommonModule } from "@angular/common";
import {
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatButtonModule,
  MatTabsModule,
  MatSelectModule
} from "@angular/material";
import { NgModule } from "@angular/core";
import { SampleDetailComponent } from "./sample-detail/sample-detail.component";
import { StoreModule } from "@ngrx/store";
import { samplesReducer } from "../state-management/reducers/samples.reducer";
import { SampleDialogComponent } from "./sample-dialog/sample-dialog.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SampleDashboardComponent } from "./sample-dashboard/sample-dashboard.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { SharedCatanieModule } from "shared/shared.module";

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    NgxJsonViewerModule,
    ReactiveFormsModule,
    SharedCatanieModule,
    StoreModule.forFeature("samples", samplesReducer)
  ],
  exports: [SampleDetailComponent, SampleDialogComponent],
  declarations: [
    SampleDetailComponent,
    SampleDialogComponent,
    SampleDashboardComponent
  ],
  providers: [],
  entryComponents: [SampleDialogComponent]
})
export class SamplesModule {}
