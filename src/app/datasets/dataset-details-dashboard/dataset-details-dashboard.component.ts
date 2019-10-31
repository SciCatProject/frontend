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
  getPublicViewMode
} from "state-management/selectors/datasets.selectors";
import {
  getIsAdmin,
  getCurrentUser
} from "state-management/selectors/user.selectors";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, Observable } from "rxjs";
import { pluck, take } from "rxjs/operators";
import { APP_CONFIG, AppConfig } from "app-config.module";
import {
  clearFacetsAction,
  addKeywordFilterAction,
  updatePropertyAction,
  updateAttachmentCaptionAction,
  removeAttachmentAction,
  fetchDatasetAction,
  addAttachmentAction
} from "state-management/actions/datasets.actions";
import { submitJobAction } from "state-management/actions/jobs.actions";
import { ReadFile } from "ngx-file-helpers";
import { SubmitCaptionEvent } from "shared/modules/file-uploader/file-uploader.component";
import { MatSlideToggleChange } from "@angular/material";

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
  jwt$: Observable<any>;

  dataset: RawDataset | DerivedDataset;
  user: User;
  pickedFile: ReadFile;
  attachment: Attachment;

  private subscriptions: Subscription[] = [];

  isPI(): boolean {
    if (this.dataset.type === "raw") {
      return (
        this.user.email.toLowerCase() ===
        (this.dataset as RawDataset).principalInvestigator.toLowerCase()
      );
    } else if (this.dataset.type === "derived") {
      return (
        this.user.email.toLowerCase() ===
        (this.dataset as DerivedDataset).investigator.toLowerCase()
      );
    } else {
      return false;
    }
  }

  onSlidePublic(event: MatSlideToggleChange) {
    const pid = this.dataset.pid;
    const property = { isPublished: event.checked };
    this.store.dispatch(updatePropertyAction({ pid, property }));
  }

  onClickKeyword(keyword: string) {
    this.store.dispatch(clearFacetsAction());
    this.store.dispatch(addKeywordFilterAction({ keyword }));
    this.router.navigateByUrl("/datasets");
  }

  onAddKeyword(keyword: string) {
    if (this.dataset.keywords.indexOf(keyword) === -1) {
      const pid = this.dataset.pid;
      const keywords = [...this.dataset.keywords].concat(keyword);
      const property = { keywords };
      this.store.dispatch(updatePropertyAction({ pid, property }));
    }
  }

  onRemoveKeyword(keyword: string) {
    const index = this.dataset.keywords.indexOf(keyword);
    if (index >= 0) {
      const pid = this.dataset.pid;
      const keywords = [...this.dataset.keywords];
      keywords.splice(index, 1);
      const property = { keywords };
      this.store.dispatch(updatePropertyAction({ pid, property }));
    }
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
    const pid = this.dataset.pid;
    const property = { scientificMetadata: metadata };
    this.store.dispatch(updatePropertyAction({ pid, property }));
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
        this.store.dispatch(submitJobAction({ job }));
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
      this.store.dispatch(addAttachmentAction({ attachment: this.attachment }));
    }
  }

  updateCaption(event: SubmitCaptionEvent) {
    this.store.dispatch(
      updateAttachmentCaptionAction({
        datasetId: this.dataset.pid,
        attachmentId: event.attachmentId,
        caption: event.caption
      })
    );
  }

  deleteAttachment(attachmentId: string) {
    this.store.dispatch(
      removeAttachmentAction({ datasetId: this.dataset.pid, attachmentId })
    );
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
    this.subscriptions.push(
      this.route.params.pipe(pluck("id")).subscribe((id: string) => {
        if (id) {
          this.store
            .pipe(select(getPublicViewMode))
            .subscribe(viewPublic => {
              if (viewPublic) {
                this.store.dispatch(
                  fetchDatasetAction({
                    pid: id,
                    filters: { isPublished: viewPublic }
                  })
                );
              } else {
                this.store.dispatch(fetchDatasetAction({ pid: id }));
              }
            })
            .unsubscribe();
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
      this.store.pipe(select(getCurrentUser)).subscribe(user => {
        if (user) {
          this.user = user;
        }
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
