export enum TableMenuAction {
  TableSetting = "TableSetting",
  Download = "Download",
  SaveSetting = "SaveSetting",
  SaveSimpleSetting = "SaveSimpleSetting",
  DeleteSetting = "DeleteSetting",
  SelectSetting = "SelectSetting",
  DefaultSetting = "DefaultSetting",
  DefaultSimpleSetting = "DefaultSimpleSetting",
  Print = "Print",
  FullScreenMode = "FullScreenMode",
}

export interface TableMenuActionChange {
  type: TableMenuAction;
  data?: any;
}
