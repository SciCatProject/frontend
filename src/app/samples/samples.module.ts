import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SampleDetailComponent } from "./sample-detail/sample-detail.component";
import { SampleTableComponent } from "./sample-table/sample-table.component";
import { StoreModule } from "@ngrx/store";
import { samplesReducer } from "../state-management/reducers/samples.reducer";
import { MatTableModule } from "@angular/material";

@NgModule({
  imports: [
    CommonModule,
    MatTableModule,
    StoreModule.forFeature("samples", samplesReducer)
  ],
  declarations: [SampleDetailComponent, SampleTableComponent]
})
export class SamplesModule {
}
