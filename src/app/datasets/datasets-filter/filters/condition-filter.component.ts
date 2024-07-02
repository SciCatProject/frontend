import { Component, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { ScientificCondition } from "../../../state-management/models";

@Component({
  selector: "app-condition-filter",
  template: ` <mat-form-field appearance="fill" class="condition-display-field">
    <mat-label>Condition</mat-label>
    <input matInput [value]="formatCondition()" disabled />
  </mat-form-field>`,
  styles: [
    `
      .mat-mdc-form-field {
        width: 100%;
      }
    `,
  ],
})
export class ConditionFilterComponent {
  @Input() condition: ScientificCondition;

  constructor(private store: Store) {}

  formatCondition() {
    const condition = this.condition;
    let relationSymbol = "";
    switch (condition.relation) {
      case "EQUAL_TO_NUMERIC":
      case "EQUAL_TO_STRING":
        relationSymbol = "=";
        break;
      case "LESS_THAN":
        relationSymbol = "<";
        break;
      case "GREATER_THAN":
        relationSymbol = ">";
        break;
      default:
        relationSymbol = "";
    }

    const rhsValue =
      condition.relation === "EQUAL_TO_STRING"
        ? `"${condition.rhs}"`
        : condition.rhs;

    return `${condition.lhs} ${relationSymbol} ${rhsValue} ${condition.unit}`;
  }
}
