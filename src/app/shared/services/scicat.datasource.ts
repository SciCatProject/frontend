import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, BehaviorSubject, of, Subscription } from "rxjs";
import { ScicatDataService } from "./scicat-data-service";
import { catchError, finalize } from "rxjs/operators";
import { ExportExcelService } from "./export-excel.service";
import { environment } from "../../../environments/environment";
import { LoopBackConfig } from "shared/sdk";

// For each different table type one instance of this class should be created
export class SciCatDataSource implements DataSource<any> {
  private exportSubscription: Subscription;
  private dataForExcel = [];
  private columnsdef = [];
  private url = "";
  private dataSubject = new BehaviorSubject<any[]>([]);
  private dataExportSubject = new BehaviorSubject<any[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private countSubject = new BehaviorSubject<number>(0);
  public loading$ = this.loadingSubject.asObservable();
  public count$ = this.countSubject.asObservable();
  public collection = "";

  constructor(
    private scicatdataService: ScicatDataService,
    private ete: ExportExcelService,
    private tableDefinition: any
  ) {
    this.url =
      environment.lbBaseURL +
      "/" +
      LoopBackConfig.getApiVersion() +
      "/" +
      this.tableDefinition.collection;
    this.collection = this.tableDefinition.collection;
    this.columnsdef = this.tableDefinition.columns;

    this.exportSubscription = this.connectExportData().subscribe((data) => {
      // convert array of objects into array of arrays
      this.dataForExcel = [];
      if (data.length > 0) {
        data.forEach((row: any) => {
          const rowSorted = this.columnsdef.map((col) => row[col.id]);
          this.dataForExcel.push(Object.values(rowSorted));
        });
        const reportData = {
          title: "SciCat data table for collection " + this.collection,
          data: this.dataForExcel,
          headers: this.columnsdef.map((col) => col.label),
          footerText: "SciCat report from " + new Date(),
          sheetTitle: this.collection,
        };
        this.ete.exportExcel(reportData);
      }
    });
  }

  loadAllData(
    globalFilter?: string,
    filterExpressions?: any,
    sortField?: string,
    sortDirection = "asc",
    pageIndex = 0,
    pageSize = 10
  ) {
    this.loadingSubject.next(true);

    this.scicatdataService
      .getCount(this.url, this.columnsdef, globalFilter, filterExpressions)
      .subscribe((numData) =>
        numData[0] && numData[0].all[0]
          ? this.countSubject.next(numData[0].all[0].totalSets)
          : this.countSubject.next(0)
      );

    this.scicatdataService
      .findAllData(
        this.url,
        this.columnsdef,
        globalFilter,
        filterExpressions,
        sortField,
        sortDirection,
        pageIndex,
        pageSize
      )
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((data) => {
        // extend with unique field per row
        const rows = [];
        data.forEach((element: any, index: number) => {
          element["uniqueId"] = index + 1;
          rows.push(element);
        });
        this.dataSubject.next(rows);
      });
  }

  loadExportData(
    globalFilter?: string,
    filterExpressions?: any,
    sortField?: string,
    sortDirection = "asc"
  ) {
    this.loadingSubject.next(true);
    this.scicatdataService
      .getCount(this.url, this.columnsdef, globalFilter, filterExpressions)
      .subscribe((numData) => {
        // send result
        const count =
          numData[0] && numData[0].all[0] ? numData[0].all[0].totalSets : 0;
        this.scicatdataService
          .findAllData(
            this.url,
            this.columnsdef,
            globalFilter,
            filterExpressions,
            sortField,
            sortDirection,
            0,
            count
          )
          .pipe(
            catchError(() => of([])),
            finalize(() => this.loadingSubject.next(false))
          )
          .subscribe((data) => {
            this.dataExportSubject.next(data);
          });
      });
  }

  connect(collectionViewer: CollectionViewer): Observable<any[]> {
    return this.dataSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();
  }

  connectExportData(): Observable<any[]> {
    return this.dataExportSubject.asObservable();
  }

  disconnectExportData(): void {
    this.dataExportSubject.complete();
    this.loadingSubject.complete();
  }
}
