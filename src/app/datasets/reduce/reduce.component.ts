import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Dataset, DerivedDataset } from "shared/sdk/models";
import { Subscription } from "rxjs";
import {
  getCurrentDataset,
  reduceDataset
} from "state-management/selectors/datasets.selectors";
import { ReduceDatasetAction } from "state-management/actions/datasets.actions";

@Component({
  selector: "reduce",
  templateUrl: "./reduce.component.html",
  styleUrls: ["./reduce.component.scss"]
})
export class ReduceComponent implements OnInit, OnDestroy {
  dataset: Dataset;
  datasetSubscription: Subscription;

  result: Object;
  resultAsString: string = "";
  resultSubscription: Subscription;

  show: boolean;

  constructor(private router: Router, private store: Store<any>) {}

  ngOnInit() {
    this.datasetSubscription = this.store
      .pipe(select(getCurrentDataset))
      .subscribe(dataset => {
        this.dataset = dataset;
      });

    this.resultSubscription = this.store
      .pipe(select(reduceDataset))
      .subscribe(result => {
        this.result = result;
        this.resultAsString = JSON.stringify(result);
      });
  }

  ngOnDestroy() {
    this.datasetSubscription.unsubscribe();
    this.resultSubscription.unsubscribe();
  }

  reduceDataset(dataset: Dataset) {
    this.store.dispatch(new ReduceDatasetAction(dataset));
  }

  goTo(dataset: DerivedDataset) {
    const pid = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl("/datasets/" + pid);
  }
}
