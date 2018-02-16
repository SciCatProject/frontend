import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {OrigDatablock, Datablock, RawDataset, Job} from 'shared/sdk/models';
import * as dsa from 'state-management/actions/datasets.actions';
import * as ja from 'state-management/actions/jobs.actions';
import * as ua from 'state-management/actions/user.actions';
import * as selectors from 'state-management/selectors';
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

  constructor(private route: ActivatedRoute, private store: Store<any>) {}

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
      // this.loadDatasetWithDatablocks(dataset.pid);
    }
  }

  private reloadDatasetWithDatablocks(datasetPID) {
    console.log('Loading data for ' + datasetPID);
    this.clearCurrentSet(); // clear current dataset entirely from the cache
    this.loadDatasetWithDatablocks(datasetPID);
    // this.store.dispatch(new dsa.CurrentSetAction(datasetPID));
  }

  resetDataset(dataset) {
      this.store
      .select(state => state.root.user)
      .take(1)
      .subscribe(user => {
        const job = new Job();
        job.jobParams = {};
        job.jobParams['username'] = user['currentUser']['username'] || undefined;
        job.emailJobInitiator = user['email'];
        if (!user['email']) {
          job.emailJobInitiator = user['currentUser']['email'] || user['currentUser']['accessEmail'];
        }
        job.creationTime = new Date();
        job.type = 'reset';
        const fileObj = {};
        const fileList = [];
        fileObj['pid'] = dataset['pid'];
        if (dataset['datablocks']) {
          dataset['datablocks'].map(d => {
            fileList.push(d['archiveId']);
          });
        }
        fileObj['files'] = fileList;
        job.datasetList = [fileObj];
        console.log(job);
        this.store.dispatch(new ja.SubmitAction(job));
      });
    }
}
