import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "app-routing/auth.guard";
import { JobsGuard } from "app-routing/jobs.guard";
import { JobsDashboardNewComponent } from "jobs/jobs-dashboard-new/jobs-dashboard-new.component";
import { JobsDetailComponent } from "jobs/jobs-detail/jobs-detail.component";
import { UserSettingsComponent } from "users/user-settings/user-settings.component";
import { NgxJsonViewerModule } from "ngx-json-viewer";

const routes: Routes = [
  {
    path: "",
    component: UserSettingsComponent,
    pathMatch: "full",
    canActivate: [AuthGuard],
  },
  {
    path: "settings",
    component: UserSettingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "jobs",
    component: JobsDashboardNewComponent,
    canActivate: [AuthGuard, JobsGuard],
  },
  {
    path: "jobs/:id",
    component: JobsDetailComponent,
    canActivate: [AuthGuard, JobsGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes), NgxJsonViewerModule],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
