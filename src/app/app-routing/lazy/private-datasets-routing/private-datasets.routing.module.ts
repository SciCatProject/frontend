import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "app-routing/auth.guard";
import { LeavingPageGuard } from "app-routing/pending-changes.guard";
import { BatchViewComponent } from "datasets/batch-view/batch-view.component";
import { DashboardComponent } from "datasets/dashboard/dashboard.component";
import { DatablocksComponent } from "datasets/datablocks-table/datablocks-table.component";
import { DatasetDetailsDashboardComponent } from "datasets/dataset-details-dashboard/dataset-details-dashboard.component";
import { PublishComponent } from "datasets/publish/publish.component";


const routes: Routes = [
  {
    path: "",
    component: DashboardComponent,
  },
  {
    path: "batch",
    component: BatchViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "batch/publish",
    component: PublishComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ":id",
    component: DatasetDetailsDashboardComponent,
    canDeactivate: [LeavingPageGuard]
  },
  {
    path: ":id/datablocks",
    component: DatablocksComponent,
    canActivate: [AuthGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class PrivateDatasetsRoutingModule {}
