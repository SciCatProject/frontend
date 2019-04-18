import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { MatCheckboxChange } from "@angular/material";
import { Logbook } from "shared/sdk";
import { Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import { getFilteredEntries } from "state-management/selectors/logbooks.selector";
import {
  FetchLogbookAction,
  FetchFilteredEntriesAction
} from "state-management/actions/logbooks.actions";

@Component({
  selector: "app-content-selector",
  templateUrl: "./content-selector.component.html",
  styleUrls: ["./content-selector.component.scss"]
})
export class ContentSelectorComponent implements OnInit, OnDestroy {
  logbook: Logbook;
  logbookSubscription: Subscription;
  entry: string;
  public entries = ["Bot Messages", "User Messages", "Images"];

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.logbookSubscription = this.store
      .pipe(select(getFilteredEntries))
      .subscribe(logbook => (this.logbook = logbook));
  }

  ngOnDestroy() {
    this.logbookSubscription.unsubscribe();
  }

  isSelected(entry: string): boolean {
    // console.log("entry: " + entry);
    return true;
  }

  onSelect(event: MatCheckboxChange, entry: string): void {
    if (event.checked) {
      console.log("checked: " + entry);
      this.store.dispatch(new FetchLogbookAction(this.logbook.name));
    } else {
      console.log("unchecked: " + entry);
      this.store.dispatch(
        new FetchFilteredEntriesAction(this.logbook.name, entry)
      );
    }
  }
}
