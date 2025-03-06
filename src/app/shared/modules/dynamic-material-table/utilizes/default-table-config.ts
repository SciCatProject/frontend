import { TableField } from "../models/table-field.model";
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
      tableSettingsConfig.settingList.push({
        ...tableDefaultSettingsConfig.settingList[defaultSettingIndex],
        settingName: tableName,
        isCurrentSetting: true,
        isDefaultSetting: false,
        columnSetting: savedTableConfig,
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
