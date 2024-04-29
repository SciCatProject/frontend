import { Component } from "@angular/core";
import { ClearableInputComponent } from "./clearable-input.component";
import { createSuggestionObserver, getFacetCount, getFacetId } from "../utils";
import {
  selectTypeFacetCounts,
  selectTypeFilter,
} from "../../../state-management/selectors/datasets.selectors";
import { Store } from "@ngrx/store";
import { BehaviorSubject } from "rxjs";
import {
  addTypeFilterAction,
  removeTypeFilterAction,
} from "../../../state-management/actions/datasets.actions";

@Component({
  selector: "app-type-filter",
  template: `<mat-form-field>
    <mat-label>Type</mat-label>
    <mat-chip-grid #typeChipList>
      <mat-chip-row
        *ngFor="let type of typeFilter$ | async"
        [removable]="true"
        (removed)="typeRemoved(type)"
        >{{ type }}<mat-icon matChipRemove>cancel</mat-icon>
      </mat-chip-row>
    </mat-chip-grid>
    <input
      (input)="onTypeInput($event)"
      [value]="typeInput$ | async"
      matInput
      class="type-input"
      [matChipInputFor]="typeChipList"
      [matAutocomplete]="type"
    />

    <mat-autocomplete #type="matAutocomplete">
      <mat-option
        (onSelectionChange)="typeSelected(getFacetId(fc))"
        *ngFor="let fc of typeSuggestions$ | async"
      >
        <span>{{ getFacetId(fc, "No Type") }}</span> |
        <small>{{ getFacetCount(fc) }}</small>
      </mat-option>
    </mat-autocomplete>
  </mat-form-field>`,
  styles: [
    `
      .mat-mdc-form-field {
        width: 100%;
      }
    `,
  ],
})
export class TypeFilterComponent extends ClearableInputComponent {
  static kName = "type";

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

  constructor(private store: Store) {
    super();
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
