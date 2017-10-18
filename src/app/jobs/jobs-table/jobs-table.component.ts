import {DatePipe} from '@angular/common';
import {Component, Input, OnInit, ViewChild} from '@angular/core';
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
export class JobsTableComponent implements OnInit {

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
  limit$: any = 10;

  selectedSets: Array<Job> = [];
  subscriptions = [];
  jobsCount = 1000;
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
    // this.loading$ = this.store.select(state => state.root.jobs.loading);
    this.loading$ = false;
    this.limit$ =
      this.store.select(state => state.root.user.settings.jobCount);
    this.totalJobNumber$ = this.store.select(state => state.root.jobs.currentJobs.length);
    console.log('this.limit$', this.limit$);
    this.store.dispatch({type: JobActions.RETRIEVE});


    this.subscriptions.push(this.store.select(state => state.root.jobs.currentJobs)
      .subscribe(selected => {
        this.jobs = selected;
      }));


  }


  onRowSelect(event) {
    this.router.navigateByUrl('/job/' + encodeURIComponent(event.job.id));
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
    this.store.select(state => state.root.jobs)
      .take(1)
      .subscribe(jStore => {
        jStore.skip = event.first;
        const jobs = {};
        jobs['skip'] = event.first;
        this.store.dispatch({type: JobActions.SORT_UPDATE, payload: jobs});
      });
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
    } else if ((key === 'archiveStatus' || key === 'retrieveStatus') &&
      ds['datasetlifecycle']) {
      return ds['datasetlifecycle'][key + 'Message'];
    } else if (key === 'size') {
      return (((ds[key] / 1024) / 1024) / 1024).toFixed(2);
    } else if (key in ds) {
      return value;
    } else {
      return key;
    }
  }

}
