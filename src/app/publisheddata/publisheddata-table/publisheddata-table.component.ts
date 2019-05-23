import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { PublishedData } from "shared/sdk";
import { Subscription } from "rxjs";
import {
  FetchAllPublishedData,
  ChangePagePub
} from "state-management/actions/published-data.actions";
import {
  selectAllPublished,
  getCount,
  getFilters,
  getPage,
  getItemsPerPage
} from "state-management/selectors/published-data.selectors";
import { ActivatedRoute, Router } from "@angular/router";
import { PageEvent } from "@angular/material";
import { PageChangeEvent } from "datasets";
import { map, take } from "rxjs/operators";
import * as rison from "rison";

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
  styleUrls: ["./publisheddata-table.component.scss"]
})
export class PublisheddataTableComponent implements OnInit, OnDestroy {
  public publishedData$ = this.store.pipe(select(selectAllPublished));
  public count$ = this.store.pipe(select(getCount));
  public publishedData: PublishedData[];
  private sub: Subscription[];
  public event: any;
  public page: number;
  public filters$ = this.store.pipe(select(getFilters));
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
  // MatPaginator Inputs
  public length = 100;
  public pageSizeOptions: number[] = [5, 10, 25, 100];
  public currentPage$ = this.store.pipe(select(getPage));
  public itemsPerPage$ = this.store.pipe(select(getItemsPerPage));

  // MatPaginator Output
  public pageEvent: PageEvent;

  private writeRouteSubscription = this.filters$
    .subscribe(filters => {
      // this.store.dispatch(new FetchAllPublishedData());
      this.router.navigate(["/publishedDatasets"], {
        queryParams: { args: rison.encode(filters) }
      });
    });

  // this.route.queryParams = this.page;
  private readRouteSubscription = this.route.queryParams
    .pipe(
      map(params => params.args as string),
      take(1),
      map(args => (args))
    )
    .subscribe(filters =>
      this.store.pipe(select(getFilters))
    );


  constructor(
    private store: Store<PublishedData>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.store.dispatch(new FetchAllPublishedData());
    // this.publishedData$ = this.pubApi.find({ limit: 7 });
    /*this.pubApi.find({ limit: 11 }).subscribe(res => {
      this.publishedData = <PublishedData[]>res;
    });*/
  }

  onClick(published: PublishedData) {
    this.router.navigateByUrl(
      "/publishedDataset/" + encodeURIComponent(published.doi)
    );
  }

  ngOnDestroy() {
    this.writeRouteSubscription.unsubscribe();
    //this.readRouteSubscription.unsubscribe();
    // this.sub.forEach(subscription => subscription.unsubscribe());
  }

  onPageChange(event: PageChangeEvent): void {
    this.store.dispatch(
      new ChangePagePub({ page: event.pageIndex, limit: event.pageSize })
    );
    this.page = event.pageIndex;
    // this.store.dispatch(new FetchAllPublishedData());
  }
}
