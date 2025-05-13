import {
  IRowEvent,
  TableRow,
  TableSelectionMode,
  ITableEvent,
  RowEventType,
} from "../models/table-row.model";
import { TableVirtualScrollDataSource } from "./table-data-source";
import {
  ViewChild,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  ChangeDetectorRef,
} from "@angular/core";
import { TableField } from "../models/table-field.model";
import { titleCase } from "../utilizes/utilizes";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { moveItemInArray } from "@angular/cdk/drag-drop";
import { SelectionModel } from "@angular/cdk/collections";
import { TableService } from "../table/dynamic-mat-table.service";
import {
  TablePagination,
  TablePaginationMode,
} from "../models/table-pagination.model";
import { PrintConfig } from "../models/print-config.model";
import {
  TableSetting,
  Direction,
  TableSettingEventType,
  ITableSetting,
} from "../models/table-setting.model";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatTable } from "@angular/material/table";
import { Directive } from "@angular/core";
import { clone, getObjectProp, isNullorUndefined } from "./type";
import { TableScrollStrategy } from "./fixed-size-table-virtual-scroll-strategy";
import { ContextMenuItem } from "../models/context-menu.model";
import { BehaviorSubject } from "rxjs";

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: "[core]",
  standalone: false,
})
export class TableCoreDirective<T extends TableRow> {
  private _expandComponent: any;
  private _rowSelectionModel = new SelectionModel<T>(true, []);
  private _tablePagination: TablePagination = null;
  protected _rowSelectionMode: TableSelectionMode;
  public expandColumn = [];
  public noData = true;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @Input() public dataSource: BehaviorSubject<any[]>;
  @Input() backgroundColor: string = null;
  @Input() public rowContextMenuItems: ContextMenuItem[];
  @Input() defaultWidth: number = null;
  @Input() minWidth = 120;
  @Input() printConfig: PrintConfig = {};
  @Input() sticky = true;
  @Input() pending: boolean;
  @Input() rowHeight = 50;
  @Input() headerHeight = 56;
  @Input() footerHeight = 48;
  @Input() headerEnable = true;
  @Input() footerEnable = false;
  @Input() showNoData = true;
  @Input() showReload = true;
  @Input() showGlobalTextSearch = true;
  @Input() globalTextSearch = "";
  @Input() globalTextSearchPlaceholder = "Search";
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onTableEvent: EventEmitter<ITableEvent> = new EventEmitter();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onRowEvent: EventEmitter<IRowEvent<any>> = new EventEmitter();
  @Output() settingChange: EventEmitter<{
    type: TableSettingEventType;
    setting: TableSetting;
  }> = new EventEmitter();
  @Output() paginationChange: EventEmitter<TablePagination> =
    new EventEmitter();
  @Output() globalTextSearchChange: EventEmitter<string> = new EventEmitter();

  /*************************************** Expand Row *********************************/
  expandedElement: TableRow | null;
  @Input() contextMenuItems: ContextMenuItem[] = [];

  // Variables //
  progressColumn: string[] = [];
  searchRowColumns = ["placeholder-column", "global-search"];
  displayedColumns: string[] = [];
  displayedFooter: string[] = [];
  public tableColumns: TableField<T>[];
  public tvsDataSource: TableVirtualScrollDataSource<T> =
    new TableVirtualScrollDataSource<T>([]);

  public tablePagingMode: TablePaginationMode = "none";
  public viewportClass: "viewport" | "viewport-with-pagination" =
    "viewport-with-pagination";
  tableSetting: ITableSetting;

  /**************************************** Reference Variables ***************************************/
  @ViewChild(MatTable, { static: true }) table!: MatTable<any>;
  @ViewChild(CdkVirtualScrollViewport, { static: true })
  viewport!: CdkVirtualScrollViewport;
  /**************************************** Methods **********************************************/

  constructor(
    public tableService: TableService,
    public cdr: ChangeDetectorRef,
    public readonly config: TableSetting,
  ) {
    this.showProgress = true;
    this.tableSetting = {
      direction: "ltr",
      columnSetting: null,
      visibleActionMenu: null,
    };
    if (this.config) {
      this.tableSetting = { ...this.tableSetting, ...this.config };
    }
  }

  @Input()
  @HostBinding("style.direction")
  get direction(): Direction {
    return this.tableSetting?.direction;
  }
  set direction(value: Direction) {
    this.tableSetting.direction = value;
  }

  @Input()
  get ScrollStrategyType() {
    return this.tableSetting.scrollStrategy;
  }
  set ScrollStrategyType(value: TableScrollStrategy) {
    this.viewport["_scrollStrategy"].scrollStrategyMode = value;
    this.tableSetting.scrollStrategy = value;
  }

