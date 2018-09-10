import { Component, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { map, first, switchMap } from "rxjs/operators";

import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import {
  PrefillBatchAction,
  ClearBatchAction,
  RemoveFromBatchAction
} from "state-management/actions/datasets.actions";
import { Dataset, MessageType } from "state-management/models";
import { ShowMessageAction } from "state-management/actions/user.actions";

import ArchivingService from "../archiving.service";
import { Router } from "@angular/router";

@Component({
  selector: "batch-view",
  templateUrl: "./batch-view.component.html",
  styleUrls: ["./batch-view.component.scss"]
})
export class BatchViewComponent implements OnInit {
  private visibleColumns = ["remove", "pid", "sourceFolder", "creationTime"];

  private batch$ = this.store.pipe(select(getDatasetsInBatch));
  private hasBatch$ = this.batch$.pipe(map(batch => batch.length > 0));

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
    this.router.navigate(['datasets', 'batch', 'publish']);
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
