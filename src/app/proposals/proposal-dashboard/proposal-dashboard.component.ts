import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import {
  ITableSetting,
  TableSettingEventType,
} from "shared/modules/dynamic-material-table/models/table-setting.model";
import {
  TablePagination,
  TablePaginationMode,
} from "shared/modules/dynamic-material-table/models/table-pagination.model";
import { PrintConfig } from "shared/modules/dynamic-material-table/models/print-config.model";
import {
  IRowEvent,
  ITableEvent,
  RowEventType,
  TableEventType,
  TableSelectionMode,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { Store } from "@ngrx/store";
import { selectProposalsWithCountAndTableSettings } from "state-management/selectors/proposals.selectors";
import { fetchProposalsAction } from "state-management/actions/proposals.actions";
import { ActivatedRoute, Router } from "@angular/router";
import { ProposalClass } from "@scicatproject/scicat-sdk-ts-angular";
import { Direction } from "@angular/cdk/bidi";
import {
  actionMenu,
  getTableSettingsConfig,
} from "shared/modules/dynamic-material-table/utilizes/default-table-config";
import { updateUserSettingsAction } from "state-management/actions/user.actions";
import { Sort } from "@angular/material/sort";

const tableDefaultSettingsConfig: ITableSetting = {
  visibleActionMenu: actionMenu,
  settingList: [
    {
      visibleActionMenu: actionMenu,
      isDefaultSetting: true,
      isCurrentSetting: true,
      columnSetting: [
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
      ],
    },
  ],
  rowStyle: {
    "border-bottom": "1px solid #d2d2d2",
  },
};

@Component({
  selector: "app-proposal-dashboard",
  templateUrl: "./proposal-dashboard.component.html",
  styleUrls: ["./proposal-dashboard.component.scss"],
})
export class ProposalDashboardComponent implements OnInit, OnDestroy {
  proposalsWithCountAndTableSettings$ = this.store.select(
    selectProposalsWithCountAndTableSettings,
  );

  subscription: Subscription;

  tableName = "proposalsTable";

  columns!: TableField<any>[];

  direction: Direction = "ltr";

  showReloadData = true;

  rowHeight = 50;

  pending = true;

  setting: ITableSetting = {};

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

  defaultPageSize = 10;

  tablesSettings: object;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    const initialQueryParams = this.route.snapshot.queryParams;
    if (initialQueryParams.textSearch) {
      this.globalTextSearch = initialQueryParams.textSearch;
    }

    this.store.dispatch(
      fetchProposalsAction({
        limit: initialQueryParams.pageSize || this.defaultPageSize,
        skip: initialQueryParams.pageIndex * initialQueryParams.pageSize,
        search: initialQueryParams.textSearch,
        sortColumn: initialQueryParams.sortColumn,
        sortDirection: initialQueryParams.sortDirection,
      }),
    );

    this.subscription = this.proposalsWithCountAndTableSettings$.subscribe(
      ({ proposals, count, tablesSettings }) => {
        const queryParams = this.route.snapshot.queryParams;
        if (queryParams.textSearch) {
          this.globalTextSearch = queryParams.textSearch;
        }
        this.tablesSettings = tablesSettings;
        this.dataSource.next(proposals);
        this.pending = false;

        let tableSort: ITableSetting["tableSort"];
        if (queryParams.sortDirection && queryParams.sortColumn) {
          tableSort = {
            sortColumn: queryParams.sortColumn,
            sortDirection: queryParams.sortDirection,
          };
        }
        const savedTableConfig = tablesSettings?.[this.tableName];

        const tableSettingsConfig = getTableSettingsConfig(
          this.tableName,
          tableDefaultSettingsConfig,
          savedTableConfig?.columns,
          tableSort,
        );

        const pagginationConfig = {
          pageSizeOptions: [5, 10, 25, 100],
          pageIndex: queryParams.pageIndex,
          pageSize: queryParams.pageSize || this.defaultPageSize,
          length: count,
        };

        if (tableSettingsConfig?.settingList.length) {
          this.initTable(tableSettingsConfig, pagginationConfig);
        }
      },
    );
  }

  initTable(
    settingConfig: ITableSetting,
    paginationConfig: TablePagination,
  ): void {
    const currentColumnSetting = settingConfig.settingList.find(
      (s) => s.isCurrentSetting,
    )?.columnSetting;

    this.columns = currentColumnSetting;
    this.setting = settingConfig;
    this.pagination = paginationConfig;
  }

  onPaginationChange(pagination: TablePagination) {
    this.pending = true;
    const queryParams: Record<string, string | number> = {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    };
    const { textSearch, sortColumn, sortDirection } =
      this.route.snapshot.queryParams;

    if (textSearch) {
      queryParams.textSearch = textSearch;
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
        sortColumn: sortColumn,
        sortDirection: sortDirection,
      }),
    );
  }

  onGlobalTextSearchChange(text: string) {
    this.pending = true;
    this.pagination.pageIndex = 0;
    this.router.navigate([], {
      queryParams: {
        textSearch: text || undefined,
        pageIndex: 0,
      },
      queryParamsHandling: "merge",
    });

    const { sortColumn, sortDirection } = this.route.snapshot.queryParams;

    this.store.dispatch(
      fetchProposalsAction({
        limit: this.pagination.pageSize,
        skip: this.pagination.pageIndex * this.pagination.pageSize,
        search: text,
        sortColumn: sortColumn,
        sortDirection: sortDirection,
      }),
    );
  }

  saveTableSettings(setting: ITableSetting) {
    this.pending = true;
    const tablesSettings = {
      ...this.tablesSettings,
      [setting.settingName || this.tableName]: {
        columns: setting.columnSetting,
      },
    };

    this.store.dispatch(
      updateUserSettingsAction({
        property: {
          tablesSettings,
        },
      }),
    );
  }

  onSettingChange(event: {
    type: TableSettingEventType;
    setting: ITableSetting;
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

  onTableEvent({ event, sender }: ITableEvent) {
    if (event === TableEventType.SortChanged) {
      const { active: sortColumn, direction: sortDirection } = sender as Sort;
      this.pending = true;
      this.router.navigate([], {
        queryParams: {
          pageIndex: 0,
          sortDirection: sortDirection || undefined,
          sortColumn: sortDirection ? sortColumn : undefined,
        },
        queryParamsHandling: "merge",
      });

      const queryParams = this.route.snapshot.queryParams;

      this.store.dispatch(
        fetchProposalsAction({
          limit: queryParams.pageSize,
          skip:
            queryParams.pageIndex *
            (queryParams.pageSize || this.defaultPageSize),
          search: queryParams.textSearch,
          sortColumn: sortColumn,
          sortDirection: sortDirection,
        }),
      );
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