  @Input()
  get pagingMode() {
    return this.tablePagingMode;
  }
  set pagingMode(value: TablePaginationMode) {
    this.tablePagingMode = value;
    this.updatePagination();
  }

  @Input()
  get pagination() {
    return this._tablePagination;
  }
  set pagination(value: TablePagination) {
    if (value && value !== null) {
      this._tablePagination = value;
      if (isNullorUndefined(this._tablePagination.pageSizeOptions)) {
        this._tablePagination.pageSizeOptions = [5, 10, 25, 100];
      }
      if (isNullorUndefined(this._tablePagination.pageSize)) {
        this._tablePagination.pageSize =
          this._tablePagination.pageSizeOptions[0];
      }
      this.updatePagination();
    }
  }

  @Input()
  get rowSelectionModel() {
    return this._rowSelectionModel;
  }
  set rowSelectionModel(value: SelectionModel<T>) {
    if (!isNullorUndefined(value)) {
      if (
        this._rowSelectionMode &&
        value &&
        this._rowSelectionMode !== "none"
      ) {
        this._rowSelectionMode =
          value.isMultipleSelection() === true ? "multi" : "single";
      }
      this._rowSelectionModel = value;
    }
  }

  @Input()
  get rowSelectionMode() {
    return this._rowSelectionMode;
  }
  set rowSelectionMode(selection: TableSelectionMode) {
    selection = selection || "none";
    const isSelectionColumn = selection === "single" || selection === "multi";
    if (
      this._rowSelectionModel === null ||
      (this._rowSelectionModel.isMultipleSelection() === true &&
        selection === "single") ||
      (this._rowSelectionModel.isMultipleSelection() === false &&
        selection === "multi")
    ) {
      this._rowSelectionModel = new SelectionModel<T>(
        selection === "multi",
        [],
      );
    }
    if (
      this.displayedColumns?.length > 0 &&
      !isSelectionColumn &&
      this.displayedColumns[0] === "row-checkbox"
    ) {
      this.displayedColumns.shift();
    } else if (
      this.displayedColumns?.length > 0 &&
      isSelectionColumn &&
      this.displayedColumns[0] !== "row-checkbox"
    ) {
      this.displayedColumns.unshift("row-checkbox");
    }
    this._rowSelectionMode = selection;
  }

  @Input()
  get tableName() {
    return this.tableService.tableName;
  }
  set tableName(value: string) {
    this.tableService.tableName = value;
  }

  @Input()
  get showProgress() {
    return this.progressColumn.length > 0;
  }
  set showProgress(value: boolean) {
    this.progressColumn = [];
    if (value === true) {
      this.progressColumn.push("progress");
    }
  }

  protected initSystemField(data: any[]) {
    if (data) {
      data = data.map((item, index) => {
        item.id = index;
        item.option = item.option || {};
        return item;
      });
    }
  }

  @Input()
  get expandComponent(): any {
    return this._expandComponent;
  }
  set expandComponent(value: any) {
    this._expandComponent = value;
    if (this._expandComponent !== null && this._expandComponent !== undefined) {
      this.expandColumn = ["expandedDetail"];
    } else {
      this.expandColumn = [];
    }
  }

  @Input()
  get columns() {
    return this.tableColumns;
  }
  set columns(fields: TableField<T>[]) {
    (fields || []).forEach((f, i) => {
      // key name error //
      if (f.name.toLowerCase() === "id") {
        throw 'Field name is reserved.["id"]';
      }
      const settingFields = (this.tableSetting.columnSetting || []).filter(
        (s) => s.name === f.name,
      );
      const settingField = settingFields.length > 0 ? settingFields[0] : null;
      /* default value for fields */
      f.printable = f.printable || true;
      f.exportable = f.exportable || true;
      f.toExport =
        f.toExport ||
        ((row, type) => (typeof row === "object" ? row[f.name] : ""));
      f.toPrint = (row) => (typeof row === "object" ? row[f.name] : "");
      f.enableContextMenu = f.enableContextMenu || true;
      f.header = f.header || titleCase(f.name);
      f.display = getObjectProp("display", "visible", settingField, f);
      f.filter = getObjectProp("filter", "client-side", settingField, f);
      f.sort = getObjectProp("sort", "client-side", settingField, f);
      f.sticky = getObjectProp("sticky", "none", settingField, f);
      f.width = getObjectProp("width", this.defaultWidth, settingField, f);
      const unit = f.widthUnit || "px";
      const style =
        unit === "px" ? f.width + "px" : `calc( ${f.widthPercentage}% )`;
      if (f.width) {
        f.style = {
          ...f.style,
          "max-width": style,
          "min-width": style,
        };
      }
    });
    this.tableColumns = fields;

    this.updateColumn();
  }

