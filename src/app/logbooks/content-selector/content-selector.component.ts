import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatCheckboxChange } from "@angular/material";
import { Logbook } from "shared/sdk";
import { Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import {
  getFilters,
  getFilteredEntries
} from "state-management/selectors/logbooks.selector";
import {
  FetchFilteredEntriesAction,
  UpdateFilterAction
} from "state-management/actions/logbooks.actions";
import { LogbookFilters } from "state-management/models";

@Component({
  selector: "app-content-selector",
  templateUrl: "./content-selector.component.html",
  styleUrls: ["./content-selector.component.scss"]
})
export class ContentSelectorComponent implements OnInit, OnDestroy {
  logbook: Logbook;
  logbookSubscription: Subscription;
  filter: LogbookFilters;
  filterSubscription: Subscription;
  entry: string;
  public entries = ["Bot Messages", "User Messages", "Images"];

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.logbookSubscription = this.store
      .pipe(select(getFilteredEntries))
      .subscribe(logbook => (this.logbook = logbook));
    this.filterSubscription = this.store
      .pipe(select(getFilters))
      .subscribe(filter => (this.filter = filter));
  }

  ngOnDestroy() {
    this.logbookSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }

  isSelected(entry: string): boolean {
    // console.log("entry: " + entry);
    return true;
  }

  onSelect(event: MatCheckboxChange, entry: string): void {
    console.log("checked: " + entry);

    if (event.checked) {
      switch (entry) {
        case "Bot Messages": {
          this.filter.showBotMessages = true;
          this.store.dispatch(new UpdateFilterAction(this.filter));

          break;
        }
        case "User Messages": {
          this.filter.showUserMessages = true;
          this.store.dispatch(new UpdateFilterAction(this.filter));

          break;
        }
        case "Images": {
          this.filter.showImages = true;
          this.store.dispatch(new UpdateFilterAction(this.filter));

          break;
        }
        default: {
          this.store.dispatch(new UpdateFilterAction(this.filter));

          break;
        }
      }
      console.log("filter", this.filter);
      this.store.dispatch(
        new FetchFilteredEntriesAction(this.logbook.name, this.filter)
      );
    } else {
      console.log("unchecked: " + entry);

      switch (entry) {
        case "Bot Messages": {
          this.filter.showBotMessages = false;

          this.store.dispatch(new UpdateFilterAction(this.filter));

          break;
        }
        case "User Messages": {
          this.filter.showUserMessages = false;
          this.store.dispatch(new UpdateFilterAction(this.filter));

          break;
        }
        case "Images": {
          this.filter.showImages = false;
          this.store.dispatch(new UpdateFilterAction(this.filter));

          break;
        }
        default: {
          this.store.dispatch(new UpdateFilterAction(this.filter));

          break;
        }
      }
      console.log("filter", this.filter);
      this.store.dispatch(
        new FetchFilteredEntriesAction(this.logbook.name, this.filter)
      );
    }
  }
}
