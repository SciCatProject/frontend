import { APP_CONFIG, AppConfig } from "app-config.module";
import { OrigDatablock, Dataset } from "shared/sdk/models";
import {
  Component,
  Input,
  OnInit,
  Inject,
  ChangeDetectorRef,
  OnDestroy,
  OnChanges,
} from "@angular/core";
import { Subscription, Observable } from "rxjs";
import { Store, select } from "@ngrx/store";
import { getCurrentOrigDatablocks, getCurrentDataset } from "state-management/selectors/datasets.selectors";
import {
  TableColumn,
  PageChangeEvent,
  CheckboxEvent,
} from "shared/modules/table/table.component";
import { getIsLoading } from "state-management/selectors/user.selectors";
import { ActivatedRoute } from "@angular/router";
import { pluck } from "rxjs/operators";
import { fetchDatasetAction } from "state-management/actions/datasets.actions";
import {
  selectPolicyAction,
  deselectPolicyAction,
} from "state-management/actions/policies.actions";
import { UserApi } from "shared/sdk";

@Component({
  selector: "datafiles",
  templateUrl: "./datafiles.component.html",
  styleUrls: ["./datafiles.component.scss"],
})
export class DatafilesComponent implements OnInit, OnDestroy, OnChanges {
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

  count = 0;
  pageSize = 25;
  currentPage = 0;

  fileDownloadEnabled: boolean = this.appConfig.fileDownloadEnabled;
  multipleDownloadEnabled: boolean = this.appConfig.multipleDownloadEnabled;
  multipleDownloadAction: string = this.appConfig.multipleDownloadAction;
  maxFileSize: number = this.appConfig.maxDirectDownloadSize;
  sftpHost: string = this.appConfig.sftpHost;
  jwt$: Observable<any>;
  jwt: any;

  tableColumns: TableColumn[] = [
    {
      name: "path",
      icon: "brightness_high",
      sort: false,
      inList: true,
    },
    { name: "size", icon: "bubble_chart", sort: false, inList: true },
    {
      name: "time",
      icon: "mail",
      sort: false,
      inList: true,
    },
  ];

  tableData: any;
  // paginator: MatPaginator;
  constructor(
    private route: ActivatedRoute,

    private store: Store<Dataset>,
    private cdRef: ChangeDetectorRef,
    private userApi: UserApi,

    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {}


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

  onPageChange(event: PageChangeEvent) {
    this.currentPage = event.pageIndex;
    const skip = this.currentPage * this.pageSize;
    this.tableData = this.files.slice(skip, skip + this.pageSize);
  }

  onRowClick(event: Event) {}

  ngOnInit() {
    this.jwt$ = this.userApi.jwt();

    this.jwt$.subscribe((jwt) => {
      this.jwt = jwt;
    });
  }

  ngAfterViewInit() {
    let myId: any;
    this.route.params.pipe(pluck("id")).subscribe((id: string) => {
      myId = id;
      this.store.dispatch(fetchDatasetAction({ pid: id }));
    });

    this.subscriptions.push(
      this.datablocks$.subscribe((datablocks) => {
        datablocks.forEach((block) => {
          if (block.datasetId === myId) {
            block.dataFileList.map((file) => {
              this.totalFileSize += file.size;
              file.selected = false;
              this.files = this.files.concat(file);
              this.count = this.files.length;
              this.tableData = this.files.slice(0, this.pageSize);
            });
          }
        });
        this.tooLargeFile = this.hasTooLargeFiles(this.files);
      })
    );
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnChanges(changes) {}

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
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

  onSelectAll(event) {
    for (const file of this.tableData) {
      file.selected = event.checked;
      if (event.checked) {
        this.selectedFileSize += file.size;
      } else {
        this.selectedFileSize = 0;
      }
    }
    this.updateSelectionStatus();
  }
}
