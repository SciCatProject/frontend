import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { PublishedData } from "shared/sdk";
import { Router } from "@angular/router";
import {
  getAllPublishedData,
  getPublishedDataCount,
  getPage,
  getPublishedDataPerPage,
  getFilters
} from "state-management/selectors/published-data.selectors";
import {
  fetchAllPublishedDataAction,
  changePageAction,
  sortByColumnAction
} from "state-management/actions/published-data.actions";
import {
  PageChangeEvent,
  TableColumn,
  SortChangeEvent
} from "shared/modules/table/table.component";
import { Subscription } from "rxjs";
import * as rison from "rison";

@Component({
  selector: "app-publisheddata-dashboard",
  templateUrl: "./publisheddata-dashboard.component.html",
  styleUrls: ["./publisheddata-dashboard.component.scss"]
})
export class PublisheddataDashboardComponent implements OnInit, OnDestroy {
  public publishedData$ = this.store.pipe(select(getAllPublishedData));
  public count$ = this.store.pipe(select(getPublishedDataCount));
  public currentPage$ = this.store.pipe(select(getPage));
  public itemsPerPage$ = this.store.pipe(select(getPublishedDataPerPage));

  columns: TableColumn[] = [
    { name: "doi", icon: "fingerprint", sort: true, inList: false },
    { name: "title", icon: "description", sort: true, inList: true },
    { name: "creator", icon: "face", sort: true, inList: true },
    { name: "publicationYear", icon: "date_range", sort: true, inList: true },
    { name: "createdBy", icon: "account_circle", sort: true, inList: true }
  ];
  paginate = true;

  filtersSubscription: Subscription;

  onPageChange(event: PageChangeEvent) {
    this.store.dispatch(
      changePageAction({ page: event.pageIndex, limit: event.pageSize })
    );
  }

  onSortChange(event: SortChangeEvent) {
    const { active: column, direction } = event;
    this.store.dispatch(sortByColumnAction({ column, direction }));
  }

  onRowClick(published: PublishedData) {
    const id = encodeURIComponent(published.doi);
    this.router.navigateByUrl("/publishedDatasets/" + id);
  }

  constructor(private router: Router, private store: Store<PublishedData>) {}

  ngOnInit() {
    this.store.dispatch(fetchAllPublishedDataAction());

    this.filtersSubscription = this.store
      .pipe(select(getFilters))
      .subscribe(filters => {
        this.router.navigate(["/publishedDatasets"], {
          queryParams: { args: rison.encode(filters) }
        });
      });
  }

  ngOnDestroy() {
    this.filtersSubscription.unsubscribe();
  }
}
