import {
  Component, Input, ChangeDetectionStrategy, AfterContentInit, QueryList,
  EventEmitter, Output, ElementRef, OnDestroy, ViewChild, ViewChildren, ChangeDetectorRef, NgZone, OnInit, AfterViewInit
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

import * as moment from "moment";
import { MatDatepickerInputEvent } from "@angular/material/datepicker/datepicker-input-base";
import { ActivatedRoute, Router } from "@angular/router";
import { Column } from "./shared-table.module";

export interface DateRange {
  begin: Date;
  end: Date;
}

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
export class SharedTableComponent implements AfterViewInit, AfterContentInit, OnDestroy, OnInit {
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
    private router: Router,
    private route: ActivatedRoute,
    public ete: ExportExcelService,
    private ruler: ViewportRuler,
    private _changeDetectorRef: ChangeDetectorRef,
    private zone: NgZone) {
    // react to viewport width changes with column restructuring
    this.rulerSubscription = this.ruler.change(100).subscribe(data => {
      // accesing clientWidth cause browser layout, cache it!
      // const tableWidth = this.table.nativeElement.clientWidth;
      this.toggleColumns(this.dataTable["_elementRef"].nativeElement.clientWidth);
    });
  }

  /**
   * Lifecycle Hook Start
   */

  ngOnInit() {
  }

  // link paginator and sort arrows to tables data source

  ngAfterViewInit() {
    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // global search handler
    fromEvent(this.input.nativeElement, "keyup")
      .pipe(
        debounceTime(650),
        distinctUntilChanged(),
        tap(() => {
          // console.log("global key typed :", this.input.nativeElement.id)
          this.paginator.pageIndex = 0;
          let globalSearch = this.input.nativeElement.value;
          if (globalSearch === "") {
            globalSearch = null;
          }
          this.router.navigate([], {
            queryParams: { globalSearch, pageIndex: 0 },
            queryParamsHandling: "merge"
          });
          this.loadDataPage();
        })
      );

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
      );

    this.route.queryParams.subscribe(queryParams => {
      /**
       * If the query-string is "?genre=rpg&platform=xbox"
       * the queryParams object will look like
       * { platform: "xbox", genre: "rpg }
       * */
      if (queryParams.sortActive) {
        this.sort.active = queryParams.sortActive;
      }
      if (queryParams.sortDirection) {
        this.sort.direction = queryParams.sortDirection;
      }
      if (queryParams.pageIndex) {
        this.paginator.pageIndex = Number(queryParams.pageIndex);
      }
      if (queryParams.pageSize) {
        this.paginator.pageSize = Number(queryParams.pageSize);
      }

      this.input.nativeElement.value = queryParams.globalSearch || "";
      const lq = { ...queryParams };
      delete lq["globalSearch"];
      this.filterExpressions = lq;
      this.allFilters.toArray().forEach(filter => {
        if (lq[filter.nativeElement.id]) {
          // if this is an object translate to string as expected in GUI, no begin, end syntax
          // TODO use instead (filter.nativeElement.name === "range-picker")  ?
          // console.log(" queryparams have changed:", filter.nativeElement.id, lq[filter.nativeElement.id]);
          if (lq[filter.nativeElement.id].startsWith("{")) {
            filter.nativeElement.value = Object.values(JSON.parse(lq[filter.nativeElement.id])).join(" ");
          } else {
            filter.nativeElement.value = lq[filter.nativeElement.id];
          }
        } else {
          filter.nativeElement.value = null;
        }
      });
      this.loadDataPage();
    });
  }

  loadAllExportData() {
    this.dataSource.loadExportData(
      this.input.nativeElement.value,
      this.filterExpressions,
      this.sort.active,
      this.sort.direction
    );
  }

  loadDataPage() {
    this.dataSource.loadAllData(
      this.input.nativeElement.value,
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

  activateColumnFilters() {
    let i = 0;
    this.allFilters.toArray().forEach(filter => {
      const col = this.columnsdef[i];
      if ("sortDefault" in col) {
        this.sort.active = col.id;
        this.sort.direction = col.sortDefault;
        this.router.navigate([], {
          queryParams: { sortActive: this.sort.active, sortDirection: this.sort.direction },
          queryParamsHandling: "merge"
        });
      }
      // set default filter only if not yet defined in URL state
      if ("filterDefault" in col && !this.route.snapshot.queryParams[col.id]) {
        if (typeof col.filterDefault === "object") {
          this.router.navigate([], {
            queryParams: { [col.id]: JSON.stringify(col.filterDefault) },
            queryParamsHandling: "merge"
          });
        } else {
          this.router.navigate([], {
            queryParams: { [col.id]: col.filterDefault },
            queryParamsHandling: "merge"
          });
        }
      }

      i++;

      // console.log("Defining subscription for column :", i)
      this.columnFilterSubscriptions[i] = fromEvent(filter.nativeElement, "keyup").pipe(
        debounceTime(650),
        distinctUntilChanged()
      )
        .subscribe(() => {
          // console.log("key typed from id,value:", filter.nativeElement.id,filter.nativeElement.value)
          this.paginator.pageIndex = 0;
          const columnId = filter.nativeElement.id;
          if (filter.nativeElement.value) {
            // console.log("Modifying filter from key strokes: element name, value:",
            // filter.nativeElement.name, filter.nativeElement.value);
            if (filter.nativeElement.name === "range-picker") {
              const beginend = filter.nativeElement.value.split(" ");
              this.filterExpressions[columnId] = {
                begin: beginend[0],
                end: beginend[1]
              };
              this.router.navigate([], {
                queryParams: { [columnId]: JSON.stringify(this.filterExpressions[columnId]) },
                queryParamsHandling: "merge"
              });
            } else {
              this.filterExpressions[columnId] = filter.nativeElement.value;
              this.router.navigate([], {
                queryParams: { [columnId]: this.filterExpressions[columnId] },
                queryParamsHandling: "merge"
              });
            }
            // console.log("columnid,filterexpression:",columnId,this.filterExpressions[columnId])
          } else {
            delete this.filterExpressions[columnId];
            this.router.navigate([], {
              queryParams: { [columnId]: null },
              queryParamsHandling: "merge"
            });
          }
          this.loadDataPage();
        });
    });
  }

  // fill input fields with current filter conditions
  reloadFilterExpressions() {
    // console.log("=== Reloading filter expressions from filterExpression array to GUI elements");
    this.allFilters.toArray().forEach(filter => {
      const columnId = filter.nativeElement.id;
      if (this.filterExpressions[columnId]) {
        // console.log(" ====== Reloading filter expressions:", columnId, this.filterExpressions[columnId]);
        if (this.filterExpressions[columnId].startsWith("{")) {
          filter.nativeElement.value = Object.values(JSON.parse(this.filterExpressions[columnId])).join(" ");
        } else {
          filter.nativeElement.value = this.filterExpressions[columnId];
        }
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
      this.zone.run(() => { });
    });
    this._changeDetectorRef.detectChanges();
    this.reloadFilterExpressions();
  }

  exportToExcel() {
    // subscribes to the latest fetched data
    this.loadAllExportData();
  }

  getPropertyByPath(obj: Record<string, unknown>, pathString: string) {
    return pathString.split(".").reduce((o, i) => o[i], obj);
  }

  dateChanged(event: MatDatepickerInputEvent<DateRange>, columnId: string) {
    // console.log("dateChanged event:", event, columnId);
    if (event.value) {
      const { begin, end } = event.value;
      this.filterExpressions[columnId] = {
        begin: moment(begin).format("YYYY-MM-DD"),
        end: moment(end).format("YYYY-MM-DD")
      };
      this.router.navigate([], {
        queryParams: { [columnId]: JSON.stringify(this.filterExpressions[columnId]) },
        queryParamsHandling: "merge"
      });
    } else {
      delete this.filterExpressions[columnId];
      this.router.navigate([], {
        queryParams: { [columnId]: null },
        queryParamsHandling: "merge"
      });
    }
    // console.log("columnid,filterexpression:",columnId,this.filterExpressions[columnId])

    this.loadDataPage();
  }
}
