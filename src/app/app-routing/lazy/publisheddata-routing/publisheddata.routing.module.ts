import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "app-routing/auth.guard";
import { leavingPageGuard } from "app-routing/pending-changes.guard";
import { BatchViewComponent } from "datasets/batch-view/batch-view.component";
import { DashboardComponent } from "datasets/dashboard/dashboard.component";
import { PublisheddataDashboardComponent } from "publisheddata/publisheddata-dashboard/publisheddata-dashboard.component";
import { PublisheddataDetailsComponent } from "publisheddata/publisheddata-details/publisheddata-details.component";
import { PublisheddataEditComponent } from "publisheddata/publisheddata-edit/publisheddata-edit.component";

const routes: Routes = [
  {
    path: "",
    component: PublisheddataDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ":id",
    component: PublisheddataDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ":id/edit",
    component: PublisheddataEditComponent,
    canActivate: [AuthGuard],
    canDeactivate: [leavingPageGuard],
  },
  {
    path: ":id/datasetList",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ":id/datasetList/edit",
    component: BatchViewComponent,
    canActivate: [AuthGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublisheddataRoutingModule {}
