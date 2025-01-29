import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BehaviorSubject } from "rxjs";
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
import { ActivatedRoute, Router } from "@angular/router";

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

  rowHeight = 50;

  pending = false;

  setting: TableSetting = {};

  paginationMode: TablePaginationMode = "server-side";

  showNoData = true;

  dataSource: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  pagination: TablePagination = {};

  stickyHeader = true;

  printConfig: PrintConfig = {};

  showProgress = true;

  dataPlayName: "clear data" | "fetch data" = "clear data";

  noDataBtn = false;

  rowSelectionMode: TableSelectionMode = "multi";

  globalTextSearch = "";

  @Output() pageChange = new EventEmitter<PageChangeEvent>();

  @Input() realDataSource: SciCatDataSource;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    if (queryParams.textSearch) {
      this.globalTextSearch = queryParams.textSearch;
    }
    this.store.dispatch(
      fetchProposalsAction({
        limit: queryParams.pageSize,
        page: queryParams.pageIndex,
        fields: { text: queryParams.textSearch },
      }),
    );

    this.vm$.subscribe((data) => {
      this.dataSource.next(data);
    });

    this.proposalsCount$.subscribe((count) => {
      this.initTable(tableColumnsConfig, tableSettingsConfig, {
        ...paginationConfig,
        pageIndex: queryParams.pageIndex,
        pageSize: queryParams.pageSize,
        length: count,
      });
    });
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

  onPaginationChange(pagination: TablePagination) {
    this.router.navigate([], {
      queryParams: {
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

  onGlobalTextSearchChange(text: string) {
    this.pagination.pageIndex = 0;
    this.router.navigate([], {
      queryParams: {
        textSearch: text,
        pageIndex: 0,
      },
      queryParamsHandling: "merge",
    });

    const fields: Record<string, unknown> = {};

    if (text) {
      fields.text = text;
    }

    this.store.dispatch(
      fetchProposalsAction({
        limit: this.pagination.pageSize,
        page: this.pagination.pageIndex,
        fields: fields,
      }),
    );
  }
}
