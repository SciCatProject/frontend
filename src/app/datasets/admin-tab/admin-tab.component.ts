import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { FileObject } from "datasets/dataset-details-dashboard/dataset-details-dashboard.component";
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";
import {
  CreateJobDto,
  OutputDatasetObsoleteDto,
} from "@scicatproject/scicat-sdk-ts-angular";
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
  standalone: false,
})
export class AdminTabComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  dataset: OutputDatasetObsoleteDto | undefined;
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
            const job: CreateJobDto = {
              ownerUser: user.email,
              type: "reset",
              jobParams: {},
            };
            job.jobParams["username"] = user.username;
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
            // job.datasetList = [fileObj];   // TODO: job release back-ward compatibility issue
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
