import {
  Component,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
  AfterViewChecked,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";
import {
  selectCurrentOrigDatablocks,
  selectCurrentDataset,
} from "state-management/selectors/datasets.selectors";
import {
  TableColumn,
  PageChangeEvent,
  CheckboxEvent,
} from "shared/modules/table/table.component";
import {
  selectIsLoading,
  selectIsLoggedIn,
} from "state-management/selectors/user.selectors";
import {
  CreateUserJWT,
  UsersService,
} from "@scicatproject/scicat-sdk-ts-angular";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatDialog } from "@angular/material/dialog";
import { PublicDownloadDialogComponent } from "datasets/public-download-dialog/public-download-dialog.component";
import { submitJobAction } from "state-management/actions/jobs.actions";
import { AppConfigService } from "app-config.service";
import { NgForm } from "@angular/forms";
import { DataFiles_File } from "./datafiles.interfaces";
import { ActionDataset } from "datasets/datafiles-actions/datafiles-action.interfaces";
import { AuthService } from "shared/services/auth/auth.service";

@Component({
  selector: "datafiles",
  templateUrl: "./datafiles.component.html",
  styleUrls: ["./datafiles.component.scss"],
  standalone: false,
})
export class DatafilesComponent
  implements OnDestroy, AfterViewInit, AfterViewChecked
{
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

  areAllSelected = false;
  isNoneSelected = true;

  subscriptions: Subscription[] = [];

  files: Array<DataFiles_File> = [];
  datasetPid = "";
  actionDataset: ActionDataset;

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

  tableColumns: TableColumn[] = [
    {
      name: "path",
      icon: "save",
      sort: false,
      inList: true,
      // pipe: FilePathTruncate,
    },
    {
      name: "size",
      icon: "save",
      sort: false,
      inList: true,
      pipe: FileSizePipe,
    },
    {
      name: "time",
      icon: "access_time",
      sort: false,
      inList: true,
      dateFormat: "yyyy-MM-dd HH:mm",
    },
  ];
  tableData: DataFiles_File[] = [];

  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
    private cdRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private usersService: UsersService,
    private authService: AuthService,
    private fileSizePipe: FileSizePipe,
  ) {}

  onPageChange(event: PageChangeEvent) {
    const { pageIndex, pageSize } = event;
    this.currentPage = pageIndex;
    this.pageSize = pageSize;
    const skip = this.currentPage * this.pageSize;
    const end = skip + this.pageSize;
    this.tableData = this.files.slice(skip, end);
  }

  getAreAllSelected() {
    return this.tableData.reduce((accum, curr) => accum && curr.selected, true);
  }

  getIsNoneSelected() {
    return this.tableData.reduce(
      (accum, curr) => accum && !curr.selected,
      true,
    );
  }

  getAllFiles() {
    if (!this.tableData) {
      return [];
    }
    return this.tableData.map((file) => file.path);
  }

  getSelectedFiles() {
    if (!this.tableData) {
      return [];
    }
    return this.tableData
      .filter((file) => file.selected)
      .map((file) => file.path);
  }

  updateSelectionStatus() {
    this.areAllSelected = this.getAreAllSelected();
    this.isNoneSelected = this.getIsNoneSelected();
    this.updateSelectedInFiles();
  }

  updateSelectedInFiles() {
    const selected = this.tableData
      .filter((item) => item.selected)
      .map((item) => item.path);
    const files = this.files.map((item) => {
      item.selected = selected.includes(item.path);
      return item;
    });
    this.files = [...files];
  }

  onSelectOne(checkboxEvent: CheckboxEvent) {
    const { event, row } = checkboxEvent;
    row.selected = event.checked;
    if (event.checked) {
      this.selectedFileSize += row.size;
    } else {
      this.selectedFileSize -= row.size;
    }
    this.updateSelectionStatus();
  }

  onSelectAll(event: MatCheckboxChange) {
    this.tableData.forEach((file) => {
      file.selected = event.checked;
      if (event.checked) {
        this.selectedFileSize += file.size;
      } else {
        this.selectedFileSize = 0;
      }
    });
    this.updateSelectionStatus();
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
  ngAfterViewInit() {
    this.subscriptions.push(
      this.dataset$.subscribe((dataset) => {
        if (dataset) {
          this.sourceFolder = dataset.sourceFolder;
          this.datasetPid = dataset.pid;
          this.actionDataset = <ActionDataset>dataset;
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
          this.tableData = files.slice(0, this.pageSize);
          this.files = files;
          this.tooLargeFile = this.hasTooLargeFiles(this.files);
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
        const data = {
          emailJobInitiator: email,
          creationTime: new Date(),
          type: "public",
          datasetList: [
            {
              pid: this.datasetPid,
              files: this.getSelectedFiles(),
            },
          ],
          jobParams: {}, // TODO: job release back-ward compatibility issue
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
