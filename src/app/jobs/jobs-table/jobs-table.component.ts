import {DatePipe} from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';
import * as JobActions from 'state-management/actions/jobs.actions';
import {DataTable} from 'primeng/primeng';
import {Http} from '@angular/http';
import {Job} from 'shared/sdk/models';
import {ConfigService} from 'shared/services/config.service';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs-table.component.html',
  styleUrls: ['./jobs-table.component.css']
})
export class JobsTableComponent implements OnInit, OnDestroy {

  @Input() jobs;
  @Input() jobs2;
  @ViewChild('js') jobsTable: DataTable;

  cols = [
    {field: 'creationTime', header: 'Creation Time', sortable: true},
    {field: 'emailJobInitiator', header: 'Email', sortable: true},
    {field: 'type', header: 'Type', sortable: true},
    {field: 'jobStatusMessage', header: 'Status', sortable: true}
  ];
  loading$: any = false;
  limit: any = 50;

  selectedSets: Array<Job> = [];
  subscriptions = [];
  jobsCount = 1000;
  filters = {};
  totalJobNumber$: any;


  constructor(public http: Http,
              private configSrv: ConfigService, private router: Router,
              private store: Store<any>) {
    this.configSrv.getConfigFile('Job').subscribe(conf => {
      for (const prop in conf) {
        if (prop in conf && 'table' in conf[prop]) {
          this.cols.push(conf[prop]['table']);
        }
      }
    });
  }

  ngOnInit() {
    this.loading$ = this.store.select(state => state.root.jobs.loading);
    this.store.select(state => state.root.user.settings.jobCount).subscribe(limit => {
      this.limit = limit;
    });
    this.store.select(state => state.root.jobs.filters).subscribe(filters => {
      this.filters = Object.assign({}, filters);
    });
    
    this.totalJobNumber$ = this.store.select(state => state.root.jobs.currentJobs.length);

    this.subscriptions.push(this.store.select(state => state.root.jobs.currentJobs)
      .subscribe(selected => {
        if (selected.length > 0) {
          this.jobs = selected.slice();
          console.log(this.jobs);
        }
      }));

  }

  ngOnDestroy() {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }


  onRowSelect(event) {
    this.store.dispatch({type: JobActions.SELECT_CURRENT, payload: event.data});
    this.router.navigateByUrl('/user/job/' + encodeURIComponent(event.data.id));
  }

  nodeExpand(event) {
    this.store.dispatch({type: JobActions.CHILD_RETRIEVE, payload: event.node});
    event.node.children = [];
    this.store.select(state => state.root.jobs.ui).take(1).subscribe(jobs => {
      console.log(jobs);
      event.node.children = jobs;
    });
  }


  onPage(event) {
    this.filters['skip'] = event.first;
    this.store.dispatch({type: JobActions.SORT_UPDATE, payload: this.filters});
  }


  setCurrentPage(n: number) {
    this.jobsTable.onPageChange({'first': n, 'rows': this.jobsTable.rows});
  }

  getFormat(key, value, ds) {
    if (key === 'creationTime') {
      const date = new Date(value);
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(date, 'yyyy/MM/dd HH:mm');
      return formattedDate;
    } else if (key in ds) {
      return value;
    } else {
      return key;
    }
  }

}
