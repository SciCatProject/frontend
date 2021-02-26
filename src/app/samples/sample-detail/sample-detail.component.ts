import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy, OnInit, Inject } from "@angular/core";
import { Subscription } from "rxjs";
import { Sample, Dataset, Attachment, User } from "shared/sdk/models";
import {
  getCurrentSample,
  getDatasets,
  getDatasetsPerPage,
  getDatasetsPage,
  getDatasetsCount,
  getCurrentAttachments
} from "../../state-management/selectors/samples.selectors";
import { select, Store } from "@ngrx/store";
import {
  fetchSampleAction,
  fetchSampleDatasetsAction,
  changeDatasetsPageAction,
  saveCharacteristicsAction,
  addAttachmentAction,
  updateAttachmentCaptionAction,
  removeAttachmentAction
} from "../../state-management/actions/samples.actions";
import { DatePipe, SlicePipe } from "@angular/common";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import {
  TableColumn,
  PageChangeEvent
} from "shared/modules/table/table.component";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { ReadFile } from "ngx-file-helpers";
import { SubmitCaptionEvent } from "shared/modules/file-uploader/file-uploader.component";
import { getCurrentUser } from "state-management/selectors/user.selectors";

@Component({
  selector: "app-sample-detail",
  templateUrl: "./sample-detail.component.html",
  styleUrls: ["./sample-detail.component.scss"]
})
export class SampleDetailComponent implements OnInit, OnDestroy {
  attachments$ = this.store.pipe(select(getCurrentAttachments));
  datasetsPerPage$ = this.store.pipe(select(getDatasetsPerPage));
  datasetsPage$ = this.store.pipe(select(getDatasetsPage));
  datasetsCount$ = this.store.pipe(select(getDatasetsCount));

  sample: Sample;
  user: User;
  pickedFile: ReadFile;
  attachment: Attachment;

  subscriptions: Subscription[] = [];

  tableData: any[];
  tablePaginate = true;
  tableColumns: TableColumn[] = [
    { name: "name", icon: "portrait", sort: false, inList: true },
    { name: "sourceFolder", icon: "explore", sort: false, inList: true },
    { name: "size", icon: "save", sort: false, inList: true },
    { name: "creationTime", icon: "calendar_today", sort: false, inList: true },
    { name: "owner", icon: "face", sort: false, inList: true },
    { name: "location", icon: "explore", sort: false, inList: true }
  ];

  show = false;

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private datePipe: DatePipe,
    private filesizePipe: FileSizePipe,
    private router: Router,
    private route: ActivatedRoute,
    private slicePipe: SlicePipe,
    private store: Store<Sample>
  ) {}

  formatTableData(datasets: Dataset[]): any[] {
    if (datasets) {
      return datasets.map((dataset: any) => {
        return {
          pid: dataset.pid,
          name: dataset.datasetName,
          sourceFolder:
            "..." + this.slicePipe.transform(dataset.sourceFolder, -14),
          size: this.filesizePipe.transform(dataset.size),
          creationTime: this.datePipe.transform(
            dataset.creationTime,
            "yyyy-MM-dd HH:mm"
          ),
          owner: dataset.owner,
          location: dataset.creationLocation
        };
      });
    }
  }

  onSaveCharacteristics(characteristics: object) {
    this.store.dispatch(
      saveCharacteristicsAction({
        sampleId: this.sample.sampleId,
        characteristics
      })
    );
  }

  onFilePicked(file: ReadFile) {
    this.pickedFile = file;
  }

  onReadEnd(filecount: number) {
    if (filecount > 0) {
      this.attachment = {
        thumbnail: this.pickedFile.content,
        caption: this.pickedFile.name,
        ownerGroup: this.sample.ownerGroup,
        accessGroups: this.sample.accessGroups,
        createdBy: this.user.username,
        updatedBy: this.user.username,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: null,
        sample: this.sample,
        sampleId: this.sample.sampleId,
        dataset: null,
        datasetId: null,
        rawDatasetId: null,
        derivedDatasetId: null,
        proposal: null,
        proposalId: null
      };
      this.store.dispatch(addAttachmentAction({ attachment: this.attachment }));
    }
  }

  updateCaption(event: SubmitCaptionEvent) {
    const { attachmentId, caption } = event;
    this.store.dispatch(
      updateAttachmentCaptionAction({
        sampleId: this.sample.sampleId,
        attachmentId,
        caption
      })
    );
  }

  deleteAttachment(attachmentId: string) {
    this.store.dispatch(
      removeAttachmentAction({ sampleId: this.sample.sampleId, attachmentId })
    );
  }

  onPageChange(event: PageChangeEvent) {
    this.store.dispatch(
      changeDatasetsPageAction({ page: event.pageIndex, limit: event.pageSize })
    );
    this.store.dispatch(
      fetchSampleDatasetsAction({ sampleId: this.sample.sampleId })
    );
  }

  onRowClick(dataset: Dataset) {
    const id = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl("/datasets/" + id);
  }

  ngOnInit() {
    this.subscriptions.push(
      this.store.pipe(select(getCurrentSample)).subscribe(sample => {
        this.sample = sample;
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getDatasets)).subscribe(datasets => {
        this.tableData = this.formatTableData(datasets);
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getCurrentUser)).subscribe(user => {
        this.user = user;
      })
    );

    this.subscriptions.push(
      this.route.params.subscribe(params => {
        this.store.dispatch(fetchSampleAction({ sampleId: params.id }));
        this.store.dispatch(fetchSampleDatasetsAction({ sampleId: params.id }));
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
