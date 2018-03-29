import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store, select} from '@ngrx/store';
import {OrigDatablock, Dataset, DatasetAttachment, Datablock, RawDataset, Job} from 'shared/sdk/models';
import * as dsa from 'state-management/actions/datasets.actions';
import * as ja from 'state-management/actions/jobs.actions';
import * as ua from 'state-management/actions/user.actions';
import * as selectors from 'state-management/selectors';
import {config} from '../../../config/config';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import { Message, MessageType } from 'state-management/models';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
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
  dataset$: Observable<Dataset>;
  origDatablocks$: Observable<OrigDatablock[]>;
  datablocks$: Observable<Datablock[]>;
  dAttachment$: Observable<DatasetAttachment[]>;
  admin$: Observable<boolean>;

  constructor(private route: ActivatedRoute, private store: Store<any>) { }

  ngOnInit() {
    const currentUser$ = this.store.select(state => state.root.user.currentUser);
    const adminUserNames = ['ingestor', 'archiveManager'];
    const userIsAdmin = (user) => {
      return (user['accountType'] === 'functional') || (adminUserNames.indexOf(user.username) !== -1);
    };
    this.admin$ = currentUser$.map(userIsAdmin);

    const routeParams$ = this.route.params;
    const currentSet$ = this.store.select(state => state.root.datasets.currentSet);
    this.subscriptions.push(routeParams$
      .subscribe(params => {
        // console.log({params});
        this.reloadDatasetWithDatablocks(params.id);
      }));

    this.dataset$ = currentSet$.distinctUntilChanged().filter((dataset: Dataset) => {
      return dataset && (Object.keys(dataset).length > 0);
    });

    this.origDatablocks$ = this.dataset$.map((dataset: Dataset) => {
      return (dataset && ('origdatablocks' in dataset)) ? dataset.origdatablocks : undefined;
    });

    this.dAttachment$ = this.dataset$.map((dataset: Dataset) => {
      return (dataset && ('datasetattachments' in dataset) && 
              dataset.datasetattachments.length > 0) ? dataset.datasetattachments : undefined;
    });



    this.datablocks$ = this.dataset$.map((dataset: RawDataset) => {
      return (dataset && ('datablocks' in dataset)) ? dataset.datablocks : [];
    });

    const msg = new Message();
    this.subscriptions.push(
      this.store.select(selectors.jobs.submitJob).subscribe(
        ret => {
          if (ret && Array.isArray(ret)) {
            console.log(ret);
          }
        },
        error => {
          console.log(error);
          msg.type = MessageType.Error;
          msg.content = 'Job not Submitted';
          this.store.dispatch(new ua.ShowMessageAction(msg));
        }
      )
    );

    this.subscriptions.push(
      this.store.select(selectors.jobs.getError).subscribe(err => {
        if (err) {
          msg.type = MessageType.Error;
          msg.content = err.message;
          this.store.dispatch(new ua.ShowMessageAction(msg));
        }
      })
    );

    // if we weren't clearing the cache and the current set's datablocks
    //   may not have been loaded, we would want to make sure that we load them:
    // this.subscriptions.push(this.dataset$.subscribe(this.ensureDatablocksForDatasetAreLoaded));
  }

  onExportClick() {
    this.dataset$.take(1).subscribe(ds => {

      const options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: false,
        useBom: true,
        headers: Object.keys(ds)
      };
      var newDs = {}
      for (var key in ds) {
        newDs[key] = JSON.stringify(ds[key])
      }
      const ts = new Angular5Csv([newDs], 'Dataset_' + ds.pid, options);
    });
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
        user = user['currentUser'];
        const job = new Job();
        job.emailJobInitiator = user['email'];
        job.jobParams = {};
        job.jobParams['username'] = user['username'] || undefined;
        if (!job.emailJobInitiator) {
          job.emailJobInitiator = user['profile'] ? user['profile']['email'] : user['email'];
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
