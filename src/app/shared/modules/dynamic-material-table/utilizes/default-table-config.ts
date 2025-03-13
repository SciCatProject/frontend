import { AbstractField, TableField } from "../models/table-field.model";
import {
  ITableSetting,
  VisibleActionMenu,
} from "../models/table-setting.model";

export const actionMenu: VisibleActionMenu = {
  json: true,
  csv: true,
  print: true,
  columnSettingPin: true,
  columnSettingFilter: true,
  clearFilter: true,
};

const mergeColumnSettings = (
  defaultColumnSetting: AbstractField[],
  savedColumnSetting: TableField<any>[],
) => {
  return defaultColumnSetting.map((column) => {
    const savedColumn = savedColumnSetting.find((c) => c.name === column.name);

    return savedColumn ? { ...column, ...savedColumn } : column;
  });
};

export const getTableSettingsConfig = (
  tableName: string,
  tableDefaultSettingsConfig: ITableSetting,
  savedTableConfig?: TableField<any>[],
  tableSort?: { sortColumn: string; sortDirection: "asc" | "desc" },
) => {
  const tableSettingsConfig: ITableSetting = { ...tableDefaultSettingsConfig };

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

      const columnSettingMerged = mergeColumnSettings(
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
};
