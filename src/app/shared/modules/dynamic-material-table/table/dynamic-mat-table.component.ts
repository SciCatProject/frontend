import {
  Component,
  OnInit,
  AfterViewInit,
  QueryList,
  ElementRef,
  ViewChild,
  TemplateRef,
  Renderer2,
  ChangeDetectorRef,
  Input,
  OnDestroy,
  ContentChildren,
  Injector,
  ComponentRef,
  HostBinding,
  ChangeDetectionStrategy,
  EventEmitter,
  Directive,
  OnChanges,
  ViewContainerRef,
  SimpleChanges,
} from "@angular/core";
import { TableCoreDirective } from "../cores/table.core.directive";
import { TableService } from "./dynamic-mat-table.service";
import { TableField } from "../models/table-field.model";
import { AbstractFilter } from "./extensions/filter/compare/abstract-filter";
import { HeaderFilterComponent } from "./extensions/filter/header-filter.component";
import { MatDialog } from "@angular/material/dialog";
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  state,
} from "@angular/animations";
import { ResizeColumn } from "../models/resize-column.mode";
import { TableMenuActionChange } from "./extensions/table-menu/table-menu.component";
import {
  CdkDragDrop,
  CdkDragStart,
  moveItemInArray,
} from "@angular/cdk/drag-drop";
import { HashMap, isNullorUndefined } from "../cores/type";
import { SettingItem, TableSetting } from "../models/table-setting.model";
import { delay, filter } from "rxjs/operators";
import { FixedSizeTableVirtualScrollStrategy } from "../cores/fixed-size-table-virtual-scroll-strategy";
import { Subscription } from "rxjs";
import { MatMenuTrigger } from "@angular/material/menu";
import { ContextMenuItem } from "../models/context-menu.model";
import {
  Overlay,
  OverlayContainer,
  OverlayPositionBuilder,
  OverlayRef,
} from "@angular/cdk/overlay";
import { requestFullscreen } from "../utilizes/html.helper";
import { TooltipComponent } from "../tooltip/tooltip.component";
import { ComponentPortal } from "@angular/cdk/portal";
import { PageEvent } from "@angular/material/paginator";
import { IRowEvent, TableRow } from "../models/table-row.model";
import { PrintTableDialogComponent } from "./extensions/print-dialog/print-dialog.component";

export interface IDynamicCell {
  row: TableRow;
  column: TableField<any>;
  parent: DynamicMatTableComponent<any>;
  onRowEvent?: EventEmitter<IRowEvent>;
}

// NOTE: This directive is in the same file as the parent component to avoind production build error (https://angular.dev/errors/NG3003).
// (https://github.com/angular/angular/issues/43227#issuecomment-904173738)
@Directive({
  selector: "[appDynamicCell]",
})
export class DynamicCellDirective implements OnChanges, OnDestroy {
  @Input() component: any;
  @Input() column: TableField<any>;
  @Input() row: any;
  @Input() onRowEvent: EventEmitter<IRowEvent>;
  componentRef: ComponentRef<IDynamicCell> = null;

  constructor(
    private vc: ViewContainerRef,
    private parent: DynamicMatTableComponent<any>,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.componentRef === null || this.componentRef === undefined) {
      this.initComponent();
    }
    // pass input parameters
    if (changes.column && changes.column.currentValue) {
      this.componentRef.instance.column = this.column;
    }
    if (changes.row && changes.row.currentValue) {
      (this.componentRef.instance as any).row = this.row;
    }
    if (changes.onRowEvent && changes.onRowEvent.currentValue) {
      (this.componentRef.instance as any).onRowEvent = this.onRowEvent;
    }
  }

  ngOnDestroy(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  initComponent() {
    try {
      this.componentRef = this.vc.createComponent<IDynamicCell>(this.component);
      this.updateInput();
    } catch (e) {
      console.warn(e);
    }
  }

  updateInput() {
    if (this.parent) {
      (this.componentRef.instance as IDynamicCell).parent = this.parent;
    }
    if (this.column) {
      this.componentRef.instance.column = this.column;
    }
    if (this.row) {
      (this.componentRef.instance as IDynamicCell).row = this.row;
    }
    if (this.onRowEvent) {
      (this.componentRef.instance as IDynamicCell).onRowEvent = this.onRowEvent;
    }
  }
}

