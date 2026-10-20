import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ConditionConfig } from "state-management/state/user.store";
import {
  describeCondition,
  getActiveConfigs,
  groupByJoin,
} from "./condition-filter.utils";

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

  /** The groups the filter is evaluated with: AND inside a group, OR between groups. */
  getGroups(active: ConditionConfig[]): ConditionConfig[][] {
    return groupByJoin(active, ({ condition }) => condition.join);
  }
}
