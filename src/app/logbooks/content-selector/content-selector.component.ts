import { Component, OnInit, OnDestroy } from "@angular/core";
import { MatCheckboxChange } from "@angular/material";
import { Logbook } from "shared/sdk";
import { Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import {
  getFilters,
  getCurrentLogbook
} from "state-management/selectors/logbooks.selector";
import {
  fetchFilteredEntriesAction,
  updateFilterAction
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

  filters: LogbookFilters;
  filterSubscription: Subscription;

  public entries = ["Bot Messages", "User Messages", "Images"];

  isSelected(entry: string): boolean {
    return true;
  }

  onSelect(event: MatCheckboxChange, entry: string): void {
    if (event.checked) {
      switch (entry) {
        case "Bot Messages": {
          this.filters.showBotMessages = true;
          break;
        }
        case "User Messages": {
          this.filters.showUserMessages = true;
          break;
        }
        case "Images": {
          this.filters.showImages = true;
          break;
        }
        default: {
          break;
        }
      }
      this.store.dispatch(updateFilterAction({ filters: this.filters }));
      this.store.dispatch(
        fetchFilteredEntriesAction({
          name: this.logbook.name,
          filters: this.filters
        })
      );
    } else {
      switch (entry) {
        case "Bot Messages": {
          this.filters.showBotMessages = false;
          break;
        }
        case "User Messages": {
          this.filters.showUserMessages = false;
          break;
        }
        case "Images": {
          this.filters.showImages = false;
          break;
        }
        default: {
          break;
        }
      }
      this.store.dispatch(updateFilterAction({ filters: this.filters }));
      this.store.dispatch(
        fetchFilteredEntriesAction({
          name: this.logbook.name,
          filters: this.filters
        })
      );
    }
  }

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.logbookSubscription = this.store
      .pipe(select(getCurrentLogbook))
      .subscribe(logbook => (this.logbook = logbook));

    this.filterSubscription = this.store
      .pipe(select(getFilters))
      .subscribe(filters => (this.filters = filters));
  }

  ngOnDestroy() {
    this.logbookSubscription.unsubscribe();
    this.filterSubscription.unsubscribe();
  }
}
