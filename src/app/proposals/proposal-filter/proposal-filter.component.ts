import { Component, Input, Output, EventEmitter } from "@angular/core";
import { DateRange } from "datasets/datasets-filter/datasets-filter.component";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";

@Component({
  selector: "proposal-filter",
  templateUrl: "./proposal-filter.component.html",
  styleUrls: ["./proposal-filter.component.scss"]
})
export class ProposalFilterComponent {
  @Input() hasAppliedFilters: boolean;
  @Input() searchBarValue: string;
  @Input() clearSearchBar: boolean;
  @Input() dateRangeValue:  {
    begin: string;
    end: string;
  };

  @Output() clear = new EventEmitter<any>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() dateChange = new EventEmitter<DateRange>();

  doClear() {
    this.clear.emit();
  }

  doSearchChange(query: string) {
    this.searchChange.emit(query);
  }

  doDateChange(event: MatDatepickerInputEvent<DateRange>) {
    this.dateChange.emit(event.value);
  }
}
