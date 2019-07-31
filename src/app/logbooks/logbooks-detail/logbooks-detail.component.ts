import { Component, OnInit, OnDestroy } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { FetchLogbookAction } from "state-management/actions/logbooks.actions";
import {
  getLogbook,
  getFilteredEntries
} from "state-management/selectors/logbooks.selector";
import { Logbook } from "state-management/models";
import { getCurrentDataset } from "state-management/selectors/datasets.selectors";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-logbooks-detail",
  templateUrl: "./logbooks-detail.component.html",
  styleUrls: ["./logbooks-detail.component.scss"]
})
export class LogbooksDetailComponent implements OnInit, OnDestroy {
  logbookName: string;

  logbook: Logbook;
  logbookSubscription: Subscription;
  filteredLogbookDescription: Subscription;
  displayedColumns: string[] = ["timestamp", "sender", "entry"];

  dataset: any;
  datasetSubscription: Subscription;

  constructor(private route: ActivatedRoute, private store: Store<Logbook>) {}

  ngOnInit() {
    this.logbookSubscription = this.store
      .pipe(select(getLogbook))
      .subscribe(logbook => {
        this.logbook = logbook;
      });

    this.filteredLogbookDescription = this.store
      .pipe(select(getFilteredEntries))
      .subscribe(logbook => {
        this.logbook = logbook
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
    this.filteredLogbookDescription.unsubscribe();
    this.datasetSubscription.unsubscribe();
  }
}
