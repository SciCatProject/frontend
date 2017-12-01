import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {OrigDatablock, RawDataset, Datablock} from 'shared/sdk/models';
import * as dsa from 'state-management/actions/datasets.actions';

import {config} from '../../../config/config';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/distinctUntilChanged';
/**
 * Component to show details for a dataset, using the
 * form compoennt
 * @export
 * @class DatasetDetailComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'dataset-detail',
  templateUrl: './dataset-detail.component.html',
  styleUrls: ['./dataset-detail.component.css']
})
export class DatasetDetailComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  dataset$: Observable<RawDataset>;
  origDatablocks$: Observable<OrigDatablock[]>;
  datablocks$: Observable<Datablock[]>;
  admin$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private store: Store<any>){};

  ngOnInit() {
    const currentUser$ = this.store.select(state => state.root.user.currentUser);
    const adminUserNames = ['ingestor', 'archiveManager'];
    const userIsAdmin = (user) => {
      return (user['accountType'] === 'functional')  || (adminUserNames.indexOf(user.username) !== -1);
    };
    this.admin$ = currentUser$.map(userIsAdmin);

    const routeParams$ = this.route.params;
    const currentSet$ = this.store.select(state => state.root.datasets.currentSet);
    this.subscriptions.push(routeParams$
      .subscribe(params => {
        // console.log({params});
        this.reloadDatasetWithDatablocks(params.id);
      }));

    this.dataset$ = currentSet$.distinctUntilChanged().filter((dataset: RawDataset) => {
      return dataset && (Object.keys(dataset).length > 0);
    });

    this.origDatablocks$ = this.dataset$.map((dataset: RawDataset) => {
      return (dataset && ('origdatablocks' in dataset)) ? dataset.origdatablocks : [];
    });

    this.datablocks$ = this.dataset$.map((dataset: RawDataset) => {
      return (dataset && ('datablocks' in dataset)) ? dataset.datablocks : [];
    });

    // if we weren't clearing the cache and the current set's datablocks
    //   may not have been loaded, we would want to make sure that we load them:
    // this.subscriptions.push(this.dataset$.subscribe(this.ensureDatablocksForDatasetAreLoaded));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  private clearCurrentSet() {
    this.store.dispatch(new dsa.CurrentSetAction(undefined)); // clear cache
  }
  private loadDatasetWithDatablocks(datasetPID) {
    this.store.dispatch(new dsa.DatablocksAction(datasetPID));
  }
  // (not currently in use since we are clearing current dataset entirely)
  private ensureDatablocksForDatasetAreLoaded(dataset: RawDataset) {
    if (dataset && !('origdatablocks' in dataset)) {
      this.loadDatasetWithDatablocks(dataset.pid);
    }
  }

  private reloadDatasetWithDatablocks(datasetPID) {
    console.log('Loading data for ' + datasetPID)
    this.clearCurrentSet(); // clear current dataset entirely from the cache
    this.loadDatasetWithDatablocks(datasetPID);
  }

  private resetDataset(dataset: RawDataset) {
    // TODO this should be moved into a reset endpoint for a dataset
    dataset.datablocks.forEach(datablock => {
      this.store.dispatch(new dsa.DatablockDeleteAction(datablock));
    })
    const archiveStatusMessage = Object.keys(config['datasetStatusMessages'])[0];
    const payload = {
      'id': dataset.pid,
      'attributes': {
        'archiveStatusMessage': archiveStatusMessage,
        'retrieveStatusMessage': ''
      }
    };
    this.store.dispatch(new dsa.ResetStatusAction(payload));
  }
}
