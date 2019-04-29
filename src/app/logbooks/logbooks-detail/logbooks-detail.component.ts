import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { FetchLogbookAction } from "state-management/actions/logbooks.actions";
import {
  getLogbook,
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
  filteredLogbookDescription: Subscription;
  displayedColumns: string[] = ["timestamp", "sender", "entry"];

  constructor(private route: ActivatedRoute, private store: Store<Logbook>) {}

  ngOnInit() {
    this.getLogbook();

    this.logbookSubscription = this.store
      .pipe(select(getLogbook))
      .subscribe(logbook => {
        this.logbook = logbook;
      });

    this.filteredLogbookDescription = this.store
      .pipe(select(getFilteredEntries))
      .subscribe(logbook => (this.logbook = logbook));
  }

  ngOnDestroy() {
    this.logbookSubscription.unsubscribe();
    this.filteredLogbookDescription.unsubscribe();
  }

  getLogbook(): void {
    let name = this.route.snapshot.paramMap.get("name");
    if (name === null) {
      name = "ERIC";
    }
    this.store.dispatch(new FetchLogbookAction(name));
  }
}
