import { Component } from "@angular/core";
import {
  selectGroupFacetCounts,
  selectGroupFilter,
} from "../../../state-management/selectors/datasets.selectors";
import { Store } from "@ngrx/store";
import {
  addGroupFilterAction,
  removeGroupFilterAction,
} from "../../../state-management/actions/datasets.actions";
import { createSuggestionObserver, getFacetCount, getFacetId } from "../utils";
import { BehaviorSubject } from "rxjs";
import { ClearableInputComponent } from "./clearable-input.component";

@Component({
  selector: "app-group-filter",
  template: `<mat-form-field>
    <mat-label>{{ label }}</mat-label>
    <mat-chip-grid #groupChipList>
      <mat-chip-row
        *ngFor="let group of groupFilter$ | async"
        [removable]="true"
        (removed)="groupRemoved(group)"
        >{{ group }}<mat-icon matChipRemove>cancel</mat-icon>
      </mat-chip-row>
    </mat-chip-grid>
    <input
      (input)="onGroupInput($event)"
      [value]="groupInput$ | async"
      matInput
      class="group-input"
      [matChipInputFor]="groupChipList"
      [matAutocomplete]="grp"
    />
    <mat-autocomplete #grp="matAutocomplete">
      <mat-option
        (onSelectionChange)="groupSelected(getFacetId(fc))"
        *ngFor="let fc of groupSuggestions$ | async"
      >
        <span>{{ getFacetId(fc, "No Group") }}</span> |
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
export class GroupFilterComponent extends ClearableInputComponent {
  static kName = "group";

  protected readonly getFacetId = getFacetId;
  protected readonly getFacetCount = getFacetCount;

  label = "Group";

  groupFilter$ = this.store.select(selectGroupFilter);

  groupFacetCounts$ = this.store.select(selectGroupFacetCounts);
  groupInput$ = new BehaviorSubject<string>("");

  groupSuggestions$ = createSuggestionObserver(
    this.groupFacetCounts$,
    this.groupInput$,
    this.groupFilter$,
  );

  constructor(private store: Store) {
    super();
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
