import { Component } from "@angular/core";
import { Store } from "@ngrx/store";
import { FileObject } from "datasets/dataset-details-dashboard/dataset-details-dashboard.component";
import { Dataset, Job, User } from "shared/sdk";
import { submitJobAction } from "state-management/actions/jobs.actions";
import { selectAdminTabPageViewModel } from "state-management/selectors/datasets.selectors";

@Component({
  selector: "app-admin-tab",
  templateUrl: "./admin-tab.component.html",
  styleUrls: ["./admin-tab.component.scss"],
})
export class AdminTabComponent {
  vm$ = this.store.select(selectAdminTabPageViewModel);

  constructor(private store: Store) {}

  resetDataset(user: User, dataset: Dataset) {
    if (confirm("Reset datablocks?")) {
      if (user && dataset) {
        const job = new Job();
        job.emailJobInitiator = user.email;
        job.jobParams = {};
        job.jobParams["username"] = user.username;
        job.creationTime = new Date();
        job.type = "reset";
        const fileObj: FileObject = {
          pid: "",
          files: [],
        };
        const fileList: string[] = [];
        fileObj.pid = dataset.pid;
        if (dataset.datablocks) {
          dataset.datablocks.map((d) => {
            fileList.push(d.archiveId);
          });
        }
        fileObj.files = fileList;
        job.datasetList = [fileObj];
        console.log(job);
        this.store.dispatch(submitJobAction({ job }));
      }
    }
  }
}
