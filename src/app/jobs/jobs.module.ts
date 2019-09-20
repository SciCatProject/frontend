import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { JobsDashboardComponent } from "./jobs-dashboard/jobs-dashboard.component";
import { JobsDetailComponent } from "./jobs-detail/jobs-detail.component";
import {
  MatCardModule,
  MatButtonToggleModule,
  MatIconModule
} from "@angular/material";
import { StoreModule } from "@ngrx/store";
import { jobsReducer } from "state-management/reducers/jobs.reducer";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedCatanieModule } from "shared/shared.module";

@NgModule({
  declarations: [JobsDetailComponent, JobsDashboardComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule,
    SharedCatanieModule,
    StoreModule.forFeature("jobs", jobsReducer)
  ],
  exports: [JobsDetailComponent, JobsDashboardComponent]
})
export class JobsModule {}