  public updateColumn() {
    if (this.tableColumns) {
      this.tableSetting.columnSetting = clone(this.tableColumns);
    }
    this.setDisplayedColumns();
  }

  updatePagination() {
    if (isNullorUndefined(this.tvsDataSource)) {
      return;
    }
    if (
      this.tablePagingMode === "client-side" ||
      this.tablePagingMode === "server-side"
    ) {
      this.viewportClass = "viewport-with-pagination";
      if (!isNullorUndefined(this.tvsDataSource.paginator)) {
        let dataLen = this.tvsDataSource.paginator.length;
        if (
          !isNullorUndefined(this._tablePagination.length) &&
          this._tablePagination.length > dataLen
        ) {
          dataLen = this._tablePagination.length;
        }
        this.tvsDataSource.paginator.length = dataLen;
      }
    } else {
      this.viewportClass = "viewport";
      if ((this.tvsDataSource as any)._paginator !== undefined) {
        delete (this.tvsDataSource as any)._paginator;
      }
    }
    this.tvsDataSource.refreshFilterPredicate();
  }

  public clearSelection() {
    if (this._rowSelectionModel) {
      this._rowSelectionModel.clear();
    }
  }

  public clear() {
    if (!isNullorUndefined(this.tvsDataSource)) {
      if (this.viewport) {
        this.viewport.scrollTo({ top: 0, behavior: "auto" });
      }
      this.tvsDataSource.clearData();
      this.expandedElement = null;
    }
    this.clearSelection();
    this.cdr.detectChanges();
  }

  setDisplayedColumns() {
    if (this.columns) {
      this.displayedColumns.splice(0, this.displayedColumns.length);
      this.columns.forEach((column, index) => {
        column.index = index;
        if (
          column.display === undefined ||
          column.display === "visible" ||
          column.display === "prevent-hidden"
        ) {
          this.displayedColumns.push(column.name);
        }
      });
      if (
        (this._rowSelectionMode === "multi" ||
          this._rowSelectionMode === "single") &&
        this.displayedColumns.indexOf("row-checkbox") === -1
      ) {
        this.displayedColumns.unshift("row-checkbox");
      }
      this.displayedFooter = this.columns
        .filter((item) => item.footer !== null && item.footer !== undefined)
        .map((item) => item.name);
      if (this.tableSetting.visibleTableMenu !== false) {
        this.displayedColumns.push("table-menu");
      }
    }
  }

  /************************************ Drag & Drop Column *******************************************/
  public refreshGrid() {
    this.cdr.detectChanges();
    this.refreshColumn(this.tableColumns);
    this.table.renderRows();
    this.viewport.checkViewportSize();
  }

  public moveRow(from: number, to: number) {
    if (
      from >= 0 &&
      from < this.tvsDataSource.data.length &&
      to >= 0 &&
      to < this.tvsDataSource.data.length
    ) {
      this.tvsDataSource.data[from].id = to;
      this.tvsDataSource.data[to].id = from;
      moveItemInArray(this.tvsDataSource.data, from, to);
      this.tvsDataSource.data = Object.assign([], this.tvsDataSource.data);
    }
  }

  moveColumn(from: number, to: number) {
    moveItemInArray(this.columns, from, to);
    this.refreshColumn(this.columns);
  }

  refreshColumn(columns: TableField<T>[]) {
    if (this.viewport) {
      const currentOffset = this.viewport.measureScrollOffset();
      this.columns = columns;
      setTimeout(
        () => this.viewport.scrollTo({ top: currentOffset, behavior: "auto" }),
        0,
      );
    }
  }

  /************************************ Selection Table Row *******************************************/

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this._rowSelectionModel.selected.length;
    const numRows = this.tvsDataSource.filteredData.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    const isAllSelected = this.isAllSelected();
    if (isAllSelected === false) {
      this.tvsDataSource.filteredData.forEach((row) =>
        this._rowSelectionModel.select(row),
      );
    } else {
      this._rowSelectionModel.clear();
    }
    this.onRowEvent.emit({
      event: RowEventType.MasterSelectionChange,
      sender: { selectionModel: this._rowSelectionModel },
    });
  }

  onRowSelectionChange(e: any, row: T) {
    if (e) {
      this._rowSelectionModel.toggle(row);
      this.onRowEvent.emit({
        event: RowEventType.RowSelectionChange,
        sender: {
          selectionModel: this._rowSelectionModel,
          row: row,
        },
      });
    }
  }
}
