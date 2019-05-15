import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DashboardComponent } from "../datasets/dashboard/dashboard.component";
import { DatafilesComponent } from "../datasets/datafiles/datafiles.component";
import { DatablocksComponent } from "../datasets/datablocks-table/datablocks-table.component";
import { DatasetDetailComponent } from "../datasets/dataset-detail/dataset-detail.component";

import { JobsTableComponent } from "../jobs/jobs-table/jobs-table.component";
import { JobsDetailComponent } from "../jobs/jobs-detail/jobs-detail.component";

import { AppComponent } from "../app.component";
import { ErrorPageComponent } from "../shared/modules/error-page/error-page.component";

import { LoginComponent } from "../users/login/login.component";
import { UserSettingsComponent } from "../users/user-settings/user-settings.component";
import { UserDetailsComponent } from "../users/user-details/user-details.component";

import { SampleDataFormComponent } from "../samples/sample-data-form/sample-data-form.component";

import { ListProposalsPageComponent } from "../proposals/containers/list-proposals-page/list-proposals-page.component";
import { ViewProposalPageComponent } from "../proposals/containers/view-proposal-page/view-proposal-page.component";

import { ArchiveSettingsComponent } from "../policies/archive-settings/archive-settings.component";

import { PublishComponent } from "datasets/publish/publish.component";
import { AuthCheck } from "../AuthCheck";
import { BatchViewComponent } from "datasets/batch-view/batch-view.component";
import { SampleDetailComponent } from "../samples/sample-detail/sample-detail.component";
import { SampleTableComponent } from "../samples/sample-table/sample-table.component";

import { LogbooksDashboardComponent } from "../logbooks/logbooks-dashboard/logbooks-dashboard.component";
import { LogbooksTableComponent } from "../logbooks/logbooks-table/logbooks-table.component";
import { AboutComponent } from "about/about/about.component";
import { HelpComponent } from "help/help/help.component";
import { PublisheddataTableComponent } from "publisheddata/publisheddata-table/publisheddata-table.component";
import { PublisheddataDetailsComponent } from "publisheddata/publisheddata-details/publisheddata-details.component";

export const routes: Routes = [
  { path: "", redirectTo: "/datasets", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "logout", component: AppComponent, canActivate: [AuthCheck] },
  {
    path: "datasets/batch/publish",
    component: PublishComponent,
    canActivate: [AuthCheck]
  },
  { path: "datasets", component: DashboardComponent, canActivate: [AuthCheck] },
  {
    path: "datasets/batch",
    component: BatchViewComponent,
    canActivate: [AuthCheck]
  },
  {
    path: "datasets/:id",
    component: DatasetDetailComponent,
    canActivate: [AuthCheck]
  },
  {
    path: "datasets/:id/datablocks",
    component: DatablocksComponent,
    canActivate: [AuthCheck]
  },
  {
    path: "datasets/:id/datafiles",
    component: DatafilesComponent,
    canActivate: [AuthCheck]
  },
  {
    path: "proposals",
    component: ListProposalsPageComponent,
    canActivate: [AuthCheck]
  },
  {
    path: "proposals/:id",
    component: ViewProposalPageComponent,
    canActivate: [AuthCheck]
  },
  {
    path: "publishedDatasets",
    component: PublisheddataTableComponent,
    canActivate: [AuthCheck]
  },
  {
    path: "publishedDataset/:id",
    component: PublisheddataDetailsComponent,
    canActivate: [AuthCheck]
  },
  {
    path: "samples",
    component: SampleTableComponent,
    canActivate: [AuthCheck]
  },
  {
    path: "samples/:id",
    component: SampleDetailComponent,
    canActivate: [AuthCheck]
  },

  {
    path: "archive-settings",
    component: ArchiveSettingsComponent,
    canActivate: [AuthCheck]
  },

  { path: "user", component: UserDetailsComponent, canActivate: [AuthCheck] },
  {
    path: "user/settings",
    component: UserSettingsComponent,
    canActivate: [AuthCheck]
  },
  {
    path: "user/details",
    component: UserDetailsComponent,
    canActivate: [AuthCheck]
  },
  {
    path: "user/jobs",
    component: JobsTableComponent,
    canActivate: [AuthCheck]
  },
  {
    path: "user/job/:id",
    component: JobsDetailComponent,
    canActivate: [AuthCheck]
  },
  {
    path: "about",
    component: AboutComponent
  },
  {
    path: "help",
    component: HelpComponent
  },
  {
    path: "sample-data/add",
    component: SampleDataFormComponent,
    canActivate: [AuthCheck]
  },
  {
    path: "logbooks",
    component: LogbooksTableComponent,
    canActivate: [AuthCheck]
  },
  {
    path: "logbooks/:name",
    component: LogbooksDashboardComponent,
    canActivate: [AuthCheck]
  },
  {
    path: "error",
    component: ErrorPageComponent,
    data: { message: "Location Not Found", breadcrumb: "Error" }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
