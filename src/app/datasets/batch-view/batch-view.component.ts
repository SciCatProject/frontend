import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { first, map, switchMap } from "rxjs/operators";

import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import {
  ClearBatchAction,
  PrefillBatchAction,
  RemoveFromBatchAction
} from "state-management/actions/datasets.actions";
import { Dataset, MessageType } from "state-management/models";
import { ShowMessageAction } from "state-management/actions/user.actions";

import { Router } from "@angular/router";
import { ArchivingService } from "../archiving.service";
import { Observable } from "rxjs";

@Component({
  selector: "batch-view",
  templateUrl: "./batch-view.component.html",
  styleUrls: ["./batch-view.component.scss"]
})
export class BatchViewComponent implements OnInit {
  private visibleColumns: [string, string, string, string] = [
    "remove",
    "pid",
    "sourceFolder",
    "creationTime"
  ];

  private batch$: Observable<Dataset[]> = this.store.pipe(
    select(getDatasetsInBatch)
  );
  public hasBatch$: Observable<boolean> = this.batch$.pipe(
    map(batch => batch.length > 0)
  );

  constructor(
    private store: Store<any>,
    private archivingSrv: ArchivingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.store.dispatch(new PrefillBatchAction());
  }

  onEmpty() {
    const msg =
      "Are you sure that you want to remove all datasets from the batch?";
    if (confirm(msg)) {
      this.clearBatch();
    }
  }

  onRemove(dataset: Dataset) {
    this.store.dispatch(new RemoveFromBatchAction(dataset));
  }

  onPublish() {
    this.router.navigate(["datasets", "batch", "publish"]);
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
            new ShowMessageAction({
              type: MessageType.Error,
              content: err.message
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
            new ShowMessageAction({
              type: MessageType.Error,
              content: err.message
            })
          )
      );
  }

  private clearBatch() {
    this.store.dispatch(new ClearBatchAction());
  }
}
