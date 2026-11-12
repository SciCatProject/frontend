import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FilterCondition } from "state-management/models";
import { ConditionConfig } from "state-management/state/user.store";
import { describeCondition, getActiveConfigs } from "./advanced-search.utils";

/** The applied filters as chips, the host connects the events to the button. */
@Component({
  selector: "advanced-search-chips",
  templateUrl: "./advanced-search-chips.component.html",
  styleUrls: ["./advanced-search-chips.component.scss"],
  standalone: false,
})
export class AdvancedSearchChipsComponent {
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
