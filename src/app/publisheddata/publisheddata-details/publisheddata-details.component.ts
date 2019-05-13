import { Component, OnInit } from "@angular/core";
import { PublishedData } from "shared/sdk";
import { Store } from "@ngrx/store";
import { ActivatedRoute } from "@angular/router";
import { FetchPublishedData } from "state-management/actions/published-data.actions";
import { map, filter } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: "publisheddata-details",
  templateUrl: "./publisheddata-details.component.html",
  styleUrls: ["./publisheddata-details.component.css"]
})
export class PublisheddataDetailsComponent implements OnInit {
  publishedDataId$: any;
  constructor(
    private route: ActivatedRoute,
    private store: Store<PublishedData>
  ) {}

  ngOnInit() {
    this.publishedDataId$ = this.route.params.pipe(
      map(params => params.id),
      filter(id => id != null)
    );
  }
}
