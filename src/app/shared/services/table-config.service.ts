import {
  AbstractField,
  TableField,
} from "../modules/dynamic-material-table/models/table-field.model";
import { ITableSetting } from "../modules/dynamic-material-table/models/table-setting.model";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TablePagination } from "../modules/dynamic-material-table/models/table-pagination.model";
import { TableColumn } from "state-management/models";
import { TableSettingsStorageService } from "./table-settings-storage.service";

@Injectable({ providedIn: "root" })
export class TableConfigService {
  constructor(private tableSettingsStorage: TableSettingsStorageService) {}

  getTableSort(route: ActivatedRoute): ITableSetting["tableSort"] {
    const { queryParams } = route.snapshot;
    return queryParams.sortDirection && queryParams.sortColumn
      ? {
          sortColumn: queryParams.sortColumn,
          sortDirection: queryParams.sortDirection,
        }
      : null;
  }

  getPaginationConfig(
    route: ActivatedRoute,
    dataCount: number,
    defaultPageSize: number,
    defaultOptions: number[],
  ): TablePagination {
    const { queryParams } = route.snapshot;
    return {
      pageSizeOptions: defaultOptions,
      pageIndex: queryParams.pageIndex,
      pageSize: queryParams.pageSize || defaultPageSize,
      length: dataCount,
    };
  }

  // NOTE: Need to merge the column settings from the default setting and the saved setting as we might change the default in the codebase so we don't end up with inconsistencies if we have saved settings in the database.
  mergeColumnSettings(
    defaultColumnSetting: AbstractField[],
    savedColumnSetting: TableField<any>[],
  ) {
    const defaultMap = new Map(defaultColumnSetting.map((c) => [c.name, c]));

    // Merge saved columns that still exist in defaults and preserve
    // explicitly user-added columns that intentionally do not exist in defaults.
    const mergedColumns = savedColumnSetting
      .map((saved) => {
        const defCol = defaultMap.get(saved.name);
        if (defCol) {
          return {
            ...defCol,
            ...saved,
            // Persisted columns store visibility as the boolean `enabled`,
            // while the table renders from `display`. Translate it back so a
            // deselected column stays hidden after reload.
            display: this.resolveDisplay(saved, defCol),
          };
        }

        return saved.userAdded
          ? { ...saved, display: this.resolveDisplay(saved, saved) }
          : null;
      })
      .filter(Boolean);

    // Append default columns that are new (i.e. not in saved settings)
    const extraColumns = defaultColumnSetting.filter(
      (defCol) =>
        !savedColumnSetting.some((saved) => saved.name === defCol.name),
    );

    return [...mergedColumns, ...extraColumns];
  }

  /**
   * Resolve the `display` value for a merged column. Persisted settings store
   * visibility as the boolean `enabled`; the table renders from `display`.
   * Prefer an explicit `display` on the saved column, then translate `enabled`,
   * and finally fall back to the default/saved column's own `display`.
   */
  private resolveDisplay(
    saved: TableField<any>,
    fallback: AbstractField,
  ): AbstractField["display"] {
    if (saved.display) {
      return saved.display;
    }
    if (typeof saved.enabled === "boolean") {
      return saved.enabled ? "visible" : "hidden";
    }
    return fallback?.display;
  }

  persistColumns(tableName: string, columns: unknown[], userId?: string) {
    try {
      this.tableSettingsStorage.set(tableName, columns, userId);
    } catch (e) {
      // Ignore storage failures (private mode or quota), server update still happens below.
    }
  }

  /**
   * Convert the table's live column setting (popup order) into the serializable
   * shape that is persisted on the server / store. This is the single source of
   * truth for how column order and column flags are saved, so every table stores
   * columns consistently (order follows the array index).
   */
  buildColumnsSetting(columnSetting: TableField<any>[]): TableColumn[] {
    return (columnSetting || []).map((column, index) => {
      const {
        name,
        header,
        display,
        width,
        type,
        format,
        path,
        tooltip,
        sort,
        printable,
        sticky,
      } = column;

      return {
        name,
        header,
        enabled: display === "visible" || display === "prevent-hidden",
        order: index,
        width,
        path,
        userAdded: column.userAdded || undefined,
        type,
        format,
        tooltip,
        sort,
        printable,
        sticky,
      } as TableColumn;
    });
  }

