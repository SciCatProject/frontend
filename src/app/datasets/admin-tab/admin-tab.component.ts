import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { FileObject } from "datasets/dataset-details-dashboard/dataset-details-dashboard.component";
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";
import { CreateJobDto, DatasetClass } from "@scicatproject/scicat-sdk-ts";
import { submitJobAction } from "state-management/actions/jobs.actions";
import {
  selectCurrentDatablocks,
  selectCurrentDataset,
} from "state-management/selectors/datasets.selectors";
import {
  selectCurrentUser,
  selectIsAdmin,
  selectIsLoading,
} from "state-management/selectors/user.selectors";

@Component({
  selector: "app-admin-tab",
  templateUrl: "./admin-tab.component.html",
  styleUrls: ["./admin-tab.component.scss"],
})
export class AdminTabComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  dataset: DatasetClass | undefined;
  datablocks$ = this.store.select(selectCurrentDatablocks);
  isAdmin$ = this.store.select(selectIsAdmin);
  loading$ = this.store.select(selectIsLoading);
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.store.select(selectCurrentDataset).subscribe((dataset) => {
        if (dataset) {
          this.dataset = dataset;
        }
      }),
    );
  }
  resetDataset() {
    if (confirm("Reset datablocks?")) {
      this.store
        .select(selectCurrentUser)
        .pipe(take(1))
        .subscribe((user) => {
          if (user && this.dataset) {
            let job: CreateJobDto;
            job.emailJobInitiator = user.email;
            job.jobParams = {};
            job.jobParams["username"] = user.username;
            // TODO: Check if we need this property as it is not needed in the CreateJobDto.
            // job.creationTime = new Date().toString();
            job.type = "reset";
            const fileObj: FileObject = {
              pid: "",
              files: [],
            };
            const fileList: string[] = [];
            fileObj.pid = this.dataset["pid"];
            if (this.dataset["datablocks"]) {
              this.dataset["datablocks"].map((d) => {
                fileList.push(d["archiveId"]);
              });
            }
            fileObj.files = fileList;
            job.datasetList = [fileObj];
            console.log(job);
            this.store.dispatch(submitJobAction({ job }));
          }
        });
    }
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
