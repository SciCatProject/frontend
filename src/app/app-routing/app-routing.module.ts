import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DashboardComponent } from "../datasets/dashboard/dashboard.component";
import { DatafilesComponent } from "../datasets/datafiles/datafiles.component";
import { DatablocksComponent } from "../datasets/datablocks-table/datablocks-table.component";
import { DatasetDetailsDashboardComponent } from "datasets/dataset-details-dashboard/dataset-details-dashboard.component";

import { JobsDashboardComponent } from "jobs/jobs-dashboard/jobs-dashboard.component";
import { JobsDetailComponent } from "../jobs/jobs-detail/jobs-detail.component";

import { ErrorPageComponent } from "shared/modules/error-page/error-page.component";

import { LoginComponent } from "../users/login/login.component";
import { UserSettingsComponent } from "../users/user-settings/user-settings.component";

import { ViewProposalPageComponent } from "../proposals/view-proposal-page/view-proposal-page.component";

import { PublishComponent } from "datasets/publish/publish.component";
import { AuthGuard } from "./auth.guard";
import { BatchViewComponent } from "datasets/batch-view/batch-view.component";
import { SampleDetailComponent } from "../samples/sample-detail/sample-detail.component";

import { LogbooksDashboardComponent } from "../logbooks/logbooks-dashboard/logbooks-dashboard.component";
import { LogbooksTableComponent } from "../logbooks/logbooks-table/logbooks-table.component";
import { AboutComponent } from "about/about/about.component";
import { HelpComponent } from "help/help/help.component";
import { PublisheddataDashboardComponent } from "publisheddata/publisheddata-dashboard/publisheddata-dashboard.component";
import { PublisheddataDetailsComponent } from "publisheddata/publisheddata-details/publisheddata-details.component";
import { PublisheddataEditComponent } from "publisheddata/publisheddata-edit/publisheddata-edit.component";

// handles external URLs by lookup in the env config
import { RedirectGuard } from "app-routing/redirect.guard";
import { ProposalDashboardComponent } from "proposals/proposal-dashboard/proposal-dashboard.component";
import { SampleDashboardComponent } from "samples/sample-dashboard/sample-dashboard.component";
import { LoginLayoutComponent } from "_layout/login-layout/login-layout.component";
import { AppLayoutComponent } from "_layout/app-layout/app-layout.component";
import { PoliciesDashboardComponent } from "policies/policies-dashboard/policies-dashboard.component";
import { InstrumentsDashboardComponent } from "instruments/instruments-dashboard/instruments-dashboard.component";
import { InstrumentDetailsComponent } from "instruments/instrument-details/instrument-details.component";
import { AnonymousDashboardComponent } from "datasets/anonymous-dashboard/anonymous-dashboard.component";
import { AnonymousDetailsDashboardComponent } from "datasets/anonymous-details-dashboard/anonymous-details-dashboard.component";
import { AnonymousLayoutComponent } from "_layout/anonymous-layout/anonymous-layout.component";
import { JobsGuard } from "app-routing/jobs.guard";
import { PoliciesGuard } from "app-routing/policies.guard";
import { LogbookGuard } from "app-routing/logbook.guard";

export const routes: Routes = [
  {
    path: "",
    component: AnonymousLayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "anonymous/datasets",
        pathMatch: "full",
      },
      {
        path: "anonymous/datasets",
        component: AnonymousDashboardComponent,
      },
      {
        path: "anonymous/datasets/:id",
        component: AnonymousDetailsDashboardComponent,
      },
      {
        path: "anonymous/about",
        component: AboutComponent,
      },
      {
        path: "anonymous/help",
        component: HelpComponent,
      },
    ],
  },
  {
    path: "",
    component: LoginLayoutComponent,
    children: [
      { path: "", redirectTo: "/login", pathMatch: "full" },
      { path: "login", component: LoginComponent },
      {
        path: "login/error",
        component: ErrorPageComponent,
        data: { message: "Location Not Found", breadcrumb: "Error" },
      },
    ],
  },
  {
    path: "",
    component: AppLayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "/datasets",
        pathMatch: "full",
      },
      {
        path: "datasets/batch/publish",
        component: PublishComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "datasets",
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "datasets/batch",
        component: BatchViewComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "datasets/:id",
        component: DatasetDetailsDashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "datasets/:id/datablocks",
        component: DatablocksComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "datasets/:id/datafiles",
        component: DatafilesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "instruments",
        component: InstrumentsDashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "instruments/:id",
        component: InstrumentDetailsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "proposals",
        component: ProposalDashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "proposals/:id",
        component: ViewProposalPageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "publishedDatasets",
        component: PublisheddataDashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "publishedDatasets/:id/edit",
        component: PublisheddataEditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "publishedDatasets/:id",
        component: PublisheddataDetailsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "samples",
        component: SampleDashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "samples/:id",
        component: SampleDetailComponent,
        canActivate: [AuthGuard],
      },

      {
        path: "policies",
        component: PoliciesDashboardComponent,
        canActivate: [AuthGuard, PoliciesGuard],
      },

      {
        path: "user",
        component: UserSettingsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "user/settings",
        component: UserSettingsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "user/jobs",
        component: JobsDashboardComponent,
        canActivate: [AuthGuard, JobsGuard],
      },
      {
        path: "user/jobs/:id",
        component: JobsDetailComponent,
        canActivate: [AuthGuard, JobsGuard],
      },
      {
        path: "about",
        component: AboutComponent,
      },
      {
        path: "help",
        component: HelpComponent,
      },
      {
        path: "logbooks",
        component: LogbooksTableComponent,
        canActivate: [AuthGuard, LogbookGuard],
      },
      {
        path: "logbooks/:name",
        component: LogbooksDashboardComponent,
        canActivate: [AuthGuard, LogbookGuard],
      },
      {
        path: "error",
        component: ErrorPageComponent,
        data: { message: "Location Not Found", breadcrumb: "Error" },
      },
      {
        path: "help/ingestManual",
        canActivate: [RedirectGuard],
        component: RedirectGuard,
        data: {
          urlConfigItem: "ingestManual",
        },
      },
      {
        path: "help/SciCatGettingStartedSLSSummary",
        canActivate: [RedirectGuard],
        component: RedirectGuard,
        data: {
          urlConfigItem: "gettingStarted",
        },
      },
      {
        path: "logout",
        component: LoginLayoutComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {
  constructor() {}
}
