import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { PublishedData, PublishedDataApi } from "shared/sdk";
import { Observable, Subscription } from "rxjs";

export interface PubElement {
  doi: string;
  affiliation: string;
  creator: string;
  publisher: string;
  publicationYear: number;
  title: string;
}

const ELEMENT_DATA: PubElement[] = [
  {
    doi: "10.17199/BRIGHTNESS/BeamInstrumentation0001",
    affiliation: "ESS",
    creator: "Clement Derrez",
    publisher: "ESS",
    publicationYear: 2018,
    title: "Sample Data from BeamInstrumentation"
  },
  {
    doi: "10.17199/BRIGHTNESS/BeamInstrumentation0002",
    affiliation: "ESS",
    creator: "Clement Derrez",
    publisher: "ESS",
    publicationYear: 2018,
    title: "Sample Data from BeamInstrumentation"
  }
];

@Component({
  selector: "publisheddata-table",
  templateUrl: "./publisheddata-table.component.html",
  styleUrls: ["./publisheddata-table.component.css"]
})
export class PublisheddataTableComponent implements OnInit, OnDestroy {
  public publishedData$: Observable<PublishedData[]>;
  public publishedData: PublishedData[];
  private sub: Subscription;
  public constData = [
    {
      name: "x1",
      owner: "owner1"
    }
  ];
  public displayedColumns: string[] = [
    "doi",
    "creator",
    "title",
    "publicationYear"
  ];
  public dataSource = ELEMENT_DATA;

  constructor(
    private store: Store<PublishedData>,
    private pubApi: PublishedDataApi
  ) {}

  ngOnInit() {
    this.publishedData$ = this.pubApi.find({ limit: 5 });
    this.sub = this.pubApi.find({ limit: 5 }).subscribe(
      res => {
        this.publishedData = <PublishedData[]>res;
      }
    );
    // this.store.dispatch(new FetchAllPublishedData());
  }

  ngOnDestroy() {
    //    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
