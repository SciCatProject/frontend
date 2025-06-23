import { Component, OnInit, OnDestroy } from "@angular/core";

import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";

import { showMessageAction } from "state-management/actions/user.actions";
import {
  selectCurrentAttachments,
  selectCurrentDataset,
  selectCurrentDatasetWithoutFileInfo,
} from "state-management/selectors/datasets.selectors";
import { selectIsLoading } from "state-management/selectors/user.selectors";
import { selectCurrentInstrument } from "state-management/selectors/instruments.selectors";

import { AppConfigService } from "app-config.service";

import { FormBuilder, FormGroup } from "@angular/forms";
import {
  CustomizationItem,
  DatasetViewFieldType,
  InternalLinkType,
  Message,
  MessageType,
} from "state-management/models";

import { AttachmentService } from "shared/services/attachment.service";
import { TranslateService } from "@ngx-translate/core";
import { DatePipe } from "@angular/common";
import { OutputDatasetObsoleteDto } from "@scicatproject/scicat-sdk-ts-angular/model/outputDatasetObsoleteDto";
import { Instrument } from "@scicatproject/scicat-sdk-ts-angular";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";

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
  cols = 10;
  gutterSize = 12;

  appConfig = this.appConfigService.getConfig();

  dataset$ = this.store.select(selectCurrentDataset);
  datasetWithout$ = this.store.select(selectCurrentDatasetWithoutFileInfo);
  attachments$ = this.store.select(selectCurrentAttachments);
  loading$ = this.store.select(selectIsLoading);
  show = false;

  instrument: Instrument | undefined;

  constructor(
    public appConfigService: AppConfigService,
    public dialog: MatDialog,
    private attachmentService: AttachmentService,
    private translateService: TranslateService,
    private datePipe: DatePipe,
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
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

    this.subscriptions.push(
      this.store.select(selectCurrentInstrument).subscribe((instrument) => {
        this.instrument = instrument;
      }),
    );
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
          return value.length > 0 ? value : [null];
        }
        return typeof value === "string" ? [value] : ["Unsupported data type"];
      case DatasetViewFieldType.INTERNALLINK:
        if (Array.isArray(value)) {
          return value.length > 0 ? value : [null];
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
  getNestedValue(
    obj: OutputDatasetObsoleteDto,
    path: string,
  ): string | string[] {
    if (!path) {
      return "field source is missing";
    }
    if (!obj) {
      return null;
    }

    if (path === "instrumentName" && this.instrument) {
      return this.instrument.name || "-";
    }

    return path
      .split(".")
      .reduce((prev, curr) => (prev != null ? prev[curr] : undefined), obj);
  }

  getInternalLinkValue(obj: OutputDatasetObsoleteDto, path: string): string {
    // For instrumentName internal links, return the instrument ID instead of the name
    if (path === "instrumentName" && this.instrument) {
      return this.instrument.pid || "";
    }

    const value = this.getNestedValue(obj, path);
    return Array.isArray(value) ? value[0] || "" : (value as string) || "";
  }

  onClickInternalLink(internalLinkType: string, id: string): void {
    const encodedId = encodeURIComponent(id);

    switch (internalLinkType) {
      case InternalLinkType.DATASETS:
        this.router.navigateByUrl("/datasets/" + encodedId);
        break;
      case InternalLinkType.SAMPLES:
        this.router.navigateByUrl("/samples/" + encodedId);
        break;
      case InternalLinkType.PROPOSALS:
        this.router.navigateByUrl("/proposals/" + encodedId);
        break;
      case InternalLinkType.INSTRUMENTS:
      case InternalLinkType.INSTRUMENTS_NAME:
        this.router.navigateByUrl("/instruments/" + encodedId);
        break;
      default:
        this.snackBar.open("The URL is not valid", "Close", {
          duration: 2000,
        });
        break;
    }
  }

  getScientificMetadata(
    dataset: OutputDatasetObsoleteDto,
    source?: string,
  ): any {
    const meta = dataset?.scientificMetadata;
    if (!meta) return null;
    if (!source) return meta;

    const path = source.replace(/^scientificMetadata\./, "");
    if (!path || source === "scientificMetadata") return meta;

    const result =
      path.split(".").reduce((acc, key) => (acc as any)?.[key], meta) ?? null;

    // Ensure the result is a valid object for metadata display
    return result && typeof result === "object" ? result : null;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
