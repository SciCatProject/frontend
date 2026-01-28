import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminGuard } from "app-routing/admin.guard";
import { AdminDashboardComponent } from "admin/admin-dashboard/admin-dashboard.component";
import { AdminConfigEditComponent } from "admin/admin-config-edit/admin-config-edit.component";
import { AdminUserlistViewComponent } from "admin/admin-userlist-view/admin-userlist-view.component";

const routes: Routes = [
  {
    path: "",
    component: AdminDashboardComponent, // parent with router-outlet
    canActivate: [AdminGuard],
    children: [
      { path: "", redirectTo: "configuration", pathMatch: "full" },
      {
        path: "configuration",
        component: AdminConfigEditComponent,
      },
      {
        path: "usersList",
        component: AdminUserlistViewComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
