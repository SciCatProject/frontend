import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { first, switchMap } from "rxjs/operators";

import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import {
  appendToDatasetArrayFieldAction,
  clearBatchAction,
  prefillBatchAction,
  removeFromBatchAction,
} from "state-management/actions/datasets.actions";
import { Dataset, Message, MessageType } from "state-management/models";
import { showMessageAction } from "state-management/actions/user.actions";

import { Router } from "@angular/router";
import { ArchivingService } from "../archiving.service";
import { Observable, Subscription } from "rxjs";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { MatDialog } from "@angular/material/dialog";
import {
  ShareDialogComponent,
  ShareUser,
} from "datasets/share-dialog/share-dialog.component";

export interface Share {
  name: string;
}
@Component({
  selector: "batch-view",
  templateUrl: "./batch-view.component.html",
  styleUrls: ["./batch-view.component.scss"],
})
export class BatchViewComponent implements OnInit, OnDestroy {
  batch$: Observable<Dataset[]> = this.store.pipe(select(getDatasetsInBatch));
  subscriptions: Subscription[] = [];
  datasetList: Dataset[] = [];
  public hasBatch = false;
  visibleColumns: string[] = ["remove", "pid", "sourceFolder", "creationTime"];
  shareEnabled = this.appConfig.shareEnabled;

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private dialog: MatDialog,
    private store: Store<any>,
    private archivingSrv: ArchivingService,
    private router: Router
  ) {}

  private clearBatch() {
    this.store.dispatch(clearBatchAction());
  }

  onEmpty() {
    const msg =
      "Are you sure that you want to remove all datasets from the batch?";
    if (confirm(msg)) {
      this.clearBatch();
    }
  }

  onRemove(dataset: Dataset) {
    this.store.dispatch(removeFromBatchAction({ dataset }));
  }

  onPublish() {
    this.router.navigate(["datasets", "batch", "publish"]);
  }

  onShare() {
    const dialogRef = this.dialog.open(ShareDialogComponent, {
      width: "500px",
    });
    dialogRef.afterClosed().subscribe((result: Record<string, ShareUser[]>) => {
      if (result && result.users && result.users.length > 0) {
        const data = result.users.map((user) => user.username);
        this.datasetList.forEach((dataset) => {
          this.store.dispatch(
            appendToDatasetArrayFieldAction({
              pid: encodeURIComponent(dataset.pid),
              fieldName: "sharedWith",
              data,
            })
          );
          const message = new Message(
            "Datasets successfully shared!",
            MessageType.Success,
            5000
          );
          this.store.dispatch(showMessageAction({ message }));
        });
      }
    });
  }

  onArchive() {
    this.batch$
      .pipe(
        first(),
        switchMap((datasets) => this.archivingSrv.archive(datasets))
      )
      .subscribe(
        () => this.clearBatch(),
        (err) =>
          this.store.dispatch(
            showMessageAction({
              message: {
                type: MessageType.Error,
                content: err.message,
                duration: 5000,
              },
            })
          )
      );
  }

  onRetrieve() {
    this.batch$
      .pipe(
        first(),
        switchMap((datasets) =>
          this.archivingSrv.retrieve(datasets, "/archive/retrieve")
        )
      )
      .subscribe(
        () => this.clearBatch(),
        (err) =>
          this.store.dispatch(
            showMessageAction({
              message: {
                type: MessageType.Error,
                content: err.message,
                duration: 5000,
              },
            })
          )
      );
  }

  ngOnInit() {
    this.store.dispatch(prefillBatchAction());
    this.subscriptions.push(
      this.batch$.subscribe((result) => {
        if (result) {
          this.datasetList = result;
          this.hasBatch = result.length > 0;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
