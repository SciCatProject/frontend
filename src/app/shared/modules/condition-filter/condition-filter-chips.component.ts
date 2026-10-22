import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FilterCondition } from "state-management/models";
import { ConditionConfig } from "state-management/state/user.store";
import { describeCondition, getActiveConfigs } from "./condition-filter.utils";

/** The applied filters as chips, the host connects the events to the button. */
@Component({
  selector: "condition-filter-chips",
  templateUrl: "./condition-filter-chips.component.html",
  styleUrls: ["./condition-filter-chips.component.scss"],
  standalone: false,
})
export class ConditionFilterChipsComponent {
  @Input() configs: ConditionConfig[] | null = [];

  @Output() filterSelect = new EventEmitter<ConditionConfig>();
  @Output() filterRemove = new EventEmitter<ConditionConfig>();
  @Output() clearAll = new EventEmitter<void>();

  readonly describe = describeCondition;
  readonly getActive = getActiveConfigs;

  /** The filter without its NOT, the chip shows that as a tag of its own. */
  text(condition: FilterCondition): string {
    return describeCondition({ ...condition, exclude: false });
  }
}
