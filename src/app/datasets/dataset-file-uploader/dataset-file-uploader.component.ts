import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import {
  PickedFile,
  SubmitCaptionEvent,
} from "shared/modules/file-uploader/file-uploader.component";
import { Attachment, Dataset, User } from "shared/sdk";
import { OwnershipService } from "shared/services/ownership.service";
import {
  addAttachmentAction,
  removeAttachmentAction,
  updateAttachmentCaptionAction,
} from "state-management/actions/datasets.actions";
import {
  selectCurrentAttachments,
  selectCurrentDataset,
} from "state-management/selectors/datasets.selectors";
import { selectCurrentUser } from "state-management/selectors/user.selectors";

@Component({
  selector: "app-dataset-file-uploader",
  templateUrl: "./dataset-file-uploader.component.html",
  styleUrls: ["./dataset-file-uploader.component.scss"],
})
export class DatasetFileUploaderComponent implements OnInit, OnDestroy {
  attachments: Attachment[] = [];
  subscriptions: Subscription[] = [];
  attachment: Partial<Attachment> = {};
  dataset: Dataset | undefined;
  user: User | undefined;
  constructor(
    private store: Store,
    private ownershipService: OwnershipService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.store.select(selectCurrentDataset).subscribe((dataset) => {
        if (dataset) {
          this.dataset = dataset;
          this.ownershipService.checkDatasetAccess(
            dataset,
            this.store,
            this.router,
          );
        }
      }),
    );
    this.subscriptions.push(
      this.store.select(selectCurrentUser).subscribe((user) => {
        if (user) {
          this.user = user;
        }
      }),
    );
    this.subscriptions.push(
      this.store.select(selectCurrentAttachments).subscribe((attachments) => {
        this.attachments = attachments;
      }),
    );
  }
  onFileUploaderFilePicked(file: PickedFile) {
    if (this.dataset && this.user) {
      this.attachment = {
        thumbnail: file.content,
        caption: file.name,
        ownerGroup: this.dataset.ownerGroup,
        accessGroups: this.dataset.accessGroups,
        datasetId: this.dataset.pid,
      };
      this.store.dispatch(addAttachmentAction({ attachment: this.attachment }));
    }
  }

  updateCaption(event: SubmitCaptionEvent) {
    if (this.dataset) {
      this.store.dispatch(
        updateAttachmentCaptionAction({
          datasetId: this.dataset.pid,
          attachmentId: event.attachmentId,
          caption: event.caption,
        }),
      );
    }
  }
  deleteAttachment(attachmentId: string) {
    if (this.dataset) {
      this.store.dispatch(
        removeAttachmentAction({ datasetId: this.dataset.pid, attachmentId }),
      );
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
