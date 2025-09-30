import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, combineLatestWith, filter, Subscription } from "rxjs";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import {
  ITableSetting,
  TableSettingEventType,
} from "shared/modules/dynamic-material-table/models/table-setting.model";
import {
  TablePagination,
  TablePaginationMode,
} from "shared/modules/dynamic-material-table/models/table-pagination.model";
import {
  IRowEvent,
  ITableEvent,
  RowEventType,
  TableEventType,
  TableSelectionMode,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { Store } from "@ngrx/store";
import {
  selectProposalsWithCountAndTableSettings,
  selectDefaultProposalColumns,
} from "state-management/selectors/proposals.selectors";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Instrument,
  OutputDatasetObsoleteDto,
  ProposalClass,
} from "@scicatproject/scicat-sdk-ts-angular";
import { updateUserSettingsAction } from "state-management/actions/user.actions";
import { Sort } from "@angular/material/sort";
import { actionMenu } from "shared/modules/dynamic-material-table/utilizes/default-table-settings";
import { TableConfigService } from "shared/services/table-config.service";
import { AppConfigService } from "app-config.service";
import { TableColumn } from "state-management/models";

@Component({
  selector: "proposal-table",
  templateUrl: "./proposal-table.component.html",
  styleUrls: ["./proposal-table.component.scss"],
  standalone: false,
})
export class ProposalTableComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  proposalsWithCountAndTableSettings$ = this.store.select(
    selectProposalsWithCountAndTableSettings,
  );
  defaultStoreColumns$ = this.store.select(selectDefaultProposalColumns);
  appConfig = this.appConfigService.getConfig();

  tableDefaultSettingsConfig: ITableSetting = {
    visibleActionMenu: actionMenu,
    settingList: [
      {
        visibleActionMenu: actionMenu,
        isDefaultSetting: true,
        isCurrentSetting: true,
        columnSetting: [],
      },
    ],
    rowStyle: {
      "border-bottom": "1px solid #d2d2d2",
    },
  };

  tableName = "proposalsTable";

  localization = "proposal";

  columns: TableField<any>[];

  pending = true;

  setting: ITableSetting = {};

  paginationMode: TablePaginationMode = "server-side";

  pagination: TablePagination = {};

  rowSelectionMode: TableSelectionMode = "none";

  showGlobalTextSearch = false;

  defaultPageSizeOptions = [5, 10, 25, 100];

  tablesSettings: object;

  datasets: OutputDatasetObsoleteDto[] = [];
  instruments: Instrument[] = [];
  instrumentMap: Map<string, Instrument> = new Map();

  @Input()
  dataSource!: BehaviorSubject<ProposalClass[]>;

  @Input()
  defaultPageSize: number;

  constructor(
    private appConfigService: AppConfigService,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private tableConfigService: TableConfigService,
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.proposalsWithCountAndTableSettings$
        .pipe(
          combineLatestWith(this.defaultStoreColumns$),
          filter(([{ hasFetchedSettings }]) => hasFetchedSettings),
        )
        .subscribe(
          async ([
            { proposals, count, tablesSettings },
            defaultStoreColumns,
          ]) => {
            const userSettingColumns =
              tablesSettings?.[this.tableName]?.columns || [];

            this.dataSource.next(proposals);
            this.pending = false;

            // Checks if there are any custom columns defined in the app config
            // If it's defined and not empty, use it as the effective columns
            // Otherwise use the default columns from the proposals store
            const configColumns =
              this.appConfig?.defaultProposalsListSettings?.columns;
            const defaultColumns =
              Array.isArray(configColumns) && configColumns.length > 0
                ? configColumns
                : defaultStoreColumns;

            const savedTableConfigColumns =
              this.convertSavedColumns(userSettingColumns);

            this.tableDefaultSettingsConfig.settingList[0].columnSetting =
              this.convertSavedColumns(defaultColumns as TableColumn[]);

            const tableSort = this.getTableSort();
            const paginationConfig = this.getTablePaginationConfig(count);
            const tableSettingsConfig =
              this.tableConfigService.getTableSettingsConfig(
                this.tableName,
                this.tableDefaultSettingsConfig,
                savedTableConfigColumns,
                tableSort,
              );

            if (tableSettingsConfig?.settingList.length) {
              this.initTable(tableSettingsConfig, paginationConfig);
            }
          },
        ),
    );
  }

  getTableSort(): ITableSetting["tableSort"] {
    const { queryParams } = this.route.snapshot;

    if (queryParams.sortDirection && queryParams.sortColumn) {
      return {
        sortColumn: queryParams.sortColumn,
        sortDirection: queryParams.sortDirection,
      };
    }

    return null;
  }

  getTablePaginationConfig(dataCount = 0): TablePagination {
    const { queryParams } = this.route.snapshot;

    return {
      pageSizeOptions: this.defaultPageSizeOptions,
      pageIndex: queryParams.pageIndex,
      pageSize: queryParams.pageSize || this.defaultPageSize,
      length: dataCount,
    };
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

  onPageChange(pagination: TablePagination) {
    this.router.navigate([], {
      queryParams: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
      queryParamsHandling: "merge",
    });
  }

  onRowClick(event: IRowEvent<ProposalClass>) {
    if (event.event === RowEventType.RowClick) {
      const id = encodeURIComponent(event.sender.row!.proposalId);
      this.router.navigateByUrl(`/proposals/${id}`);
    }
  }

  onGlobalTextSearchChange(text: string) {
    this.router.navigate([], {
      queryParams: {
        textSearch: text || undefined,
        pageIndex: 0,
      },
      queryParamsHandling: "merge",
    });
  }

  convertSavedColumns(columns: TableColumn[]): TableField<any>[] {
    return columns.map((column) => {
      const convertedColumn: TableField<any> = {
        name: column.name,
        header: column.header,
        index: column.order,
        display: column.enabled ? "visible" : "hidden",
        width: column.width,
        type: column.type,
        format: column.format,
        tooltip: column.tooltip,
      };
      if (column.type === "hoverContent") {
        convertedColumn.hoverContent = true;
      }

      return convertedColumn;
    });
  }

  saveTableSettings(setting: ITableSetting) {
    this.pending = true;
    const columnsSetting = setting.columnSetting.map((column) => {
      const { name, display, index, width, type, format } = column;

      return {
        name,
        enabled: !!(display === "visible"),
        order: index,
        width,
        type,
        format,
      };
    });

    const tablesSettings = {
      ...this.tablesSettings,
      [setting.settingName || this.tableName]: {
        columns: columnsSetting,
      },
    };

    this.store.dispatch(
      updateUserSettingsAction({
        property: {
          tablesSettings,
        },
      }),
    );

    this.pending = false;
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

  onTableEvent({ event, sender }: ITableEvent) {
    if (event === TableEventType.SortChanged) {
      const { active: sortColumn, direction: sortDirection } = sender as Sort;

      this.router.navigate([], {
        queryParams: {
          pageIndex: 0,
          sortDirection: sortDirection || undefined,
          sortColumn: sortDirection ? sortColumn : undefined,
        },
        queryParamsHandling: "merge",
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
