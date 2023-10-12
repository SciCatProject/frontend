import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { fromEvent, Subscription } from "rxjs";
import { Sample, Attachment, User, Dataset } from "shared/sdk/models";
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
  TableColumn,
  PageChangeEvent,
} from "shared/modules/table/table.component";
import {
  PickedFile,
  SubmitCaptionEvent,
} from "shared/modules/file-uploader/file-uploader.component";
import { EditableComponent } from "app-routing/pending-changes.guard";
import { AppConfigService } from "app-config.service";

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
})
export class SampleDetailComponent
  implements OnInit, OnDestroy, EditableComponent
{
  private _hasUnsavedChanges = false;
  vm$ = this.store.select(selectSampleDetailPageViewModel);

  appConfig = this.appConfigService.getConfig();

  sample: Sample = new Sample();
  user: User = new User();
  attachment: Partial<Attachment> = new Attachment();
  attachments: Attachment[] = [new Attachment()];
  show = false;
  subscriptions: Subscription[] = [];

  tableData: TableData[] = [];
  tablePaginate = true;
  tableColumns: TableColumn[] = [
    { name: "name", icon: "portrait", sort: false, inList: true },
    { name: "sourceFolder", icon: "explore", sort: false, inList: true },
    { name: "size", icon: "save", sort: false, inList: true },
    { name: "creationTime", icon: "calendar_today", sort: false, inList: true },
    { name: "owner", icon: "face", sort: false, inList: true },
    { name: "location", icon: "explore", sort: false, inList: true },
  ];

  constructor(
    private appConfigService: AppConfigService,
    private datePipe: DatePipe,
    private filesizePipe: FileSizePipe,
    private router: Router,
    private route: ActivatedRoute,
    private slicePipe: SlicePipe,
    private store: Store,
  ) {}

  formatTableData(datasets: Dataset[]): TableData[] {
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
      dataset: undefined,
      datasetId: undefined,
      rawDatasetId: undefined,
      derivedDatasetId: undefined,
      proposal: undefined,
      proposalId: undefined,
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

  onPageChange(event: PageChangeEvent) {
    this.store.dispatch(
      changeDatasetsPageAction({
        page: event.pageIndex,
        limit: event.pageSize,
      }),
    );
    this.store.dispatch(
      fetchSampleDatasetsAction({ sampleId: this.sample.sampleId }),
    );
  }

  onRowClick(dataset: Dataset) {
    const id = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl("/datasets/" + id);
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
        this.tableData = this.formatTableData(vm.datasets);
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
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
