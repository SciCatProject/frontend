import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChange,
  ViewEncapsulation,
} from "@angular/core";
import { TableColumn } from "state-management/models";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import {
  clearSelectionAction,
  selectDatasetAction,
  deselectDatasetAction,
  selectAllDatasetsAction,
  sortByColumnAction,
} from "state-management/actions/datasets.actions";

import {
  selectDatasets,
  selectDatasetsPerPage,
  selectPage,
  selectTotalSets,
  selectDatasetsInBatch,
} from "state-management/selectors/datasets.selectors";
import { get } from "lodash-es";
import { AppConfigService } from "app-config.service";
import { selectCurrentUser } from "state-management/selectors/user.selectors";
import {
  DatasetClass,
  OutputDatasetObsoleteDto,
} from "@scicatproject/scicat-sdk-ts-angular";
import { PageEvent } from "@angular/material/paginator";
export interface SortChangeEvent {
  active: string;
  direction: "asc" | "desc" | "";
}

@Component({
  selector: "dataset-table",
  templateUrl: "dataset-table.component.html",
  styleUrls: ["dataset-table.component.scss"],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class DatasetTableComponent implements OnInit, OnDestroy, OnChanges {
  private inBatchPids: string[] = [];
  private subscriptions: Subscription[] = [];

  appConfig = this.appConfigService.getConfig();

  lodashGet = get;
  currentPage$ = this.store.select(selectPage);
  datasetsPerPage$ = this.store.select(selectDatasetsPerPage);
  datasetCount$ = this.store.select(selectTotalSets);

  @Input() tableColumns: TableColumn[] | null = null;
  displayedColumns: string[] = [];
  @Input() selectedSets: OutputDatasetObsoleteDto[] | null = null;
  @Output() pageChange = new EventEmitter<{
    pageIndex: number;
    pageSize: number;
  }>();

  datasets: OutputDatasetObsoleteDto[] = [];

  @Output() settingsClick = new EventEmitter<MouseEvent>();
  @Output() rowClick = new EventEmitter<OutputDatasetObsoleteDto>();

  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
  ) {}

  onPageChange(event: PageEvent) {
    this.pageChange.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }
  doSettingsClick(event: MouseEvent) {
    this.settingsClick.emit(event);
  }

  doRowClick(dataset: OutputDatasetObsoleteDto): void {
    this.rowClick.emit(dataset);
  }

  // conditional to asses dataset status and assign correct icon ArchViewMode.work_in_progress
  // TODO: when these concepts stabilise, we should move the definitions to site config
  wipCondition(dataset: DatasetClass): boolean {
    if (
      !dataset.datasetlifecycle.archivable &&
      !dataset.datasetlifecycle.retrievable &&
      dataset.datasetlifecycle.archiveStatusMessage !==
        "scheduleArchiveJobFailed" &&
      dataset.datasetlifecycle.retrieveStatusMessage !==
        "scheduleRetrieveJobFailed"
    ) {
      return true;
    }
    return false;
  }

  systemErrorCondition(dataset: DatasetClass): boolean {
    if (
      (dataset.datasetlifecycle.retrievable &&
        dataset.datasetlifecycle.archivable) ||
      dataset.datasetlifecycle.archiveStatusMessage ===
        "scheduleArchiveJobFailed" ||
      dataset.datasetlifecycle.retrieveStatusMessage ===
        "scheduleRetrieveJobFailed"
    ) {
      return true;
    }
    return false;
  }

  userErrorCondition(dataset: DatasetClass): boolean {
    if (dataset.datasetlifecycle.archiveStatusMessage === "missingFilesError") {
      return true;
    }
    return false;
  }

  archivableCondition(dataset: DatasetClass): boolean {
    if (
      dataset.datasetlifecycle.archivable &&
      !dataset.datasetlifecycle.retrievable &&
      dataset.datasetlifecycle.archiveStatusMessage !== "missingFilesError"
    ) {
      return true;
    }
    return false;
  }

  retrievableCondition(dataset: DatasetClass): boolean {
    if (
      !dataset.datasetlifecycle.archivable &&
      dataset.datasetlifecycle.retrievable
    ) {
      return true;
    }
    return false;
  }

  isSelected(dataset: DatasetClass): boolean {
    if (!this.selectedSets) {
      return false;
    }
    return this.selectedSets.map((set) => set.pid).indexOf(dataset.pid) !== -1;
  }

  isAllSelected(): boolean {
    const numSelected = this.selectedSets ? this.selectedSets.length : 0;
    const numRows = this.datasets ? this.datasets.length : 0;
    return numSelected === numRows;
  }

  isInBatch(dataset: DatasetClass): boolean {
    return this.inBatchPids.indexOf(dataset.pid) !== -1;
  }

  onSelect(event: MatCheckboxChange, dataset: OutputDatasetObsoleteDto): void {
    if (event.checked) {
      this.store.dispatch(selectDatasetAction({ dataset }));
    } else {
      this.store.dispatch(deselectDatasetAction({ dataset }));
    }
  }

  onSelectAll(event: MatCheckboxChange): void {
    if (event.checked) {
      this.store.dispatch(selectAllDatasetsAction());
    } else {
      this.store.dispatch(clearSelectionAction());
    }
  }

  onSortChange(event: SortChangeEvent): void {
    const { active, direction } = event;
    let column = active.split("_")[1];
    if (column === "runNumber") column = "scientificMetadata.runNumber.value";
    this.store.dispatch(sortByColumnAction({ column, direction }));
  }

  // countDerivedDatasets(dataset: Dataset): number {
  //   let derivedDatasetsNum = 0;
  //   if (dataset.history) {
  //     dataset.history.forEach(item => {
  //       if (
  //         item.hasOwnProperty("derivedDataset") &&
  //         this.datasets.map(set => set.pid).includes(item.derivedDataset.pid)
  //       ) {
  //         derivedDatasetsNum++;
  //       }
  //     });
  //   }
  //   return derivedDatasetsNum;
  // }

  ngOnInit() {
    this.subscriptions.push(
      this.store.select(selectDatasetsInBatch).subscribe((datasets) => {
        this.inBatchPids = datasets.map((dataset) => {
          return dataset.pid;
        });
      }),
    );

    if (this.tableColumns) {
      this.displayedColumns = this.tableColumns
        .filter((column) => column.enabled)
        .map((column) => {
          return column.type + "_" + column.name;
        });
    }

    this.subscriptions.push(
      this.store.select(selectDatasets).subscribe((datasets) => {
        this.store.select(selectCurrentUser).subscribe((currentUser) => {
          const publishedDatasets = datasets.filter(
            (dataset) => dataset.isPublished,
          );
          this.datasets = currentUser ? datasets : publishedDatasets;
        });

        // this.derivationMapPids = this.datasetDerivationsMaps.map(
        //   datasetderivationMap => datasetderivationMap.datasetPid
        // );
        // this.datasetDerivationsMaps = datasets
        //   .filter(({ pid }) => !this.derivationMapPids.includes(pid))
        //   .map(dataset => ({
        //     datasetPid: dataset.pid,
        //     derivedDatasetsNum: this.countDerivedDatasets(dataset)
        //   }));
      }),
    );
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (const propName in changes) {
      if (propName === "tableColumns") {
        this.tableColumns = changes[propName].currentValue;
        this.displayedColumns = changes[propName].currentValue
          .filter((column: TableColumn) => column.enabled)
          .map((column: TableColumn) => column.type + "_" + column.name);
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
