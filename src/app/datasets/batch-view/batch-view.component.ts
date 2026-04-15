import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";

import { selectDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import {
  appendToDatasetArrayFieldAction,
  clearBatchAction,
  prefillBatchAction,
  removeFromBatchAction,
  storeBatchAction,
} from "state-management/actions/datasets.actions";
import { Message, MessageType } from "state-management/models";
import { showMessageAction } from "state-management/actions/user.actions";
import { DialogComponent } from "shared/modules/dialog/dialog.component";

import { ActivatedRoute, Router } from "@angular/router";
import { Observable, Subscription, combineLatest } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { ShareDialogComponent } from "datasets/share-dialog/share-dialog.component";
import { AppConfigService } from "app-config.service";
import { ArchivingService } from "datasets/archiving.service";
import {
  selectIsAdmin,
  selectProfile,
} from "state-management/selectors/user.selectors";
import { OutputDatasetObsoleteDto } from "@scicatproject/scicat-sdk-ts-angular";
import { resyncPublishedDataAction } from "state-management/actions/published-data.actions";
import {
  ActionConfig,
  ActionExecutionContext,
  ActionItemDataset,
  ActionItems,
  ActionValue,
} from "shared/modules/configurable-actions/configurable-action.interfaces";

@Component({
  selector: "batch-view",
  templateUrl: "./batch-view.component.html",
  styleUrls: ["./batch-view.component.scss"],
  standalone: false,
})
export class BatchViewComponent implements OnInit, OnDestroy {
  batch$: Observable<OutputDatasetObsoleteDto[]> = this.store.select(
    selectDatasetsInBatch,
  );
  userProfile$ = this.store.select(selectProfile);
  isAdmin$ = this.store.select(selectIsAdmin);
  params$ = this.route.queryParams;
  isAdmin = false;
  userProfile: any = {};
  subscriptions: Subscription[] = [];
  editingPublishedDataDoi = null;

  appConfig = this.appConfigService.getConfig();
  shareEnabled = this.appConfig.shareEnabled;
  markForDeletion = this.appConfig.markForDeletionCodes?.length > 0;
  batchActionsEnabled = this.appConfig.batchActionsEnabled;
  batchActionsConfig: ActionConfig[] = this.appConfig.batchActions ?? [];
  actionItems: ActionItems = {
    datasets: [],
    handlers: {
      openRetrieveForm: () => this.openRetrieveForm(),
      clearBatch: () => this.clearBatch(),
      showRetrieveError: (context) => this.showRetrieveError(context),
    },
  };

  datasetList: OutputDatasetObsoleteDto[] = [];
  public hasBatch = false;
  visibleColumns: string[] = ["remove", "pid", "sourceFolder", "creationTime"];

  constructor(
    public appConfigService: AppConfigService,
    private dialog: MatDialog,
    private store: Store,
    private archivingSrv: ArchivingService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  get filteredBatchActions(): ActionConfig[] {
    return this.batchActionsConfig.filter(
      (action) => !action.requiresMarkForDeletionCodes || this.markForDeletion,
    );
  }

  private clearBatch() {
    this.store.dispatch(clearBatchAction());
  }

  private storeBatch(datasetUpdatedBatch: OutputDatasetObsoleteDto[]) {
    this.store.dispatch(storeBatchAction({ batch: datasetUpdatedBatch }));
  }

  onEmpty() {
    const msg =
      "Are you sure that you want to remove all datasets from the batch?";
    if (confirm(msg)) {
      this.clearBatch();
    }
  }

  onRemove(dataset: OutputDatasetObsoleteDto) {
    this.store.dispatch(removeFromBatchAction({ dataset }));
  }

  onPublish() {
    this.router.navigate(["datasets", "selection", "publish"]);
  }

  onShareClick() {
    this.router.navigate([], {
      queryParams: { share: "true" },
      queryParamsHandling: "merge",
    });
  }

  onShare() {
    const shouldHaveInfoMessage =
      !this.isAdmin &&
      this.datasetList.some(
        (item) =>
          item.ownerEmail !== this.userProfile.email &&
          !this.userProfile.accessGroups.includes(item.ownerGroup),
      );

    const disableShareButton =
      !this.isAdmin &&
      this.datasetList.every(
        (item) =>
          item.ownerEmail !== this.userProfile.email &&
          !this.userProfile.accessGroups.includes(item.ownerGroup),
      );

    const sharedUsersList = this.datasetList
      .map((item) => item.sharedWith)
      .flat()
      .filter((x, i, a) => a.indexOf(x) === i);

    const infoMessage = shouldHaveInfoMessage
      ? disableShareButton
        ? "You haven't selected any dataset that you own to share."
        : "Only datasets that you own can be shared with other people."
      : "";

    const dialogRef = this.dialog.open(ShareDialogComponent, {
      width: "500px",
      data: {
        infoMessage,
        disableShareButton,
        sharedUsersList,
      },
    });
    dialogRef.afterClosed().subscribe((result: Record<string, string[]>) => {
      if (result && result.users) {
        this.datasetList.forEach((dataset) => {
          // NOTE: If the logged in user is not an owner of the dataset or and not admin then skip sharing.
          if (
            (!this.isAdmin && dataset.ownerEmail !== this.userProfile.email) ||
            (!this.isAdmin &&
              !this.userProfile.accessGroups.includes(dataset.ownerGroup))
          ) {
            return;
          }

          this.store.dispatch(
            appendToDatasetArrayFieldAction({
              pid: dataset.pid,
              fieldName: "sharedWith",
              data: result.users,
            }),
          );
        });

        const datasetUpdatedBatch = this.datasetList.map((item) => ({
          ...item,
          sharedWith: result.users,
        }));

        this.clearBatch();
        this.storeBatch(datasetUpdatedBatch);

        const message = new Message(
          result.users.length
            ? "Datasets successfully shared!"
            : "Shared users successfully removed!",
          MessageType.Success,
          5000,
        );
        this.store.dispatch(showMessageAction({ message }));
      }

      this.router.navigate([], {
        queryParams: { share: null },
        queryParamsHandling: "merge",
      });
    });
  }

  private openRetrieveForm(): Promise<Record<string, ActionValue> | false> {
    return new Promise((resolve) => {
      const dialogOptions = this.archivingSrv.retriveDialogOptions(
        this.appConfig.retrieveDestinations,
      );
      const dialogRef = this.dialog.open(DialogComponent, dialogOptions);
      const destPath = { destinationPath: "/archive/retrieve" };

      dialogRef.afterClosed().subscribe((result) => {
        if (!result || !this.datasetList?.length) {
          resolve(false);
          return;
        }

        const locationOption = this.archivingSrv.generateOptionLocation(
          result,
          this.appConfig.retrieveDestinations,
        );
        const jobParams = {
          username: this.userProfile.username,
          ...destPath,
          ...(locationOption as Record<string, string>),
        };
        const retrieveJobPayload = JSON.stringify({
          jobParams,
          emailJobInitiator: this.userProfile.email,
          datasetList: this.datasetList.map((dataset) => ({
            pid: dataset.pid,
            files: [],
          })),
          type: "retrieve",
        });

        resolve({ retrieveJobPayload });
      });
    });
  }

  private showRetrieveError(context?: ActionExecutionContext): void {
    const message =
      (context?.variables?.lastErrorMessage as string) || "Retrieve failed";
    this.store.dispatch(
      showMessageAction({
        message: {
          type: MessageType.Error,
          content: message,
          duration: 5000,
        },
      }),
    );
  }

  onRetrieve() {
    const dialogOptions = this.archivingSrv.retriveDialogOptions(
      this.appConfig.retrieveDestinations,
    );
    const dialogRef = this.dialog.open(DialogComponent, dialogOptions);
    const destPath = { destinationPath: "/archive/retrieve" };
    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.datasetList) {
        const locationOption = this.archivingSrv.generateOptionLocation(
          result,
          this.appConfig.retrieveDestinations,
        );
        const extra = { ...destPath, ...locationOption };
        this.archivingSrv.retrieve(this.datasetList, extra).subscribe(
          () => this.clearBatch(),
          (err) =>
            this.store.dispatch(
              showMessageAction({
                message: {
                  type: MessageType.Error,
                  content: err.message,
                  duration: 5000,
                },
              }),
            ),
        );
      }
    });
  }

  onSaveChanges() {
    this.store.dispatch(
      resyncPublishedDataAction({
        doi: this.editingPublishedDataDoi,
        redirect: false,
        data: { datasetPids: this.datasetList.map((d) => d.pid) },
      }),
    );

    this.router.navigateByUrl(this.getPublishingDataUrl());
    this.store.dispatch(clearBatchAction());
    localStorage.removeItem("editingPublishedDataDoi");
    localStorage.removeItem("editingDatasetList");
  }

  onChangeSelection() {
    const encodedDoi = encodeURIComponent(this.editingPublishedDataDoi);

    this.router.navigateByUrl(`/publishedDatasets/${encodedDoi}/datasetList`);
  }

  onCancelEdit() {
    this.router.navigateByUrl(this.getPublishingDataUrl());
    this.store.dispatch(clearBatchAction());
    localStorage.removeItem("editingPublishedDataDoi");
    localStorage.removeItem("editingDatasetList");
  }

  getPublishingDataUrl(): string {
    const isEditingDatasetList =
      localStorage.getItem("editingDatasetList") === "true";
    const encodedDoi = encodeURIComponent(this.editingPublishedDataDoi);

    return `/publishedDatasets/${encodedDoi}${isEditingDatasetList ? "" : "/edit"}`;
  }

  ngOnInit() {
    this.editingPublishedDataDoi = localStorage.getItem(
      "editingPublishedDataDoi",
    );

    combineLatest([this.isAdmin$, this.userProfile$])
      .subscribe(([isAdmin, userProfile]) => {
        this.isAdmin = isAdmin;
        this.userProfile = userProfile;
      })
      .unsubscribe();
    this.store.dispatch(prefillBatchAction());
    this.subscriptions.push(
      this.batch$.subscribe((result) => {
        if (result) {
          this.datasetList = result;
          this.actionItems.datasets = result as ActionItemDataset[];
          this.hasBatch = result.length > 0;
        }
      }),
    );

    this.subscriptions.push(
      combineLatest([this.params$]).subscribe(([queryParams]) => {
        if (queryParams["share"] === "true") {
          this.onShare();
        }
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
