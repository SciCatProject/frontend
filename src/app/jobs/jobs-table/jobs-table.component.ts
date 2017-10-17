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
  @ViewChild('js') jobsTable: DataTable;
  jobsCount = 30;

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
    this.limit$ =
      this.store.select(state => state.root.user.settings.jobCount);
    this.store.dispatch({type: JobActions.RETRIEVE});


    this.subscriptions.push(this.store.select(state => state.root.jobs)
      .subscribe(selected => {
        this.selectedSets = selected;
      }));


    this.jobs = [
      {
      id: '5',
      emailJobInitiator: 'test@test.com',
      type: 'retrieve',
      creationTime: '2015-04-11T11:00:00Z',
      executionTime: '2015-04-11T11:00:00Z',
      jobParams: {'0': 's'},
      jobStatusMessage: 'retrieve',
      datasetList: {'0': 'm'},
      createdAt: '2015-04-11T11:00:00Z',
      updatedAt: '2017-10-17T08:33:00Z'
    }
    ,
      {
        id: '6',
        emailJobInitiator: 'zest@test.com',
        type: 'retrieve',
        creationTime: '2016-04-11T11:00:00Z',
        executionTime: '2016-04-11T11:00:00Z',
        jobParams: {'0': 's'},
        jobStatusMessage: 'retrieve',
        datasetList: {'0': 'm'},
        createdAt: '2016-04-11T11:00:00Z',
        updatedAt: '2017-10-17T08:33:00Z'
      }
    ];

  }


  onRowSelect(event) {
    const pid = encodeURIComponent(event.data.pid);
    // Odd hack to stop click event in column loading dataset view, not needed
    // before 5th July 2017
    if (event['originalEvent']['target']['innerHTML'].indexOf('chkbox') ===
      -1) {
      this.router.navigateByUrl('/job/' + encodeURIComponent(event.data.pid));
      // this.store.dispatch(
      //     {type : dsa.SELECT_CURRENT, payload : event.data});
    }
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
        const jobs = jStore.activeFilters;
        if (jobs) {
          jobs['skip'] = event.first;
          jobs['initial'] = false;
          if (event.sortField) {
            const sortOrder = event.sortOrder === 1 ? 'ASC' : 'DESC';
            jobs['sortField'] = event.sortField + ' ' + sortOrder;
          } else {
            jobs['sortField'] = undefined;
          }
        }
        //        }
      });
  }


  setCurrentPage(n: number) {
    this.jobsTable.onPageChange({'first': n, 'rows': this.jobsTable.rows});
  }

  getFormat(key, value, ds) {
    if (key === 'creationTime') {
      const date = new Date(value);
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(date, 'dd/MM/yyyy HH:mm');
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
