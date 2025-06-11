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
import {
  IRowEvent,
  ITableEvent,
  TableEventType,
  TableSelectionMode,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { Store } from "@ngrx/store";
import { ActivatedRoute, Router } from "@angular/router";
import { updateUserSettingsAction } from "state-management/actions/user.actions";
import { Sort } from "@angular/material/sort";
import { selectFilesWithCountAndTableSettings } from "state-management/selectors/files.selectors";
import { fetchAllOrigDatablocksAction } from "state-management/actions/files.actions";
import { get } from "lodash-es";
import { DatePipe } from "@angular/common";
import { actionMenu } from "shared/modules/dynamic-material-table/utilizes/default-table-settings";
import { TableConfigService } from "shared/services/table-config.service";

@Component({
  selector: "app-files-dashboard",
  templateUrl: "./files-dashboard.component.html",
  styleUrls: ["./files-dashboard.component.scss"],
  standalone: false,
})
export class FilesDashboardComponent implements OnInit, OnDestroy {
  filesWithCountAndTableSettings$ = this.store.select(
    selectFilesWithCountAndTableSettings,
  );

  subscriptions: Subscription[] = [];

  tableName = "filesTable";

  columns: TableField<any>[];

  pending = true;

  setting: ITableSetting = {};

  paginationMode: TablePaginationMode = "server-side";

  dataSource: BehaviorSubject<object[]> = new BehaviorSubject<object[]>([]);

  pagination: TablePagination = {};

  rowSelectionMode: TableSelectionMode = "none";

  globalTextSearch = "";

  defaultPageSize = 10;

  defaultPageSizeOptions = [5, 10, 25, 100];

  tablesSettings: object;

  tableDefaultSettingsConfig: ITableSetting = {
    visibleActionMenu: actionMenu,
    settingList: [
      {
        visibleActionMenu: actionMenu,
        isDefaultSetting: true,
        isCurrentSetting: true,
        columnSetting: [
          {
            name: "dataFileList.path",
            icon: "text_snippet",
            header: "Filename",
            customRender(column, row) {
              return get(row, column.name);
            },
          },
          {
            name: "dataFileList.size",
            icon: "save",
            header: "Size",
            customRender(column, row) {
              return get(row, column.name);
            },
          },
          {
            name: "dataFileList.time",
            icon: "access_time",
            header: "Created at",
            customRender: (column, row) => {
              return this.datePipe.transform(get(row, column.name));
            },
          },
          {
            name: "dataFileList.uid",
            icon: "person",
            header: "UID",
            customRender: (column, row) => {
              return get(row, column.name);
            },
          },
          {
            name: "dataFileList.gid",
            icon: "group",
            header: "GID",
            customRender: (column, row) => {
              return get(row, column.name);
            },
          },
          {
            name: "ownerGroup",
            icon: "group",
            header: "Owner Group",
          },
          {
            name: "datasetId",
            icon: "list",
            header: "Dataset PID",
            customRender: (column, row) =>
              `<a href="/datasets/${encodeURIComponent(row[column.name])}" target="_blank">${row[column.name]}</a>`,
          },
        ],
      },
    ],
    rowStyle: {
      "border-bottom": "1px solid #d2d2d2",
    },
  };

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private tableConfigService: TableConfigService,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.filesWithCountAndTableSettings$.subscribe(
        ({ origDatablocks, count, tablesSettings }) => {
          this.tablesSettings = tablesSettings;
          this.dataSource.next(origDatablocks);
          this.pending = false;

          const savedTableConfigColumns =
            tablesSettings?.[this.tableName]?.columns;
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

    this.subscriptions.push(
      this.route.queryParams.subscribe((queryParams) => {
        this.pending = true;
        const limit = queryParams.pageSize
          ? +queryParams.pageSize
          : this.defaultPageSize;
        const skip = queryParams.pageIndex ? +queryParams.pageIndex * limit : 0;
        if (queryParams.textSearch) {
          this.globalTextSearch = queryParams.textSearch;
        }

        this.store.dispatch(
          fetchAllOrigDatablocksAction({
            limit: limit,
            skip: skip,
            search: queryParams.textSearch,
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

  onGlobalTextSearchChange(text: string) {
    this.router.navigate([], {
      queryParams: {
        textSearch: text || undefined,
        pageIndex: 0,
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

  onRowClick(event: IRowEvent<object>) {}

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
