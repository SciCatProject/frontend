import { Component } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { map } from "rxjs/operators";

import { getDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { clearBatchAction } from "state-management/actions/datasets.actions";

@Component({
  selector: "batch-card",
  templateUrl: "./batch-card.component.html",
  styleUrls: ["./batch-card.component.scss"]
})
export class BatchCardComponent {
  private batch$ = this.store.pipe(select(getDatasetsInBatch));
  public batchSize$ = this.batch$.pipe(map(batch => batch.length));
  public nonEmpty$ = this.batchSize$.pipe(map(size => size > 0));

  constructor(private store: Store<any>) {}

  public clear(): void {
    this.store.dispatch(clearBatchAction());
  }
}
