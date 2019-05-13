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
    this.publishedDataId$ = this.route.params.pipe(
      map(params => {
        this.id = params.get("id");
        console.log("gm this id", this.id);
      }),
      filter(id => id != null)
    );

    this.publishedData$ = this.pubApi.findById(
      "10.17199%2FBRIGHTNESS%2FMB0001"
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    // destroy subscriptions
  }
}
