import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {OrigDatablock, RawDataset} from 'shared/sdk/models';
import * as dsa from 'state-management/actions/datasets.actions';

import {config} from '../../../config/config';

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
  dataset: RawDataset = undefined;
  dataBlocks: Array<OrigDatablock>;
  error;
  admin = false;

  subscriptions = [];

  constructor(private route: ActivatedRoute, private store: Store<any>){};

  ngOnInit() {
    const self = this;

    this.subscriptions.push(
        this.store.select(state => state.root.user.currentUser)
            .subscribe(user => {
              if (('accountType' in user &&
                   user['accountType'] === 'functional') ||
                  user['username'] == 'ingestor' ||
                  user['username'] === 'archiveManager') {
                this.admin = true;
              }
            }));


    this.subscriptions.push(
        this.store.select(state => state.root.datasets.currentSet)
            .subscribe(dataset => {
              if (dataset && Object.keys(dataset).length > 0) {
                self.dataset = <RawDataset>dataset;
                if (!('origdatablocks' in self.dataset)) {
                  self.store.dispatch(
                      {type: dsa.DATABLOCKS, payload: self.dataset.pid});
                }
                // clear selected dataset
                self.store.dispatch(
                    {type: dsa.SELECT_CURRENT, payload: undefined});
              }
            }));

    this.store.select(state => state.root.datasets.currentSet)
        .take(1)
        .subscribe(ds => {
          if (!ds) {
            this.route.params.subscribe(params => {
              this.store.dispatch({type: dsa.SEARCH_ID, payload: params.id});
            });
          }
        });
  }

  ngOnDestroy() {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  onAdminReset() {
    if (this.admin) {
      const pl = {
        'id': this.dataset.pid,
        'attributes': {
          'archiveStatusMessage':
              Object.keys(config['datasetStatusMessages'])[0],
          'retrieveStatusMessage': ''
        }
      };
      if(this.dataset.datablocks.length > 0) {
        this.dataset.datablocks.map((block, index) => {
          this.store.dispatch({type: dsa.DATABLOCK_DELETE, payload: block});
          if (index === this.dataset.datablocks.length) {
            this.store.dispatch({type: dsa.RESET_STATUS, payload: pl});
          }
        });
      } else {
        this.store.dispatch({type: dsa.RESET_STATUS, payload: pl});
      }
      
    }
  }
}
