import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { PublishedData } from "shared/sdk";
import { selectPublishedDataEntities } from "state-management/reducers/published-data.reducer";
import { FetchAllPublishedData } from "state-management/actions/published-data.actions";

@Component({
  selector: "publisheddata-table",
  templateUrl: "./publisheddata-table.component.html",
  styleUrls: ["./publisheddata-table.component.css"]
})
export class PublisheddataTableComponent implements OnInit {
  public publishedData$ = this.store.pipe(select(selectPublishedDataEntities));
  public publishedData: PublishedData[];
  private subscriptions = [];
  constructor(private store: Store<PublishedData>) {}

  ngOnInit() {
    this.store.dispatch(new FetchAllPublishedData);
    this.subscriptions.push(
      this.publishedData$.subscribe(data => {
        this.publishedData = data;
      })
    );
  }
}
