import { Component, OnInit, OnDestroy } from "@angular/core";
import { PublishedData, PublishedDataApi } from "shared/sdk";
import { Store, select } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";
import { FetchPublishedData } from "state-management/actions/published-data.actions";
import { map, filter, flatMap } from "rxjs/operators";
import { Observable, Subscription } from "rxjs";
import { getSelectedPublishedDataId } from "state-management/reducers/published-data.reducer";

@Component({
  selector: "publisheddata-details",
  templateUrl: "./publisheddata-details.component.html",
  styleUrls: ["./publisheddata-details.component.scss"]
})
export class PublisheddataDetailsComponent implements OnInit, OnDestroy {
  id: string;
  publishedDataId$: any;
  publishedData$: any;

  subscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private pubApi: PublishedDataApi,
    private store: Store<PublishedData>
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      console.log("gm params", params);
      this.id = params["params"]["id"];
      console.log(this.id); // log the value of id
      this.publishedData$ = this.pubApi.findById(
        encodeURIComponent(this.id)
    );
      this.store.dispatch(new FetchPublishedData({ id: encodeURIComponent(this.id) }) );
    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    // destroy subscriptions
  }
}
