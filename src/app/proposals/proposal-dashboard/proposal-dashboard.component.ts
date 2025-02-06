import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { PageChangeEvent } from "shared/modules/table/table.component";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import {
  TableSetting,
  TableSettingEventType,
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
import { Store } from "@ngrx/store";
import {
  selectProposals,
  selectProposalsCount,
} from "state-management/selectors/proposals.selectors";
import { fetchProposalsAction } from "state-management/actions/proposals.actions";
import { ActivatedRoute, Router } from "@angular/router";
import { ProposalClass } from "@scicatproject/scicat-sdk-ts-angular";
import { Direction } from "@angular/cdk/bidi";

export const tableDefaultColumnsConfig: TableField<any>[] = [
  {
    name: "proposalId",
    header: "Proposal ID",
    icon: "perm_device_information",
    type: "text",
  },
  {
    name: "title",
    icon: "description",
    width: 250,
  },
  {
    name: "abstract",
    icon: "chrome_reader_mode",
    width: 250,
  },
  {
    name: "firstname",
    header: "First Name",
    icon: "person",
  },
  {
    name: "lastname",
    header: "Last Name",
  },
  { name: "email", icon: "email", width: 200 },
  { name: "type", icon: "badge", width: 200 },
  {
    name: "parentProposalId",
    header: "Parent Proposal",
    icon: "badge",
  },
  {
    name: "pi_firstname",
    header: "PI First Name",
    icon: "person_pin",
  },
  {
    name: "pi_lastname",
    header: "PI Last Name",
    icon: "person_pin",
  },
  {
    name: "pi_email",
    header: "PI Email",
    icon: "email",
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

const tableDefaultSettingsConfig: TableSetting = {
  direction: "ltr",
  visibleActionMenu: actionMenu,
  autoHeight: false,
  saveSettingMode: "simple",
  settingList: [
    {
      direction: "ltr",
      visibleActionMenu: actionMenu,
      autoHeight: false,
      saveSettingMode: "simple",
      isDefaultSetting: true,
      isCurrentSetting: true,
      settingName: "default",
      rowStyle: {
        "border-bottom": "1px solid #d2d2d2",
      },
      columnSetting: [...tableDefaultColumnsConfig],
    },
  ],
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

  tableName = "proposal-table";

  columns!: TableField<any>[];

  direction: Direction = "ltr";

  showReloadData = true;

  rowHeight = 50;

  pending = true;

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

  rowSelectionMode: TableSelectionMode = "none";

  globalTextSearch = "";

  @Output() pageChange = new EventEmitter<PageChangeEvent>();

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
        skip: queryParams.pageIndex * queryParams.pageSize,
        search: queryParams.textSearch,
      }),
    );

    this.vm$.subscribe((data) => {
      this.dataSource.next(data);
      this.pending = false;
    });

    this.proposalsCount$.subscribe((count) => {
      const pagginationConfig = {
        pageSizeOptions: [5, 10, 25, 100],
        pageIndex: queryParams.pageIndex,
        pageSize: queryParams.pageSize || DEFAULT_PAGE_SIZE,
        length: count,
      };

      const foundTableSetting = tableDefaultSettingsConfig.settingList.find(
        (s) => s.settingName === this.tableName,
      );

      const tableSettingsConfig: TableSetting = {
        ...tableDefaultSettingsConfig,
      };

      if (!foundTableSetting) {
        const savedTableConfig = this.loadSavedColumnInfo(this.tableName);

        if (savedTableConfig) {
          tableSettingsConfig.settingList.push({
            ...tableDefaultSettingsConfig.settingList[0],
            settingName: this.tableName,
            isCurrentSetting: true,
            isDefaultSetting: false,
            columnSetting: savedTableConfig,
          });

          tableSettingsConfig.settingList[0].isCurrentSetting = false;
        }
      }

      this.initTable(tableSettingsConfig, pagginationConfig);
    });
  }

  initTable(
    settingConfig: TableSetting,
    paginationConfig: TablePagination,
  ): void {
    this.columns = settingConfig.settingList.find(
      (s) => s.isCurrentSetting,
    ).columnSetting;
    this.setting = settingConfig;
    this.pagination = paginationConfig;
  }

  onPaginationChange(pagination: TablePagination) {
    this.pending = true;
    const queryParams: Record<string, string | number> = {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    };

    if (this.route.snapshot.queryParams.textSearch) {
      queryParams.textSearch = this.route.snapshot.queryParams.textSearch;
    }
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: "merge",
    });

    this.store.dispatch(
      fetchProposalsAction({
        limit: pagination.pageSize,
        skip: pagination.pageIndex * pagination.pageSize,
        search: queryParams.textSearch as string,
      }),
    );
  }

  onGlobalTextSearchChange(text: string) {
    this.pending = true;
    this.pagination.pageIndex = 0;
    this.router.navigate([], {
      queryParams: {
        textSearch: text,
        pageIndex: 0,
      },
      queryParamsHandling: "merge",
    });

    this.store.dispatch(
      fetchProposalsAction({
        limit: this.pagination.pageSize,
        skip: this.pagination.pageIndex * this.pagination.pageSize,
        search: text,
      }),
    );
  }

  saveTableSettings(setting: TableSetting) {
    this.saveColumnInfo(setting.columnSetting, setting.settingName);
  }

  onSettingChange(event: {
    type: TableSettingEventType;
    setting: TableSetting;
  }) {
    if (
      event.type === TableSettingEventType.save ||
      event.type === TableSettingEventType.create
    ) {
      this.saveTableSettings(event.setting);
    }
  }

  onRowClick(event: IRowEvent<ProposalClass>) {
    if (event.event === RowEventType.RowClick) {
      const id = encodeURIComponent(event.sender.row.proposalId);
      this.router.navigateByUrl("/proposals/" + id);
    }
  }

  loadSavedColumnInfo(saveName: string): TableField<any>[] {
    // Only load if a save name is passed in
    if (saveName) {
      if (!localStorage) {
        return null;
      }

      const loadedInfo = localStorage.getItem(`${saveName}`);

      if (loadedInfo) {
        return JSON.parse(loadedInfo);
      }
    }

    return null;
  }

  saveColumnInfo(
    columnInfo: TableField<any>[],
    saveName = "proposal-table",
  ): void {
    if (saveName) {
      if (!localStorage) {
        return;
      }

      localStorage.setItem(`${saveName}`, JSON.stringify(columnInfo));
    }
  }
}
