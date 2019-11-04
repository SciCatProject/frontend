import { Component, Input, Output, EventEmitter } from "@angular/core";
import { DateRange } from "datasets/datasets-filter/datasets-filter.component";
import { MatDatepickerInputEvent } from "@angular/material";

@Component({
  selector: "proposal-filter",
  templateUrl: "./proposal-filter.component.html",
  styleUrls: ["./proposal-filter.component.scss"]
})
export class ProposalFilterComponent {
  @Input() hasAppliedFilters: boolean;
  @Input() clearSearchBar: boolean;
  @Input() dateRangeValue: DateRange;

  @Output() onClear = new EventEmitter<any>();
  @Output() onSearchChange = new EventEmitter<string>();
  @Output() onDateChange = new EventEmitter<DateRange>();

  doClear() {
    this.onClear.emit();
  }

  doSearchChange(query: string) {
    this.onSearchChange.emit(query);
  }

  doDateChange(event: MatDatepickerInputEvent<DateRange>) {
    this.onDateChange.emit(event.value);
  }
}
