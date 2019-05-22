import { Component, OnInit, OnDestroy } from "@angular/core";
import { PublishedData } from "shared/sdk";
import { Store, select } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";
import { FetchPublishedData as FetchCurrentPublishedData } from "state-management/actions/published-data.actions";
import { Subscription } from "rxjs";
import { pluck } from "rxjs/operators";
import {
  selectCurrentPublishedData,
} from "state-management/selectors/published-data.selectors";

@Component({
  selector: "publisheddata-details",
  templateUrl: "./publisheddata-details.component.html",
  styleUrls: ["./publisheddata-details.component.scss"]
})
export class PublisheddataDetailsComponent implements OnInit, OnDestroy {
  publishedData: PublishedData;
  publishedDataId$: any;
  subscriptions = [];
  currentData$ = this.store.pipe(select(selectCurrentPublishedData));
  private routeSubscription = this.route.params
  .pipe(pluck("id"))
  .subscribe((id: string) =>
    this.store.dispatch(new FetchCurrentPublishedData({ id })
  ));


  subscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private store: Store<PublishedData>
  ) {}

  ngOnInit() {

  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    // destroy subscriptions
  }
}
