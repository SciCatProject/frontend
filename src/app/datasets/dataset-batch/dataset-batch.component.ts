import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getDatasetsInBatch } from 'state-management/selectors/datasets.selectors';
import { map } from 'rxjs/operators';

@Component({
  selector: 'dataset-batch',
  templateUrl: './dataset-batch.component.html',
  styleUrls: ['./dataset-batch.component.scss']
})
export class DatasetBatchComponent {
  private batch$ = this.store.pipe(select(getDatasetsInBatch));
  private batchSize$ = this.batch$.pipe(map(batch => batch.length));
  private nonEmpty$ = this.batchSize$.pipe(map(size => size > 0));

  constructor(private store: Store<any>) {}
}
