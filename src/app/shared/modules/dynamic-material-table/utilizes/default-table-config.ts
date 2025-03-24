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
    (defCol) => !savedColumnSetting.some((saved) => saved.name === defCol.name),
  );

  return [...mergedColumns, ...extraColumns];
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
