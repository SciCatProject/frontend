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
import { BehaviorSubject, Subscription } from "rxjs";
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
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import {
  ITableSetting,
  TableSettingEventType,
} from "shared/modules/dynamic-material-table/models/table-setting.model";
import {
  TablePagination,
  TablePaginationMode,
} from "shared/modules/dynamic-material-table/models/table-pagination.model";
import {
  IRowEvent,
  ITableEvent,
  RowEventType,
  TableEventType,
  TableSelectionMode,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { updateUserSettingsAction } from "state-management/actions/user.actions";
import { Sort } from "@angular/material/sort";
import { ActivatedRoute } from "@angular/router";
import {
  actionMenu,
  getTableSettingsConfig,
} from "shared/modules/dynamic-material-table/utilizes/default-table-config";
import { selectDatasetsCount } from "state-management/selectors/proposals.selectors";
export interface SortChangeEvent {
  active: string;
  direction: "asc" | "desc" | "";
}

@Component({
  selector: "dataset-dynamic-table",
  templateUrl: "dataset-dynamic-table.component.html",
  styleUrls: ["dataset-table.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DatasetDynamicTableComponent
  implements OnInit, OnDestroy, OnChanges
{
  private inBatchPids: string[] = [];
  private subscriptions: Subscription[] = [];

  appConfig = this.appConfigService.getConfig();

  lodashGet = get;
  currentPage$ = this.store.select(selectPage);
  datasetsPerPage$ = this.store.select(selectDatasetsPerPage);
  datasetCount$ = this.store.select(selectTotalSets);
  currentUser$ = this.store.select(selectCurrentUser);
  datasets$ = this.store.select(selectDatasets);

  @Input() tableColumns: TableColumn[] | null = null;
  displayedColumns: string[] = [];
  @Input() selectedSets: OutputDatasetObsoleteDto[] | null = null;
  @Output() pageChange = new EventEmitter<{
    pageIndex: number;
    pageSize: number;
  }>();

  datasets: OutputDatasetObsoleteDto[] = [];

  @Output() rowClick = new EventEmitter<OutputDatasetObsoleteDto>();

  tableDefaultSettingsConfig: ITableSetting = {
    visibleActionMenu: actionMenu,
    settingList: [
      {
        visibleActionMenu: actionMenu,
        isDefaultSetting: true,
        isCurrentSetting: true,
        columnSetting: [
          {
            name: "pid",
          },
          {
            name: "datasetName",
          },
          {
            name: "runNumber",
            header: "Run Number",
          },
          {
            name: "sourceFolder",
          },
          {
            name: "size",
          },
          {
            name: "creationTime",
          },
          {
            name: "type",
          },
          {
            name: "image",
          },
          {
            name: "metadata",
          },
          {
            name: "proposalId",
          },
          {
            name: "ownerGroup",
          },
          {
            name: "dataStatus",
          },
        ],
      },
    ],
    rowStyle: {
      "border-bottom": "1px solid #d2d2d2",
    },
  };

  tableName = "datasetsTable";

  columns: TableField<any>[];

  pending = true;

  setting: ITableSetting = {};

  paginationMode: TablePaginationMode = "server-side";

  dataSource: BehaviorSubject<OutputDatasetObsoleteDto[]> = new BehaviorSubject<
    OutputDatasetObsoleteDto[]
  >([]);

  pagination: TablePagination = {};

  rowSelectionMode: TableSelectionMode = "multi";

  showGlobalTextSearch = false;

  defaultPageSize = 10;

  defaultPageSizeOptions = [5, 10, 25, 100];

  tablesSettings: object;

  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
    private route: ActivatedRoute,
  ) {}

  getTableSort(): ITableSetting["tableSort"] {
    const { queryParams } = this.route.snapshot;

    if (queryParams.sortDirection && queryParams.sortColumn) {
      return {
        sortColumn: queryParams.sortColumn,
        sortDirection: queryParams.sortDirection,
      };
    }

    return null;
  }

  getTablePaginationConfig(dataCount = 0): TablePagination {
    const { queryParams } = this.route.snapshot;

    const argsParsed = JSON.parse(queryParams.args);

    return {
      pageSizeOptions: this.defaultPageSizeOptions,
      pageIndex: argsParsed.skip / argsParsed.limit || 0,
      pageSize: argsParsed.limit || this.defaultPageSize,
      length: dataCount,
    };
  }

  initTable(
    settingConfig: ITableSetting,
    paginationConfig: TablePagination,
  ): void {
    const currentColumnSetting = settingConfig.settingList.find(
      (s) => s.isCurrentSetting,
    )?.columnSetting;

    this.columns = currentColumnSetting;
    this.setting = settingConfig;
    this.pagination = paginationConfig;
  }

  saveTableSettings(setting: ITableSetting) {
    this.pending = true;
    const columnsSetting = setting.columnSetting.map((column) => {
      const { name, display, index, width, type } = column;

      return {
        name,
        enabled: display === "visible" ? true : false,
        order: index,
        width,
        type,
      };
    });


    // const tablesSettings = {
    //   ...this.tablesSettings,
    //   [setting.settingName || this.tableName]: {
    //     columns: columnsSetting,
    //   },
    // };

    this.store.dispatch(
      updateUserSettingsAction({
        property: {
          columns: columnsSetting,
        },
      }),
    );
  }

  onSettingChange(event: {
    type: TableSettingEventType;
    setting: ITableSetting;
  }) {
    if (
      event.type === TableSettingEventType.save ||
      event.type === TableSettingEventType.create
    ) {
      this.saveTableSettings(event.setting);
    }
  }

  onRowEvent({ event, sender }: IRowEvent<OutputDatasetObsoleteDto>) {
    if (event === RowEventType.RowClick) {
      const dataset = sender.row;
      this.rowClick.emit(dataset);
    } else if (event === RowEventType.RowSelectionChange) {
      const dataset = sender.row;
      if (sender.checked) {
        this.store.dispatch(selectDatasetAction({ dataset }));
      } else {
        this.store.dispatch(deselectDatasetAction({ dataset }));
      }
    } else if (event === RowEventType.MasterSelectionChange) {
      if (sender.checked) {
        this.store.dispatch(selectAllDatasetsAction());
      } else {
        this.store.dispatch(clearSelectionAction());
      }
    }
  }

  onTableEvent({ event, sender }: ITableEvent) {
    if (event === TableEventType.SortChanged) {
      const { active: sortColumn, direction: sortDirection } = sender as Sort;

      // this.router.navigate([], {
      //   queryParams: {
      //     pageIndex: 0,
      //     sortDirection: sortDirection || undefined,
      //     sortColumn: sortDirection ? sortColumn : undefined,
      //   },
      //   queryParamsHandling: "merge",
      // });
    }
  }

  onPageChange({ pageIndex, pageSize }: TablePagination) {
    this.pageChange.emit({
      pageIndex,
      pageSize,
    });
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

  convertSavedColumns(): TableField<any>[] {
    return this.tableColumns.map((column) => {
      const convertedColumn: TableField<any> = {
        name: column.name,
        header: column.header,
        index: column.order,
        display: column.enabled ? "visible" : "hidden",
        width: undefined,
        type: column.type as any,
      };

      if (column.name === "runNumber" && column.type !== "custom") {
        // NOTE: This is for the saved columns in the database or the old config.
        convertedColumn.customRender = (c, row) =>
          this.lodashGet(row, "scientificMetadata.runNumber.value");
      }
      // NOTE: This is how we render the custom columns if new config is used.
      if (column.type === "custom") {
        convertedColumn.customRender = (c, row) =>
          this.lodashGet(row, column.path || column.name);
      }

      return convertedColumn;
    });
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.select(selectDatasetsInBatch).subscribe((datasets) => {
        this.inBatchPids = datasets.map((dataset) => {
          return dataset.pid;
        });
      }),
    );

    this.subscriptions.push(
      this.datasets$.subscribe((datasets) => {
        this.currentUser$.subscribe((currentUser) => {
          this.datasetCount$.subscribe((count) => {
            const publishedDatasets = datasets.filter(
              (dataset) => dataset.isPublished,
            );
            this.datasets = currentUser ? datasets : publishedDatasets;

            if (this.tableColumns) {
              // this.tablesSettings = tablesSettings;
              this.dataSource.next(this.datasets);
              this.pending = false;

              // const savedTableConfigColumns =
              //   tablesSettings?.[this.tableName]?.columns;
              const savedTableConfigColumns = this.convertSavedColumns();

              const tableSort = this.getTableSort();
              const paginationConfig = this.getTablePaginationConfig(count);

              const tableSettingsConfig = getTableSettingsConfig(
                this.tableName,
                this.tableDefaultSettingsConfig,
                savedTableConfigColumns,
                tableSort,
              );

              if (tableSettingsConfig?.settingList.length) {
                this.initTable(tableSettingsConfig, paginationConfig);
              }
            }
          });
        });
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
