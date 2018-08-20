import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { getDatasetsInBatch } from 'state-management/selectors/datasets.selectors';
import { ClearBatchAction } from 'state-management/actions/datasets.actions';

@Component({
  selector: 'batch-card',
  templateUrl: './batch-card.component.html',
  styleUrls: ['./batch-card.component.scss']
})
export class BatchCardComponent {
  private batch$ = this.store.pipe(select(getDatasetsInBatch));
  private batchSize$ = this.batch$.pipe(map(batch => batch.length));
  private nonEmpty$ = this.batchSize$.pipe(map(size => size > 0));

  constructor(private store: Store<any>) {}

  private clear(): void {
    this.store.dispatch(new ClearBatchAction());
  }
}
