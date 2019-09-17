import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Sample } from "../../shared/sdk/models";
import {
  getCurrentSample,
  getDatasetsForSample
} from "../../state-management/selectors/samples.selectors";
import { select, Store } from "@ngrx/store";
import {
  FetchSampleAction,
  FetchDatasetsForSample
} from "../../state-management/actions/samples.actions";

@Component({
  selector: "app-sample-detail",
  templateUrl: "./sample-detail.component.html",
  styleUrls: ["./sample-detail.component.scss"]
})
export class SampleDetailComponent implements OnInit, OnDestroy {
  sample$ = this.store.pipe(select(getCurrentSample));
  datasets$ = this.store.pipe(select(getDatasetsForSample));
  routeSubscription: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<Sample>
  ) {}

  onClickDataset(proposalId: string): void {
    const id = encodeURIComponent(proposalId);
    this.router.navigateByUrl("/datasets/" + id);
  }

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.store.dispatch(new FetchSampleAction(params.id));
      this.store.dispatch(new FetchDatasetsForSample(params.id));
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
