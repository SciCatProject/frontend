import {
  Component,
  Input,
  ChangeDetectionStrategy,
  AfterContentInit,
  QueryList,
  EventEmitter,
  Output,
  ElementRef,
  OnDestroy,
  ViewChild,
  ViewChildren,
  ChangeDetectorRef,
  NgZone,
  OnInit,
  AfterViewInit,
} from "@angular/core";
import { ViewportRuler } from "@angular/cdk/scrolling";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";
import { fromEvent, merge, Subscription } from "rxjs";

import { Column } from "./../../column.type";
import { SciCatDataSource } from "../../services/scicat.datasource";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { ExportExcelService } from "../../services/export-excel.service";

@Component({
  selector: "shared-table",
  templateUrl: "./shared-table.component.html",
  styleUrls: ["./shared-table.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("detailExpand", [
      state(
        "collapsed",
        style({ height: "0px", minHeight: "0", visibility: "hidden" })
      ),
      state("expanded", style({ height: "*", visibility: "visible" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class SharedTableComponent
  implements AfterContentInit, OnDestroy, OnInit, AfterViewInit {
  private rulerSubscription: Subscription;
  public MIN_COLUMN_WIDTH = 200;

  // Filter Fields
  generalFilter = new FormControl();
  filterExpressions = {};

  // Visible Hidden Columns
  visibleColumns: Column[];
  hiddenColumns: Column[];
  // unitialized values are effectively treated as false
  expandedElement = {};

  columnFilterSubscriptions: Subscription[] = [];

  // MatPaginator Inputs
  length = 100;

  // Shared Variables
  @Input() dataSource: SciCatDataSource;
  @Input() columnsdef: Column[];
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];

  @Output() rowClick = new EventEmitter<any>();

  // MatTable
  @ViewChild(MatTable, { static: true }) dataTable: MatTable<Element>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("input", { static: true }) input: ElementRef;
  @ViewChildren("allFilters") allFilters: QueryList<ElementRef>;

  constructor(
    public ete: ExportExcelService,
    private ruler: ViewportRuler,
    private _changeDetectorRef: ChangeDetectorRef,
    private zone: NgZone
  ) {
    // react to viewport width changes with column restructuring
    this.rulerSubscription = this.ruler.change(100).subscribe((data) => {
      // accesing clientWidth cause browser layout, cache it!
      // const tableWidth = this.table.nativeElement.clientWidth;
      this.toggleColumns(
        this.dataTable["_elementRef"].nativeElement.clientWidth
      );
    });
  }

  /**
   * Lifecycle Hook Start
   */

  ngOnInit() {
    this.dataSource.loadAllData("", {}, "", "", 0, this.pageSize);
  }

  // link paginator and sort arrows to tables data source

  ngAfterViewInit() {
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    // TODO unsubscribe global search filter as well
    fromEvent(this.input.nativeElement, "keyup")
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        tap(() => {
          // console.log("global key typed :", this.input.nativeElement.id)
          this.paginator.pageIndex = 0;
          this.loadDataPage();
        })
      )
      .subscribe();

    this.activateColumnFilters();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.loadDataPage()))
      .subscribe();
  }

  loadAllExportData() {
    this.dataSource.loadExportData(
      this.input.nativeElement.value,
      this.filterExpressions,
      this.sort.active,
      this.sort.direction
    );
  }

  // TODO Known problem: API server can not filter on ObjectId fields

  loadDataPage() {
    this.dataSource.loadAllData(
      this.input.nativeElement.value,
      this.filterExpressions,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize
    );
  }

  ngAfterContentInit() {
    this.toggleColumns(this.dataTable["_elementRef"].nativeElement.clientWidth);
  }

  ngOnDestroy() {
    // TODO unsubscribe ALL subscriptions for cleanup
    this.rulerSubscription.unsubscribe();
    this.unsubscribeColumnFilters();
    this.sort.sortChange.unsubscribe();
  }

  /**
   * Lifecycle Hook End
   */

  onRowClick(event: any) {
    this.rowClick.emit(event);
  }

  get visibleColumnsIds() {
    const visibleColumnsIds = this.visibleColumns.map((column) => column.id);

    return this.hiddenColumns.length
      ? ["trigger", ...visibleColumnsIds]
      : visibleColumnsIds;
  }

  get hiddenColumnsIds() {
    return this.hiddenColumns.map((column) => column.id);
  }

  getExpandFlag(i) {
    const ex =
      Object.keys(this.expandedElement).length > 0 && this.expandedElement[i]
        ? "expanded"
        : "collapsed";
    return ex;
  }

  toggleExpandFlag(i) {
    this.expandedElement[i] = !this.expandedElement[i];
    this._changeDetectorRef.detectChanges();
  }

  unsubscribeColumnFilters() {
    this.columnFilterSubscriptions.forEach((sub) => {
      // console.log("Unsubscribing subscription sub:", sub)
      sub.unsubscribe();
    });
  }

  activateColumnFilters() {
    // the following does not work:this.unsubscribeColumnFilters()
    let i = 0;
    this.allFilters.toArray().forEach((filter) => {
      i++;
      // console.log("Defining subscription for column :", i)
      this.columnFilterSubscriptions[i] = fromEvent(
        filter.nativeElement,
        "keyup"
      )
        .pipe(
          debounceTime(350),
          distinctUntilChanged(),
          tap(() => {
            // console.log("key typed :", filter.nativeElement.id)
            this.paginator.pageIndex = 0;
            const columnId = filter.nativeElement.id;
            if (filter.nativeElement.value) {
              this.filterExpressions[columnId] = filter.nativeElement.value;
            } else {
              delete this.filterExpressions[columnId];
            }
            this.loadDataPage();
          })
        )
        .subscribe();
    });
  }

  reloadFilterExpressions() {
    this.allFilters.toArray().forEach((filter) => {
      const columnId = filter.nativeElement.id;
      if (this.filterExpressions[columnId]) {
        // console.log("Reloading filter expressions:", columnId, this.filterExpressions[columnId]);
        filter.nativeElement.value = this.filterExpressions[columnId];
      }
    });
  }

  toggleColumns(tableWidth: number) {
    // console.log("Calling toggleColumns", tableWidth)

    this.zone.runOutsideAngular(() => {
      const sortedColumns = this.columnsdef
        .slice()
        .map((column, index) => ({ ...column, order: index }))
        .sort((a, b) => a.hideOrder - b.hideOrder);

      for (const column of sortedColumns) {
        const columnWidth = column.width ? column.width : this.MIN_COLUMN_WIDTH;

        if (column.hideOrder && tableWidth < columnWidth) {
          column.visible = false;

          continue;
        }

        tableWidth -= columnWidth;
        column.visible = true;
      }

      this.columnsdef = sortedColumns.sort((a, b) => a.order - b.order);
      this.visibleColumns = this.columnsdef.filter((column) => column.visible);
      this.hiddenColumns = this.columnsdef.filter((column) => !column.visible);
      // console.log("visible columns:",this.visibleColumns)
    });

    this._changeDetectorRef.detectChanges();
    this.reloadFilterExpressions();
    this.activateColumnFilters();
  }

  exportToExcel() {
    // subscribes to the latest fetched data
    this.loadAllExportData();
  }

  getPropertyByPath(obj: Object, pathString: string) {
    return pathString.split(".").reduce((o, i) => o[i], obj);
  }
}
