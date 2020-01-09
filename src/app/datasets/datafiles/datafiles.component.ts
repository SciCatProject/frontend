import { APP_CONFIG, AppConfig } from "app-config.module";
import { MatTableDataSource, MatPaginator } from "@angular/material";
import { OrigDatablock, Dataset } from "shared/sdk/models";
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  Inject,
  ChangeDetectorRef,
  AfterViewChecked
} from "@angular/core";

@Component({
  selector: "datafiles",
  templateUrl: "./datafiles.component.html",
  styleUrls: ["./datafiles.component.scss"]
})
export class DatafilesComponent
  implements OnInit, AfterViewInit, AfterViewChecked {
  @Input() datablocks: Array<OrigDatablock>;
  // tslint:disable-next-line:no-input-rename
  @Input("data") dataset: Dataset;
  @Input() jwt: any;

  count = 0;
  files: Array<any> = [];
  tooLargeFile: boolean;
  totalFileSize = 0;
  selectedFileSize = 0;

  areAllSelected = false;
  isNoneSelected = true;

  urlPrefix: string = this.appConfig.fileserverBaseURL;
  multipleDownloadEnabled: boolean = this.appConfig.multipleDownloadEnabled;
  multipleDownloadAction: string = this.appConfig.multipleDownloadAction;
  maxFileSize: number = this.appConfig.maxDirectDownloadSize;
  sftpHost: string = this.appConfig.sftpHost;
  displayedColumns = (this.appConfig.multipleDownloadEnabled
    ? ["select"]
    : []
  ).concat(["name", "size", "path"]);

  dataSource: MatTableDataSource<any> | null;
  @ViewChild(MatPaginator, { static: false })
  paginator: MatPaginator;

  /**
   * Load datafiles and add to source for table viewing
   * @param datablocks
   */
  getDatafiles(datablocks: Array<OrigDatablock>) {
    datablocks.forEach(block => {
      const selectable = block.dataFileList.map(file => {
        this.totalFileSize += file.size;
        return { ...file, selected: false };
      });
      this.files = this.files.concat(selectable);
    });
    this.tooLargeFile = this.hasTooLargeFiles(this.files);
    this.dataSource.data = this.files;
  }

  getAreAllSelected() {
    return this.dataSource.data.reduce(
      (accum, curr) => accum && curr.selected,
      true
    );
  }

  getIsNoneSelected() {
    return this.dataSource.data.reduce(
      (accum, curr) => accum && !curr.selected,
      true
    );
  }

  getSelectedFiles() {
    if (!this.dataSource) {
      return [];
    }
    return this.dataSource.data
      .filter(file => file.selected)
      .map(file => file.path);
  }

  updateSelectionStatus() {
    this.areAllSelected = this.getAreAllSelected();
    this.isNoneSelected = this.getIsNoneSelected();
  }

  onSelect(event, file) {
    file.selected = event.checked;
    this.updateSelectionStatus();
    if (event.checked) {
      this.selectedFileSize += file.size;
    } else {
      this.selectedFileSize -= file.size;
    }
  }

  onSelectAll(event) {
    for (const file of this.dataSource.data) {
      file.selected = event.checked;
      if (event.checked) {
        this.selectedFileSize += file.size;
      } else {
        this.selectedFileSize = 0;
      }
    }
    this.updateSelectionStatus();
  }

  hasTooLargeFiles(files: any[]) {
    if (this.maxFileSize) {
      const largeFiles = files.filter(file => {
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

  constructor(
    private cdRef: ChangeDetectorRef,
    @Inject(APP_CONFIG) private appConfig: AppConfig
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    if (this.datablocks) {
      this.getDatafiles(this.datablocks);
    }
  }

  ngAfterViewChecked() {
    this.count = this.files.length;
    this.cdRef.detectChanges();
  }
}
