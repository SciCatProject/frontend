import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from "@angular/core";

import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { Subscription, Observable, combineLatest } from "rxjs";
import { filter, map } from "rxjs/operators";

import { showMessageAction } from "state-management/actions/user.actions";
import {
  selectCurrentAttachments,
  selectCurrentDataset,
  selectCurrentDatasetWithoutFileInfo,
} from "state-management/selectors/datasets.selectors";
import {
  selectCurrentUser,
  selectIsLoading,
  selectUserAccessGroups,
} from "state-management/selectors/user.selectors";

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
import { DatePipe } from "@angular/common";
import { ReturnedUserDto } from "@scicatproject/scicat-sdk-ts-angular";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  ActionItemDataset,
  ActionItems,
} from "shared/modules/configurable-actions/configurable-action.interfaces";
import { CurrentDataset } from "state-management/state/datasets.store";

const RELATION_CONFIG: Record<
  string,
  { lookupField: string; idField: string; labelField: string }
> = {
  proposalIds: {
    lookupField: "proposals",
    idField: "proposalId",
    labelField: "title",
  },
  sampleIds: {
    lookupField: "samples",
    idField: "sampleId",
    labelField: "description",
  },
  instrumentIds: {
    lookupField: "instruments",
    idField: "pid",
    labelField: "name",
  },
};

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatasetDetailDynamicComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  datasetView$: Observable<CustomizationItem[]>;
  form: FormGroup;
  cols = 10;
  gutterSize = 12;

  appConfig = this.appConfigService.getConfig();

  localization = "dataset";
  tileRestrictedIconVisible: boolean;
  tileRestrictedIconGroups: string[];

  dataset$ = this.store.select(selectCurrentDataset);
  datasetWithout$ = this.store.select(selectCurrentDatasetWithoutFileInfo);
  attachments$ = this.store.select(selectCurrentAttachments);
  loading$ = this.store.select(selectIsLoading);
  userGroups$ = this.store.select(selectUserAccessGroups);

  showJsonMetadata = false;

  user: ReturnedUserDto | undefined;

  dataset: CurrentDataset | undefined;

  actionItems: ActionItems = {
    datasets: [],
    instruments: [],
  };

  constructor(
    public appConfigService: AppConfigService,
    public dialog: MatDialog,
    private attachmentService: AttachmentService,
    private datePipe: DatePipe,
    private store: Store,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {
    this.tileRestrictedIconVisible =
      this.appConfig.datasetDetailComponent?.tileRestrictedIconVisible ?? false;
    this.tileRestrictedIconGroups =
      this.appConfig.datasetDetailComponent?.tileRestrictedIconGroups ?? [];
  }

  ngOnInit() {
    this.form = this.fb.group({});

    this.subscriptions.push(
      this.store.select(selectCurrentUser).subscribe((user) => {
        if (user) {
          this.user = user;
        }
      }),
    );

    const sortedDatasetView = (
      this.appConfig.datasetDetailComponent?.customization || []
    )
      .sort((a, b) => a.order - b.order)
      .map((section) => ({
        ...section,
        authorization: section.authorization ? [...section.authorization] : [],
        visible: section.visible ?? true,
        fields:
          section.fields && Array.isArray(section.fields)
            ? [...section.fields].sort((a, b) => a.order - b.order)
            : section.fields,
      }));

    this.datasetView$ = combineLatest([this.dataset$, this.userGroups$]).pipe(
      map(([dataset, userGroups]) =>
        sortedDatasetView
          .filter((section) => this.showTile(section, userGroups))
          .map((section) => ({
            ...section,
            restrictedIconVisible: this.showRestrictedIcon(section, userGroups),
            fields: Array.isArray(section.fields)
              ? section.fields.map((field) => {
                  const value = this.handleFieldValue(
                    field.element,
                    this.getNestedValue(dataset, field.source),
                    dataset,
                    field.source,
                  );
                  return { ...field, value, isEmpty: this.isEmpty(value) };
                })
              : undefined,
          })),
      ),
    );

    this.subscriptions.push(
      this.dataset$.pipe(filter(Boolean)).subscribe((dataset) => {
        this.dataset = dataset;
        this.actionItems.datasets = <ActionItemDataset[]>[dataset];
        this.actionItems.instruments = dataset.instruments ?? [];
      }),
    );
  }

  /**
   * Checks if the current user can view a block based on authorization
   * @param blockAuthorization - Optional array of group names from block.authorization
   * @param userGroups - Array of groups the current user belongs to
   * @returns true if user can view the block
   */
  showTile(section: CustomizationItem, userGroups: string[]): boolean {
    if (!section.visible) {
      return false;
    }

    if (!section.authorization || section.authorization.length === 0) {
      return true;
    }

    if (!this.user) {
      return false;
    }

    return section.authorization.some((group) => userGroups.includes(group));
  }

  /**
   * Checks if a section has restricted access and should show the lock icon
   * @param section - The customization item/section to check
   * @returns true if the section is restricted and the feature is enabled
   */
  showRestrictedIcon(
    section: CustomizationItem,
    userGroups: string[],
  ): boolean {
    if (!this.tileRestrictedIconVisible) {
      // the icon is disabled by configuration
      return false;
    }
    if (!section.authorization || section.authorization.length === 0) {
      return false;
    }
    if (this.tileRestrictedIconGroups.length == 0) {
      // the icon is visible to everybody
      return true;
    }
    // check if any of the user groups is listed in the group who can see the icon
    return this.tileRestrictedIconGroups.some((group) =>
      userGroups.includes(group),
    );
  }

  /**
   * Formats authorization groups for tooltip display as a comma-separated list.
   * Shows group names as they are defined in configuration.
   *
   * @param groups - Array of group names with access, or undefined
   * @returns Comma-separated string of group names, or empty string
   */
  formatAuthorizedGroups(groups: string[] | undefined): string {
    if (!groups || groups.length === 0) {
      return "";
    }
    return groups.join(", ");
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

  navigateToAttachmentsTab() {
    this.router.navigate(["attachments"], {
      relativeTo: this.route,
    });
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

  isEmpty(value: unknown): boolean {
    if (value == null || value === "") return true;
    if (Array.isArray(value)) {
      return (
        value.length === 0 ||
        value.every((v) => v == null || (typeof v === "object" && v.id == null))
      );
    }
    return false;
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
  getNestedValue(obj: CurrentDataset, path: string): string | string[] {
    if (!path) {
      return "field source is missing";
    }
    if (!obj) {
      return null;
    }

    return path
      .split(".")
      .reduce((prev, curr) => (prev != null ? prev[curr] : undefined), obj);
  }

  getInternalLinkValue(obj: CurrentDataset, path: string): string {
    const value = this.getNestedValue(obj, path);
    return Array.isArray(value) ? value[0] || "" : (value as string) || "";
  }

  handleFieldValue(
    fieldType: string,
    value: string | string[],
    dataset: CurrentDataset,
    source: string,
  ): string | string[] | { id: string; label: string }[] {
    const errorElement = `<span class="general-warning">Unsupported data type</span>`;

    switch (fieldType) {
      case DatasetViewFieldType.TEXT:
      case DatasetViewFieldType.COPY:
        if (Array.isArray(value)) {
          return value.length > 0 ? value.join(" , ") : null;
        }
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
        return this.getInternalLinkItems(dataset, source);

      default:
        return "Unsupported data type";
    }
  }

  onClickInternalLink(internalLinkType: string, id: string): void {
    const encodedId = encodeURIComponent(id);
    let path: string;

    switch (internalLinkType) {
      case InternalLinkType.DATASETS:
        path = "/datasets/" + encodedId;
        break;
      case InternalLinkType.SAMPLES:
        path = "/samples/" + encodedId;
        break;
      case InternalLinkType.PROPOSALS:
        path = "/proposals/" + encodedId;
        break;
      case InternalLinkType.INSTRUMENTS:
        path = "/instruments/" + encodedId;
        break;
      default:
        this.snackBar.open("The URL is not valid", "Close", { duration: 2000 });
        return;
    }
    window.open(
      this.router.serializeUrl(this.router.parseUrl(path)),
      "_blank",
      "noopener",
    );
  }

  getInternalLinkItems(
    dataset: CurrentDataset,
    source: string,
  ): { id: string; label: string }[] {
    const raw = this.getNestedValue(dataset, source);
    const ids = Array.isArray(raw) ? raw : raw != null ? [raw] : [];

    const relation = RELATION_CONFIG[source];

    if (!relation) {
      return ids.map((id) => ({ id, label: id }));
    }

    const related = (dataset[relation.lookupField] as any[]) ?? [];
    return ids.map((id) => ({
      id,
      label:
        related.find((r) => r[relation.idField] === id)?.[
          relation.labelField
        ] ?? id,
    }));
  }

  getScientificMetadata(dataset: CurrentDataset, source?: string): any {
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

  emptyMetadataTable(): boolean {
    if (this.appConfig.hideEmptyMetadataTable) {
      return (
        !!this.dataset?.scientificMetadata &&
        Object.keys(this.dataset.scientificMetadata).length > 0
      );
    }
    return true;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
