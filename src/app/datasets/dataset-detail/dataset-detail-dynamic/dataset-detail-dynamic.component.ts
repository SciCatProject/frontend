import { Component, OnInit, OnDestroy } from "@angular/core";

import { MatDialog } from "@angular/material/dialog";
import { Subscription } from "rxjs";
import { Store } from "@ngrx/store";

import { showMessageAction } from "state-management/actions/user.actions";
import {
  selectCurrentAttachments,
  selectCurrentDataset,
  selectCurrentDatasetWithoutFileInfo,
} from "state-management/selectors/datasets.selectors";
import { selectIsLoading } from "state-management/selectors/user.selectors";
import {
  addKeywordFilterAction,
  clearFacetsAction,
} from "state-management/actions/datasets.actions";
import { Router } from "@angular/router";

import { AppConfigService } from "app-config.service";

import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import {
  CustomizationItem,
  DatasetViewFieldType,
  Message,
  MessageType,
} from "state-management/models";

import { AttachmentService } from "shared/services/attachment.service";
import { TranslateService } from "@ngx-translate/core";
import { Attachment } from "@scicatproject/scicat-sdk-ts";

/**
 * Component to show customizable details for a dataset, using the
 * form component
 * @export
 * @class DatasetDetailDynamicComponent
 */
@Component({
  selector: "dataset-detail-dynamic",
  templateUrl: "./dataset-detail-dynamic.component.html",
  styleUrls: ["./dataset-detail-dynamic.component.scss"],
  standalone: false,
})
export class DatasetDetailDynamicComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  datasetView: CustomizationItem[];
  form: FormGroup;

  appConfig = this.appConfigService.getConfig();
  enabledAttachmentsDisplay =
    this.appConfig.datasetDetailComponent?.enableAttachmentsInDatasetDetails;

  dataset$ = this.store.select(selectCurrentDataset);
  datasetWithout$ = this.store.select(selectCurrentDatasetWithoutFileInfo);
  attachments$ = this.store.select(selectCurrentAttachments);
  loading$ = this.store.select(selectIsLoading);
  show = false;

  constructor(
    public appConfigService: AppConfigService,
    public dialog: MatDialog,
    private attachmentService: AttachmentService,
    private translateService: TranslateService,
    private store: Store,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.translateService.use(
      this.appConfig.datasetDetailViewLabelOption?.currentLabelSet,
    );
  }

  ngOnInit() {
    this.form = this.fb.group({});

    const sortedDatasetView = (
      this.appConfig.datasetDetailComponent?.customization || []
    ).sort((a, b) => a.order - b.order);
    sortedDatasetView.forEach((section) => {
      if (section.fields && Array.isArray(section.fields)) {
        section.fields.sort((a, b) => a.order - b.order);
      }
    });

    this.datasetView = sortedDatasetView;
  }

  onClickKeyword(keyword: string) {
    this.store.dispatch(clearFacetsAction());
    this.store.dispatch(addKeywordFilterAction({ keyword }));
    this.router.navigateByUrl("/datasets");
  }

  get keywords(): FormArray {
    return this.form.controls.keywords as FormArray;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  onCopy(value: string) {
    navigator.clipboard.writeText(value).then(
      () => {
        const message = new Message(
          "Dataset PID has been copied to your clipboard",
          MessageType.Success,
          5000,
        );
        this.store.dispatch(showMessageAction({ message }));
      },
      (err) => {
        const errorMessage = new Message(
          "Failed to copy Dataset PID to clipboard",
          MessageType.Error,
          5000,
        );
        this.store.dispatch(showMessageAction({ message: errorMessage }));
        console.error("Could not copy text: ", err);
      },
    );
  }
  base64MimeType(encoded: string): string {
    return this.attachmentService.base64MimeType(encoded);
  }

  getImageUrl(encoded: string) {
    return this.attachmentService.getImageUrl(encoded);
  }

  openAttachment(encoded: string) {
    this.attachmentService.openAttachment(encoded);
  }

  hideAttachmentsThumbnail(attachments: Attachment[] = []) {
    return !this.enabledAttachmentsDisplay || attachments.length < 1
      ? true
      : false;
  }

  isUnsupportedFieldType(fieldType: string): boolean {
    const supportedTypes = Object.values(DatasetViewFieldType) as string[];
    return !supportedTypes.includes(fieldType);
  }

  handleFieldValue(
    fieldType: string,
    value: string | string[],
  ): string | string[] {
    switch (fieldType) {
      case DatasetViewFieldType.TEXT:
        return typeof value === "string" ? value : JSON.stringify(value);
      case DatasetViewFieldType.COPY:
        return typeof value === "string" ? value : JSON.stringify(value);
      case DatasetViewFieldType.LINKY:
        return typeof value === "string" ? value : "Unsupported data type";
      case DatasetViewFieldType.DATE:
        return typeof value === "string" ? value : "Unsupported data type";
      case DatasetViewFieldType.TAG:
        if (Array.isArray(value)) {
          return value.length > 0 ? value : ["-"];
        }
        return typeof value === "string" ? [value] : ["Unsupported data type"];
      default:
        return "Unsupported data type";
    }
  }
}
