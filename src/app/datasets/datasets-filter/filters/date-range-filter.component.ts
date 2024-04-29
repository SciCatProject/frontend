import { Component, Input } from "@angular/core";
import { ClearableInputComponent } from "./clearable-input.component";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DateTime } from "luxon";
import { setDateRangeFilterAction } from "../../../state-management/actions/datasets.actions";
import { selectCreationTimeFilter } from "../../../state-management/selectors/datasets.selectors";
import { Store } from "@ngrx/store";

interface DateRange {
  begin: string;
  end: string;
}

@Component({
  selector: "app-date-range-filter",
  template: `<mat-form-field>
    <mat-label>Start Date - End Date</mat-label>
    <mat-date-range-input class="date-input" [rangePicker]="picker">
      <input
        matStartDate
        name="begin"
        [value]="(creationTimeFilter$ | async)?.begin"
        (dateChange)="dateChanged($event)"
      />
      <input
        matEndDate
        name="end"
        [value]="(creationTimeFilter$ | async)?.end"
        (dateChange)="dateChanged($event)"
      />
    </mat-date-range-input>
    <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
    <mat-date-range-picker #picker></mat-date-range-picker>
  </mat-form-field>`,
  styles: [
    `
      .mat-mdc-form-field {
        width: 100%;
      }
    `,
  ],
})
export class DateRangeFilterComponent extends ClearableInputComponent {
  static kName = "date";

  creationTimeFilter$ = this.store.select(selectCreationTimeFilter);

  dateRange: DateRange = {
    begin: "",
    end: "",
  };

  constructor(private store: Store) {
    super();
  }

  dateChanged(event: MatDatepickerInputEvent<DateTime>) {
    if (event.value) {
      const name = event.targetElement.getAttribute("name");
      if (name === "begin") {
        this.dateRange.begin = event.value.toUTC().toISO();
        this.dateRange.end = "";
      }
      if (name === "end") {
        this.dateRange.end = event.value.toUTC().plus({ days: 1 }).toISO();
      }
      if (this.dateRange.begin.length > 0 && this.dateRange.end.length > 0) {
        this.store.dispatch(setDateRangeFilterAction(this.dateRange));
      }
    } else {
      this.store.dispatch(setDateRangeFilterAction({ begin: "", end: "" }));
    }
  }

  @Input()
  set clear(value: boolean) {
    if (value)
      this.dateRange = {
        begin: "",
        end: "",
      };
  }
}
