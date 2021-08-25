import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
} from "@angular/core";
import { select, Store } from "@ngrx/store";
import { first, switchMap } from "rxjs/operators";

import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import {
  clearBatchAction,
  prefillBatchAction,
  removeFromBatchAction,
} from "state-management/actions/datasets.actions";
import { Dataset, MessageType } from "state-management/models";
import { showMessageAction } from "state-management/actions/user.actions";

import { Router } from "@angular/router";
import { ArchivingService } from "../archiving.service";
import { Observable, Subscription } from "rxjs";
import { DatasetApi } from "shared/sdk/services/custom/Dataset";

import { MatDialog } from "@angular/material/dialog";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { MatChipInputEvent } from "@angular/material/chips";
import { APP_CONFIG, AppConfig } from "app-config.module";

export interface Share {
  name: string;
}
@Component({
  selector: "batch-view",
  templateUrl: "./batch-view.component.html",
  styleUrls: ["./batch-view.component.scss"],
})
export class BatchViewComponent implements OnInit, OnDestroy {

  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  shareEmails: Share[] = [];
  datasetList: Dataset[] = [];

  visibleColumns: string[] = ["remove", "pid", "sourceFolder", "creationTime"];

  batch$: Observable<Dataset[]> = this.store.pipe(select(getDatasetsInBatch));
  subscriptions: Subscription[] = [];
  public hasBatch = false;

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
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
