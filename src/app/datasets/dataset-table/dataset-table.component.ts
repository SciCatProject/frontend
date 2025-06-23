import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from "@angular/core";
import { TableColumn } from "state-management/models";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { BehaviorSubject, Subscription, lastValueFrom, take } from "rxjs";
import { Store } from "@ngrx/store";
import {
  clearSelectionAction,
  selectDatasetAction,
  deselectDatasetAction,
  selectAllDatasetsAction,
  sortByColumnAction,
} from "state-management/actions/datasets.actions";
import { fetchInstrumentsAction } from "state-management/actions/instruments.actions";

import {
  selectDatasets,
  selectDatasetsPerPage,
  selectPage,
  selectTotalSets,
  selectDatasetsInBatch,
} from "state-management/selectors/datasets.selectors";
import { get as lodashGet } from "lodash-es";
import { AppConfigService } from "app-config.service";
import {
  selectColumnsWithHasFetchedSettings,
  selectCurrentUser,
} from "state-management/selectors/user.selectors";
import {
  DatasetClass,
  OutputDatasetObsoleteDto,
  Instrument,
} from "@scicatproject/scicat-sdk-ts-angular";
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
import { JsonHeadPipe } from "shared/pipes/json-head.pipe";
import { DatePipe } from "@angular/common";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { actionMenu } from "shared/modules/dynamic-material-table/utilizes/default-table-settings";
import { TableConfigService } from "shared/services/table-config.service";
import { selectInstruments } from "state-management/selectors/instruments.selectors";

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
export class DatasetTableComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  selectionIds: string[] = [];

  appConfig = this.appConfigService.getConfig();
  currentPage$ = this.store.select(selectPage);
  datasetsPerPage$ = this.store.select(selectDatasetsPerPage);
  datasetCount$ = this.store.select(selectTotalSets);
  currentUser$ = this.store.select(selectCurrentUser);
  datasets$ = this.store.select(selectDatasets);
  selectedDatasets$ = this.store.select(selectDatasetsInBatch);
  selectColumnsWithFetchedSettings$ = this.store.select(
    selectColumnsWithHasFetchedSettings,
  );
  instruments$ = this.store.select(selectInstruments);

  @Input() selectedSets: OutputDatasetObsoleteDto[] | null = null;
  @Output() pageChange = new EventEmitter<{
    pageIndex: number;
    pageSize: number;
  }>();

  datasets: OutputDatasetObsoleteDto[] = [];
  instruments: Instrument[] = [];
  instrumentMap: Map<string, Instrument> = new Map();

  @Output() rowClick = new EventEmitter<OutputDatasetObsoleteDto>();

  tableDefaultSettingsConfig: ITableSetting = {
    visibleActionMenu: actionMenu,
    settingList: [
      {
        visibleActionMenu: actionMenu,
        isDefaultSetting: true,
        isCurrentSetting: true,
        columnSetting: [],
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
    private jsonHeadPipe: JsonHeadPipe,
    private datePipe: DatePipe,
    private fileSize: FileSizePipe,
    private tableConfigService: TableConfigService,
  ) {}

  private getInstrumentName(row: OutputDatasetObsoleteDto): string {
    const instrument = this.instrumentMap.get(row.instrumentId);
    if (instrument?.name) {
      return instrument.name;
    }
    if (row.instrumentId != null) {
      return row.instrumentId === "" ? "-" : row.instrumentId;
    }
    return "-";
  }

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

    const { skip = 0, limit = 25 } = JSON.parse(queryParams.args ?? "{}");

    return {
      pageSizeOptions: this.defaultPageSizeOptions,
      pageIndex: skip / limit || 0,
      pageSize: limit || this.defaultPageSize,
      length: dataCount,
    };
  }

  initTable(
    settingConfig: ITableSetting,
    paginationConfig: TablePagination,
  ): void {
    let currentColumnSetting = settingConfig.settingList.find(
      (s) => s.isCurrentSetting,
    )?.columnSetting;

    if (!currentColumnSetting && settingConfig.settingList.length > 0) {
      currentColumnSetting = settingConfig.settingList[0].columnSetting;
    }

    this.columns = currentColumnSetting;
    this.setting = settingConfig;
    this.pagination = paginationConfig;
  }

  saveTableSettings(setting: ITableSetting) {
    this.pending = true;
    const columnsSetting = setting.columnSetting.map((column, index) => {
      const { name, display, width, type } = column;

      return {
        name,
        enabled: !!(display === "visible"),
        order: index,
        width,
        type,
      };
    });
    this.store.dispatch(
      updateUserSettingsAction({
        property: {
          columns: columnsSetting,
        },
      }),
    );

    this.pending = false;
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
      const { active, direction } = sender as Sort;

      let column = active;
      if (column === "runNumber") {
        column = "scientificMetadata.runNumber.value";
      }

      this.store.dispatch(sortByColumnAction({ column, direction }));
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

  // isInBatch(dataset: DatasetClass): boolean {
  //   return this.inBatchPids.indexOf(dataset.pid) !== -1;
  // }

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

  convertSavedColumns(columns: TableColumn[]): TableField<any>[] {
    return columns
      .filter((column) => column.name !== "select")
      .map((column) => {
        const convertedColumn: TableField<any> = {
          name: column.name,
          header: column.header,
          index: column.order,
          display: column.enabled ? "visible" : "hidden",
          width: column.width,
          type: column.type as any,
        };

        if (column.name === "runNumber" && column.type !== "custom") {
          // NOTE: This is for the saved columns in the database or the old config.
          convertedColumn.customRender = (c, row) =>
            lodashGet(row, "scientificMetadata.runNumber.value");
          convertedColumn.toExport = (row) =>
            lodashGet(row, "scientificMetadata.runNumber.value");
        }
        // NOTE: This is how we render the custom columns if new config is used.
        if (column.type === "custom") {
          convertedColumn.customRender = (c, row) =>
            lodashGet(row, column.path || column.name);
          convertedColumn.toExport = (row) =>
            lodashGet(row, column.path || column.name);
        }

        if (column.name === "size") {
          convertedColumn.customRender = (column, row) =>
            this.fileSize.transform(row[column.name]);
          convertedColumn.toExport = (row) =>
            this.fileSize.transform(row[column.name]);
        }

        if (column.name === "creationTime") {
          convertedColumn.customRender = (column, row) =>
            this.datePipe.transform(row[column.name]);
          convertedColumn.toExport = (row) =>
            this.datePipe.transform(row[column.name]);
        }

        if (
          column.name === "metadata" ||
          column.name === "scientificMetadata"
        ) {
          convertedColumn.customRender = (column, row) => {
            // NOTE: Maybe here we should use the "scientificMetadata" as field name and not "metadata". This should be changed in the backend config.
            return this.jsonHeadPipe.transform(row["scientificMetadata"]);
          };
          convertedColumn.toExport = (row) => {
            return this.jsonHeadPipe.transform(row["scientificMetadata"]);
          };
        }

        if (column.name === "dataStatus") {
          convertedColumn.renderContentIcon = (column, row) => {
            if (this.wipCondition(row)) {
              return "hourglass_empty";
            } else if (this.archivableCondition(row)) {
              return "archive";
            } else if (this.retrievableCondition(row)) {
              return "archive";
            } else if (this.systemErrorCondition(row)) {
              return "error_outline";
            } else if (this.userErrorCondition(row)) {
              return "error_outline";
            }

            return "";
          };

          convertedColumn.customRender = (column, row) => {
            if (this.wipCondition(row)) {
              return "Work in progress";
            } else if (this.archivableCondition(row)) {
              return "Archivable";
            } else if (this.retrievableCondition(row)) {
              return "Retrievable";
            } else if (this.systemErrorCondition(row)) {
              return "System error";
            } else if (this.userErrorCondition(row)) {
              return "User error";
            }

            return "";
          };

          convertedColumn.toExport = (row) => {
            if (this.wipCondition(row)) {
              return "Work in progress";
            } else if (this.archivableCondition(row)) {
              return "Archivable";
            } else if (this.retrievableCondition(row)) {
              return "Retrievable";
            } else if (this.systemErrorCondition(row)) {
              return "System error";
            } else if (this.userErrorCondition(row)) {
              return "User error";
            }

            return "";
          };
        }

        if (column.name === "image") {
          convertedColumn.renderImage = true;
        }

        if (column.name === "instrumentName") {
          convertedColumn.customRender = (column, row) =>
            this.getInstrumentName(row);
          convertedColumn.toExport = (row, column) =>
            this.getInstrumentName(row);
        }

        return convertedColumn;
      });
  }

  ngOnInit() {
    this.store.dispatch(fetchInstrumentsAction({ limit: 1000, skip: 0 }));

    this.subscriptions.push(
      this.selectedDatasets$.subscribe((datasets) => {
        // NOTE: In the selectionIds we are storing either _id or pid. Dynamic material table works only with these two.
        this.selectionIds = datasets.map((dataset) => {
          return dataset.pid;
        });
      }),
    );

    this.subscriptions.push(
      this.instruments$.subscribe((instruments) => {
        this.instruments = instruments;
        this.instrumentMap = new Map(
          instruments.map((instrument) => [instrument.pid, instrument]),
        );
      }),
    );

    this.subscriptions.push(
      this.datasets$.subscribe((datasets) => {
        this.currentUser$.subscribe((currentUser) => {
          this.datasetCount$.subscribe(async (count) => {
            const defaultTableColumns = await lastValueFrom(
              this.selectColumnsWithFetchedSettings$.pipe(take(1)),
            );

            if (
              defaultTableColumns.hasFetchedSettings &&
              defaultTableColumns.columns.length
            ) {
              const tableColumns = defaultTableColumns.columns;

              if (!currentUser) {
                this.rowSelectionMode = "none";
              }

              if (tableColumns) {
                this.dataSource.next(datasets);
                this.pending = false;

                const savedTableConfigColumns =
                  this.convertSavedColumns(tableColumns);

                const tableSort = this.getTableSort();
                const paginationConfig = this.getTablePaginationConfig(count);

                this.tableDefaultSettingsConfig.settingList[0].columnSetting =
                  savedTableConfigColumns;

                const tableSettingsConfig =
                  this.tableConfigService.getTableSettingsConfig(
                    this.tableName,
                    this.tableDefaultSettingsConfig,
                    savedTableConfigColumns,
                    tableSort,
                  );

                if (tableSettingsConfig?.settingList.length) {
                  this.initTable(tableSettingsConfig, paginationConfig);
                }
              }
            }
          });
        });
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
