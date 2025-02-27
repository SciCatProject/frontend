import { IPipe } from "./pipe.model";
import { FooterCell } from "./table-footer.model";
import { TableRow } from "./table-row.model";

export declare type AtRenderFunc<R extends TableRow> = (row: R) => string;
export declare type AtClassFunc = (row: any, col: any) => string;
export declare type AtSortFunc<R extends TableRow> = (
  data: R[],
  col: any,
) => string;
export declare type AtFilterFunc<R extends TableRow> = (
  data: R[],
  col: any,
) => string;
export declare type ToPrint = (row: any) => any;
export declare type ToExport = (row: any, type: any) => any;
export declare type FieldType = "text" | "number" | "date" | "category";
export declare type FieldDisplay = "visible" | "hidden" | "prevent-hidden";
export declare type FieldSticky = "start" | "end" | "none";
export declare type FieldFilter = "client-side" | "server-side" | "none";
export declare type FieldSort = "client-side" | "server-side" | "none";

export interface TableField<R extends TableRow> extends AbstractField {
  classNames?: string;
  rowClass?: string | AtClassFunc;
  customSortFunction?: AtSortFunc<R>;
  customFilterFunction?: AtSortFunc<R>;
  toPrint?: ToPrint;
  toExport?: ToExport;
}

export interface AbstractField {
  index?: number;
  name: string /* The key of the data */;
  type?: FieldType /* Type of data in the field */;
  minWidth?: number /* min width of column */;
  width?: number /* width of column */;
  widthPercentage?: number;
  widthUnit?: "px" | "%" /* width unit */;
  style?: any /* private property used only in html */;
  header?: string /* The title of the column */;
  isKey?: boolean;
  inlineEdit?: boolean;
  display?: FieldDisplay /* Hide and visible this column */;
  sticky?: FieldSticky /* sticky this column to start or end */;
  filter?: FieldFilter;
  sort?: FieldSort;
  cellClass?: string /* Apply a class to a cell, class name must be in the global stylesheet */;
  cellStyle?: any /* Apply a style to a cell, style must be object ex: [...].cellStyle = {'color' : 'red'} */;
  icon?: string /* Set Icon in Column */;
  iconColor?: string /* Set Icon Color */;
  dynamicCellComponent?: any /* Set Dynamic Component in Cell */;
  draggable?: boolean;
  clickable?: boolean;
  clickType?: "cell" | "label" | "custom";
  printable?: boolean /* display in printing view by default is true */;
  exportable?: boolean;
  enableContextMenu?: boolean;
  rowSelectable?: boolean;
  /* Footer */
  footer?: FooterCell[];
  /* For Ellipsis Text */
  cellEllipsisRow?: number;
  cellTooltipEnable?: boolean;
  headerEllipsisRow?: number;
  headerTooltipEnable?: boolean;
  option?: any; // for store share data show in cell of column
  categoryData?: any[];
  pipes?: IPipe[];
  toString?: (column: TableField<any>, row: TableRow) => string;
  customSort?: (column: TableField<any>, row: any) => string;
}
