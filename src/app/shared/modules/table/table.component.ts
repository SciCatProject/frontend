import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { MatCheckboxChange } from "@angular/material/checkbox";

export interface TableColumn {
  name: string;
  icon: string;
  sort: boolean;
  inList: boolean;
  dateFormat?: string;
  pipe?: any;
}

export interface PageChangeEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
}

export interface SortChangeEvent {
  active: string;
  direction: "asc" | "desc" | "";
}

export interface CheckboxEvent {
  event: MatCheckboxChange;
  row: any;
}

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"]
})
export class TableComponent implements OnInit {
  @Input() data: any[];
  @Input() columns: TableColumn[];
  displayedColumns: string[];
  listItems: string[];

  @Input() select?: boolean;
  @Input() allChecked?: boolean;
  @Input() oneChecked?: boolean;
  selection = new SelectionModel<any>(true, []);

  @Input() paginate?: boolean;
  @Input() currentPage?: number;
  @Input() dataCount?: number;
  @Input() dataPerPage?: number;
  pageSizeOptions = [10, 25, 50, 100, 500, 1000];

  @Output() pageChange = new EventEmitter<PageChangeEvent>();
  @Output() sortChange = new EventEmitter<SortChangeEvent>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() selectAll = new EventEmitter<MatCheckboxChange>();
  @Output() selectOne = new EventEmitter<CheckboxEvent>();

  onPageChange(event: PageChangeEvent) {
    this.pageChange.emit(event);
  }

  onSortChange(event: SortChangeEvent) {
    this.sortChange.emit(event);
  }

  onRowClick(event: any) {
    this.rowClick.emit(event);
  }

  onSelectAll(event: MatCheckboxChange) {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.data.forEach(row => this.selection.select(row));
    }
    this.selectAll.emit(event);
  }

  onSelectOne(event: MatCheckboxChange, row: any) {
    this.selection.toggle(row);
    const selectEvent: CheckboxEvent = {
      event: event,
      row: row
    };
    this.selectOne.emit(selectEvent);
  }

  isAllSelected() {
    const numSelected = this.selection.selected
      ? this.selection.selected.length
      : 0;
    const numRows = this.data ? this.data.length : 0;
    return numSelected === numRows;
  }

  ngOnInit() {
    if (this.columns) {
      this.displayedColumns = this.columns.map(column => {
        return column.name;
      });

      this.listItems = this.columns
        .filter(column => {
          return column.inList;
        })
        .map(listItem => {
          return listItem.name;
        });
    }

    if (this.select) {
      this.displayedColumns.splice(0, 0, "select");
    }
  }
}