  /**
   * Centralized persistence of the column setting: builds the persisted column
   * list (preserving the given order) and stores it in the local cache.
   * Returns the built columns so callers can dispatch their scope-specific
   * store action without mapping the columns themselves.
   */
  saveColumns(
    tableName: string,
    columnSetting: TableField<any>[],
    userId?: string,
  ): TableColumn[] {
    const columns = this.buildColumnsSetting(columnSetting);
    this.persistColumns(tableName, columns, userId);
    return columns;
  }

  preferSavedColumns<T>(
    tableName: string,
    columns: T[] | undefined,
    userId?: string,
  ): T[] {
    const persisted = this.tableSettingsStorage.get(
      tableName,
      userId,
    ) as unknown[];

    return persisted && persisted.length > 0
      ? (persisted as T[])
      : (columns ?? []);
  }

  getTableSettingsConfig(
    tableName: string,
    tableDefaultSettingsConfig: ITableSetting,
    savedTableConfig?: TableField<any>[],
    tableSort?: { sortColumn: string; sortDirection: "asc" | "desc" },
    userId?: string,
  ) {
    // If the caller didn't provide a savedTableConfig (store might not be ready),
    // attempt to recover from the persistent local storage so recent user changes
    // survive short navigations.
    if (!savedTableConfig) {
      const recovered = this.tableSettingsStorage.get(tableName, userId);
      if (recovered) {
        savedTableConfig = recovered as TableField<any>[];
      }
    }

    const tableSettingsConfig: ITableSetting = {
      ...tableDefaultSettingsConfig,
    };

    const defaultSettingIndex = tableSettingsConfig.settingList.findIndex(
      (s) => s.isDefaultSetting,
    );

    const savedTableSettingIndex = tableSettingsConfig.settingList.findIndex(
      (s) => s.settingName === tableName,
    );

    if (savedTableSettingIndex < 0) {
      if (savedTableConfig) {
        const defaultColumnSetting =
          tableDefaultSettingsConfig.settingList[defaultSettingIndex]
            .columnSetting;

        const columnSettingMerged = this.mergeColumnSettings(
          defaultColumnSetting,
          savedTableConfig,
        );

        tableSettingsConfig.settingList.push({
          ...defaultColumnSetting,
          settingName: tableName,
          isCurrentSetting: true,
          isDefaultSetting: false,
          columnSetting: columnSettingMerged,
        });

        tableSettingsConfig.settingList[defaultSettingIndex].isCurrentSetting =
          false;
      }
    } else {
      const existingSetting =
        tableSettingsConfig.settingList[savedTableSettingIndex];

      // Re-merge the saved columns so a later change of the column order
      // (e.g. after the user applies a new popup order) is reflected here
      // instead of keeping a stale order from a previous initialization.
      if (savedTableConfig && defaultSettingIndex >= 0) {
        const defaultColumnSetting =
          tableDefaultSettingsConfig.settingList[defaultSettingIndex]
            .columnSetting;

        existingSetting.columnSetting = this.mergeColumnSettings(
          defaultColumnSetting,
          savedTableConfig,
        );
      }

      existingSetting.isCurrentSetting = true;
      existingSetting.isDefaultSetting = false;

      if (
        defaultSettingIndex >= 0 &&
        defaultSettingIndex !== savedTableSettingIndex
      ) {
        tableSettingsConfig.settingList[defaultSettingIndex].isCurrentSetting =
          false;
      }
    }

    if (tableSort) {
      tableSettingsConfig.tableSort = tableSort;
    }

    return tableSettingsConfig;
  }
}
