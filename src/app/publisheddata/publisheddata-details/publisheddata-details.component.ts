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
  styleUrls: ["./publisheddata-details.component.css"]
})
export class PublisheddataDetailsComponent implements OnInit, OnDestroy {
  publishedDataId$: any;
  publishedData$: any;

  subscription: Subscription;
  constructor(
    private route: ActivatedRoute,
    private pubApi: PublishedDataApi,
    private store: Store<PublishedData>
  ) {}

  ngOnInit() {
    this.publishedDataId$ = this.route.params.pipe(
      map(params => params.id),
      filter(id => id != null)
    );
    console.log("id", id);



    this.subscription = this.publishedDataId$
      .pipe(
        flatMap(id => [new FetchPublishedData(id), new SelectSampleAction(id)])
      )
      .subscribe(this.store);

    this.publishedData$ = this.pubApi.findById(id);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    // destroy subscriptions
  }
}
