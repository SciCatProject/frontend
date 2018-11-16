import { CommonModule } from "@angular/common";
import { MatCardModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatTableModule } from "@angular/material";
import { NgModule } from "@angular/core";
import { SampleApi } from "../shared/sdk/services/custom";
import { SampleDetailComponent } from "./sample-detail/sample-detail.component";
import { SampleTableComponent } from "./sample-table/sample-table.component";
import { SampleDataFormComponent } from "./sample-data-form/sample-data-form.component";
import { StoreModule } from "@ngrx/store";
import { samplesReducer } from "../state-management/reducers/samples.reducer";
import { SampleDialogComponent } from "./sample-dialog/sample-dialog.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTableModule,
    ReactiveFormsModule,
    StoreModule.forFeature("samples", samplesReducer)
  ],
  declarations: [
    SampleDetailComponent,
    SampleTableComponent,
    SampleDataFormComponent,
    SampleDialogComponent
  ],
  providers: [SampleApi],
  entryComponents: [SampleDialogComponent]
})
export class SamplesModule {
}
