import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { FetchFilteredLogbookAction } from "state-management/actions/logbooks.actions";
import { Logbook } from "shared/sdk";
import { getLogbook } from "state-management/selectors/logbooks.selector";

@Component({
  selector: "app-logbooks-filter",
  templateUrl: "./logbooks-filter.component.html",
  styleUrls: ["./logbooks-filter.component.scss"]
})
export class LogbooksFilterComponent implements OnInit, OnDestroy {
  logbook: Logbook;
  logbookSubscription: Subscription;
  query: string;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.logbookSubscription = this.store
      .pipe(select(getLogbook))
      .subscribe(logbook => {
        this.logbook = logbook;
      });
  }

  ngOnDestroy() {
    this.logbookSubscription.unsubscribe();
  }

  textSearchChanged(query: string) {
    this.store.dispatch(
      new FetchFilteredLogbookAction(this.logbook.name, query)
    );
  }
}
