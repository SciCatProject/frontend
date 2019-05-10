import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { PublishedData } from "shared/sdk";
import { FetchAllPublishedData } from "state-management/actions/published-data.actions";

@Component({
  selector: "publisheddata-table",
  templateUrl: "./publisheddata-table.component.html",
  styleUrls: ["./publisheddata-table.component.css"]
})
export class PublisheddataTableComponent implements OnInit {
  public publishedData$ = this.store.pipe(select(FetchAllPublishedData));
  constructor(
    private store: Store<PublishedData>,
  ) {}

  ngOnInit() {}
}
