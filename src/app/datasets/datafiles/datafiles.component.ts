import { APP_CONFIG, AppConfig } from "app-config.module";
import { Dataset } from "shared/sdk/models";
import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
  AfterViewChecked,
} from "@angular/core";
import { Subscription } from "rxjs";
import { Store, select } from "@ngrx/store";
import {
  getCurrentOrigDatablocks,
  getCurrentDataset,
} from "state-management/selectors/datasets.selectors";
import {
  TableColumn,
  PageChangeEvent,
  CheckboxEvent,
} from "shared/modules/table/table.component";
import { getIsLoading } from "state-management/selectors/user.selectors";
import { ActivatedRoute } from "@angular/router";
import { pluck } from "rxjs/operators";
import { fetchDatasetAction } from "state-management/actions/datasets.actions";
import { UserApi } from "shared/sdk";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { FilePathTruncate } from "shared/pipes/file-path-truncate.pipe";
import { MatCheckboxChange } from "@angular/material/checkbox";

export interface File {
  path: string;
  size: number;
  time: string;
  chk: string;
  uid: string;
  gid: string;
  perm: string;
  selected: boolean;
}

@Component({
  selector: "datafiles",
  templateUrl: "./datafiles.component.html",
  styleUrls: ["./datafiles.component.scss"],
})
export class DatafilesComponent
  implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  datablocks$ = this.store.pipe(select(getCurrentOrigDatablocks));
  dataset$ = this.store.pipe(select(getCurrentDataset));
  loading$ = this.store.pipe(select(getIsLoading));

  tooLargeFile: boolean;
  totalFileSize = 0;
  selectedFileSize = 0;

  areAllSelected = false;
  isNoneSelected = true;

  subscriptions: Subscription[] = [];

  files: Array<any> = [];
  sourcefolder: string;

  count = 0;
  pageSize = 25;
  currentPage = 0;

  fileDownloadEnabled: boolean = this.appConfig.fileDownloadEnabled;
  multipleDownloadEnabled: boolean = this.appConfig.multipleDownloadEnabled;
  multipleDownloadAction: string = this.appConfig.multipleDownloadAction;
  maxFileSize: number = this.appConfig.maxDirectDownloadSize;
  sftpHost: string = this.appConfig.sftpHost;
  jwt: any;

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
  tableData: File[];

  constructor(
    private route: ActivatedRoute,
    private store: Store<Dataset>,
    private cdRef: ChangeDetectorRef,
    private userApi: UserApi,
    @Inject(APP_CONFIG) public appConfig: AppConfig
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
      true
    );
  }

  getAllFiles() {
    if (!this.tableData) {
      return [];
    }
    return this.tableData.map((file) =>
      file.path.includes("/")
        ? file.path.split("/")[file.path.split("/").length - 1]
        : file.path
    );
  }

  getSelectedFiles() {
    if (!this.tableData) {
      return [];
    }
    return this.tableData
      .filter((file) => file.selected)
      .map((file) =>
        file.path.includes("/")
          ? file.path.split("/")[file.path.split("/").length - 1]
          : file.path
      );
  }

  updateSelectionStatus() {
    this.areAllSelected = this.getAreAllSelected();
    this.isNoneSelected = this.getIsNoneSelected();
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
      const largeFiles = files.filter((file) => {
        return file.size > this.maxFileSize;
      });
      if (largeFiles.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  ngOnInit() {
    this.subscriptions.push(
      this.userApi.jwt().subscribe((jwt) => {
        this.jwt = jwt;
      })
    );
  }

  ngAfterViewInit() {
    let datasetPid: string;
    this.route.params.pipe(pluck("id")).subscribe((id: string) => {
      datasetPid = id;
      this.store.dispatch(fetchDatasetAction({ pid: id }));
    });

    this.subscriptions.push(
      this.dataset$.subscribe((dataset) => {
        this.sourcefolder = dataset.sourceFolder;
      })
    );

    this.subscriptions.push(
      this.datablocks$.subscribe((datablocks) => {
        const files: File[] = [];
        datablocks.forEach((block) => {
          if (block.datasetId === datasetPid) {
            block.dataFileList.map((file) => {
              this.totalFileSize += file.size;
              file.selected = false;
              files.push(file);
            });
          }
        });
        this.count = files.length;
        this.tableData = files.slice(0, this.pageSize);
        this.files = files.map((file) => {
          // if (file.path.indexOf("/") !== -1) {
          //   const splitPath = file.path.split("/");
          //   file.path = splitPath[splitPath.length - 1];
          // }
          return file;
        });
        this.tooLargeFile = this.hasTooLargeFiles(this.files);
      })
    );
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
