import { Component, OnInit, Inject, Input, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { FetchLogbookAction } from "state-management/actions/logbooks.actions";
import {
  getLogbook,
  getSearchedEntries,
  getFilteredEntries
} from "state-management/selectors/logbooks.selector";
import { Logbook } from "state-management/models";

@Component({
  selector: "app-logbooks-detail",
  templateUrl: "./logbooks-detail.component.html",
  styleUrls: ["./logbooks-detail.component.scss"]
})
export class LogbooksDetailComponent implements OnInit, OnDestroy {
  logbook: Logbook;
  logbookSubscription: Subscription;
  searchedEntriesSubscription: Subscription;
  filteredEntriesSubscription: Subscription;
  displayedColumns: string[] = ["timestamp", "sender", "entry"];

  constructor(private route: ActivatedRoute, private store: Store<Logbook>) {}

  ngOnInit() {
    this.getLogbook();

    this.logbookSubscription = this.store
      .pipe(select(getLogbook))
      .subscribe(logbook => {
        this.logbook = logbook;
      });

    this.searchedEntriesSubscription = this.store
      .pipe(select(getSearchedEntries))
      .subscribe(logbook => {
        this.logbook = logbook;
      });

    this.filteredEntriesSubscription = this.store
      .pipe(select(getFilteredEntries))
      .subscribe(logbook => (this.logbook = logbook));
  }

  ngOnDestroy() {
    this.logbookSubscription.unsubscribe();
    this.searchedEntriesSubscription.unsubscribe();
    this.filteredEntriesSubscription.unsubscribe();
  }

  getLogbook(): void {
    let name = this.route.snapshot.paramMap.get("name");
    if (name === null) {
      name = "ERIC";
    }
    this.store.dispatch(new FetchLogbookAction(name));
  }
}
