import {Component, OnInit, ViewChild} from '@angular/core';
import {Store} from '@ngrx/store';
import * as JobActions from 'state-management/actions/jobs.actions';
import {DataTable} from 'primeng/primeng';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs-table.component.html',
  styleUrls: ['./jobs-table.component.css']
})
export class JobsTableComponent implements OnInit {

  @ViewChild('ds') jobsTable: DataTable;
  jobs = [];
  jobsCount = 30;

  cols = [
    {field: 'creationTime', header: 'Creation Time', sortable: true},
    {field: 'emailJobInitiator', header: 'Email', sortable: true},
    {field: 'type', header: 'Type', sortable: true},
    {field: 'jobStatusMessage', header: 'Status', sortable: true}
  ];

  constructor(private store: Store<any>) {
    const jobsTree = {'data': []};
    this.store.select(state => state.root.jobs.currentJobs).subscribe(jobs => {
      let index = -1;
      jobs.map(job => {
        const entry = {
          'data': {
            'creationTime': job['creationTime'],
            'emailJobInitiator': job['emailJobInitiator'],
            'type': job['type'],
            'jobStatusMessage': job['jobStatusMessage'],
            'datasetList': job['datasetList'],
            'index': index += 1
          },
          'leaf': false
        };
        this.jobs.push(entry);
      });
    });
  }

  ngOnInit() {
    this.store.dispatch({type: JobActions.RETRIEVE});
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
      .subscribe(dStore => {
        const jobs = dStore.activeFilters;
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
