import {
  Component,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
  OnInit,
  AfterViewChecked,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { BehaviorSubject, Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import {
  selectCurrentOrigDatablocks,
  selectCurrentDataset,
} from "state-management/selectors/datasets.selectors";
import {
  selectIsLoading,
  selectIsLoggedIn,
} from "state-management/selectors/user.selectors";
import {
  CreateUserJWT,
  UsersService,
  CreateJobDtoV3,
} from "@scicatproject/scicat-sdk-ts-angular";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { MatDialog } from "@angular/material/dialog";
import { PublicDownloadDialogComponent } from "datasets/public-download-dialog/public-download-dialog.component";
import { submitJobAction } from "state-management/actions/jobs.actions";
import { AppConfigService } from "app-config.service";
import { NgForm } from "@angular/forms";
import { DataFiles_File } from "./datafiles.interfaces";
import {
  ActionItemDataset,
  ActionItems,
} from "shared/modules/configurable-actions/configurable-action.interfaces";
import { AuthService } from "shared/services/auth/auth.service";
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
import { ITableSetting } from "shared/modules/dynamic-material-table/models/table-setting.model";

@Component({
  selector: "datafiles",
  templateUrl: "./datafiles.component.html",
  styleUrls: ["./datafiles.component.scss"],
  standalone: false,
})
export class DatafilesComponent implements OnDestroy, OnInit, AfterViewChecked {
  @ViewChild("downloadAllForm") downloadAllFormElement: ElementRef<NgForm>;
  @ViewChild("downloadSelectedForm") downloadSelectedFormElement;
  datablocks$ = this.store.select(selectCurrentOrigDatablocks);
  dataset$ = this.store.select(selectCurrentDataset);
  loading$ = this.store.select(selectIsLoading);
  isLoggedIn$ = this.store.select(selectIsLoggedIn);
  downloadAllForm: NgForm;
  downloadSelectedForm: NgForm;

  appConfig = this.appConfigService.getConfig();

  tooLargeFile = false;
  totalFileSize = 0;
  selectedFileSize = 0;

  subscriptions: Subscription[] = [];

  files: Array<DataFiles_File> = [];
  datasetPid = "";
  actionItems: ActionItems = {
    datasets: [],
  };

  count = 0;
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

  tableColumns: TableField<any>[] = [
    {
      name: "path",
      header: "Path",
    },
    {
      name: "size",
      header: "Size",
      customRender: (_column, row: DataFiles_File) =>
        this.fileSizePipe.transform(row.size),
    },
    {
      name: "time",
      header: "Time",
      type: "date",
      format: "yyyy-MM-dd HH:mm",
    },
  ];

  setting: ITableSetting = {
    rowStyle: {
      "border-bottom": "1px solid #d2d2d2",
    },
  };

  dataSource: BehaviorSubject<DataFiles_File[]> = new BehaviorSubject<
    DataFiles_File[]
  >([]);

  paginationMode: TablePaginationMode = "server-side";

  pagination: TablePagination = {
    pageSizeOptions: [10, 25, 50],
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
    private usersService: UsersService,
    private authService: AuthService,
    private fileSizePipe: FileSizePipe,
  ) {}

  getAllFiles() {
    return this.files.map((file) => file.path);
  }

  getSelectedFiles() {
    return this.files.filter((file) => file.selected).map((file) => file.path);
  }

  onRowEvent({ event, sender }: IRowEvent<DataFiles_File>) {
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
  //ngAfterViewInit() {
  ngOnInit() {
    this.subscriptions.push(
      this.dataset$.subscribe((dataset) => {
        if (dataset) {
          this.actionItems.datasets = <ActionItemDataset[]>[dataset];
        }
      }),
    );
    this.subscriptions.push(
      this.datablocks$.subscribe((datablocks) => {
        if (datablocks) {
          const files: DataFiles_File[] = [];
          datablocks.forEach((block) => {
            block.dataFileList.map((file: DataFiles_File) => {
              this.totalFileSize += file.size;
              file.selected = false;
              files.push(file);
            });
          });
          this.count = files.length;
          this.files = files;
          this.dataSource.next(files);
          this.pagination.length = files.length;
          this.tooLargeFile = this.hasTooLargeFiles(this.files);
          this.actionItems.datasets[0].files = files;
        }
      }),
    );
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  downloadFiles(form: "downloadAllForm" | "downloadSelectedForm") {
    if (this.appConfig.multipleDownloadUseAuthToken) {
      this.auth_token = `Bearer ${this.authService.getToken().id}`;
      this[`${form}Element`].nativeElement.auth_token.value = this.auth_token;
    }
    if (!this.jwt) {
      this.subscriptions.push(
        this.usersService.usersControllerGetUserJWTV3().subscribe((jwt) => {
          this.jwt = jwt;
          this[`${form}Element`].nativeElement.jwt.value = jwt.jwt;
          this[`${form}Element`].nativeElement.submit();
        }),
      );
    } else {
      this[`${form}Element`].nativeElement.submit();
    }
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
}
