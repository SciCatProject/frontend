import { Component, OnDestroy, OnInit } from '@angular/core';
import * as JobActions from 'state-management/actions/jobs.actions';
import {Job} from 'shared/sdk/models';
import {Store} from '@ngrx/store';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-jobs-detail',
  templateUrl: './jobs-detail.component.html',
  styleUrls: ['./jobs-detail.component.css']
})
export class JobsDetailComponent implements OnInit, OnDestroy {

  job: Job = undefined;
  subscriptions = [];

  constructor(private route: ActivatedRoute,
              private store: Store<any>) {
  };


  ngOnInit() {
    this.subscriptions.push(this.store.select(state => state.root.jobs.currentSet)
      .subscribe(job => {
        if (job && Object.keys(job).length > 0) {
          this.job = <Job>job;
          this.store.dispatch({type: JobActions.SELECT_CURRENT, payload: undefined});
        }else {
          this.route.params.subscribe(params => {
            this.store.dispatch({type: JobActions.SEARCH_ID, payload: params.id});
          });
        }
      }));
  }

  ngOnDestroy() {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }
}
