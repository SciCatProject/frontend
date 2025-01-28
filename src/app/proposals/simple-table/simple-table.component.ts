import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
import { SciCatDataSource } from "shared/services/scicat.datasource";
import { Store } from "@ngrx/store";
import {
  selectProposals,
  selectProposalsCount,
} from "state-management/selectors/proposals.selectors";
import { fetchProposalsAction } from "state-management/actions/proposals.actions";
import { Router } from "@angular/router";

@Component({
  selector: "app-simple-table",
  templateUrl: "./simple-table.component.html",
  styleUrls: ["./simple-table.component.scss"],
})
export class DemoTableComponent implements OnInit {
  vm$ = this.store.select(selectProposals);
  proposalsCount$ = this.store.select(selectProposalsCount);

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

  @Input() realDataSource: SciCatDataSource;

  constructor(
    private store: Store,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(fetchProposalsAction({ limit: 10, page: 0 }));

    this.vm$.subscribe((data) => {
      this.dataSource.next(data);
    });

    this.proposalsCount$.subscribe((count) => {
      this.initTable(tableColumnsConfig, tableSettingsConfig, {
        ...paginationConfig,
        length: count,
      });
    });

    // const newData = DATA.slice(
    //   this.pagination.pageIndex * this.pagination.pageSize,
    //   (this.pagination.pageIndex + 1) * this.pagination.pageSize,
    // );
    // this.realDataSource.connect().subscribe((data) => {
    //   console.log(data);
    //   this.dataSource.next(data);
    // });
    // this.dataSource.next(newData);
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
    // const newData = DATA.slice(
    //   pagination.pageIndex * pagination.pageSize,
    //   (pagination.pageIndex + 1) * pagination.pageSize,
    // );
    // this.dataSource.next(newData);

    this.router.navigate([], {
      queryParams: {
        // sortActive: this.sort.active,
        // sortDirection: this.sort.direction,
        pageIndex: this.pagination.pageIndex,
        pageSize: this.pagination.pageSize,
      },
      queryParamsHandling: "merge",
    });

    this.store.dispatch(
      fetchProposalsAction({
        limit: pagination.pageSize,
        page: pagination.pageIndex,
      }),
    );
  }
}
