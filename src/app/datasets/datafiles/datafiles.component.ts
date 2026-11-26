import {
  Component,
  ChangeDetectorRef,
  OnDestroy,
  OnInit,
  AfterViewChecked,
} from "@angular/core";
import { BehaviorSubject, combineLatest, filter, Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import {
  selectCurrentOrigDatablocks,
  selectCurrentDataset,
  selectDatafilesPageViewModel,
  selectDefaultDatafilesColumns,
} from "state-management/selectors/datasets.selectors";
import {
  selectHasFetchedSettings,
  selectSettings,
} from "state-management/selectors/user.selectors";
import { CreateJobDtoV3 } from "@scicatproject/scicat-sdk-ts-angular";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { MatDialog } from "@angular/material/dialog";
import { PublicDownloadDialogComponent } from "datasets/public-download-dialog/public-download-dialog.component";
import { submitJobAction } from "state-management/actions/jobs.actions";
import { AppConfigService } from "app-config.service";
import { DataFile } from "datasets/datafiles/datafiles.interfaces";
import {
  ActionItemDataset,
  ActionItems,
} from "shared/modules/configurable-actions/configurable-action.interfaces";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import {
  TablePagination,
  TablePaginationMode,
} from "shared/modules/dynamic-material-table/models/table-pagination.model";
import {
  IRowEvent,
  RowEventType,
  TableSelectionMode,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import {
  ITableSetting,
  TableSettingEventType,
} from "shared/modules/dynamic-material-table/models/table-setting.model";
import { actionMenu } from "shared/modules/dynamic-material-table/utilizes/default-table-settings";
import { fetchOrigDatablocksAction } from "state-management/actions/datasets.actions";
import { updateUserSettingsAction } from "state-management/actions/user.actions";
import { TableColumn } from "state-management/models";
import { TableConfigService } from "shared/services/table-config.service";

@Component({
  selector: "datafiles",
  templateUrl: "./datafiles.component.html",
  styleUrls: ["./datafiles.component.scss"],
  standalone: false,
})
export class DatafilesComponent implements OnDestroy, OnInit, AfterViewChecked {
  vm$ = this.store.select(selectDatafilesPageViewModel);
  datablocks$ = this.store.select(selectCurrentOrigDatablocks);
  dataset$ = this.store.select(selectCurrentDataset);

  appConfig = this.appConfigService.getConfig();

  pending = true;
  tooLargeFile = false;
  totalFileSize = 0;
  selectedFileSize = 0;

  subscriptions: Subscription[] = [];
  files: Array<DataFile> = [];
  datasetPid = "";
  actionItems: ActionItems = {
    datasets: [],
  };

  count = 0;
  fileDownloadEnabled: boolean = this.appConfig.fileDownloadEnabled;
  fileserverBaseURL: string | undefined = this.appConfig.fileserverBaseURL;
  fileserverButtonLabel: string =
    this.appConfig.fileserverButtonLabel || "Download";
  maxFileSize: number | null = this.appConfig.maxDirectDownloadSize;
  sourceFolder: string =
    this.appConfig.sourceFolder || "No source folder provided";
  sftpHost: string = this.appConfig.sftpHost || "No sftp host provided";
  maxFileSizeWarning: string | null =
    this.appConfig.maxFileSizeWarning ||
    `Some files are above the max size ${this.fileSizePipe.transform(this.maxFileSize)}`;

  tableName = "datafilesTable";
  tableColumns: TableField<any>[] = [];
  defaultStoreColumns$ = this.store.select(selectDefaultDatafilesColumns);
  settings$ = this.store.select(selectSettings);
  hasFetchedSettings$ = this.store.select(selectHasFetchedSettings);
  tableSettingsConfig: ITableSetting = {};

  dataSource: BehaviorSubject<DataFile[]> = new BehaviorSubject<DataFile[]>([]);
  paginationMode: TablePaginationMode = "server-side";
  pagination: TablePagination = {
    pageSizeOptions: [5, 10, 25, 50, 100],
    pageIndex: 0,
    pageSize: 25,
    length: 0,
  };
  rowSelectionMode: TableSelectionMode = this.fileDownloadEnabled
    ? "multi"
    : "none";

  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private fileSizePipe: FileSizePipe,
    private tableConfigService: TableConfigService,
  ) {}

  getAllFiles() {
    return this.files.map((file) => file.path);
  }

  getSelectedFiles() {
    return this.files.filter((file) => file.selected).map((file) => file.path);
  }

  onRowEvent({ event, sender }: IRowEvent<DataFile>) {
    if (event === RowEventType.RowSelectionChange && sender.row) {
      sender.row.selected = sender.checked;
    }

    if (event === RowEventType.MasterSelectionChange && sender.selectionModel) {
      this.files.forEach((file) => {
        file.selected = sender.selectionModel.isSelected(file);
      });
    }

    this.selectedFileSize = this.files
      .filter((file) => file.selected)
      .reduce((sum, file) => sum + file.size, 0);
  }

  hasTooLargeFiles(files: any[]) {
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

  convertSavedColumns(columns: TableColumn[]): TableField<any>[] {
    return columns.map((column) => ({
      ...column,
      name: column.name.replace(/^dataFileList\./, ""),
      index: column.order,
      display: column.enabled ? "visible" : "hidden",
    }));
  }

  // Built fresh on every emission: TableConfigService pushes the saved
  // setting into settingList, so reusing one object would keep stale columns.
  getDefaultTableSettingsConfig(
    defaultColumns: TableField<any>[],
  ): ITableSetting {
    return {
      visibleActionMenu: actionMenu,
      settingList: [
        {
          visibleActionMenu: actionMenu,
          isDefaultSetting: true,
          isCurrentSetting: true,
          columnSetting: defaultColumns,
        },
      ],
      rowStyle: {
        "border-bottom": "1px solid #d2d2d2",
      },
    };
  }

  initTable(settingConfig: ITableSetting): void {
    this.tableColumns = settingConfig.settingList.find(
      (s) => s.isCurrentSetting,
    )?.columnSetting;
    this.tableSettingsConfig = settingConfig;
  }

  ngOnInit() {
    this.subscriptions.push(
      combineLatest([
        this.settings$,
        this.defaultStoreColumns$,
        this.hasFetchedSettings$,
      ])
        .pipe(filter(([, , hasFetchedSettings]) => hasFetchedSettings))
        .subscribe(([settings, defaultStoreColumns]) => {
          const defaultConfigColumns =
            this.appConfig.defaultDatafilesListSettings?.columns;
          const defaultColumns = defaultConfigColumns?.length
            ? this.convertSavedColumns(defaultConfigColumns)
            : defaultStoreColumns;

          const userColumns = this.convertSavedColumns(
            settings.fe_datafiles_table_columns || [],
          );

          const tableSettingsConfig =
            this.tableConfigService.getTableSettingsConfig(
              this.tableName,
              this.getDefaultTableSettingsConfig(defaultColumns),
              userColumns,
            );

          if (tableSettingsConfig?.settingList.length) {
            this.initTable(tableSettingsConfig);
          }
        }),
    );

    this.subscriptions.push(
      this.vm$.subscribe(({ datablocks, totalCount, dataset, isLoading }) => {
        if (dataset) {
          this.datasetPid = dataset.pid;
          this.actionItems.datasets = <ActionItemDataset[]>[dataset];
        }
        if (datablocks) {
          this.totalFileSize = 0;
          const files: DataFile[] = [];
          datablocks.forEach((block) => {
            if (block.dataFileList && !Array.isArray(block.dataFileList)) {
              const file = block.dataFileList as DataFile;
              this.totalFileSize += file.size || 0;
              files.push(file);
            }
          });
          this.pending = false;
          this.count = files.length;
          this.files = files;

          this.dataSource.next(this.files);

          this.tooLargeFile = this.hasTooLargeFiles(this.files);
          if (this.actionItems.datasets.length > 0) {
            this.actionItems.datasets[0].files = files;
          }
        }
        this.pagination = {
          ...this.pagination,
          length: totalCount,
          isLoading,
        };
      }),
    );
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  onPaginationChange({ pageIndex, pageSize }: TablePagination) {
    this.store.dispatch(
      fetchOrigDatablocksAction({
        pid: this.datasetPid,
        filters: { skip: pageIndex * pageSize, limit: pageSize },
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(PublicDownloadDialogComponent, {
      width: "500px",
      data: { email: "" },
    });
    dialogRef.afterClosed().subscribe((email) => {
      if (email) {
        this.getSelectedFiles();
        const data: CreateJobDtoV3 = {
          emailJobInitiator: email,
          type: "public",
          jobParams: {},
          datasetList: [
            {
              pid: this.datasetPid,
              files: this.getSelectedFiles(),
            },
          ],
          jobStatusMessage: "jobCreated",
        };
        this.store.dispatch(submitJobAction({ job: data }));
      }
    });
  }
  getFileTransferLink() {
    return (
      this.fileserverBaseURL +
      "&origin_path=" +
      encodeURIComponent(this.sourceFolder)
    );
  }

  saveTableSettings(setting: ITableSetting) {
    this.pending = true;
    const columnsSetting = setting.columnSetting.map((column) => {
      const {
        name,
        display,
        index,
        width,
        type,
        format,
        header,
        pipe,
        pipeArgs,
        emptyValue,
      } = column;

      return {
        name,
        enabled: !!(display === "visible"),
        order: index,
        width,
        type,
        format,
        header,
        pipe,
        pipeArgs,
        emptyValue,
      };
    });

    this.store.dispatch(
      updateUserSettingsAction({
        property: {
          fe_datafiles_table_columns: columnsSetting,
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
      event.type === TableSettingEventType.create ||
      event.type === TableSettingEventType.reset
    ) {
      this.saveTableSettings(event.setting);
    }
  }
}
