import {
  AbstractField,
  TableField,
} from "../modules/dynamic-material-table/models/table-field.model";
import { ITableSetting } from "../modules/dynamic-material-table/models/table-setting.model";
import { Injectable } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TablePagination } from "../modules/dynamic-material-table/models/table-pagination.model";

@Injectable({ providedIn: "root" })
export class TableConfigService {
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

    // Merge saved columns that still exist in defaults
    const mergedColumns = savedColumnSetting
      .map((saved) => {
        const defCol = defaultMap.get(saved.name);
        return defCol ? { ...defCol, ...saved } : null;
      })
      .filter(Boolean);

    // Append default columns that are new (i.e. not in saved settings)
    const extraColumns = defaultColumnSetting.filter(
      (defCol) =>
        !savedColumnSetting.some((saved) => saved.name === defCol.name),
    );

    return [...mergedColumns, ...extraColumns];
  }

  getTableSettingsConfig(
    tableName: string,
    tableDefaultSettingsConfig: ITableSetting,
    savedTableConfig?: TableField<any>[],
    tableSort?: { sortColumn: string; sortDirection: "asc" | "desc" },
  ) {
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
      tableSettingsConfig.settingList[savedTableSettingIndex].isCurrentSetting =
        true;
      tableSettingsConfig.settingList[savedTableSettingIndex].isDefaultSetting =
        false;
    }

    if (tableSort) {
      tableSettingsConfig.tableSort = tableSort;
    }

    return tableSettingsConfig;
  }
}
