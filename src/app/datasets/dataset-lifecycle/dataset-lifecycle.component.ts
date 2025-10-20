import { Component, OnInit, OnChanges, SimpleChange } from "@angular/core";
import {
  HistoryClass,
  OutputDatasetObsoleteDto,
} from "@scicatproject/scicat-sdk-ts-angular";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { DatePipe } from "@angular/common";
import { PageEvent } from "@angular/material/paginator";
import { selectCurrentDataset } from "state-management/selectors/datasets.selectors";
import { Store } from "@ngrx/store";
import { AppConfigService } from "app-config.service";
import { selectIsLoading } from "state-management/selectors/user.selectors";

export interface HistoryItem {
  property: string;
  value: any;
  updatedBy: string;
  updatedAt: string;
  [key: string]: any;
}

// unfortunately the index signature in HistoryClass is not exported by the openapi sdk generator
export type HistoryWithProperties = HistoryClass & { [key: string]: unknown };

@Component({
  selector: "dataset-lifecycle",
  templateUrl: "./dataset-lifecycle.component.html",
  styleUrls: ["./dataset-lifecycle.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)"),
      ),
    ]),
  ],
  standalone: false,
})
export class DatasetLifecycleComponent implements OnInit, OnChanges {
  appConfig = this.appConfigService.getConfig();

  dataset: OutputDatasetObsoleteDto | undefined;
  historyItems: HistoryItem[] = [];

  pageSizeOptions = [10, 25, 50, 100, 500, 1000];
  currentPage = 0;
  itemsPerPage = 10;
  historyItemsCount = 0;

  dataSource: HistoryItem[] = [];
  displayedColumns = ["property", "updatedBy", "updatedAt"];
  expandedItem: any | null;
  loading$ = this.store.select(selectIsLoading);
  constructor(
    public appConfigService: AppConfigService,
    private datePipe: DatePipe,
    private store: Store,
  ) {}

  private parseHistoryItems(): HistoryItem[] {
    const dataset = this.dataset;
    if (dataset && dataset.history) {
      const history = (dataset.history as HistoryWithProperties[]).map(
        ({ updatedAt, updatedBy, id, _id, ...properties }) =>
          Object.keys(properties).map((property) => ({
            property,
            value: properties[property],
            updatedBy: updatedBy.replace("ldap.", ""),
            updatedAt: this.datePipe.transform(updatedAt),
          })),
      );
      // flatten array before return
      return [].concat(...history);
    }
    return [];
  }

  onPageChange(event: PageEvent) {
    const { pageIndex, pageSize } = event;
    const skip = pageIndex * pageSize;
    const end = skip + pageSize;
    this.dataSource = this.historyItems.slice(skip, end);
  }

  downloadCsv(): void {
    const replacer = (key: string, value: string) =>
      value === null ? "" : value;
    const header = [
      "property",
      "currentValue",
      "previousValue",
      "updatedBy",
      "updatedAt",
    ];
    const csv = this.historyItems.map((row) =>
      header
        .map((fieldName) => {
          switch (fieldName) {
            case "currentValue": {
              return row.value[fieldName]
                ? JSON.stringify(row.value[fieldName], replacer)
                : JSON.stringify(row.value, replacer);
            }
            case "previousValue": {
              return row.value[fieldName]
                ? JSON.stringify(row.value[fieldName], replacer)
                : "";
            }
            default: {
              return JSON.stringify(row[fieldName], replacer);
            }
          }
        })
        .join(";"),
    );
    csv.unshift(header.join(";"));
    const csvArray = csv.join("\r\n");

    const a = document.createElement("a");
    const blob = new Blob([csvArray], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = "history.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }

  ngOnInit() {
    this.store.select(selectCurrentDataset).subscribe((dataset) => {
      this.dataset = dataset;
    });
    this.historyItems = this.parseHistoryItems();
    this.dataSource = this.historyItems.slice(
      this.currentPage,
      this.itemsPerPage,
    );
    this.historyItemsCount = this.historyItems.length;
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (propName === "dataset") {
        this.dataset = changes[propName].currentValue;
        this.historyItems = this.parseHistoryItems();
        this.dataSource = this.historyItems.slice(
          this.currentPage,
          this.itemsPerPage,
        );
        this.historyItemsCount = this.historyItems.length;
      }
    }
  }
}
