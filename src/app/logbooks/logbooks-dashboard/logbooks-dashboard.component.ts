import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Logbook } from "shared/sdk";
import { Subscription } from "rxjs";
import {
  getLogbook,
  getFilters
} from "state-management/selectors/logbooks.selector";
import { getCurrentDataset } from "state-management/selectors/datasets.selectors";
import {
  FetchLogbookAction,
  FetchFilteredEntriesAction,
  UpdateFilterAction
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
  logbookName: string;

  logbook: Logbook;
  logbookSubscription: Subscription;

  filter: LogbookFilters;
  filterSubscription: Subscription;

  dataset: any;
  datasetSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private store: Store<Logbook>,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.logbookSubscription = this.store
      .pipe(select(getLogbook))
      .subscribe(logbook => {
        this.logbook = logbook;
      });

    this.filterSubscription = this.store
      .pipe(select(getFilters))
      .subscribe(filter => {
        this.filter = filter;
      });

    this.datasetSubscription = this.store
      .pipe(select(getCurrentDataset))
      .subscribe(dataset => {
        this.dataset = dataset;
      });

    this.route.params.subscribe(params => {
      if (params.hasOwnProperty("name")) {
        this.logbookName = params["name"];
      } else {
        if (this.dataset.hasOwnProperty("proposalId")) {
          this.logbookName = this.dataset.proposalId;
        }
      }
    });

    this.store.dispatch(new FetchLogbookAction(this.logbookName));
  }

  ngOnDestroy() {
    this.logbookSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
    this.datasetSubscription.unsubscribe();
  }

  onTextSearchChange(query) {
    this.filter.textSearch = query;
    this.store.dispatch(new UpdateFilterAction(this.filter));

    this.store.dispatch(
      new FetchFilteredEntriesAction(this.logbook.name, this.filter)
    );
  }

  reverseTimeline(): void {
    this.logbook.messages.reverse();
  }
}
