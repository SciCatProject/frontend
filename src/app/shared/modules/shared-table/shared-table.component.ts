import {
  Component, Input, ChangeDetectionStrategy, AfterContentInit, QueryList,
  EventEmitter, Output, ElementRef, OnDestroy, ViewChild, ViewChildren, ChangeDetectorRef, NgZone, OnInit, AfterViewInit, AfterViewChecked
} from "@angular/core";
import { ViewportRuler } from "@angular/cdk/scrolling";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { trigger, state, style, animate, transition } from "@angular/animations";
import { fromEvent, merge, Subscription } from "rxjs";

import { SciCatDataSource } from "../../services/scicat.datasource";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { ExportExcelService } from "../../services/export-excel.service";
import { DateTime } from "luxon";
import { MatDatepickerInputEvent } from "@angular/material/datepicker/datepicker-input-base";
import { ActivatedRoute, Router } from "@angular/router";
import { Column } from "./shared-table.module";

@Component({
  selector: "shared-table",
  templateUrl: "./shared-table.component.html",
  styleUrls: ["./shared-table.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0", visibility: "hidden" })),
      state("expanded", style({ height: "*", visibility: "visible" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
})
export class SharedTableComponent implements AfterViewChecked, AfterViewInit, AfterContentInit, OnDestroy, OnInit {
  private rulerSubscription: Subscription;
  public MIN_COLUMN_WIDTH = 200;

  // Filter Fields (there can be more than 1 oper column)
  generalFilter = new FormControl();
  filterExpressions = {};
  columnFilterSubscriptions: Subscription[] = [];

  // Visible Hidden Columns
  visibleColumns: Column[];
  hiddenColumns: Column[];
  // unitialized values are effectively treated as false
  expandedElement = {};

  // MatPaginator Inputs
  length = 100;

  // Shared Variables
  @Input() dataSource: SciCatDataSource;
  @Input() columnsdef: Column[];
  @Input() pageSize = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 100];
  @Input() title = "";

  @Output() rowClick = new EventEmitter<any>();

  // MatTable
  @ViewChild(MatTable, { static: true }) dataTable: MatTable<Element>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("globalFilter", { static: true }) globalFilter: ElementRef;
  @ViewChildren("allFilters") allFilters: QueryList<ElementRef>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public ete: ExportExcelService,
    private ruler: ViewportRuler,
    private _changeDetectorRef: ChangeDetectorRef,
    private zone: NgZone) {
    // react to viewport width changes with column restructuring
    this.rulerSubscription = this.ruler.change(100).subscribe(data => {
      this.toggleColumns(this.dataTable["_elementRef"].nativeElement.clientWidth);
    });
  }

  /**
   * Lifecycle Hook Start
   */

  ngOnInit() {
  }

  ngAfterViewChecked() {
    this._changeDetectorRef.detectChanges();
  }

  // link paginator and sort arrows to tables data source

  ngAfterViewInit() {
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // global search handler
    fromEvent(this.globalFilter.nativeElement, "keyup")
      .pipe(
        debounceTime(650),
        distinctUntilChanged(),
        tap(() => {
          // console.log("global key typed :", this.globalFilter.nativeElement.name)
          this.paginator.pageIndex = 0;
          let globalSearch = this.globalFilter.nativeElement.value;
          if (globalSearch === "") {
            globalSearch = null;
          }
          this.router.navigate([], {
            queryParams: { globalSearch, pageIndex: 0 },
            queryParamsHandling: "merge"
          });
          this.loadDataPage();
        })
      ).subscribe();

    this.setDefaultFilters();
    this.activateColumnFilters();

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.router.navigate([], {
            queryParams: {
              sortActive: this.sort.active,
              sortDirection: this.sort.direction,
              pageIndex: this.paginator.pageIndex,
              pageSize: this.paginator.pageSize
            },
            queryParamsHandling: "merge"
          });
          this.loadDataPage();
        }
        )
      ).subscribe();

    // copy changes in URL parameters to corresponding GUI fields
    this.route.queryParams.subscribe(queryParams => {
      this.sort.active = queryParams.sortActive ? queryParams.sortActive : null;
      this.sort.direction = queryParams.sortDirection ? queryParams.sortDirection : "asc";
      this.paginator.pageIndex = queryParams.pageIndex ? Number(queryParams.pageIndex) : 0;
      this.paginator.pageSize = queryParams.pageSize ? Number(queryParams.pageSize) : this.pageSize;
      this.globalFilter.nativeElement.value = queryParams.globalSearch ? queryParams.globalSearch : "";
      this.allFilters.toArray().forEach(filter => {
        if (filter.nativeElement.name in queryParams) {
          filter.nativeElement.value = queryParams[filter.nativeElement.name];
          this.filterExpressions[filter.nativeElement.name] = filter.nativeElement.value;
        } else {
          filter.nativeElement.value = null;
          delete this.filterExpressions[filter.nativeElement.name];
        }
      });
      this.loadDataPage();
    });
  }

  loadAllExportData() {
    this.dataSource.loadExportData(
      this.globalFilter.nativeElement.value,
      this.filterExpressions,
      this.sort.active,
      this.sort.direction
    );
  }

  loadDataPage() {
    this.dataSource.loadAllData(
      this.globalFilter.nativeElement.value,
      this.filterExpressions,
      this.sort.active,
      this.sort.direction,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  ngAfterContentInit() {
    this.toggleColumns(this.dataTable["_elementRef"].nativeElement.clientWidth);
  }

  ngOnDestroy() {
    this.rulerSubscription.unsubscribe();
    this.unsubscribeColumnFilters();
    this.sort.sortChange.unsubscribe();
  }

  onRowClick(event: any) {
    this.rowClick.emit(event);
  }

  get visibleColumnsIds() {
    const visibleColumnsIds = this.visibleColumns.map(column => column.id);

    return this.hiddenColumns.length ? ["trigger", ...visibleColumnsIds] : visibleColumnsIds;
  }

  get hiddenColumnsIds() {
    return this.hiddenColumns.map(column => column.id);
  }

  getExpandFlag(i) {
    const ex = Object.keys(this.expandedElement).length > 0 && this.expandedElement[i] ? "expanded" : "collapsed";
    return ex;
  }

  toggleExpandFlag(i) {
    this.expandedElement[i] = !this.expandedElement[i];
    this._changeDetectorRef.detectChanges();
  }

  unsubscribeColumnFilters() {
    this.columnFilterSubscriptions.forEach(sub => {
      // console.log("Unsubscribing subscription sub:", sub)
      sub.unsubscribe();
    });
  }

  // fill default filters from table definition
  setDefaultFilters() {
    // copy default filters from column definitions to URL (which should trigger the filling of the GUI)
    this.columnsdef.forEach(col => {
      if ("sortDefault" in col) {
        this.sort.active = col.id;
        this.sort.direction = col.sortDefault;
        this.router.navigate([], {
          queryParams: { sortActive: this.sort.active, sortDirection: this.sort.direction },
          queryParamsHandling: "merge"
        });
      }
      // set default filter only if no other filters defined in query parameters
      // TODO replace by newer queryParamMap
      const qp = { ...this.route.snapshot.queryParams };
      // ignore non-filtering parameters
      delete qp.sortActive;
      delete qp.sortDirection;
      delete qp.pageIndex;
      delete qp.pageSize;
      if ("filterDefault" in col && Object.keys(qp).length === 0) {
        if (typeof col.filterDefault === "object") {
          this.router.navigate([], {
            queryParams: { [col.id + ".start"]: col.filterDefault.start, [col.id + ".end"]: col.filterDefault.end },
            queryParamsHandling: "merge"
          });
        } else {
          this.router.navigate([], {
            queryParams: { [col.id]: col.filterDefault },
            queryParamsHandling: "merge"
          });
        }
      }
    });
  }

  // define filter input field event handler
  activateColumnFilters() {
    // define key handler in all filter input fields
    let i = 0;
    this.allFilters.toArray().forEach(filter => {
      // console.log("Defining subscription for column :", i);
      this.columnFilterSubscriptions[i] = fromEvent(filter.nativeElement, "keyup").pipe(
        debounceTime(650),
        distinctUntilChanged()
      )
        .subscribe(() => {
          // console.log("key typed from id,value:", filter.nativeElement.name,filter.nativeElement.value)
          this.paginator.pageIndex = 0;
          const columnId = filter.nativeElement.name;
          if (filter.nativeElement.value) {
            this.filterExpressions[columnId] = filter.nativeElement.value;
            this.router.navigate([], {
              queryParams: { [columnId]: this.filterExpressions[columnId] },
              queryParamsHandling: "merge"
            });
          } else {
            delete this.filterExpressions[columnId];
            this.router.navigate([], {
              queryParams: { [columnId]: null },
              queryParamsHandling: "merge"
            });
          }
          this.loadDataPage();
        });
      i++;
    });
  }

  // fill input fields with current filter conditions
  reloadFilterExpressions() {
    // console.log("=== Reloading filter expressions from filterExpression array to GUI elements");
    this.allFilters.toArray().forEach(filter => {
      const columnId = filter.nativeElement.name;
      if (this.filterExpressions[columnId]) {
        // console.log(" ====== Reloading filter expressions:", columnId, this.filterExpressions[columnId]);
        filter.nativeElement.value = this.filterExpressions[columnId];
      }
    });
  }

  toggleColumns(tableWidth: number) {
    this.zone.runOutsideAngular(() => {
      const sortedColumns = this.columnsdef.slice()
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
      this.visibleColumns = this.columnsdef.filter(column => column.visible);
      this.hiddenColumns = this.columnsdef.filter(column => !column.visible);
      this.zone.run(() => {
        this._changeDetectorRef.detectChanges();
        this.reloadFilterExpressions();
        this.activateColumnFilters();
      });
    });

  }

  exportToExcel() {
    // subscribes to the latest fetched data
    this.loadAllExportData();
  }

  getPropertyByPath(obj: Record<string, unknown>, pathString: string) {
    return pathString.split(".").reduce((o, i) => o[i], obj);
  }

  // both start and end trigger their own event on change
  dateChanged(event: MatDatepickerInputEvent<DateTime>, columnId: string) {
    if (event.value) {
      this.filterExpressions[columnId] = event.value.toISODate();
      this.router.navigate([], {
        queryParams: { [columnId]: this.filterExpressions[columnId] },
        queryParamsHandling: "merge"
      });
      this.loadDataPage();
    }
  }
  getFilterColumns(){
    return this.visibleColumns.map((column) => {
      return `${column.id}-filter`
    })
  }
}
