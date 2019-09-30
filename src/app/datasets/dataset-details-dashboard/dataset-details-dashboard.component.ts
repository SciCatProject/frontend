import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  ChangeDetectorRef,
  AfterViewChecked
} from "@angular/core";
import { Store, select } from "@ngrx/store";
import {
  Dataset,
  UserApi,
  User,
  Job,
  Attachment,
  RawDataset,
  DerivedDataset
} from "shared/sdk";
import {
  getCurrentDataset,
  getCurrentDatasetWithoutOrigData,
  getCurrentOrigDatablocks,
  getCurrentDatablocks,
  getCurrentAttachments,
  getViewPublicMode,
  getIsLoading
} from "state-management/selectors/datasets.selectors";
import {
  getIsAdmin,
  getCurrentUser
} from "state-management/selectors/users.selectors";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { pluck, take } from "rxjs/operators";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { Message, MessageType } from "state-management/models";
import { submitJob, getError } from "state-management/selectors/jobs.selectors";
import { ShowMessageAction } from "state-management/actions/user.actions";
import {
  DatablocksAction,
  UpdateAttachmentCaptionAction,
  DeleteAttachment,
  AddAttachment,
  ClearFacetsAction,
  AddKeywordFilterAction,
  SaveDatasetAction
} from "state-management/actions/datasets.actions";
import { SubmitAction } from "state-management/actions/jobs.actions";
import { ReadFile } from "ngx-file-helpers";
import { SubmitCaptionEvent } from "shared/modules/file-uploader/file-uploader.component";

@Component({
  selector: "dataset-details-dashboard",
  templateUrl: "./dataset-details-dashboard.component.html",
  styleUrls: ["./dataset-details-dashboard.component.scss"]
})
export class DatasetDetailsDashboardComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  datasetWithout$ = this.store.pipe(select(getCurrentDatasetWithoutOrigData));
  origDatablocks$ = this.store.pipe(select(getCurrentOrigDatablocks));
  datablocks$ = this.store.pipe(select(getCurrentDatablocks));
  attachments$ = this.store.pipe(select(getCurrentAttachments));
  isAdmin$ = this.store.pipe(select(getIsAdmin));
  loading$ = this.store.pipe(select(getIsLoading));
  jwt$: Observable<any>;

  dataset: RawDataset | DerivedDataset;
  viewPublic: boolean;
  pickedFile: ReadFile;
  attachment: Attachment;

  private subscriptions: Subscription[] = [];

  onClickKeyword(keyword: string) {
    this.store.dispatch(new ClearFacetsAction());
    this.store.dispatch(new AddKeywordFilterAction(keyword));
    this.router.navigateByUrl("/datasets");
  }

  onClickProposal(proposalId: string) {
    const id = encodeURIComponent(proposalId);
    this.router.navigateByUrl("/proposals/" + id);
  }

  onClickSample(sampleId: string) {
    const id = encodeURIComponent(sampleId);
    this.router.navigateByUrl("/samples/" + id);
  }

  onSaveMetadata(metadata: object) {
    this.dataset.scientificMetadata = metadata;
    this.store.dispatch(new SaveDatasetAction(this.dataset));
  }

  resetDataset(dataset: Dataset) {
    if (!confirm("Reset datablocks?")) {
      return null;
    }
    this.store
      .pipe(
        select(getCurrentUser),
        take(1)
      )
      .subscribe((user: User) => {
        const job = new Job();
        job.emailJobInitiator = user.email;
        job.jobParams = {};
        job.jobParams["username"] = user.username;
        job.creationTime = new Date();
        job.type = "reset";
        const fileObj = {};
        const fileList = [];
        fileObj["pid"] = dataset["pid"];
        if (dataset["datablocks"]) {
          dataset["datablocks"].map(d => {
            fileList.push(d["archiveId"]);
          });
        }
        fileObj["files"] = fileList;
        job.datasetList = [fileObj];
        console.log(job);
        this.store.dispatch(new SubmitAction(job));
      });
  }

  onFileUploaderFilePicked(file: ReadFile) {
    this.pickedFile = file;
  }

  onFileUploaderReadEnd(fileCount: number) {
    if (fileCount > 0) {
      this.attachment = {
        thumbnail: this.pickedFile.content,
        caption: this.pickedFile.name,
        creationTime: new Date(),
        id: null,
        dataset: this.dataset,
        datasetId: this.dataset.pid,
        rawDatasetId: null,
        derivedDatasetId: null,
        proposal: null,
        proposalId: null,
        sample: null,
        sampleId: null
      };
      this.store.dispatch(new AddAttachment(this.attachment));
    }
  }

  updateCaption(event: SubmitCaptionEvent) {
    this.store.dispatch(
      new UpdateAttachmentCaptionAction(
        this.dataset.pid,
        event.attachmentId,
        event.caption
      )
    );
  }

  deleteAttachment(attachmentId: string) {
    this.store.dispatch(new DeleteAttachment(this.dataset.pid, attachmentId));
  }

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<Dataset>,
    private userApi: UserApi
  ) {}

  ngOnInit() {
    const message = new Message();

    this.subscriptions.push(
      this.route.params.pipe(pluck("id")).subscribe((id: string) => {
        if (id) {
          if (this.viewPublic) {
            this.store.dispatch(
              new DatablocksAction(id, { isPublished: this.viewPublic })
            );
          } else {
            this.store.dispatch(new DatablocksAction(id));
          }
        }
      })
    );

    this.subscriptions.push(
      this.store
        .pipe(select(getCurrentDataset))
        .subscribe((dataset: RawDataset | DerivedDataset) => {
          if (dataset) {
            this.dataset = dataset;
          }
        })
    );

    this.subscriptions.push(
      this.store.pipe(select(submitJob)).subscribe(
        ret => {
          if (ret && Array.isArray(ret)) {
            console.log(ret);
          }
        },
        error => {
          console.log(error);
          message.type = MessageType.Error;
          message.content = "Job not Submitted";
          this.store.dispatch(new ShowMessageAction(message));
        }
      )
    );

    this.subscriptions.push(
      this.store.pipe(select(getError)).subscribe(err => {
        if (err) {
          message.type = MessageType.Error;
          message.content = err.message;
          this.store.dispatch(new ShowMessageAction(message));
        }
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getViewPublicMode)).subscribe(viewPublic => {
        this.viewPublic = viewPublic;
      })
    );

    this.jwt$ = this.userApi.jwt();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
