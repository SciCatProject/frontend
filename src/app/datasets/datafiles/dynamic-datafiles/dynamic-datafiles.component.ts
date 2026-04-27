import { Component, OnDestroy, OnInit } from "@angular/core";
import { SelectionModel } from "@angular/cdk/collections";
import { BehaviorSubject, Subscription, take } from "rxjs";
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
import { Store } from "@ngrx/store";
import { ActivatedRoute, Router } from "@angular/router";
import { updateUserSettingsAction } from "state-management/actions/user.actions";
import { Sort } from "@angular/material/sort";
import {
  selectCurrentDatasetFilesWithCountAndTableSettings,
  selectSelectedOrigDatablocks,
} from "state-management/selectors/files.selectors";
import { actionMenu } from "shared/modules/dynamic-material-table/utilizes/default-table-settings";
import { TableConfigService } from "shared/services/table-config.service";
import {
  clearSelectionAction,
  deselectOrigDatablockAction,
  deselectOrigDatablocksAction,
  fetchDatasetOrigDatablocksAction,
  selectAllOrigDatablocksAction,
  selectOrigDatablockAction,
} from "state-management/actions/files.actions";
import { CreateUserJWT } from "@scicatproject/scicat-sdk-ts-angular";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { TimeDurationPipe } from "shared/pipes/time-duration.pipe";
import { AppConfigService } from "app-config.service";
import { DataFile, FileOrigdatablock } from "state-management/models";
import {
  ActionItemDataset,
  ActionItems,
} from "shared/modules/configurable-actions/configurable-action.interfaces";
import { selectCurrentDataset } from "state-management/selectors/datasets.selectors";

