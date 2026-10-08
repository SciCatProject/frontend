import { JobEffects } from "./../state-management/effects/jobs.effects";
import { EffectsModule } from "@ngrx/effects";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { JobsDashboardComponent } from "./jobs-dashboard/jobs-dashboard.component";
import { JobsDetailComponent } from "./jobs-detail/jobs-detail.component";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { StoreModule } from "@ngrx/store";
import { jobsReducer } from "state-management/reducers/jobs.reducer";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { NgxJsonViewerModule } from "ngx-json-viewer";

@NgModule({
  declarations: [JobsDetailComponent, JobsDashboardComponent],
  imports: [
    CommonModule,
    EffectsModule.forFeature([JobEffects]),
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    SharedScicatFrontendModule,
    StoreModule.forFeature("jobs", jobsReducer),
    NgxJsonViewerModule,
  ],
  exports: [JobsDetailComponent, JobsDashboardComponent],
})
export class JobsModule {}
