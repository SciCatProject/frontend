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

// NOTE: Need to merge the column settings from the default setting and the saved setting as we might change the default in the codebase so we don't end up with inconsistencies if we have saved settings in the database.
const mergeColumnSettings = (
  defaultColumnSetting: AbstractField[],
  savedColumnSetting: TableField<any>[],
) => {
  const mergedColumns = [];
  const extraColumnsAddedAfterLastSave = [];

  // Loop through the default column settings and merge with the saved column settings
  defaultColumnSetting.forEach((column, index) => {
    const savedColumnIndex = savedColumnSetting.findIndex(
      (c) => c.name === column.name,
    );

    if (savedColumnIndex !== -1) {
      const savedColumn = savedColumnSetting[savedColumnIndex];
      const columnToPush = savedColumn ? { ...column, ...savedColumn } : column;
      mergedColumns[savedColumnIndex] = { ...columnToPush };
    } else {
      // If the column is not found in the saved column settings, we add it to the extraColumnsAddedAfterLastSave array
      extraColumnsAddedAfterLastSave.push({ ...column });
    }
  });

  // Filter out any undefined columns (removed from the default table columns since the last save) and merge the extra columns added after the last save
  const allColumns = mergedColumns
    .concat(extraColumnsAddedAfterLastSave)
    .filter((c) => c);

  return allColumns;
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