@Component({
  selector: "dynamic-datafiles",
  templateUrl: "./dynamic-datafiles.component.html",
  styleUrls: ["./dynamic-datafiles.component.scss"],
  standalone: false,
})
export class DynamicDatafilesComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  appConfig = this.appConfigService.getConfig();

  tableName = "datafilesTable";
  columns: TableField<any>[];
  pending = true;
  setting: ITableSetting = {};
  paginationMode: TablePaginationMode = "server-side";
  dataSource: BehaviorSubject<FileOrigdatablock[]> = new BehaviorSubject<
    FileOrigdatablock[]
  >([]);
  pagination: TablePagination = {};
  rowSelectionMode: TableSelectionMode = "multi";
  rowSelectionModel = new SelectionModel<FileOrigdatablock>(true, []);

  tooLargeFile = false;
  totalFileSize = 0;
  selectedFileSize = 0;

  areAllSelected = false;
  isNoneSelected = true;

  files: Array<DataFile> = [];
  origDatablocks: FileOrigdatablock[] = [];
  selectedOrigDatablocks: FileOrigdatablock[] = [];
  dataset$ = this.store.select(selectCurrentDataset);
  datasetId?: string;
  actionItems: ActionItems = {
    datasets: [],
  };

  globalTextSearch = "";
  defaultPageSize = 25;
  defaultPageSizeOptions = [10, 25, 50, 100, 200];
  tablesSettings: { columns?: TableField<any>[] } = {};
  tableDefaultSettingsConfig: ITableSetting = {
    visibleActionMenu: actionMenu,
    settingList: [
      {
        visibleActionMenu: actionMenu,
        isDefaultSetting: true,
        isCurrentSetting: true,
        columnSetting: this.appConfig.defaultDatafilesColumnsList ?? [],
      },
    ],
    rowStyle: {
      "border-bottom": "1px solid #d2d2d2",
    },
  };

  count = 0;
  pageSize = 25;
  currentPage = 0;
  fileDownloadEnabled: boolean = this.appConfig.fileDownloadEnabled;
  multipleDownloadEnabled: boolean = this.appConfig.multipleDownloadEnabled;
  fileserverBaseURL: string | undefined = this.appConfig.fileserverBaseURL;
  fileserverButtonLabel: string =
    this.appConfig.fileserverButtonLabel || "Download";
  multipleDownloadAction: string | null = this.appConfig.multipleDownloadAction;
  maxFileSize: number | null = this.appConfig.maxDirectDownloadSize;
  sourceFolder: string =
    this.appConfig.sourceFolder || "No source folder provided";
  sftpHost: string = this.appConfig.sftpHost || "No sftp host provided";
  maxFileSizeWarning: string | null =
    this.appConfig.maxFileSizeWarning ||
    `Some files are above the max size ${this.fileSizePipe.transform(this.maxFileSize)}`;
  jwt: CreateUserJWT;
  auth_token: string;

  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
    private router: Router,
    private route: ActivatedRoute,
    private fileSizePipe: FileSizePipe,
    private timeDurationPipe: TimeDurationPipe,
    private tableConfigService: TableConfigService,
  ) {}

  private getFileOrigdatablockKey = (
    origDatablock: FileOrigdatablock,
  ): string =>
    [origDatablock.datasetId, origDatablock.dataFileList?.path].join(":");

  private getSelectedOrigDatablockKeys(): Set<string> {
    return new Set(
      this.selectedOrigDatablocks.map((origDatablock) =>
        this.getFileOrigdatablockKey(origDatablock),
      ),
    );
  }

  private updateActionItemsFiles(): void {
    const files = new Map<string, DataFile>();

    this.origDatablocks.forEach((odb) => {
      odb.dataFileList.selected = false;
      files.set(this.getFileOrigdatablockKey(odb), odb.dataFileList);
    });
    this.selectedOrigDatablocks.forEach((odb) => {
      odb.dataFileList.selected = true;
      files.set(this.getFileOrigdatablockKey(odb), odb.dataFileList);
    });

    this.files = Array.from(files.values());

    this.selectedFileSize = this.files
      .filter((file) => file.selected)
      .reduce((sum, file) => sum + file.size, 0);
    this.tooLargeFile = this.hasTooLargeFiles(this.files);

    if (this.actionItems.datasets.length) {
      this.actionItems = {
        ...this.actionItems,
        datasets: this.actionItems.datasets.map((dataset, index) =>
          index === 0 ? { ...dataset, files: this.files } : dataset,
        ),
      };
    }
  }

  private updateRowSelectionModel(): void {
    const selectedKeys = this.getSelectedOrigDatablockKeys();
    const selectedRowsOnCurrentPage = this.origDatablocks.filter(
      (origDatablock) =>
        selectedKeys.has(this.getFileOrigdatablockKey(origDatablock)),
    );

    this.rowSelectionModel = new SelectionModel<FileOrigdatablock>(
      true,
      selectedRowsOnCurrentPage,
    );
  }

  private updateSelectionState(): void {
    this.updateRowSelectionModel();
    this.updateActionItemsFiles();
  }

  private refreshSelectedOrigDatablocks(): void {
    this.store
      .select(selectSelectedOrigDatablocks)
      .pipe(take(1))
      .subscribe((selectedOrigDatablocks) => {
        this.selectedOrigDatablocks = selectedOrigDatablocks;
        this.updateSelectionState();
      });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.dataset$.subscribe((dataset) => {
        if (dataset) {
          this.actionItems = {
            ...this.actionItems,
            datasets: [
              {
                ...(dataset as ActionItemDataset),
                files: this.files,
              },
            ],
          };
          this.datasetId = dataset.pid;
          this.updateSelectionState();
        }
      }),
    );
    this.subscriptions.push(
      this.store
        .select(selectCurrentDatasetFilesWithCountAndTableSettings)
        .subscribe(
          ({
            origDatablocks,
            count,
            selectedOrigDatablocks,
            tablesSettings,
          }) => {
            this.tablesSettings = tablesSettings;
            this.origDatablocks = origDatablocks;
            this.selectedOrigDatablocks = selectedOrigDatablocks;
            this.updateSelectionState();
            this.dataSource.next(origDatablocks);
            this.pending = false;
            this.count = count;

            const savedTableConfigColumns = tablesSettings?.columns;
            const tableSort = this.getTableSort();
            const paginationConfig = this.getTablePaginationConfig(count);

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
          },
        ),
    );

    this.subscriptions.push(
      this.route.queryParams.subscribe((queryParams) => {
        this.pending = true;
        const limit = queryParams.pageSize
          ? +queryParams.pageSize
          : this.defaultPageSize;
        const skip = queryParams.pageIndex ? +queryParams.pageIndex * limit : 0;
        if (queryParams.textSearch) {
          this.globalTextSearch = queryParams.textSearch;
        }
        if (this.datasetId) {
          this.store.dispatch(
            fetchDatasetOrigDatablocksAction({
              limit: limit,
              skip: skip,
              search: queryParams.textSearch,
              sortColumn: queryParams.sortColumn,
              sortDirection: queryParams.sortDirection,
              datasetId: this.datasetId,
            }),
          );
        }
      }),
    );
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

    return {
      pageSizeOptions: this.defaultPageSizeOptions,
      pageIndex: queryParams.pageIndex,
      pageSize: queryParams.pageSize || this.defaultPageSize,
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

    this.columns = currentColumnSetting?.map((column) => ({
      emptyValue: "-",
      ...column,
    }));
    this.setting = settingConfig;
    this.pagination = paginationConfig;
  }

  onPaginationChange(pagination: TablePagination) {
    this.router.navigate([], {
      queryParams: {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
      },
      queryParamsHandling: "merge",
    });
  }

  onGlobalTextSearchChange(text: string) {
    this.router.navigate([], {
      queryParams: {
        textSearch: text || undefined,
        pageIndex: 0,
      },
      queryParamsHandling: "merge",
    });
  }

  saveTableSettings(setting: ITableSetting) {
    this.pending = true;
    const columnsSetting = setting.columnSetting.map((column, index) => {
      const { name, display, width } = column;

      return { name, display, order: index, width };
    });

    this.store.dispatch(
      updateUserSettingsAction({
        property: {
          fe_datafiles_table_columns: columnsSetting,
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

  onRowClick({ event, sender }: IRowEvent<FileOrigdatablock>) {
    if (event === RowEventType.RowSelectionChange) {
      const fileOrigdatablock = sender.row;
      if (!fileOrigdatablock) {
        return;
      }

      if (sender.checked) {
        this.store.dispatch(
          selectOrigDatablockAction({ origDatablock: fileOrigdatablock }),
        );
      } else {
        this.store.dispatch(
          deselectOrigDatablockAction({ origDatablock: fileOrigdatablock }),
        );
      }
      this.refreshSelectedOrigDatablocks();
    } else if (event === RowEventType.MasterSelectionChange) {
      if (sender.checked) {
        this.store.dispatch(
          selectAllOrigDatablocksAction({
            origDatablocks: sender.selectionModel?.selected ?? [],
          }),
        );
      } else {
        this.store.dispatch(
          deselectOrigDatablocksAction({
            origDatablocks: this.origDatablocks,
          }),
        );
      }
      this.refreshSelectedOrigDatablocks();
    }
  }

  onTableEvent({ event, sender }: ITableEvent) {
    if (event === TableEventType.SortChanged) {
      const { active: sortColumn, direction: sortDirection } = sender as Sort;
      this.router.navigate([], {
        queryParams: {
          pageIndex: 0,
          sortDirection: sortDirection || undefined,
          sortColumn: sortDirection ? sortColumn : undefined,
        },
        queryParamsHandling: "merge",
      });
    }
  }

  hasTooLargeFiles(files: DataFile[]) {
    if (this.maxFileSize) {
      const maxFileSize = this.maxFileSize;
      const largeFiles = files.filter((file) => file.size > maxFileSize);
      if (largeFiles.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  hasFileAboveMaxSizeWarning() {
    /**
     * Template for a file size warning message.
     * Placeholders:
     * - <maxDirectDownloadSize>: Maximum file size allowed (e.g., "10 MB").
     * - <sftpHost>: SFTP host for downloading large files.
     * - <sourceFolder>: Directory path on the SFTP host.
     *
     * Example usage:
     * Some files are above <maxDirectDownloadSize>. These file can be accessed via sftp host: <sftpHost> in directory: <sourceFolder>
     */

    const valueMapping = {
      sftpHost: this.sftpHost,
      sourceFolder: this.sourceFolder,
      maxDirectDownloadSize: this.fileSizePipe.transform(this.maxFileSize),
    };

    let warning = this.maxFileSizeWarning;

    Object.keys(valueMapping).forEach((key) => {
      warning = warning.replace(
        "<" + key + ">",
        `<strong>${valueMapping[key]}</strong>`,
      );
    });

    return warning;
  }

  ngOnDestroy() {
    this.store.dispatch(clearSelectionAction());
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
