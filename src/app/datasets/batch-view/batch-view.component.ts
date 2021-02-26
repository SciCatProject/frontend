import { Component, OnInit, ViewChild, TemplateRef, Inject } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { first, switchMap, mergeMap } from "rxjs/operators";

import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import {
  clearBatchAction,
  prefillBatchAction,
  removeFromBatchAction
} from "state-management/actions/datasets.actions";
import { Dataset, MessageType } from "state-management/models";
import { showMessageAction } from "state-management/actions/user.actions";

import { Router } from "@angular/router";
import { ArchivingService } from "../archiving.service";
import { Observable } from "rxjs";
import { ShareGroupApi } from "shared/sdk/services/custom/ShareGroup";
import { DatasetApi } from "shared/sdk/services/custom/Dataset";
import { ShareGroup } from "shared/sdk/models/ShareGroup";

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
  styleUrls: ["./batch-view.component.scss"]
})
export class BatchViewComponent implements OnInit {
  @ViewChild("secondDialog", { static: true }) secondDialog: TemplateRef<any>;

  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  shareEmails: Share[] = [];
  datasetList = [];

  visibleColumns: string[] = [
    "remove",
    "pid",
    "sourceFolder",
    "creationTime"
  ];

  batch$: Observable<Dataset[]> = this.store.pipe(
    select(getDatasetsInBatch)
  );
  public hasBatch: boolean;

  constructor(
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private store: Store<any>,
    private archivingSrv: ArchivingService,
    private router: Router,
    private shareGroupApi: ShareGroupApi,
    private datasetApi: DatasetApi,
    private dialog: MatDialog
  ) {}

  private clearBatch() {
    this.store.dispatch(clearBatchAction());
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || "").trim()) {
      this.shareEmails.push({ name: value.trim() });
    }

    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  remove(fruit: Share): void {
    const index = this.shareEmails.indexOf(fruit);

    if (index >= 0) {
      this.shareEmails.splice(index, 1);
    }
  }

  openDialogWithoutRef() {
    this.dialog.open(this.secondDialog);
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
    // add new share group to model and update datasets access groups
    const myShare = new ShareGroup();
    myShare.datasets = this.datasetList.map(dataset => dataset.pid);
    myShare.members = this.shareEmails.map(share => share.name);
    this.shareGroupApi
      .upsert(myShare)
      .pipe(
        mergeMap((result: any) => {
          const newShare = result as ShareGroup;
          const datasetId: string = myShare.datasets[0];
          return this.datasetApi.appendToArrayField(
            encodeURIComponent(datasetId),
            "accessGroups",
            newShare.id
          );
        })
      )
      .subscribe(
        success => {
          this.store.dispatch(
            showMessageAction({
              message: {
                type: MessageType.Success,
                content: "Share Successful",
                duration: 5000
              }
            })
          );
        },
        err => {
          return this.store.dispatch(
            showMessageAction({
              message: {
                type: MessageType.Error,
                content: "Share Failed",
                duration: 5000
              }
            })
          );
        }
      );
  }

  onArchive() {
    this.batch$
      .pipe(
        first(),
        switchMap(datasets => this.archivingSrv.archive(datasets))
      )
      .subscribe(
        () => this.clearBatch(),
        err =>
          this.store.dispatch(
            showMessageAction({
              message: {
                type: MessageType.Error,
                content: err.message,
                duration: 5000
              }
            })
          )
      );
  }

  onRetrieve() {
    this.batch$
      .pipe(
        first(),
        switchMap(datasets =>
          this.archivingSrv.retrieve(datasets, "/archive/retrieve")
        )
      )
      .subscribe(
        () => this.clearBatch(),
        err =>
          this.store.dispatch(
            showMessageAction({
              message: {
                type: MessageType.Error,
                content: err.message,
                duration: 5000
              }
            })
          )
      );
  }

  ngOnInit() {
    this.store.dispatch(prefillBatchAction());
    this.batch$.subscribe(result => {
      if (result) {
        this.datasetList = result;
        this.hasBatch = result.length > 0;
      }
    });
  }
}
