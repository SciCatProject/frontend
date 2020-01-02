import { Component, Input, Output, EventEmitter } from "@angular/core";
import { TableColumn } from "state-management/models";
import { MatCheckboxChange } from "@angular/material";

export interface SelectColumnEvent {
  checkBoxChange: MatCheckboxChange;
  column: string;
}

@Component({
  selector: "dataset-table-settings",
  templateUrl: "./dataset-table-settings.component.html",
  styleUrls: ["./dataset-table-settings.component.scss"]
})
export class DatasetTableSettingsComponent {
  @Input() tableColumns: TableColumn[] = [];
  filteredColumns: TableColumn[];

  @Output() closeClick = new EventEmitter<MouseEvent>();
  @Output() selectColumn = new EventEmitter<SelectColumnEvent>();

  doCloseClick(event: MouseEvent): void {
    this.closeClick.emit(event);
  }

  doSelectColumn(event: MatCheckboxChange, column: string): void {
    const selectColumnEvent: SelectColumnEvent = {
      checkBoxChange: event,
      column
    };
    this.selectColumn.emit(selectColumnEvent);
  }

  searchColumns(value: string): void {
    const filterValue = value.toLowerCase();
    this.filteredColumns = this.tableColumns.filter(({ name }) =>
      name.toLowerCase().includes(filterValue)
    );
  }
}
