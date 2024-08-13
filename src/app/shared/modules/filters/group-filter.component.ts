import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import {
  selectGroupFacetCounts,
  selectGroupFilter,
} from "state-management/selectors/datasets.selectors";
import { Store } from "@ngrx/store";
import {
  addGroupFilterAction,
  removeGroupFilterAction,
} from "state-management/actions/datasets.actions";
import {
  createSuggestionObserver,
  getFacetCount,
  getFacetId,
  getFilterLabel,
} from "./utils";
import { BehaviorSubject } from "rxjs";

@Component({
  selector: "app-group-filter",
  templateUrl: "group-filter.component.html",
  styleUrls: ["group-filter.component.scss"],
})
export class GroupFilterComponent {
  protected readonly getFacetId = getFacetId;
  protected readonly getFacetCount = getFacetCount;

  groupFilter$ = this.store.select(selectGroupFilter);

  groupFacetCounts$ = this.store.select(selectGroupFacetCounts);
  groupInput$ = new BehaviorSubject<string>("");

  groupSuggestions$ = createSuggestionObserver(
    this.groupFacetCounts$,
    this.groupInput$,
    this.groupFilter$,
  );

  constructor(private store: Store) {}

  get label() {
    return getFilterLabel(this.constructor.name);
  }

  @Input()
  set clear(value: boolean) {
    if (value) {
      this.groupInput$.next("");
    }
  }

  onGroupInput(event: any) {
    const value = (<HTMLInputElement>event.target).value;
    this.groupInput$.next(value);
  }
  groupSelected(group: string) {
    this.store.dispatch(addGroupFilterAction({ group }));
    this.groupInput$.next("");
  }

  groupRemoved(group: string) {
    this.store.dispatch(removeGroupFilterAction({ group }));
  }
}
