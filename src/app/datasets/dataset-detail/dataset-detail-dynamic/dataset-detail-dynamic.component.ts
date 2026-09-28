import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from "@angular/core";

import { MatDialog } from "@angular/material/dialog";
import { createSelector, Store } from "@ngrx/store";
import { Subscription, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { showMessageAction } from "state-management/actions/user.actions";
import {
  selectCurrentAttachments,
  selectCurrentDataset,
  selectCurrentDatasetWithoutFileInfo,
} from "state-management/selectors/datasets.selectors";
import { selectCurrentProposal } from "state-management/selectors/proposals.selectors";
import { fetchProposalAction } from "state-management/actions/proposals.actions";
import {
  selectCurrentUser,
  selectCurrentUserName,
  selectIsLoading,
  selectProfile,
} from "state-management/selectors/user.selectors";
import { selectCurrentInstrument } from "state-management/selectors/instruments.selectors";
import { selectCurrentLogbook } from "state-management/selectors/logbooks.selectors";
import { fetchDatasetLogbookAction } from "state-management/actions/logbooks.actions";

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
import { OutputDatasetObsoleteDto } from "@scicatproject/scicat-sdk-ts-angular/model/outputDatasetObsoleteDto";
import {
  Instrument,
  ReturnedUserDto,
} from "@scicatproject/scicat-sdk-ts-angular";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "shared/services/auth/auth.service";
import {
  ActionItemDataset,
  ActionItems,
} from "shared/modules/configurable-actions/configurable-action.interfaces";

// profile.selectors.ts
export const selectProfileAccessGroups = createSelector(
  selectProfile,
  (profile) => profile?.accessGroups || [],
);

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
  logbook$ = this.store.select(selectCurrentLogbook);
  loading$ = this.store.select(selectIsLoading);
  show = false;

  userGroups$ = this.store.select(selectProfileAccessGroups);

  user: ReturnedUserDto | undefined;
  currentUserName = "";
  get canUseMessageLog(): boolean {
    return this.authService.isAuthenticated() || !!this.user?.id;
  }

  instrument: Instrument | undefined;
  dataset: OutputDatasetObsoleteDto | undefined;
  proposalName = "";
  messageLogPrefix = "";
  messageLogDraft = "";
  private logbookMessages: any[] = [];
  private pendingMessages: any[] = [];
  @ViewChild("messageLog", { static: false }) messageLog?: ElementRef<HTMLElement>;
  @ViewChild("messageLogInput", { static: false }) messageLogInput?: ElementRef<HTMLElement>;

  actionItems: ActionItems = {
    datasets: [],
    instruments: undefined,
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
    private http: HttpClient,
    private authService: AuthService,
  ) {
    this.tileRestrictedIconVisible =
      this.appConfig.datasetDetailComponent?.tileRestrictedIconVisible ?? false;
    this.tileRestrictedIconGroups =
      this.appConfig.datasetDetailComponent?.tileRestrictedIconGroups ?? [];
  }

  postMessage(): void {
    if (!this.canUseMessageLog) {
      this.snackBar.open("You must be logged in to use the message log.", "Close", {
        duration: 3000,
      });
      return;
    }

    const comment = this.messageLogDraft.trim();
    if (!comment || !this.dataset?.proposalId || !this.dataset?.pid) return;
    const metadataPrefix = this.messageLogPrefix;
    const datasetPid = this.dataset.pid;
    const message = `${metadataPrefix}${comment}`;
    const senderName =
      this.currentUserName ||
      this.user?.username ||
      this.authService.getCurrentUserData()?.username ||
      this.authService.getCurrentUserData()?.email ||
      "You";

    const pendingMessage = {
      senderName,
      datasetPid,
      origin_server_ts: Date.now(),
      content: {
        msgtype: "m.text",
        body: message,
        metadataPrefix,
        datasetPid,
      },
    };
    this.pendingMessages = [...this.pendingMessages, pendingMessage];
    this.messageLogPrefix = "";
    this.messageLogDraft = "";
    this.clearMessageEditor();

    this.http
      .post(
        `/api/v3/logbooks/${encodeURIComponent(this.dataset.proposalId)}/message`,
        { message, metadataPrefix, senderName, datasetPid },
        { headers: this.messageHeaders() },
      )
      .subscribe({
        next: () => {
          this.pendingMessages = this.pendingMessages.filter(
            (entry) => entry !== pendingMessage,
          );
          this.store.dispatch(fetchDatasetLogbookAction({ pid: this.dataset.pid }));
        },
        error: () => {
          this.pendingMessages = this.pendingMessages.filter(
            (entry) => entry !== pendingMessage,
          );
          this.snackBar.open("Unable to save message", "Close", { duration: 3000 });
        },
      });
  }

  startMetadataComment(metadataName: string): void {
    if (!this.canUseMessageLog) {
      this.snackBar.open("You must be logged in to use the message log.", "Close", {
        duration: 3000,
      });
      return;
    }

    this.messageLogPrefix = `${metadataName} - `;
    this.messageLogDraft = "";
    setTimeout(() => {
      this.messageLog?.nativeElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      this.messageLogInput?.nativeElement.focus();
    });
  }

  viewMetadataComments(metadataName: string): void {
    const message = this.visibleMessages.find(
      (entry) => this.messagePrefix(entry) === `${metadataName} - `,
    );
    if (!message) return;

    setTimeout(() => {
      document
        .getElementById(this.messageAnchor(message))
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  onMessageDraftChange(event: Event): void {
    this.messageLogDraft = (event.target as HTMLElement).innerText.trimStart();
  }

  private clearMessageEditor(): void {
    if (this.messageLogInput) {
      this.messageLogInput.nativeElement.textContent = "";
    }
  }

  messagePrefix(message: any): string {
    return message.content?.metadataPrefix || "";
  }

  messageAnchor(message: any): string {
    return `message-log-${message.event_id || message.origin_server_ts}`;
  }

  get commentedMetadataNames(): string[] {
    return this.visibleMessages
      .map((message) => this.messagePrefix(message).replace(/ - $/, ""))
      .filter(Boolean);
  }

  get metadataCommentMap(): Record<string, string> {
    const map: Record<string, string> = {};
    this.visibleMessages.forEach((message) => {
      const prefix = this.messagePrefix(message);
      if (!prefix || !prefix.endsWith(" - ")) {
        return;
      }
      const metadataName = prefix.slice(0, -3);
      const text = this.messageText(message).trim();
      if (metadataName && text) {
        map[metadataName] = text;
      }
    });
    return map;
  }

  messageText(message: any): string {
    const prefix = this.messagePrefix(message);
    const body = message.content?.body || "";
    return prefix && body.startsWith(prefix) ? body.slice(prefix.length) : body;
  }

  get visibleMessages(): any[] {
    const currentPid = this.dataset?.pid;
    const all = [...this.logbookMessages, ...this.pendingMessages].sort(
      (left, right) => right.origin_server_ts - left.origin_server_ts,
    );
    if (!currentPid) {
      return all;
    }
    return all.filter((message) => {
      const msgPid = message.datasetPid || message.content?.datasetPid;
      if (msgPid) {
        return msgPid === currentPid;
      }
      const prefix = this.messagePrefix(message);
      if (prefix && prefix.endsWith(" - ")) {
        return false;
      }
      return true;
    });
  }

  private messageHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `${this.appConfig.accessTokenPrefix || "Bearer "}${this.authService.getAccessTokenId()}`,
    });
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

    this.subscriptions.push(
      this.store.select(selectCurrentUserName).subscribe((name) => {
        this.currentUserName = name || "";
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

    this.datasetView$ = this.userGroups$.pipe(
      map((userGroups) =>
        sortedDatasetView
          .filter((section) => this.showTile(section, userGroups))
          .map((section) => ({
            ...section,
            restrictedIconVisible: this.showRestrictedIcon(section, userGroups),
          })),
      ),
    );

    this.subscriptions.push(
      this.store.select(selectCurrentInstrument).subscribe((instrument) => {
        if (instrument) {
          console.log("Updatding action items");
          this.actionItems.instruments = [instrument];
        }
        this.instrument = instrument;
      }),
    );

    this.subscriptions.push(
      this.dataset$.subscribe((dataset) => {
        if (dataset) {
          console.log("Updatding action items");
          this.actionItems.datasets = <ActionItemDataset[]>[dataset];
          this.proposalName = "";
          if (dataset.proposalId) {
            this.store.dispatch(
              fetchProposalAction({ proposalId: dataset.proposalId }),
            );
          }
          this.store.dispatch(fetchDatasetLogbookAction({ pid: dataset.pid }));
        }
        this.dataset = dataset;
      }),
    );

    this.subscriptions.push(
      this.logbook$.subscribe((logbook) => {
        this.logbookMessages = logbook?.messages || [];
      }),
    );

    this.subscriptions.push(
      this.store.select(selectCurrentProposal).subscribe((proposal) => {
        if (proposal?.proposalId === this.dataset?.proposalId) {
          this.proposalName = proposal.title || "";
        }
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

    if (path === "proposalName") {
      return this.proposalName || obj["proposalName"] || "-";
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

    if (path === "proposalName") {
      return obj["proposalId"] || "";
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
      case "proposalName":
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
