import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { PublishedData } from "shared/sdk";
import { Router } from "@angular/router";
import {
  selectAllPublished,
  getCount,
  getPage,
  getItemsPerPage
} from "state-management/selectors/published-data.selectors";
import {
  FetchAllPublishedData,
  ChangePagePub
} from "state-management/actions/published-data.actions";
import {
  PageChangeEvent,
  TableColumn
} from "shared/modules/table/table.component";

@Component({
  selector: "app-publisheddata-dashboard",
  templateUrl: "./publisheddata-dashboard.component.html",
  styleUrls: ["./publisheddata-dashboard.component.scss"]
})
export class PublisheddataDashboardComponent implements OnInit {
  constructor(private router: Router, private store: Store<PublishedData>) {}

  public publishedData$ = this.store.pipe(select(selectAllPublished));
  public count$ = this.store.pipe(select(getCount));
  public currentPage$ = this.store.pipe(select(getPage));
  public itemsPerPage$ = this.store.pipe(select(getItemsPerPage));

  columns: TableColumn[] = [
    { name: "doi", icon: "fingerprint", sort: false, inList: false },
    { name: "title", icon: "description", sort: false, inList: true },
    { name: "creator", icon: "face", sort: false, inList: true },
    { name: "publicationYear", icon: "date_range", sort: false, inList: true }
  ];
  paginate = true;

  onPageChange(event: PageChangeEvent) {
    this.store.dispatch(
      new ChangePagePub({ page: event.pageIndex, limit: event.pageSize })
    );
  }

  onRowClick(published: PublishedData) {
    const id = encodeURIComponent(published.doi);
    this.router.navigateByUrl("/publishedDatasets/" + id);
  }

  ngOnInit() {
    this.store.dispatch(new FetchAllPublishedData());
  }
}
