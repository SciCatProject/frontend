import { Component, OnInit, OnDestroy } from "@angular/core";
import { PublishedData } from "shared/sdk";
import { Store, select } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";
import { fetchPublishedDataAction } from "state-management/actions/published-data.actions";
import { Subscription } from "rxjs";
import { pluck } from "rxjs/operators";
import { getCurrentPublishedData } from "state-management/selectors/published-data.selectors";

@Component({
  selector: "publisheddata-details",
  templateUrl: "./publisheddata-details.component.html",
  styleUrls: ["./publisheddata-details.component.scss"]
})
export class PublisheddataDetailsComponent implements OnInit, OnDestroy {
  currentData$ = this.store.pipe(select(getCurrentPublishedData));

  routeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private store: Store<PublishedData>
  ) {}

  ngOnInit() {
    this.routeSubscription = this.route.params
      .pipe(pluck("id"))
      .subscribe((id: string) =>
        this.store.dispatch(fetchPublishedDataAction({ id }))
      );
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
