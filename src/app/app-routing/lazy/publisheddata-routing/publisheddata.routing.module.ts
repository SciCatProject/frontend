import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "app-routing/auth.guard";
import { leavingPageGuard } from "app-routing/pending-changes.guard";
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
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublisheddataRoutingModule {}
