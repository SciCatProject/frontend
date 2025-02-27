import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminGuard } from "app-routing/admin.guard";
import { AuthGuard } from "app-routing/auth.guard";
import { ServiceGuard } from "app-routing/service.guard";
import { AdminTabComponent } from "datasets/admin-tab/admin-tab.component";
import { DatafilesComponent } from "datasets/datafiles/datafiles.component";
import { JsonScientificMetadataComponent } from "datasets/jsonScientificMetadata/jsonScientificMetadata.component";
import { DatasetFileUploaderComponent } from "datasets/dataset-file-uploader/dataset-file-uploader.component";
import { DatasetLifecycleComponent } from "datasets/dataset-lifecycle/dataset-lifecycle.component";
import { ReduceComponent } from "datasets/reduce/reduce.component";
import { RelatedDatasetsComponent } from "datasets/related-datasets/related-datasets.component";
import { LogbooksDashboardComponent } from "logbooks/logbooks-dashboard/logbooks-dashboard.component";
import { DatasetDetailWrapperComponent } from "datasets/dataset-detail/dataset-detail-wrapper.component";

const routes: Routes = [
  {
    path: "",
    component: DatasetDetailWrapperComponent,
  },
  {
    path: "jsonScientificMetadata",
    component: JsonScientificMetadataComponent,
  },
  {
    path: "datafiles",
    component: DatafilesComponent,
  },
  {
    path: "relatedDatasets",
    component: RelatedDatasetsComponent,
  },
  // For reduce && logbook this is a work around because guard priority somehow doesn't work and this work around make guards excuted sequencial
  // Expected behavior should be that ServiceGuard return false should have higher priority than AuthGuard therefore it shoulds navigate to /404 instead of /login
  {
    path: "reduce",
    canActivate: [ServiceGuard],
    children: [
      {
        path: "",
        component: ReduceComponent,
        canActivate: [AuthGuard],
      },
    ],
    data: { service: "reduce" },
  },
  {
    path: "logbook",
    canActivate: [ServiceGuard],
    children: [
      {
        path: "",
        component: LogbooksDashboardComponent,
        canActivate: [AuthGuard],
      },
    ],
    data: { service: "logbook" },
  },
  {
    path: "attachments",
    component: DatasetFileUploaderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "lifecycle",
    component: DatasetLifecycleComponent,
  },
  {
    path: "admin",
    component: AdminTabComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatasetDetailsDashboardRoutingModule {}
