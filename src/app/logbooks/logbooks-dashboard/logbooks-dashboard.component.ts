import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectorRef,
  AfterViewChecked
} from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Logbook } from "shared/sdk";
import { Subscription } from "rxjs";
import {
  getCurrentLogbook,
  getFilters
} from "state-management/selectors/logbooks.selectors";
import { getCurrentDataset } from "state-management/selectors/datasets.selectors";
import {
  fetchLogbookAction,
  fetchFilteredEntriesAction,
  setFilterAction
} from "state-management/actions/logbooks.actions";
import { ActivatedRoute } from "@angular/router";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { LogbookFilters } from "state-management/models";

@Component({
  selector: "app-logbooks-dashboard",
  templateUrl: "./logbooks-dashboard.component.html",
  styleUrls: ["./logbooks-dashboard.component.scss"]
})
export class LogbooksDashboardComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  logbook: Logbook;
  logbookSubscription: Subscription;

  filters: LogbookFilters;
  filtersSubscription: Subscription;

  dataset: any;
  datasetSubscription: Subscription;

  routeSubscription: Subscription;

  onTextSearchChange(query: string) {
    this.filters.textSearch = query;
    this.store.dispatch(setFilterAction({ filters: this.filters }));
    this.store.dispatch(
      fetchFilteredEntriesAction({
        name: this.logbook.name,
        filters: this.filters
      })
    );
  }

  onFilterSelect(filters: LogbookFilters) {
    this.filters = filters;
    this.store.dispatch(setFilterAction({ filters: this.filters }));
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

  constructor(
    private cdRef: ChangeDetectorRef,
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
        const logbookName = params["name"];
        this.store.dispatch(fetchLogbookAction({ name: logbookName }));
      } else {
        if (this.dataset.hasOwnProperty("proposalId")) {
          const logbookName = this.dataset.proposalId;
          this.store.dispatch(fetchLogbookAction({ name: logbookName }));
        }
      }
    });
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.logbookSubscription.unsubscribe();
    this.filtersSubscription.unsubscribe();
    this.datasetSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }
}
