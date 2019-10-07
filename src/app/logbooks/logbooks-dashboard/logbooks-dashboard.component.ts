import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Logbook } from "shared/sdk";
import { Subscription } from "rxjs";
import {
  getCurrentLogbook,
  getFilters,
  getIsLoading
} from "state-management/selectors/logbooks.selector";
import { getCurrentDataset } from "state-management/selectors/datasets.selectors";
import {
  fetchLogbookAction,
  fetchFilteredEntriesAction,
  updateFilterAction
} from "state-management/actions/logbooks.actions";
import { ActivatedRoute } from "@angular/router";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { LogbookFilters } from "state-management/models";

@Component({
  selector: "app-logbooks-dashboard",
  templateUrl: "./logbooks-dashboard.component.html",
  styleUrls: ["./logbooks-dashboard.component.scss"]
})
export class LogbooksDashboardComponent implements OnInit, OnDestroy {
  loading$ = this.store.pipe(select(getIsLoading));

  logbookName: string;

  logbook: Logbook;
  logbookSubscription: Subscription;

  filters: LogbookFilters;
  filtersSubscription: Subscription;

  dataset: any;
  datasetSubscription: Subscription;

  routeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private store: Store<Logbook>,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.logbookSubscription = this.store
      .pipe(select(getCurrentLogbook))
      .subscribe(logbook => {
        this.logbook = logbook;
      });

    this.filtersSubscription = this.store
      .pipe(select(getFilters))
      .subscribe(filter => {
        this.filters = filter;
      });

    this.datasetSubscription = this.store
      .pipe(select(getCurrentDataset))
      .subscribe(dataset => {
        this.dataset = dataset;
      });

    this.routeSubscription = this.route.params.subscribe(params => {
      if (params.hasOwnProperty("name")) {
        this.logbookName = params["name"];
      } else {
        if (this.dataset.hasOwnProperty("proposalId")) {
          this.logbookName = this.dataset.proposalId;
        }
      }
    });

    this.store.dispatch(fetchLogbookAction({ name: this.logbookName }));
  }

  ngOnDestroy() {
    this.logbookSubscription.unsubscribe();
    this.filtersSubscription.unsubscribe();
    this.datasetSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  onTextSearchChange(query: string) {
    this.filters.textSearch = query;
    this.store.dispatch(updateFilterAction({ filters: this.filters }));

    this.store.dispatch(
      fetchFilteredEntriesAction({
        name: this.logbook.name,
        filters: this.filters
      })
    );
  }

  reverseTimeline(): void {
    this.logbook.messages.reverse();
  }
}
