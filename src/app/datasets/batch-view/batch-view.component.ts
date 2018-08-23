import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { getDatasetsInBatch } from 'state-management/selectors/datasets.selectors';
import { PrefillBatchAction, ClearBatchAction, RemoveFromBatchAction } from 'state-management/actions/datasets.actions';
import { Dataset } from 'state-management/models';

@Component({
    selector: 'batch-view',
    templateUrl: './batch-view.component.html',
    styleUrls: ['./batch-view.component.scss']
})
export class BatchViewComponent implements OnInit {
    private visibleColumns = ['remove', 'pid', 'sourceFolder', 'creationTime'];
    
    private batch$ = this.store.pipe(select(getDatasetsInBatch));
    private hasBatch$ = this.batch$.pipe(map(batch => batch.length > 0));

    constructor(private store: Store<any>) {}

    ngOnInit() {
        this.store.dispatch(new PrefillBatchAction());
    }

    onEmpty() {
        const msg = 'Are you sure that you want to remove all datasets from the batch?';
        if (confirm(msg)) {
            this.store.dispatch(new ClearBatchAction());
        }
    }

    onRemove(dataset: Dataset) {
        this.store.dispatch(new RemoveFromBatchAction(dataset));
    }
}
