import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { BehaviorSubject, fromEvent, Subscription } from "rxjs";
import { selectSampleDetailPageViewModel } from "../../state-management/selectors/samples.selectors";
import { Store } from "@ngrx/store";
import {
  fetchSampleAction,
  fetchSampleDatasetsAction,
  changeDatasetsPageAction,
  saveCharacteristicsAction,
  addAttachmentAction,
  updateAttachmentCaptionAction,
  removeAttachmentAction,
  fetchSampleAttachmentsAction,
} from "../../state-management/actions/samples.actions";
import { DatePipe, SlicePipe } from "@angular/common";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import {
  PickedFile,
  SubmitCaptionEvent,
} from "shared/modules/file-uploader/file-uploader.component";
import { EditableComponent } from "app-routing/pending-changes.guard";
import { AppConfigService } from "app-config.service";
import {
  CreateAttachmentV3Dto,
  OutputAttachmentV3Dto,
  OutputDatasetObsoleteDto,
  ReturnedUserDto,
  OutputSampleDto,
} from "@scicatproject/scicat-sdk-ts-angular";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import { ITableSetting } from "shared/modules/dynamic-material-table/models/table-setting.model";
import {
  TablePagination,
  TablePaginationMode,
} from "shared/modules/dynamic-material-table/models/table-pagination.model";
import {
  IRowEvent,
  RowEventType,
  TableSelectionMode,
} from "shared/modules/dynamic-material-table/models/table-row.model";

export interface TableData {
  pid: string;
  name: string;
  sourceFolder: string;
  size: string;
  creationTime: string | null;
  owner: string;
  location: string;
}

@Component({
  selector: "app-sample-detail",
  templateUrl: "./sample-detail.component.html",
  styleUrls: ["./sample-detail.component.scss"],
  standalone: false,
})
export class SampleDetailComponent
  implements OnInit, OnDestroy, EditableComponent
{
  private _hasUnsavedChanges = false;
  vm$ = this.store.select(selectSampleDetailPageViewModel);

  appConfig = this.appConfigService.getConfig();

  sample: OutputSampleDto;
  user: ReturnedUserDto;
  attachment: CreateAttachmentV3Dto;
  attachments: OutputAttachmentV3Dto[] = [];
  show = false;
  subscriptions: Subscription[] = [];

  tableColumns: TableField<TableData>[] = [
    { name: "name", header: "Name" },
    { name: "sourceFolder", header: "Source Folder" },
    { name: "size", header: "Size" },
    { name: "creationTime", header: "Creation Time" },
    { name: "owner", header: "Owner" },
    { name: "location", header: "Location" },
  ];

  setting: ITableSetting = {
    rowStyle: {
      "border-bottom": "1px solid #d2d2d2",
    },
  };

  dataSource: BehaviorSubject<TableData[]> = new BehaviorSubject<TableData[]>(
    [],
  );

  paginationMode: TablePaginationMode = "server-side";

  pagination: TablePagination = {
    pageSizeOptions: [5, 10, 25, 50, 100],
    pageIndex: 0,
    pageSize: 25,
    length: 0,
  };

  rowSelectionMode: TableSelectionMode = "none";

  constructor(
    private appConfigService: AppConfigService,
    private datePipe: DatePipe,
    private filesizePipe: FileSizePipe,
    private router: Router,
    private route: ActivatedRoute,
    private slicePipe: SlicePipe,
    private store: Store,
  ) {}

  formatTableData(datasets: OutputDatasetObsoleteDto[]): TableData[] {
    let tableData: TableData[] = [];
    if (datasets) {
      tableData = datasets.map((dataset: any) => ({
        pid: dataset.pid,
        name: dataset.datasetName,
        sourceFolder:
          "..." + this.slicePipe.transform(dataset.sourceFolder, -14),
        size: this.filesizePipe.transform(dataset.size),
        creationTime: this.datePipe.transform(
          dataset.creationTime,
          "yyyy-MM-dd HH:mm",
        ),
        owner: dataset.owner,
        location: dataset.creationLocation,
      }));
    }
    return tableData;
  }

  onSaveCharacteristics(characteristics: Record<string, unknown>) {
    this.store.dispatch(
      saveCharacteristicsAction({
        sampleId: this.sample.sampleId,
        characteristics,
      }),
    );
  }

  onFilePicked(file: PickedFile) {
    this.attachment = {
      thumbnail: file.content,
      caption: file.name,
      ownerGroup: this.sample.ownerGroup,
      accessGroups: this.sample.accessGroups,
      sampleId: this.sample.sampleId,
    };
    this.store.dispatch(addAttachmentAction({ attachment: this.attachment }));
  }

  updateCaption(event: SubmitCaptionEvent) {
    const { attachmentId, caption } = event;
    this.store.dispatch(
      updateAttachmentCaptionAction({
        sampleId: this.sample.sampleId,
        attachmentId,
        caption,
      }),
    );
  }

  deleteAttachment(attachmentId: string) {
    this.store.dispatch(
      removeAttachmentAction({ sampleId: this.sample.sampleId, attachmentId }),
    );
  }

  onPaginationChange({ pageIndex, pageSize }: TablePagination) {
    this.store.dispatch(
      changeDatasetsPageAction({
        page: pageIndex,
        limit: pageSize,
      }),
    );
    this.store.dispatch(
      fetchSampleDatasetsAction({ sampleId: this.sample.sampleId }),
    );
  }

  onRowEvent(event: IRowEvent<TableData>) {
    if (event.event === RowEventType.RowClick) {
      const id = encodeURIComponent(event.sender.row.pid);
      this.router.navigateByUrl("/datasets/" + id);
    }
  }

  ngOnInit() {
    this.subscriptions.push(
      this.vm$.subscribe((vm) => {
        if (vm.sample) {
          this.sample = vm.sample;

          if (!this.sample.sampleCharacteristics) {
            this.sample.sampleCharacteristics = {};
          }
        }

        if (vm.attachments) {
          this.attachments = vm.attachments;
        }

        this.dataSource.next(this.formatTableData(vm.datasets));
        this.pagination = {
          ...this.pagination,
          pageIndex: vm.datasetsPage || 0,
          pageSize: vm.datasetsPerPage || this.pagination.pageSize,
          length: vm.datasetsCount || 0,
        };
      }),
    );
    // Prevent user from reloading page if there are unsave changes
    this.subscriptions.push(
      fromEvent(window, "beforeunload").subscribe((event) => {
        if (this.hasUnsavedChanges()) {
          event.preventDefault();
        }
      }),
    );

    this.subscriptions.push(
      this.vm$.subscribe((vm) => {
        if (vm.user) {
          this.user = vm.user;
        }
      }),
    );

    this.subscriptions.push(
      this.route.params.subscribe((params) => {
        this.store.dispatch(fetchSampleAction({ sampleId: params.id }));
        this.store.dispatch(
          fetchSampleAttachmentsAction({ sampleId: params.id }),
        );
        this.store.dispatch(fetchSampleDatasetsAction({ sampleId: params.id }));
      }),
    );
  }
  hasUnsavedChanges() {
    return this._hasUnsavedChanges;
  }
  onHasUnsavedChanges($event: boolean) {
    this._hasUnsavedChanges = $event;
  }

  emptyMetadataTable(): boolean {
    if (this.appConfig.hideEmptyMetadataTable) {
      return (
        !!this.sample?.sampleCharacteristics &&
        Object.keys(this.sample.sampleCharacteristics).length > 0
      );
    }
    return true;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
