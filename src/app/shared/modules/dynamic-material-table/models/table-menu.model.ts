export enum TableMenuAction {
  TableSetting = "TableSetting",
  Download = "Download",
  DefaultSimpleSetting = "DefaultSimpleSetting",
  Print = "Print",
  FullScreenMode = "FullScreenMode",
}

export interface TableMenuActionChange {
  type: TableMenuAction;
  data?: any;
}
