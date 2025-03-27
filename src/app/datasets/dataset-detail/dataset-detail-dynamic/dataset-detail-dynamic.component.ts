import { Component, OnInit } from "@angular/core";

import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";

import { showMessageAction } from "state-management/actions/user.actions";
import {
  selectCurrentAttachments,
  selectCurrentDataset,
  selectCurrentDatasetWithoutFileInfo,
} from "state-management/selectors/datasets.selectors";
import { selectIsLoading } from "state-management/selectors/user.selectors";

import { AppConfigService } from "app-config.service";

import { FormBuilder, FormGroup } from "@angular/forms";
import {
  CustomizationItem,
  DatasetViewFieldType,
  Message,
  MessageType,
} from "state-management/models";

import { AttachmentService } from "shared/services/attachment.service";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";

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
export class DatasetDetailDynamicComponent implements OnInit {
  datasetView: CustomizationItem[];
  form: FormGroup;
  cols = 10;
  gutterSize = 12;

  appConfig = this.appConfigService.getConfig();

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
    private datePipe: DatePipe,
    private store: Store,
    private fb: FormBuilder,
  ) {
    this.translateService.use("datasetCustom");
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

  onCopy(value: string) {
    navigator.clipboard.writeText(value).then(
      () => {
        const message = new Message(
          "Selected field has been copied to your clipboard",
          MessageType.Success,
          5000,
        );
        this.store.dispatch(showMessageAction({ message }));
      },
      (err) => {
        const errorMessage = new Message(
          "Failed to copy selected field to clipboard",
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

  isUnsupportedFieldType(fieldType: string): boolean {
    const supportedTypes = Object.values(DatasetViewFieldType) as string[];
    return !supportedTypes.includes(fieldType);
  }

  handleFieldValue(
    fieldType: string,
    value: string | string[],
  ): string | string[] {
    const errorElement = `<span class="general-warning">Unsupported data type</span>`;

    switch (fieldType) {
      case DatasetViewFieldType.TEXT:
        return typeof value === "string" ? value : JSON.stringify(value);
      case DatasetViewFieldType.COPY:
        return typeof value === "string" ? value : JSON.stringify(value);
      case DatasetViewFieldType.LINKY:
        return typeof value === "string" ? value : errorElement;
      case DatasetViewFieldType.DATE:
        return this.transformDate(value, errorElement);
      case DatasetViewFieldType.TAG:
        if (Array.isArray(value)) {
          return value.length > 0 ? value : ["-"];
        }
        return typeof value === "string" ? [value] : ["Unsupported data type"];
      default:
        return "Unsupported data type";
    }
  }
  transformDate(value: unknown, errorElement: string): string {
    if (typeof value !== "string") {
      return errorElement;
    }
    try {
      return this.datePipe.transform(value, "yyyy-MM-dd HH:mm");
    } catch {
      return errorElement;
    }
  }
  getThumbnailSize(value: string): string {
    return value ? `thumbnail-image--${value}` : "";
  }
}
