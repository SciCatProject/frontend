import { JobEffects } from "./../state-management/effects/jobs.effects";
import { EffectsModule } from "@ngrx/effects";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { JobsDashboardComponent } from "./jobs-dashboard/jobs-dashboard.component";
import { JobsDetailComponent } from "./jobs-detail/jobs-detail.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { StoreModule } from "@ngrx/store";
import { jobsReducer } from "state-management/reducers/jobs.reducer";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { JobsDashboardNewComponent } from "./jobs-dashboard-new/jobs-dashboard-new.component";
import { SharedTableModule } from "shared/modules/shared-table/shared-table.module";

@NgModule({
  declarations: [
    JobsDetailComponent,
    JobsDashboardComponent,
    JobsDashboardNewComponent,
  ],
  imports: [
    CommonModule,
    EffectsModule.forFeature([JobEffects]),
    FlexLayoutModule,
    MatButtonToggleModule,
    MatCardModule,
    MatIconModule,
    SharedScicatFrontendModule,
    SharedTableModule,
    StoreModule.forFeature("jobs", jobsReducer),
  ],
  exports: [
    JobsDetailComponent,
    JobsDashboardComponent,
    JobsDashboardNewComponent,
  ],
})
export class JobsModule {}
