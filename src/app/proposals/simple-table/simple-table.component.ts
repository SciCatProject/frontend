import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DATA } from "./simple-table.model";
import {
  paginationConfig,
  tableColumnsConfig,
  tableSettingsConfig,
} from "./simple-table.config";
import { PageChangeEvent } from "shared/modules/table/table.component";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import { TableSetting } from "shared/modules/dynamic-material-table/models/table-setting.model";
import {
  TablePagination,
  TablePaginationMode,
} from "shared/modules/dynamic-material-table/models/table-pagination.model";
import { PrintConfig } from "shared/modules/dynamic-material-table/models/print-config.model";
import { TableSelectionMode } from "shared/modules/dynamic-material-table/models/table-row.model";

@Component({
  selector: "app-simple-table",
  templateUrl: "./simple-table.component.html",
  styleUrls: ["./simple-table.component.scss"],
})
export class DemoTableComponent implements OnInit {
  columns!: TableField<any>[];

  direction: "ltr" | "rtl" = "ltr";

  showReloadData = true;

  rowHeight = 40;

  pending = false;

  setting: TableSetting = {};

  paginationMode: TablePaginationMode = "server-side";

  showNoData = true;

  dataSource: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  pagination: TablePagination = {};

  stickyHeader = false;

  printConfig: PrintConfig = {};

  showProgress = true;

  dataPlayName: "clear data" | "fetch data" = "clear data";

  noDataBtn = false;

  rowSelectionMode: TableSelectionMode = "multi";

  @Output() pageChange = new EventEmitter<PageChangeEvent>();

  constructor() {}

  ngOnInit(): void {
    this.initTable(tableColumnsConfig, tableSettingsConfig, paginationConfig);
    const newData = DATA.slice(
      this.pagination.pageIndex * this.pagination.pageSize,
      (this.pagination.pageIndex + 1) * this.pagination.pageSize,
    );
    this.dataSource.next(newData);
  }

  initTable(
    columnsConfig: TableField<any>[],
    settingConfig: TableSetting,
    paginationConfig: TablePagination,
  ): void {
    this.columns = columnsConfig;
    this.setting = settingConfig;
    this.pagination = paginationConfig;
  }

  dataPlay(): void {
    const newData = DATA.slice(
      this.pagination.pageIndex * this.pagination.pageSize,
      (this.pagination.pageIndex + 1) * this.pagination.pageSize,
    );
    if (this.dataSource.value !== newData) {
      this.dataSource.next(newData);
      this.dataPlayName = "clear data";
    } else if (this.dataSource.value === newData) {
      this.dataSource.next([]);
      this.dataPlayName = "fetch data";
    }

    this.noDataBtn = !this.noDataBtn;
  }

  changeHeaderMode() {
    this.stickyHeader = !this.stickyHeader;
  }

  onPaginationChange(pagination: TablePagination) {
    const newData = DATA.slice(
      pagination.pageIndex * pagination.pageSize,
      (pagination.pageIndex + 1) * pagination.pageSize,
    );
    this.dataSource.next(newData);
  }
}
