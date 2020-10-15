import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Logbook } from "state-management/models";
import {
  PageChangeEvent,
  SortChangeEvent
} from "shared/modules/table/table.component";

@Component({
  selector: "app-logbooks-detail",
  templateUrl: "./logbooks-detail.component.html",
  styleUrls: ["./logbooks-detail.component.scss"]
})
export class LogbooksDetailComponent {
  @Input() logbook: Logbook;
  @Input() entriesCount: number;
  @Input() entriesPerPage: number;
  @Input() currentPage: number;

  @Output() pageChange = new EventEmitter<PageChangeEvent>();
  @Output() sortChange = new EventEmitter<SortChangeEvent>();

  displayedColumns: string[] = ["timestamp", "sender", "entry"];

  doPageChange(event: PageChangeEvent) {
    this.pageChange.emit(event);
  }

  doSortChange(event: SortChangeEvent) {
    this.sortChange.emit(event);
  }
}
