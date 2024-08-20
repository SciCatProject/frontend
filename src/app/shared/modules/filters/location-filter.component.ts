import { Component } from "@angular/core";
import {
  selectLocationFacetCounts,
  selectLocationFilter,
} from "state-management/selectors/datasets.selectors";
import {
  createSuggestionObserver,
  getFacetCount,
  getFacetId,
  getFilterLabel,
} from "./utils";
import { BehaviorSubject } from "rxjs";
import {
  addLocationFilterAction,
  removeLocationFilterAction,
} from "state-management/actions/datasets.actions";
import { ClearableInputComponent } from "./clearable-input.component";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-location-filter",
  templateUrl: "location-filter.component.html",
  styleUrls: ["location-filter.component.scss"],
})
export class LocationFilterComponent extends ClearableInputComponent {
  protected readonly getFacetId = getFacetId;
  protected readonly getFacetCount = getFacetCount;

  locationFacetCounts$ = this.store.select(selectLocationFacetCounts);
  locationFilter$ = this.store.select(selectLocationFilter);

  locationInput$ = new BehaviorSubject<string>("");

  locationSuggestions$ = createSuggestionObserver(
    this.locationFacetCounts$,
    this.locationInput$,
    this.locationFilter$,
  );

  constructor(private store: Store) {
    super();
  }

  get label() {
    return getFilterLabel(this.constructor.name);
  }

  locationSelected(location: string | null) {
    const loc = location || "";
    this.store.dispatch(addLocationFilterAction({ location: loc }));
    this.locationInput$.next("");
  }

  locationRemoved(location: string) {
    this.store.dispatch(removeLocationFilterAction({ location }));
  }

  onLocationInput(event: any) {
    const value = (<HTMLInputElement>event.target).value;
    this.locationInput$.next(value);
  }
}
