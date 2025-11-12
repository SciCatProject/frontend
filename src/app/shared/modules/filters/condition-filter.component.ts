import { Component, Input } from "@angular/core";
import { Store } from "@ngrx/store";
import { ScientificCondition } from "state-management/models";

@Component({
  selector: "app-condition-filter",
  templateUrl: "condition-filter.component.html",
  styleUrls: ["condition-filter.component.scss"],
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

    const unit = condition.unit || "";

    return `${condition.lhs} ${relationSymbol} ${rhsValue} ${unit}`;
  }
}
