import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Instrument } from "@scicatproject/scicat-sdk-ts-angular";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ITableSetting,
  TableSettingEventType,
} from "shared/modules/dynamic-material-table/models/table-setting.model";
import { BehaviorSubject, Subscription } from "rxjs";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
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
import { fetchInstrumentsAction } from "state-management/actions/instruments.actions";
import { updateUserSettingsAction } from "state-management/actions/user.actions";
import { Sort } from "@angular/material/sort";
import { selectInstrumentsWithCountAndTableSettings } from "state-management/selectors/instruments.selectors";
import { actionMenu } from "shared/modules/dynamic-material-table/utilizes/default-table-settings";
import { TableConfigService } from "shared/services/table-config.service";

const tableDefaultSettingsConfig: ITableSetting = {
  visibleActionMenu: actionMenu,
  settingList: [
    {
      visibleActionMenu: actionMenu,
      isDefaultSetting: true,
      isCurrentSetting: true,
      columnSetting: [
        {
          name: "uniqueName",
          icon: "scanner",
        },
        {
          name: "name",
          icon: "fingerprint",
        },
      ],
    },
  ],
  rowStyle: {
    "border-bottom": "1px solid #d2d2d2",
  },
};

@Component({
  selector: "app-instruments-dashboard",
  templateUrl: "./instruments-dashboard.component.html",
  styleUrls: ["./instruments-dashboard.component.scss"],
  standalone: false,
})
export class InstrumentsDashboardComponent implements OnInit, OnDestroy {
  instrumentsWithCountAndTableSettings$ = this.store.select(
    selectInstrumentsWithCountAndTableSettings,
  );

  subscriptions: Subscription[] = [];

  tableName = "instrumentsTable";

  columns: TableField<any>[];

  pending = true;

  setting: ITableSetting = {};

  paginationMode: TablePaginationMode = "server-side";

  dataSource: BehaviorSubject<Instrument[]> = new BehaviorSubject<Instrument[]>(
    [],
  );

  pagination: TablePagination = {};

  rowSelectionMode: TableSelectionMode = "none";

  showGlobalTextSearch = false;

  defaultPageSize = 10;

  defaultPageSizeOptions = [5, 10, 25, 100];

  tablesSettings: object;

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private tableConfigService: TableConfigService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.instrumentsWithCountAndTableSettings$.subscribe(
        ({ instruments, count, tablesSettings }) => {
          this.tablesSettings = tablesSettings;
          this.dataSource.next(instruments);
          this.pending = false;

          const savedTableConfigColumns =
            tablesSettings?.[this.tableName]?.columns;
          const tableSort = this.getTableSort();
          const paginationConfig = this.getTablePaginationConfig(count);

          const tableSettingsConfig =
            this.tableConfigService.getTableSettingsConfig(
              this.tableName,
              tableDefaultSettingsConfig,
              savedTableConfigColumns,
              tableSort,
            );

          if (tableSettingsConfig?.settingList.length) {
            this.initTable(tableSettingsConfig, paginationConfig);
          }
        },
      ),
    );

    this.subscriptions.push(
      this.route.queryParams.subscribe((queryParams) => {
        this.pending = true;
        const limit = queryParams.pageSize
          ? +queryParams.pageSize
          : this.defaultPageSize;
        const skip = queryParams.pageIndex ? +queryParams.pageIndex * limit : 0;

        this.store.dispatch(
          fetchInstrumentsAction({
            limit: limit,
            skip: skip,
            sortColumn: queryParams.sortColumn,
            sortDirection: queryParams.sortDirection,
          }),
        );
      }),
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

  onPaginationChange(pagination: TablePagination) {
    this.router.navigate([], {
      queryParams: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
      queryParamsHandling: "merge",
    });
  }

  saveTableSettings(setting: ITableSetting) {
    this.pending = true;
    const columnsSetting = setting.columnSetting.map((column) => {
      const { name, display, index, width } = column;

      return { name, display, index, width };
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

  onRowClick(event: IRowEvent<Instrument>) {
    if (event.event === RowEventType.RowClick) {
      const id = encodeURIComponent(event.sender.row.pid);
      this.router.navigateByUrl("/instruments/" + id);
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
