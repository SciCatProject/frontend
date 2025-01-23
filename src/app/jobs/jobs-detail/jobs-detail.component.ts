import { Component, OnDestroy, OnInit } from "@angular/core";
import { fetchJobAction } from "state-management/actions/jobs.actions";
import { Store } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";
import { selectCurrentJob } from "state-management/selectors/jobs.selectors";
import { Observable, Subscription } from "rxjs";
import { JobClass } from "@scicatproject/scicat-sdk-ts-angular";

@Component({
  selector: "app-jobs-detail",
  templateUrl: "./jobs-detail.component.html",
  styleUrls: ["./jobs-detail.component.scss"],
})
export class JobsDetailComponent implements OnInit, OnDestroy {
  // TODO: We should extract the response dto with the right properties instead of using the schema for ApiResponse in the backend
  job$ = this.store.select(selectCurrentJob) as Observable<
    JobClass & { createdAt: string; updatedAt: string }
  >;
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
