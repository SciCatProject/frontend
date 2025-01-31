import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { PageChangeEvent } from "shared/modules/table/table.component";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import {
  TableSetting,
  VisibleActionMenu,
} from "shared/modules/dynamic-material-table/models/table-setting.model";
import {
  TablePagination,
  TablePaginationMode,
} from "shared/modules/dynamic-material-table/models/table-pagination.model";
import { PrintConfig } from "shared/modules/dynamic-material-table/models/print-config.model";
import {
  IRowEvent,
  RowEventType,
  TableSelectionMode,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { SciCatDataSource } from "shared/services/scicat.datasource";
import { Store } from "@ngrx/store";
import {
  selectProposals,
  selectProposalsCount,
} from "state-management/selectors/proposals.selectors";
import { fetchProposalsAction } from "state-management/actions/proposals.actions";
import { ActivatedRoute, Router } from "@angular/router";
import { ProposalClass } from "@scicatproject/scicat-sdk-ts-angular";

export const tableColumnsConfig: TableField<any>[] = [
  {
    name: "proposalId",
    header: "Proposal ID",
    icon: "perm_device_information",
    type: "text",
  },
  {
    name: "title",
    icon: "description",
  },
  {
    name: "abstract",
    icon: "chrome_reader_mode",
  },
  { name: "email", icon: "email" },
  { name: "type", icon: "badge" },
  {
    name: "createdBy",
    icon: "badge",
  },
];

const actionMenu: VisibleActionMenu = {
  json: true,
  csv: true,
  print: true,
  columnSettingPin: true,
  columnSettingFilter: true,
  clearFilter: true,
};

const tableSettingsConfig: TableSetting = {
  direction: "ltr",
  visibleActionMenu: actionMenu,
  autoHeight: false,
  saveSettingMode: "multi",
  rowStyle: {
    "border-bottom": "1px solid #d2d2d2",
  },
};

const DEFAULT_PAGE_SIZE = 10;

@Component({
  selector: "app-proposal-dashboard",
  templateUrl: "./proposal-dashboard.component.html",
  styleUrls: ["./proposal-dashboard.component.scss"],
})
export class ProposalDashboardComponent implements OnInit {
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

  dataSource: BehaviorSubject<ProposalClass[]> = new BehaviorSubject<
    ProposalClass[]
  >([]);

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
        limit: queryParams.pageSize || DEFAULT_PAGE_SIZE,
        page: queryParams.pageIndex,
        fields: { text: queryParams.textSearch },
      }),
    );

    this.vm$.subscribe((data) => {
      this.dataSource.next(data);
    });

    this.proposalsCount$.subscribe((count) => {
      const pagginationConfig = {
        pageSizeOptions: [5, 10, 25, 100],
        pageIndex: queryParams.pageIndex,
        pageSize: queryParams.pageSize || DEFAULT_PAGE_SIZE,
        length: count,
      };

      this.initTable(
        tableColumnsConfig,
        tableSettingsConfig,
        pagginationConfig,
      );
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

  onRowClick(event: IRowEvent<ProposalClass>) {
    if (event.event === RowEventType.RowClick) {
      const id = encodeURIComponent(event.sender.row.proposalId);
      this.router.navigateByUrl("/proposals/" + id);
    }
  }
}
