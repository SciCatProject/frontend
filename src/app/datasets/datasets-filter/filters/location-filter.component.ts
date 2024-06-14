import { Component } from "@angular/core";
import {
  selectLocationFacetCounts,
  selectLocationFilter,
} from "../../../state-management/selectors/datasets.selectors";
import { createSuggestionObserver, getFacetCount, getFacetId } from "../utils";
import { BehaviorSubject } from "rxjs";
import {
  addLocationFilterAction,
  removeLocationFilterAction,
} from "../../../state-management/actions/datasets.actions";
import { ClearableInputComponent } from "./clearable-input.component";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-location-filter",
  template: `
    <mat-form-field>
      <mat-label>{{ label }}</mat-label>
      <mat-chip-grid #locationChipList>
        <mat-chip-row
          *ngFor="let location of locationFilter$ | async"
          [removable]="true"
          (removed)="locationRemoved(location)"
          >{{ location || "No Location" }}
          <mat-icon matChipRemove>cancel</mat-icon>
        </mat-chip-row>
      </mat-chip-grid>
      <input
        #input
        (input)="onLocationInput($event)"
        [value]="locationInput$ | async"
        matInput
        class="location-input"
        [matChipInputFor]="locationChipList"
        [matAutocomplete]="loc"
      />

      <mat-autocomplete #loc="matAutocomplete">
        <mat-option
          (onSelectionChange)="locationSelected(getFacetId(fc))"
          *ngFor="let fc of locationSuggestions$ | async"
        >
          <span>{{ getFacetId(fc, "No Location") }} | </span>
          <small>{{ getFacetCount(fc) }}</small>
        </mat-option>
      </mat-autocomplete>
    </mat-form-field>
  `,
  styles: [
    `
      .mat-mdc-form-field {
        width: 100%;
      }
    `,
  ],
})
export class LocationFilterComponent extends ClearableInputComponent {
  static kLabel = "Location";

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
    return LocationFilterComponent.kLabel;
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
