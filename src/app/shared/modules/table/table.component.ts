import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

export interface TableColumn {
  name: string;
  icon: string;
  sort: boolean;
  inList: boolean;
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

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html",
  styleUrls: ["./table.component.scss"]
})
export class TableComponent implements OnInit {
  @Input() data: any[];
  @Input() columns: TableColumn[];
  columnsToDisplay: string[];
  listItems: string[];

  @Input() paginate?: boolean;
  @Input() currentPage?: number;
  @Input() dataCount?: number;
  @Input() dataPerPage?: number;
  pageSizeOptions = [10, 25, 50, 100, 500, 1000];

  @Output() pageChange? = new EventEmitter<PageChangeEvent>();
  @Output() sortChange? = new EventEmitter<SortChangeEvent>();
  @Output() rowSelect? = new EventEmitter<any>();

  constructor() {}

  onPageChange(event: PageChangeEvent) {
    this.pageChange.emit(event);
  }

  onSortChange(event: SortChangeEvent) {
    this.sortChange.emit(event);
  }

  onRowSelect(event: any) {
    this.rowSelect.emit(event);
  }

  ngOnInit() {
    if (this.columns) {
      this.columnsToDisplay = this.columns.map(column => {
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
  }
}