export const tableAnimation = trigger("tableAnimation", [
  transition("void => *", [
    query(":enter", style({ transform: "translateX(-50%)", opacity: 0 }), {
      //limit: 5,
      optional: true,
    }),
    query(
      ":enter",
      stagger("0.01s", [
        animate(
          "0.5s ease",
          style({ transform: "translateX(0%)", opacity: 1 }),
        ),
      ]),
      {
        //limit: 5,
        optional: true,
      },
    ),
  ]),
]);

export const expandAnimation = trigger("detailExpand", [
  state("collapsed", style({ height: "0px", minHeight: "0" })),
  state("expanded", style({ height: "*" })),
  transition(
    "expanded <=> collapsed",
    animate("100ms cubic-bezier(0.4, 0.0, 0.2, 1)"),
  ),
]);

@Component({
  selector: "dynamic-mat-table",
  templateUrl: "./dynamic-mat-table.component.html",
  styleUrls: ["./dynamic-mat-table.component.scss"],
  animations: [tableAnimation, expandAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicMatTableComponent<T extends TableRow>
  extends TableCoreDirective<T>
  implements OnInit, AfterViewInit, OnDestroy
{
  private dragDropData = { dragColumnIndex: -1, dropColumnIndex: -1 };
  private eventsSubscription: Subscription;
  currentContextMenuSender: any = {};

  @ViewChild("tbl", { static: true }) tbl;
  @Input()
  get setting() {
    return this.tableSetting;
  }
  set setting(value: TableSetting) {
    if (!isNullorUndefined(value)) {
      value.alternativeRowStyle =
        value.alternativeRowStyle || this.tableSetting.alternativeRowStyle;
      value.columnSetting =
        value.columnSetting || this.tableSetting.columnSetting;
      value.direction = value.direction || this.tableSetting.direction;
      value.normalRowStyle =
        value.normalRowStyle || this.tableSetting.normalRowStyle;
      value.visibleActionMenu =
        value.visibleActionMenu || this.tableSetting.visibleActionMenu;
      value.visibleTableMenu =
        value.visibleTableMenu || this.tableSetting.visibleTableMenu;
      value.autoHeight = value.autoHeight || this.tableSetting.autoHeight;
      value.saveSettingMode =
        value.saveSettingMode || this.tableSetting.saveSettingMode || "simple";
      this.pagination.pageSize =
        value.pageSize ||
        this.tableSetting.pageSize ||
        this.pagination.pageSize;
      /* Dynamic Cell must update when setting change */
      value?.columnSetting?.forEach((column) => {
        const originalColumn = this.columns?.find(
          (c) => c.name === column.name,
        );
        if (originalColumn) {
          column = { ...originalColumn, ...column };
        }
      });
      this.tableSetting = value;
      this.setDisplayedColumns();
    }
  }
  init = false;

  @HostBinding("style.height.px") height = null;

  @ViewChild("tooltip") tooltipRef!: TemplateRef<any>;
  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  public contextMenuPosition = { x: "0px", y: "0px" };
  @ViewChild("printRef", { static: true }) printRef!: TemplateRef<any>;
  @ViewChild("printContentRef", { static: true }) printContentRef!: ElementRef;
  @ContentChildren(HeaderFilterComponent)
  headerFilterList!: QueryList<HeaderFilterComponent>;

  printing = true;
  printTemplate: TemplateRef<any> = null;
  public resizeColumn: ResizeColumn = new ResizeColumn();
  /* mouse resize */
  resizableMousemove: () => void;
  resizableMouseup: () => void;
  /* Tooltip */
  overlayRef: OverlayRef = null;

  constructor(
    public dialog: MatDialog,
    private renderer: Renderer2,
    public tableService: TableService,
    public cdr: ChangeDetectorRef,
    public overlay: Overlay,
    private overlayContainer: OverlayContainer,
    private overlayPositionBuilder: OverlayPositionBuilder,
    public readonly config: TableSetting,
  ) {
    super(tableService, cdr, config);
    this.overlayContainer
      .getContainerElement()
      .addEventListener("contextmenu", (e) => {
        e.preventDefault();
        return false;
      });

    this.eventsSubscription = this.resizeColumn.widthUpdate
      .pipe(
        delay(150),
        filter((data) => data.e.columnIndex >= 0) /* Checkbox Column */,
      )
      .subscribe((data) => {
        let i = data.e.columnIndex;
        if (data.e.resizeHandler === "left") {
          const visibleColumns = this.columns.filter(
            (c) => c.display !== "hidden" && c.index < data.e.columnIndex,
          );
          i = visibleColumns[visibleColumns.length - 1].index;
        }
        // this.columns[i].width = data.w;
        const unit = this.columns[i].widthUnit || "px";
        let style = "";
        if (this.columns[i].minWidth) {
          data.w = Math.min(this.columns[i].minWidth, data.w);
        }
        if (unit === "px") {
          style = data.w + "px";
        } else if (unit === "%") {
          const widthChanges =
            (this.tableSetting.columnSetting[i].width ?? 0) - data.w;
          console.log(
            this.tableSetting.columnSetting[i].width,
            data.w,
            widthChanges,
          );
          style = `calc( ${this.columns[i].widthPercentage}% + ${widthChanges}px)`;
        }
        this.columns[i].style = {
          ...this.columns[i].style,
          "max-width": style,
          "min-width": style,
        };
        /* store latest width in setting if exists */
        if (this.tableSetting.columnSetting[i]) {
          this.tableSetting.columnSetting[i].width = data.w;
        }
        this.refreshGrid();
      });
  }

  ngAfterViewInit(): void {
    this.tvsDataSource.paginator = this.paginator;
    this.tvsDataSource.sort = this.sort;
    this.dataSource.subscribe((x) => {
      x = x || [];
      this.rowSelectionModel.clear();
      this.tvsDataSource.data = [];
      this.initSystemField(x);
      this.tvsDataSource.data = x;
      // this.cdr.detectChanges();
      this.refreshUI();
      // window.requestAnimationFrame(() => {
      // });
    });

    this.tvsDataSource.sort.sortChange.subscribe((sort) => {
      this.pagination.pageIndex = 0;
      this.onTableEvent.emit({ event: "SortChanged", sender: sort });
    });
  }

  tooltip_onChanged(
    column: TableField<T>,
    row: any,
    elementRef: any,
    show: boolean,
  ) {
    if (column.cellTooltipEnable === true) {
      if (show === true && row[column.name]) {
        if (this.overlayRef !== null) {
          this.closeTooltip();
        }

        const positionStrategy = this.overlayPositionBuilder
          .flexibleConnectedTo(elementRef)
          .withPositions([
            {
              originX: "center",
              originY: "top",
              overlayX: "center",
              overlayY: "bottom",
              offsetY: -8,
            },
          ]);

        this.overlayRef = this.overlay.create({ positionStrategy });

        const option = {
          providers: [
            {
              provide: "tooltipConfig",
              useValue: row[column.name],
            },
          ],
        };

        const injector = Injector.create(option);
        const tooltipRef: ComponentRef<TooltipComponent> =
          this.overlayRef.attach(
            new ComponentPortal(TooltipComponent, null, injector),
          );
        setTimeout(() => {
          tooltipRef.destroy();
        }, 5000);
      } else if (show === false && this.overlayRef !== null) {
        this.closeTooltip();
      }
    }
  }

  closeTooltip() {
    this.overlayRef?.detach();
    this.overlayRef = null;
  }
  ellipsis(column: TableField<T>, cell = true) {
    if (cell === true && column.cellEllipsisRow > 0) {
      return {
        display: "-webkit-box",
        "-webkit-line-clamp": column?.cellEllipsisRow,
        "-webkit-box-orient": "vertical",
        overflow: "hidden",
        "white-space": "pre-wrap",
      };
    } else if (cell === true && column.headerEllipsisRow > 0) {
      return {
        display: "-webkit-box",
        "-webkit-line-clamp": column?.headerEllipsisRow,
        "-webkit-box-orient": "vertical",
        overflow: "hidden",
        "white-space": "pre-wrap",
      };
    }

    return {};
  }

  indexTrackFn = (index: number) => {
    return index;
  };

  trackColumn(index: number, item: TableField<T>): string {
    return `${item.index}`;
  }

  ngOnDestroy(): void {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  public refreshUI() {
    if (this.tableSetting.autoHeight === true) {
      this.height = this.autoHeight();
    } else {
      this.height = null;
    }
    this.refreshColumn(this.tableColumns);
    this.tvsDataSource.columns = this.columns;
    const scrollStrategy: FixedSizeTableVirtualScrollStrategy =
      this.viewport["_scrollStrategy"];
    scrollStrategy?.viewport?.checkViewportSize();
    scrollStrategy?.viewport?.scrollToOffset(0);
    this.cdr.detectChanges();
  }

  ngOnInit() {
    setTimeout(() => {
      this.init = true;
    }, 1000);
    const scrollStrategy: FixedSizeTableVirtualScrollStrategy =
      this.viewport["_scrollStrategy"];

    scrollStrategy.offsetChange.subscribe((offset) => {});
    this.viewport.renderedRangeStream.subscribe((t) => {
      // in expanding row scrolling make not good appearance therefor close it.
      if (
        this.expandedElement &&
        this.expandedElement.option &&
        this.expandedElement.option.expand
      ) {
        // this.expandedElement.option.expand = false;
        // this.expandedElement = null;
      }
    });
  }

  public get inverseOfTranslation(): number {
    if (!this.viewport || !this.viewport["_renderedContentOffset"]) {
      return -0;
    }
    const offset = this.viewport["_renderedContentOffset"];
    return -offset;
  }

  headerClass(column: TableField<T>) {
    return column?.classNames;
  }

  rowStyle(row) {
    let style: any = row?.option?.style || {};
    if (this.setting.alternativeRowStyle && row.id % 2 === 0) {
      // style is high priority
      style = { ...this.setting.alternativeRowStyle, ...style };
    }
    if (this.setting.rowStyle) {
      style = { ...this.setting.rowStyle, ...style };
    }
    return style;
  }

  cellClass(option, column) {
    let className = null;
    if (option && column.name) {
      className = option[column.name] ? option[column.name].style : null;
    }

    if (className === null) {
      return column.cellClass;
    } else {
      return { ...className, ...column.cellClass };
    }
  }

  cellStyle(option: HashMap<any>, column) {
    let style = null;
    if (option && column.name) {
      style = option[column.name] ? option[column.name].style : null;
    }
    /* consider to column width resize */
    if (style === null) {
      return { ...column.cellStyle, ...column.style };
    } else {
      return { ...style, ...column.cellStyle, ...column?.style };
    }
  }

  cellIcon(option, cellName) {
    if (option && cellName) {
      return option[cellName] ? option[cellName].icon : null;
    } else {
      return null;
    }
  }

  filter_onChanged(column: TableField<T>, filter: AbstractFilter[]) {
    this.pending = true;
    this.tvsDataSource.setFilter(column.name, filter).subscribe(() => {
      this.clearSelection();
      this.pending = false;
    });
  }

  onContextMenu(event: MouseEvent, column: TableField<T>, row: any) {
    if (
      this.currentContextMenuSender?.time &&
      new Date().getTime() - this.currentContextMenuSender.time < 500
    ) {
      return;
    }
    this.contextMenu.closeMenu();
    if (this.contextMenuItems?.length === 0) {
      return;
    }
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + "px";
    this.contextMenuPosition.y = event.clientY + "px";
    this.currentContextMenuSender = {
      column: column,
      row: row,
      time: new Date().getTime(),
    };
    this.contextMenu.menuData = this.currentContextMenuSender;
    this.contextMenu.menu.focusFirstItem("mouse");
    this.onRowEvent.emit({
      event: "BeforeContextMenuOpen",
      sender: { row: row, column: column, contextMenu: this.contextMenuItems },
    });
    this.contextMenu.openMenu();
  }

  onContextMenuItemClick(data: ContextMenuItem) {
    this.contextMenu.menuData.item = data;
    this.onRowEvent.emit({
      event: "ContextMenuClick",
      sender: this.contextMenu.menuData,
    });
  }

  tableMenuActionChange(e: TableMenuActionChange) {
    if (e.type === "TableSetting") {
      this.settingChange.emit({ type: "apply", setting: this.tableSetting });
      this.refreshColumn(this.tableSetting.columnSetting);
    } else if (e.type === "DefaultSetting") {
      (this.setting.settingList || []).forEach((setting) => {
        if (setting.settingName === e.data) {
          setting.isDefaultSetting = true;
        } else {
          setting.isDefaultSetting = false;
        }
      });
      this.settingChange.emit({ type: "default", setting: this.tableSetting });
    } else if (e.type === "SaveSetting") {
      const newSetting = Object.assign({}, this.setting);
      delete newSetting.settingList;
      newSetting.settingName = e.data;
      const settingIndex = (this.setting.settingList || []).findIndex(
        (f) => f.settingName === e.data,
      );
      if (settingIndex === -1) {
        this.setting.settingList.push(JSON.parse(JSON.stringify(newSetting)));
        this.settingChange.emit({ type: "create", setting: this.tableSetting });
      } else {
        this.setting.settingList[settingIndex] = JSON.parse(
          JSON.stringify(newSetting),
        );
        this.settingChange.emit({ type: "save", setting: this.tableSetting });
      }
    } else if (e.type === "DeleteSetting") {
      this.setting.settingList = this.setting.settingList.filter(
        (s) => s.settingName !== e.data.settingName,
      );
      this.setting.columnSetting
        .filter((f) => f.display === "hidden")
        .forEach((f) => (f.display = "visible"));
      this.refreshColumn(this.setting.columnSetting);
      this.settingChange.emit({ type: "delete", setting: this.tableSetting });
    } else if (e.type === "SelectSetting") {
      if (e.data != null) {
        let setting: SettingItem = null;
        this.setting.settingList.forEach((s) => {
          if (s.settingName === e.data) {
            s.isCurrentSetting = true;
            setting = Object.assign(
              {},
              this.setting.settingList.find((s) => s.settingName === e.data),
            );
          } else {
            s.isCurrentSetting = false;
          }
        });
        setting.settingList = this.setting.settingList;
        delete setting.isCurrentSetting;
        delete setting.isDefaultSetting;
        if (
          this.pagingMode !== "none" &&
          this.pagination.pageSize != setting?.pageSize
        ) {
          this.pagination.pageSize =
            setting?.pageSize || this.pagination.pageSize;
          this.paginationChange.emit(this.pagination);
        }
        /* Dynamic Cell must update when setting change */
        setting.columnSetting?.forEach((column) => {
          const originalColumn = this.columns.find(
            (c) => c.name === column.name,
          );
          column = { ...originalColumn, ...column };
        });
        this.tableSetting = setting;
        this.refreshColumn(this.setting.columnSetting);
        this.settingChange.emit({ type: "select", setting: this.tableSetting });
      } else {
        const columns = [];
        this.columns.forEach((c) => {
          columns.push(Object.assign({}, c));
        });
        this.refreshColumn(columns);
        this.refreshUI();
      }
    } else if (e.type === "FullScreenMode") {
      requestFullscreen(this.tbl.elementRef);
    } else if (e.type === "Download") {
      this.onTableEvent.emit({
        event: "ExportData",
        sender: {
          type: e.data,
          columns: this.columns,
          data: this.tvsDataSource.filteredData,
          dataSelection: this.rowSelectionModel,
        },
      });
      if (e.data === "CSV") {
        this.tableService.exportToCsv<T>(
          this.columns,
          this.tvsDataSource.filteredData,
          this.rowSelectionModel,
        );
      } else if (e.data === "JSON") {
        this.tableService.exportToJson(this.tvsDataSource.filteredData);
      }
    } else if (e.type === "FilterClear") {
      this.tvsDataSource.clearFilter();
      this.headerFilterList.forEach((hf) => hf.clearColumn_OnClick());
    } else if (e.type === "Print") {
      this.onTableEvent.emit({
        event: "ExportData",
        sender: {
          type: "Print",
          columns: this.columns,
          data: this.tvsDataSource.filteredData,
          dataSelection: this.rowSelectionModel,
        },
      });
      this.printConfig.title = this.printConfig.title || this.tableName;
      this.printConfig.direction = this.tableSetting.direction || "ltr";
      this.printConfig.columns = this.tableColumns.filter(
        (t) => t.display !== "hidden" && t.printable !== false,
      );
      this.printConfig.displayedFields = this.printConfig.columns.map(
        (o) => o.name,
      );
      this.printConfig.data = this.tvsDataSource.filteredData;
      const params = this.tvsDataSource.toTranslate();
      this.printConfig.tablePrintParameters = [];
      params.forEach((item) => {
        this.printConfig.tablePrintParameters.push(item);
      });

      this.dialog.open(PrintTableDialogComponent, {
        width: "90vw",
        data: this.printConfig,
      });
    }
  }

  rowMenuActionChange(contextMenuItem: ContextMenuItem, row: any) {
    this.onRowEvent.emit({
      event: "RowActionMenu",
      sender: { row: row, action: contextMenuItem },
    });
    // this.rowActionMenuChange.emit({actionItem: contextMenuItem, rowItem: row });
  }

  pagination_onChange(e: PageEvent) {
    if (this.pagingMode !== "none") {
      this.pending = true;
      this.tvsDataSource.refreshFilterPredicate();
      this.pagination.length = e.length;
      this.pagination.pageIndex = e.pageIndex;
      this.pagination.pageSize = e.pageSize;
      this.setting.pageSize =
        e.pageSize; /* Save Page Size when need in setting config */
      this.paginationChange.emit(this.pagination);
    }
  }

  globalTextSearch_onChange(event: Event) {
    if (this.showGlobalTextSearch) {
      this.globalTextSearch = (event.target as HTMLInputElement).value;
      this.globalTextSearchChange.emit(this.globalTextSearch);
    }
  }

  autoHeight() {
    const minHeight =
      this.headerHeight +
      (this.rowHeight + 1) * this.dataSource.value.length +
      this.footerHeight * 0;
    return minHeight.toString();
  }

  reload_onClick() {
    this.onTableEvent.emit({ sender: null, event: "ReloadData" });
  }

  /////////////////////////////////////////////////////////////////

  onResizeColumn(event: MouseEvent, index: number, type: "left" | "right") {
    this.resizeColumn.resizeHandler = type;
    this.resizeColumn.startX = event.pageX;
    if (this.resizeColumn.resizeHandler === "right") {
      this.resizeColumn.startWidth = (
        event.target as Node
      ).parentElement.clientWidth;
      this.resizeColumn.columnIndex = index;
    } else {
      if (
        (event.target as Node).parentElement.previousElementSibling === null
      ) {
        /* for first column not resize */
        return;
      } else {
        this.resizeColumn.startWidth = (
          event.target as Node
        ).parentElement.previousElementSibling.clientWidth;
        this.resizeColumn.columnIndex = index;
      }
    }
    event.preventDefault();
    this.mouseMove(index);
  }

  mouseMove(index: number) {
    this.resizableMousemove = this.renderer.listen(
      "document",
      "mousemove",
      (event) => {
        if (this.resizeColumn.resizeHandler !== null && event.buttons) {
          const rtl = this.direction === "rtl" ? -1 : 1;
          let width = 0;
          if (this.resizeColumn.resizeHandler === "right") {
            const dx = event.pageX - this.resizeColumn.startX;
            width = this.resizeColumn.startWidth + rtl * dx;
          } else {
            const dx = this.resizeColumn.startX - event.pageX;
            width = this.resizeColumn.startWidth - rtl * dx;
          }
          if (
            this.resizeColumn.columnIndex === index &&
            width > this.minWidth
          ) {
            // this.resizeColumn.columnIndex = index;
            this.resizeColumn.widthUpdate.next({
              e: this.resizeColumn,
              w: width,
            });
          }
        }
      },
    );
    this.resizableMouseup = this.renderer.listen(
      "document",
      "mouseup",
      (event) => {
        if (this.resizeColumn.resizeHandler !== null) {
          this.resizeColumn.resizeHandler = null;
          this.resizeColumn.columnIndex = -1;
          /* fix issue sticky column */
          this.table.updateStickyColumnStyles();
          /* Remove Event Listen */
          this.resizableMousemove();
        }
      },
    );
  }

  public expandRow(rowIndex: number, mode = true) {
    if (rowIndex === null || rowIndex === undefined) {
      throw "Row index is not defined.";
    }
    if (this.expandedElement === this.tvsDataSource.allData[rowIndex]) {
      this.expandedElement.option.expand = mode;
      this.expandedElement =
        this.expandedElement === this.tvsDataSource.allData[rowIndex]
          ? null
          : this.tvsDataSource.allData[rowIndex];
    } else {
      if (
        this.expandedElement &&
        this.expandedElement !== this.tvsDataSource.allData[rowIndex]
      ) {
        this.expandedElement.option.expand = false;
      }
      this.expandedElement = null;
      if (mode === true) {
        this.expandedElement =
          this.expandedElement === this.tvsDataSource.allData[rowIndex]
            ? null
            : this.tvsDataSource.allData[rowIndex];
        if (
          this.expandedElement.option === undefined ||
          this.expandedElement.option === null
        ) {
          this.expandedElement.option = { expand: false };
        }
        this.expandedElement.option.expand = true;
      }
    }
  }

  onRowSelection(e, row, column: TableField<T>) {
    if (
      this.rowSelectionMode &&
      this.rowSelectionMode !== "none" &&
      column.rowSelectable !== false
    ) {
      this.onRowSelectionChange(e, row);
    }
  }

  onCellClick(e, row, column: TableField<T>) {
    if (column.cellTooltipEnable === true) {
      this.closeTooltip(); /* Fixed BUG: Open Overlay when redirect to other route */
    }
    this.onRowSelection(e, row, column);
    if (
      column.clickable !== false &&
      (column.clickType === null || column.clickType === "cell")
    ) {
      this.onRowEvent.emit({
        event: "CellClick",
        sender: { row: row, column: column },
      });
    }
  }

  onLabelClick(e, row, column: TableField<T>) {
    if (column.clickable !== false && column.clickType === "label") {
      this.onRowEvent.emit({
        event: "LabelClick",
        sender: { row: row, column: column, e: e },
      });
    }
  }

  onRowDblClick(e, row) {
    this.onRowEvent.emit({ event: "DoubleClick", sender: { row: row, e: e } });
  }

  onRowClick(e, row) {
    this.onRowEvent.emit({ event: "RowClick", sender: { row: row, e: e } });
  }

  /************************************ Drag & Drop Column *******************************************/

  dragStarted(event: Event) {
    // this.dragDropData.dragColumnIndex = event.source.;
  }

  dropListDropped(event: CdkDragDrop<string[]>) {
    if (event) {
      this.dragDropData.dropColumnIndex = event.currentIndex;
      this.moveColumn(event.previousIndex, event.currentIndex);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    );

    // updates moved data and table, but not dynamic if more dropzones
    // this.dataSource.data = clonedeep(this.dataSource.data);
  }
  /************************************  *******************************************/

  copyProperty(from: any, to: any) {
    const keys = Object.keys(from);
    keys.forEach((key) => {
      if (from[key] !== undefined && from[key] === null) {
        to[key] = Array.isArray(from[key])
          ? Object.assign([], from[key])
          : Object.assign({}, from[key]);
      }
    });
  }
}
