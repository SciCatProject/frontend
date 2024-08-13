import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import {
  createSuggestionObserver,
  getFacetCount,
  getFacetId,
  getFilterLabel,
} from "./utils";
import {
  selectTypeFacetCounts,
  selectTypeFilter,
} from "state-management/selectors/datasets.selectors";
import { Store } from "@ngrx/store";
import { BehaviorSubject } from "rxjs";
import {
  addTypeFilterAction,
  removeTypeFilterAction,
} from "state-management/actions/datasets.actions";

@Component({
  selector: "app-type-filter",
  templateUrl: "type-filter.component.html",
  styleUrls: ["type-filter.component.scss"],
})
export class TypeFilterComponent {
  protected readonly getFacetCount = getFacetCount;
  protected readonly getFacetId = getFacetId;

  typeFacetCounts$ = this.store.select(selectTypeFacetCounts);

  typeFilter$ = this.store.select(selectTypeFilter);
  typeInput$ = new BehaviorSubject<string>("");

  typeSuggestions$ = createSuggestionObserver(
    this.typeFacetCounts$,
    this.typeInput$,
    this.typeFilter$,
  );

  constructor(private store: Store) {}

  get label() {
    return getFilterLabel(this.constructor.name);
  }

  @Input()
  set clear(value: boolean) {
    if (value) {
      this.typeInput$.next("");
    }
  }

  onTypeInput(event: any) {
    const value = (<HTMLInputElement>event.target).value;
    this.typeInput$.next(value);
  }

  typeSelected(type: string) {
    this.store.dispatch(addTypeFilterAction({ datasetType: type }));
    this.typeInput$.next("");
  }

  typeRemoved(type: string) {
    this.store.dispatch(removeTypeFilterAction({ datasetType: type }));
  }
}
