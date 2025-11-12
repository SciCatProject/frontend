import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { map } from "rxjs/operators";

import { selectDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { clearBatchAction } from "state-management/actions/datasets.actions";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "batch-card",
  templateUrl: "./batch-card.component.html",
  styleUrls: ["./batch-card.component.scss"],
})
export class BatchCardComponent implements OnInit, OnDestroy {
  private batch$ = this.store.select(selectDatasetsInBatch);
  public batchSize$ = this.batch$.pipe(map((batch) => batch.length));
  public nonEmpty$ = this.batchSize$.pipe(map((size) => size > 0));

  batchSizeSubscription: Subscription = new Subscription();
  batchSize = 0;

  constructor(
    private store: Store,
    private router: Router,
  ) {}

  ngOnInit() {
    this.batchSizeSubscription = this.batchSize$.subscribe((size) => {
      if (size) {
        this.batchSize = size;
      }
    });
  }

  ngOnDestroy() {
    this.batchSizeSubscription.unsubscribe();
  }

  public clear(): void {
    this.store.dispatch(clearBatchAction());
  }

  getRouterLink(): string {
    const currentUrl = this.router.url.split("?")[0];

    if (
      localStorage.getItem("editingDatasetList") === "true" &&
      currentUrl.endsWith("datasetList")
    ) {
      return currentUrl + "/edit";
    }
    return "/datasets/selection";
  }
}
