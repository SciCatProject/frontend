import { ActivatedRoute } from "@angular/router";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import {
  DatablocksAction,
  DeleteAttachment,
  UpdateAttachmentCaptionAction,
  ClearFacetsAction,
  AddAttachment
} from "state-management/actions/datasets.actions";
import { Job, User, Attachment, Dataset } from "shared/sdk/models";
import { select, Store } from "@ngrx/store";
import { AddKeywordFilterAction } from "state-management/actions/datasets.actions";
import { SubmitAction } from "state-management/actions/jobs.actions";
import { ShowMessageAction } from "state-management/actions/user.actions";
import {
  getError,
  submitJob
} from "../../state-management/selectors/jobs.selectors";
import { Subscription, Observable } from "rxjs";
import { Message, MessageType } from "state-management/models";
import { getIsAdmin } from "state-management/selectors/users.selectors";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { pluck, take } from "rxjs/operators";
import { Router } from "@angular/router";
import {
  getCurrentAttachments,
  getCurrentDatablocks,
  getCurrentDataset,
  getCurrentOrigDatablocks,
  getCurrentDatasetWithoutOrigData
} from "state-management/selectors/datasets.selectors";
import { ReadFile } from "ngx-file-helpers";
import { UserApi } from "shared/sdk";

/**
 * Component to show details for a data set, using the
 * form component
 * @export
 * @class DatasetDetailComponent
 * @implements {OnInit}
 */
@Component({
  selector: "dataset-detail",
  templateUrl: "./dataset-detail.component.html",
  styleUrls: ["./dataset-detail.component.scss"]
})
export class DatasetDetailComponent implements OnInit, OnDestroy {
  dataset$ = this.store.pipe(select(getCurrentDataset));
  datasetwithout$ = this.store.pipe(select(getCurrentDatasetWithoutOrigData));
  jwt$: Observable<any>;

  private subscriptions: Subscription[] = [];
  private routeSubscription = this.route.params
    .pipe(pluck("id"))
    .subscribe((id: string) => this.store.dispatch(new DatablocksAction(id)));
  public origDatablocks$ = this.store.pipe(select(getCurrentOrigDatablocks));
  public datablocks$ = this.store.pipe(select(getCurrentDatablocks));
  public attachments$ = this.store.pipe(select(getCurrentAttachments));
  public isAdmin$ = this.store.pipe(select(getIsAdmin));

  dataset: Dataset;
  pickedFile: ReadFile;
  attachment: Attachment;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<any>,
    private userApi: UserApi,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {}

  ngOnInit() {
    const msg = new Message();

    this.subscriptions.push(
      this.store.pipe(select(submitJob)).subscribe(
        ret => {
          if (ret && Array.isArray(ret)) {
            console.log(ret);
          }
        },
        error => {
          console.log(error);
          msg.type = MessageType.Error;
          msg.content = "Job not Submitted";
          this.store.dispatch(new ShowMessageAction(msg));
        }
      )
    );

    this.subscriptions.push(
      this.store.pipe(select(getError)).subscribe(err => {
        if (err) {
          msg.type = MessageType.Error;
          msg.content = err.message;
          this.store.dispatch(new ShowMessageAction(msg));
        }
      })
    );

    this.subscriptions.push(
      this.dataset$.subscribe(dataset => {
        this.dataset = dataset;
      })
    );
    this.jwt$ = this.userApi.jwt();
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  resetDataset(dataset) {
    if (!confirm("Reset datablocks?")) {
      return null;
    }
    this.store
      .pipe(
        select(state => state.root.user.currentUser),
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

  updateCaption(datasetId: string, attachmentId: string, caption: string) {
    this.store.dispatch(
      new UpdateAttachmentCaptionAction(datasetId, attachmentId, caption)
    );
  }

  delete(dataset_id, dataset_attachment_id) {
    this.store.dispatch(
      new DeleteAttachment(dataset_id, dataset_attachment_id)
    );
  }

  onClickProp(proposalId: string): void {
    const id = encodeURIComponent(proposalId);
    this.router.navigateByUrl("/proposals/" + id);
  }

  onClickSample(sampleId: string): void {
    const id = encodeURIComponent(sampleId);
    this.router.navigateByUrl("/samples/" + id);
  }

  onClickKeyword(keyword: string): void {
    this.store.dispatch(new ClearFacetsAction());
    this.store.dispatch(new AddKeywordFilterAction(keyword));
    this.router.navigateByUrl("/datasets");
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
}
