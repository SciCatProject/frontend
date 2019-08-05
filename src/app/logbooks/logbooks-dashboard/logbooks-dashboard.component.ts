import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { Logbook } from "shared/sdk";
import { Subscription } from "rxjs";
import { getLogbook } from "state-management/selectors/logbooks.selector";
import { getCurrentDataset } from "state-management/selectors/datasets.selectors";
import { FetchLogbookAction } from "state-management/actions/logbooks.actions";
import { ActivatedRoute } from "@angular/router";
import { APP_CONFIG, AppConfig } from "app-config.module";

@Component({
  selector: "app-logbooks-dashboard",
  templateUrl: "./logbooks-dashboard.component.html",
  styleUrls: ["./logbooks-dashboard.component.scss"]
})
export class LogbooksDashboardComponent implements OnInit, OnDestroy {
  logbookName: string;

  logbook: Logbook;
  logbookSubscription: Subscription;

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
    this.datasetSubscription = this.store
      .pipe(select(getCurrentDataset))
      .subscribe(dataset => {
        this.dataset = dataset;
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
    this.datasetSubscription.unsubscribe();
  }

  reverseTimeline(): void {
    this.logbook.messages.reverse();
  }
}
