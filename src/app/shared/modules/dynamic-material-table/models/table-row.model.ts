import { SelectionModel } from "@angular/cdk/collections";
import { HashMap } from "../cores/type";
import { ContextMenuItem } from "./context-menu.model";
import { TableField } from "./table-field.model";

// this fields are for each row data
export interface TableRow {
  id?: number;
  rowActionMenu?: { [key: string]: ContextMenuItem };
  option?: RowOption;
}

export type TableSelectionMode = "single" | "multi" | "none";
export type RowEventType =
  | "MasterSelectionChange"
  | "RowSelectionChange"
  | "RowActionMenu"
  | "RowClick"
  | "DoubleClick"
  | "CellClick"
  | "LabelClick"
  | "BeforeContextMenuOpen"
  | "ContextMenuClick";

export interface IRowEvent {
  event: RowEventType | any;
  sender: {
    row?: any;
    column?: TableField<any>;
    selectionModel?: SelectionModel<any>;
    [t: string]: any;
  };
}

export interface ITableEvent {
  event: "ReloadData" | "SortChanged" | "ExportData" | any;
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
