import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "app-routing/auth.guard";
import { LeavingPageGuard } from "app-routing/pending-changes.guard";
import { DatafilesComponent } from "datasets/datafiles/datafiles.component";
import { DatasetDetailComponent } from "datasets/dataset-detail/dataset-detail.component";
import { DatasetFileUploaderComponent } from "datasets/dataset-file-uploader/dataset-file-uploader.component";
import { DatasetLifecycleComponent } from "datasets/dataset-lifecycle/dataset-lifecycle.component";
import { ReduceComponent } from "datasets/reduce/reduce.component";
import { LogbooksDashboardComponent } from "logbooks/logbooks-dashboard/logbooks-dashboard.component";
const routes: Routes = [
  {
    path: "",
    component: DatasetDetailComponent,
    canDeactivate:[LeavingPageGuard]
  },
  {
    path: "datafiles",
    component: DatafilesComponent,

  },
  {
    path: "reduce",
    component: ReduceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "logbook",
    component: LogbooksDashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "attachments",
    component: DatasetFileUploaderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "lifecycle",
    component: DatasetLifecycleComponent,
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatasetDetailsDashboardRoutingModule {}
