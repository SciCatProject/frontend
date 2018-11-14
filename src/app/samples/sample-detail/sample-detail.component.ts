import { ActivatedRoute } from "@angular/router";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FetchSampleAction } from "../../state-management/actions/samples.actions";
import { Observable, Subscription } from "rxjs";
import { Sample } from "../../shared/sdk/models";
import { SampleService } from "../../samples/sample.service";
import { filter, flatMap, map } from "rxjs/operators";
import { getCurrentSample } from "../../state-management/selectors/samples.selectors";
import { select, Store } from "@ngrx/store";

@Component({
  selector: "app-sample-detail",
  templateUrl: "./sample-detail.component.html",
  styleUrls: ["./sample-detail.component.css"]
})
export class SampleDetailComponent implements OnInit, OnDestroy {
  sample$: Observable<Sample>;
  public sample: Sample = undefined;
  private sampleId$: Observable<string>;
  private subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private sampleService: SampleService,
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
        flatMap(id => [new FetchSampleAction(id)])
      )
      .subscribe(this.store);

    this.sample$ = this.store.pipe(select(getCurrentSample));
  }

  ngOnDestroy() {
  }
}
