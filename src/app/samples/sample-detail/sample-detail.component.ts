import { ActivatedRoute } from "@angular/router";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FetchSampleAction, SelectSampleAction } from "../../state-management/actions/samples.actions";
import { Observable, Subscription } from "rxjs";
import { Sample } from "../../shared/sdk/models";
import { filter, flatMap, map } from "rxjs/operators";
import { getCurrentSample, getSelectedSample } from "../../state-management/selectors/samples.selectors";
import { select, Store } from "@ngrx/store";

@Component({
  selector: "app-sample-detail",
  templateUrl: "./sample-detail.component.html",
  styleUrls: ["./sample-detail.component.css"]
})
export class SampleDetailComponent implements OnInit, OnDestroy {
  sample$: Observable<Sample>;
  private sampleId$: Observable<string>;
  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private store: Store<Sample>
  ) {
  }

  ngOnInit() {
    this.sampleId$ = this.route.params.pipe(
      map(params => params.id),
      filter(id => id != null)
    );

    this.subscription = this.sampleId$
      .pipe(
        flatMap(id => [new FetchSampleAction(id), new SelectSampleAction(id)])
      )
      .subscribe(this.store);

    this.sample$ = this.store.pipe(select(getCurrentSample));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
