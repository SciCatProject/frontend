import { ActivatedRoute } from "@angular/router";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Sample, Dataset } from "../../shared/sdk/models";
import { getCurrentSample, getDatasetsForSample } from "../../state-management/selectors/samples.selectors";
import { select, Store } from "@ngrx/store";
import {
  FetchSampleAction,
  SetCurrentSample,
  FetchDatasetsForSample,
  SetCurrentDatasets
} from "../../state-management/actions/samples.actions";

@Component({
  selector: "app-sample-detail",
  templateUrl: "./sample-detail.component.html",
  styleUrls: ["./sample-detail.component.scss"]
})
export class SampleDetailComponent implements OnInit, OnDestroy {
  sample: Object;
  datasets: Object;
  sample$ = this.store.pipe(select(getCurrentSample));
  datasets$ = this.store.pipe(select(getDatasetsForSample));
  private sampleId$: Observable<string>;
  private subscriptions = [];

  constructor(private route: ActivatedRoute, private store: Store<Sample>) {}

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(select(getCurrentSample)).subscribe(sample => {
        if (sample && Object.keys(sample).length > 0) {
          this.sample = <Sample>sample;
        } else {
          // console.log("Searching from URL params");
          this.route.params.subscribe(params => {
            console.log("gm: fetching sampleId", params.id);
            this.store.dispatch(new FetchSampleAction(params.id));
          });
        }
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getDatasetsForSample)).subscribe(
        datasets => {
          if (datasets && Object.keys(datasets).length > 0) {
            this.datasets = <Dataset>datasets;
            console.log(datasets);
          } else {
            console.log("get from param");
            this.route.params.subscribe(
              params => {
                console.log("gm: fetching datasets sampleId", params.id);
                this.store.dispatch( new FetchDatasetsForSample(params.id));
              }
            );
          }
        }
      )
    );
  }

  ngOnDestroy() {
    console.log("on destroy");
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
    this.store.dispatch(new SetCurrentSample(undefined));
    this.store.dispatch(new SetCurrentDatasets(undefined));
  }
}
