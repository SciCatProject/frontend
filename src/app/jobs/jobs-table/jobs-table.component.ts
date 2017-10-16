import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
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
              private configSrv: ConfigService,
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
    this.limit$ =
      this.store.select(state => state.root.user.settings.jobCount);
    this.store.dispatch({type: JobActions.RETRIEVE});


    this.subscriptions.push(this.store.select(state => state.root.jobs)
      .subscribe(selected => {
        this.selectedSets = selected;
      }));
  }

  onRowSelect(event) {
    console.log(event);
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

}
