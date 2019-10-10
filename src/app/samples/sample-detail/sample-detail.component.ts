import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Sample } from "../../shared/sdk/models";
import {
  getCurrentSample,
  getSampleDatasets
} from "../../state-management/selectors/samples.selectors";
import { select, Store } from "@ngrx/store";
import {
  fetchSampleAction,
  fetchSampleDatasetsAction
} from "../../state-management/actions/samples.actions";

@Component({
  selector: "app-sample-detail",
  templateUrl: "./sample-detail.component.html",
  styleUrls: ["./sample-detail.component.scss"]
})
export class SampleDetailComponent implements OnInit, OnDestroy {
  sample$ = this.store.pipe(select(getCurrentSample));
  datasets$ = this.store.pipe(select(getSampleDatasets));
  routeSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<Sample>
  ) {}

  onClickDataset(datasetId: string): void {
    const id = encodeURIComponent(datasetId);
    this.router.navigateByUrl("/datasets/" + id);
  }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.store.dispatch(fetchSampleAction({ sampleId: params.id }));
      this.store.dispatch(fetchSampleDatasetsAction({ sampleId: params.id }));
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
