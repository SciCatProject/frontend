import { SelectionModel } from "@angular/cdk/collections";
import { HashMap } from "../cores/type";
import { ContextMenuItem } from "./context-menu.model";
import { TableField } from "./table-field.model";

// this fields are for each row data
export interface TableRow {
  id?: number;
  _id?: string;
  pid?: string;
  rowActionMenu?: { [key: string]: ContextMenuItem };
  option?: RowOption;
}

export type TableSelectionMode = "single" | "multi" | "none";
export enum RowEventType {
  MasterSelectionChange = "MasterSelectionChange",
  RowSelectionChange = "RowSelectionChange",
  RowActionMenu = "RowActionMenu",
  RowClick = "RowClick",
  DoubleClick = "DoubleClick",
  CellClick = "CellClick",
  LabelClick = "LabelClick",
  BeforeContextMenuOpen = "BeforeContextMenuOpen",
  ContextMenuClick = "ContextMenuClick",
}

export interface IRowEvent<T extends object> {
  event: RowEventType | any;
  sender: {
    row?: T;
    column?: TableField<any>;
    selectionModel?: SelectionModel<any>;
    [t: string]: any;
  };
}

export enum TableEventType {
  ReloadData = "ReloadData",
  SortChanged = "SortChanged",
  ExportData = "ExportData",
}

export interface ITableEvent {
  event: TableEventType | any;
  sender: any | undefined;
}

export interface IRowActionMenuEvent<T> {
  actionItem: ContextMenuItem;
  rowItem: T;
}

export interface RowOption extends HashMap<any> {
  style?: any;
  class?: any;
  selected?: boolean;
  expand?: boolean;
}
