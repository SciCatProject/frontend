import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import {
  UpdateFilterAction,
  FetchFilteredEntriesAction
} from "state-management/actions/logbooks.actions";
import { Logbook } from "shared/sdk";
import {
  getFilters,
  getFilteredEntries
} from "state-management/selectors/logbooks.selector";
import { LogbookFilters } from "state-management/models";

@Component({
  selector: "app-logbooks-filter",
  templateUrl: "./logbooks-filter.component.html",
  styleUrls: ["./logbooks-filter.component.scss"]
})
export class LogbooksFilterComponent implements OnInit, OnDestroy {
  logbook: Logbook;
  logbookSubscription: Subscription;
  filter: LogbookFilters;
  filterSubscription: Subscription;
  query: string;

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.logbookSubscription = this.store
      .pipe(select(getFilteredEntries))
      .subscribe(logbook => {
        this.logbook = logbook;
      });
    this.filterSubscription = this.store
      .pipe(select(getFilters))
      .subscribe(filter => (this.filter = filter));
  }

  ngOnDestroy() {
    this.logbookSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }

  textSearchChanged(query: string) {
    this.filter.textSearch = query;
    this.store.dispatch(new UpdateFilterAction(this.filter));

    let filterJSON = JSON.stringify(this.filter);
    this.store.dispatch(
      new FetchFilteredEntriesAction(this.logbook.name, filterJSON)
    );
  }
}
