import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getDatasetsInBatch } from 'state-management/selectors/datasets.selectors';

@Component({
    selector: 'batch-view',
    templateUrl: './batch-view.component.html',
    // styleUrls: ['./batch-view.component.scss']
})
export class BatchViewComponent {
    private visibleColumns = ['pid'];
    private batch$ = this.store.pipe(select(getDatasetsInBatch));

    constructor(private store: Store<any>) {}
}
