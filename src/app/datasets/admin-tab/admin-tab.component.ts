import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { FileObject } from "datasets/dataset-details-dashboard/dataset-details-dashboard.component";
import { Subscription } from "rxjs";
import { take } from "rxjs/operators";
import { Dataset, Job } from "shared/sdk";
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
  dataset: Dataset | undefined;
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
            const job = new Job();
            job.createdBy = user.username;
            job.createdAt = new Date();
            job.type = "reset";
            job.jobParams = {};
            job.jobParams["datasetIds"] = [this.dataset["pid"]];
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
