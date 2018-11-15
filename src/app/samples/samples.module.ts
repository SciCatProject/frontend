import { CommonModule } from "@angular/common";
import {
  MatCardModule,
  MatIconModule,
  MatTableModule
} from "@angular/material";
import { NgModule } from "@angular/core";
import { SampleApi } from "../shared/sdk/services/custom";
import { SampleDetailComponent } from "./sample-detail/sample-detail.component";
import { SampleTableComponent } from "./sample-table/sample-table.component";
import { SampleDataFormComponent } from "./sample-data-form/sample-data-form.component";
import { StoreModule } from "@ngrx/store";
import { samplesReducer } from "../state-management/reducers/samples.reducer";

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    StoreModule.forFeature("samples", samplesReducer)
  ],
  declarations: [SampleDetailComponent, SampleTableComponent, SampleDataFormComponent],
  providers: [SampleApi]
})
export class SamplesModule {}
