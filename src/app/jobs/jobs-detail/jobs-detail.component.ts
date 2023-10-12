import { Component, OnDestroy, OnInit } from "@angular/core";
import { fetchJobAction } from "state-management/actions/jobs.actions";
import { Store } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";
import { selectCurrentJob } from "state-management/selectors/jobs.selectors";
import { Subscription } from "rxjs";

@Component({
  selector: "app-jobs-detail",
  templateUrl: "./jobs-detail.component.html",
  styleUrls: ["./jobs-detail.component.scss"],
})
export class JobsDetailComponent implements OnInit, OnDestroy {
  job$ = this.store.select(selectCurrentJob);
  routeSubscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private store: Store,
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.params.subscribe((params) => {
      this.store.dispatch(fetchJobAction({ jobId: params.id }));
    });
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
