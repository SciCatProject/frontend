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

@Component({
  selector: "app-logbooks-detail",
  templateUrl: "./logbooks-detail.component.html",
  styleUrls: ["./logbooks-detail.component.scss"]
})
export class LogbooksDetailComponent implements OnInit, OnDestroy {
  logbook: Logbook;
  logbookSubscription: Subscription;
  filteredLogbookDescription: Subscription;
  displayedColumns: string[] = ["timestamp", "sender", "entry"];

  dataset: any;
  datasetSubscription: Subscription;

  constructor(private store: Store<Logbook>) {}

  ngOnInit() {
    this.logbookSubscription = this.store
      .pipe(select(getLogbook))
      .subscribe(logbook => {
        this.logbook = logbook;
      });

    this.filteredLogbookDescription = this.store
      .pipe(select(getFilteredEntries))
      .subscribe(logbook => (this.logbook = logbook));

    this.datasetSubscription = this.store
      .pipe(select(getCurrentDataset))
      .subscribe(dataset => {
        this.dataset = dataset;
        if (this.dataset.hasOwnProperty("proposalId")) {
          this.store.dispatch(new FetchLogbookAction(this.dataset.proposalId));
        }
      });
  }

  ngOnDestroy() {
    this.logbookSubscription.unsubscribe();
    this.filteredLogbookDescription.unsubscribe();
    this.datasetSubscription.unsubscribe();
  }
}
