import { TableScrollStrategy } from "../cores/fixed-size-table-virtual-scroll-strategy";
import { AbstractField } from "./table-field.model";

export type Direction = "rtl" | "ltr";
export type DisplayMode = "visible" | "hidden" | "none";
export interface ITableSetting {
  pageSize?: number;
  direction?: Direction;
  columnSetting?: AbstractField[] | null;
  visibleActionMenu?: VisibleActionMenu | null;
  visibleTableMenu?: boolean;
  alternativeRowStyle?: any;
  normalRowStyle?: any;
  scrollStrategy?: TableScrollStrategy;
  rowStyle?: any;
  enableContextMenu?: boolean;
  autoHeight?: boolean;
  saveSettingMode?: "simple" | "multi" | "none";
  settingName?: string;
  settingList?: SettingItem[];
  showColumnSettingMenu?: boolean;
  tableSort?: { sortColumn: string; sortDirection: "asc" | "desc" };
}

export interface SettingItem extends ITableSetting {
  isCurrentSetting: boolean;
  isDefaultSetting: boolean;
}

export interface VisibleActionMenu {
  fullscreen?: boolean;
  json?: boolean;
  csv?: boolean;
  print?: boolean;
  columnSettingPin?: boolean;
  columnSettingOrder?: boolean;
  columnSettingFilter?: boolean;
  columnSettingSort?: boolean;
  columnSettingPrint?: boolean;
  saveTableSetting?: boolean;
  clearFilter?: boolean;
}

export class TableSetting implements ITableSetting {
  direction?: Direction = "ltr";
  visibleActionMenu?: VisibleActionMenu | null = null;
  visibleTableMenu?: boolean;
  alternativeRowStyle?: any;
  normalRowStyle?: any;
  rowStyle?: any;
  settingName?: string = "default";
  enableContextMenu?: boolean;
  autoHeight?: boolean = false;
  saveSettingMode?: "simple" | "multi" | "none" = "simple";
  showColumnSettingMenu?: boolean = false;
  tableSort?: { sortColumn: string; sortDirection: "asc" | "desc" };
}

export enum TableSettingEventType {
  create = "create",
  save = "save",
  apply = "apply",
  delete = "delete",
  default = "default",
  reset = "reset",
  select = "select",
  error = "error",
}
