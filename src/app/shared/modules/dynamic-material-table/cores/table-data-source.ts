import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  of,
  ReplaySubject,
  Subject,
  Subscription,
} from "rxjs";
import { map } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort, Sort } from "@angular/material/sort";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { titleCase } from "../utilizes/utilizes";
import { HashMap } from "./type";
import { TableField } from "../models/table-field.model";
import { TableRow } from "../models/table-row.model";
import { AbstractFilter } from "../table/extensions/filter/compare/abstract-filter";

export class TableVirtualScrollDataSource<
  T extends TableRow,
> extends MatTableDataSource<T> {
  private streamsReady: boolean;
  private filterMap: HashMap<AbstractFilter[]> = {};
  public dataToRender$: Subject<T[]>;
  public dataOfRange$: Subject<T[]>;
  public columns: TableField<T>[] = [];
  get allData(): T[] {
    return this.data;
  }

  private initStreams() {
    if (!this.streamsReady) {
      this.dataToRender$ = new ReplaySubject<T[]>(1);
      this.dataOfRange$ = new ReplaySubject<T[]>(1);
      this.streamsReady = true;
    }
  }

  toTranslate(): any[] {
    const tranList = [];
    const keys: string[] = Object.keys(this.filterMap);
    for (const k of keys) {
      let fieldTotalTran = "";
      for (const f of this.filterMap[k]) {
        fieldTotalTran += f.toPrint();
      }
      if (fieldTotalTran !== "") {
        tranList.push({ key: titleCase(k), value: fieldTotalTran });
      }
    }
    return tranList;
  }

  getFilter(fieldName: string): AbstractFilter[] {
    return this.filterMap[fieldName];
  }

  setFilter(fieldName: string, filters: AbstractFilter[]): Observable<null> {
    this.filterMap[fieldName] = filters;
    return new Observable((subscriber) => {
      this.refreshFilterPredicate();
      subscriber.next();
      subscriber.complete();
    });
  }

  clearFilter(fieldName: string = null) {
    if (fieldName != null) {
      delete this.filterMap[fieldName];
    } else {
      this.filterMap = {};
    }
    this.refreshFilterPredicate();
  }

  clearData() {
    this.data = [];
  }

  public refreshFilterPredicate() {
    let conditionsString = "";
    Object.keys(this.filterMap).forEach((key) => {
      let fieldCondition = "";
      this.filterMap[key].forEach((fieldFilter, row, array) => {
        if (row < array.length - 1) {
          fieldCondition +=
            fieldFilter.toString(key) +
            (fieldFilter.type === "and" ? " && " : " || ");
        } else {
          fieldCondition += fieldFilter.toString(key);
        }
      });
      if (fieldCondition !== "") {
        conditionsString += ` ${conditionsString === "" ? "" : " && "} ( ${fieldCondition} )`;
      }
    });
    if (conditionsString !== "") {
      const filterFunction = new Function("_a$", "return " + conditionsString);
      this.filterPredicate = (data: T, filter: string) =>
        filterFunction(data) as boolean;
    } else {
      this.filterPredicate = (data: T, filter: string) => true;
    }
    this.filter = conditionsString;
  }

  // When client paging active use for retrieve paging data
  pagingData(data) {
    const p: MatPaginator = (this as any)._paginator;
    if (p && p !== null) {
      const end = (p.pageIndex + 1) * p.pageSize;
      const start = p.pageIndex * p.pageSize;
      return data.slice(start, end);
    }
    return data;
  }

  _updateChangeSubscription() {
    this.initStreams();
    const sort: MatSort | null = (this as any)._sort;
    const paginator: MatPaginator | null = (this as any)._paginator;
    const internalPageChanges: Subject<void> = (this as any)
      ._internalPageChanges;
    const filter: BehaviorSubject<string> = (this as any)._filter;
    const renderData: BehaviorSubject<T[]> = (this as any)._renderData;
    const dataStream: BehaviorSubject<T[]> = (this as any)._data;

    const sortChange: Observable<Sort | null | void> = sort
      ? (merge(sort.sortChange, sort.initialized) as Observable<Sort | void>)
      : of(null);
    const pageChange: Observable<PageEvent | null | void> = paginator
      ? (merge(
          paginator.page,
          internalPageChanges,
          paginator.initialized,
        ) as Observable<PageEvent | void>)
      : of(null);

    // First Filter
    const filteredData = combineLatest([dataStream, filter]).pipe(
      map(([data]) => this._filterData(data)),
    );
    // Second Order
    const orderedData = combineLatest([filteredData, sortChange]).pipe(
      map(([data, sortColumn]) => {
        const sc: Sort = sortColumn as Sort;
        if (!sc) {
          return data;
        } else if (sc.active !== "") {
          const column = this.columns.filter((c) => c.name == sc.active)[0];
          if (column.sort === "server-side") {
            return data;
          } else if (column.sort === "client-side") {
            return this._orderData(data);
          }
        }

        return data;
      }),
    );
    // Last Paging
    const paginatedData = combineLatest([orderedData, pageChange]).pipe(
      map(([data]) => this.pagingData(data)),
    );

    this._renderChangesSubscription?.unsubscribe();
    this._renderChangesSubscription = new Subscription();
    this._renderChangesSubscription.add(
      paginatedData.subscribe((data) => this.dataToRender$.next(data)),
    );
    this._renderChangesSubscription.add(
      this.dataOfRange$.subscribe((data) => renderData.next(data)),
    );
  }
}
