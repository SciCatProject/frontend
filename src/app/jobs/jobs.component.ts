import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as JobActions from 'state-management/actions/jobs.actions';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit, OnDestroy {
  jobs = [];

  cols = [
    { field: 'creationTime', header: 'Creation Time', sortable: true },
    { field: 'emailJobInitiator', header: 'Email', sortable: true },
    { field: 'type', header: 'Type', sortable: true },
    { field: 'jobStatusMessage', header: 'Status', sortable: true }
  ];

  subscriptions = [];

  constructor(private store: Store<any>) {
    // const jobsTree = { data: [] };
  }

  ngOnInit() {
    this.subscriptions.push(this.store.select(state => state.root.jobs.currentJobs).subscribe(jobs => {
      let index = -1;
      jobs.map(job => {
        const entry = {
          data: {
            creationTime: job['creationTime'],
            emailJobInitiator: job['emailJobInitiator'],
            type: job['type'],
            jobStatusMessage: job['jobStatusMessage'],
            datasetList: job['datasetList'],
            index: (index += 1)
          },
          leaf: false
        };
        this.jobs.push(entry);
      });
    }));
    this.store.dispatch({ type: JobActions.RETRIEVE });
  }

  ngOnDestroy() {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  onRowSelect(event) {
    console.log(event);
  }

  nodeExpand(event) {
    this.store.dispatch({
      type: JobActions.CHILD_RETRIEVE,
      payload: event.node
    });
    event.node.children = [];
    this.store
      .select(state => state.root.jobs.ui)
      .take(1)
      .subscribe(jobs => {
        console.log(jobs);
        event.node.children = jobs;
      });
  }
}
