import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "app-routing/auth.guard";
import { leavingPageGuard } from "app-routing/pending-changes.guard";
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
    path: "selection",
    component: BatchViewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "selection/publish",
    component: PublishComponent,
    canActivate: [AuthGuard],
    canDeactivate: [leavingPageGuard],
  },
  {
    path: ":id",
    component: DatasetDetailsDashboardComponent,
    loadChildren: () =>
      import(
        "../dataset-details-dashboard-routing/dataset-details-dashboard.feature.module"
      ).then((m) => m.DatasetDetailsDashboardFeatureModule),
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
export class DatasetsRoutingModule {}
