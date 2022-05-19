import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "app-routing/auth.guard";
import { ProposalDashboardComponent } from "proposals/proposal-dashboard/proposal-dashboard.component";
import { ViewProposalPageComponent } from "proposals/view-proposal-page/view-proposal-page.component";

const routes: Routes = [
  {
    path: "",
    component: ProposalDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: ":id",
    component: ViewProposalPageComponent,
    canActivate: [AuthGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProposalsRoutingModule {}
