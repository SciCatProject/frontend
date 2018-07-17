import {DatePipe} from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';
import * as JobActions from 'state-management/actions/jobs.actions';
import {HttpClient} from '@angular/common/http';
import {Job} from 'shared/sdk/models';
import {ConfigService} from 'shared/services/config.service';
import * as selectors from 'state-management/selectors';
import {MatTableDataSource, MatPaginator} from '@angular/material';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { takeLast } from 'rxjs/operators';

@Component({
  selector: 'jobs-table',
  templateUrl: './jobs-table.component.html',
  styleUrls: ['./jobs-table.component.css']
})
export class JobsTableComponent implements OnInit, OnDestroy, AfterViewInit {

  @Input() jobs;
  @Input() jobs2;

  cols = [ ];
  loading$: any = false;
  limit: any = 50;

  selectedSets: Array<Job> = [];
  subscriptions = [];
  jobsCount = 1000;
  filters = {};
  totalJobNumber$: any;

  dataSource: MatTableDataSource<any> | null;
  displayedColumns = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public http: HttpClient,
              private configSrv: ConfigService, private router: Router,
              private store: Store<any>) {
    this.configSrv.getConfigFile('Job').subscribe(conf => {
      for (const prop in conf) {
        if (prop in conf  ) {
          this.cols.push(conf[prop]['table']);
          this.displayedColumns.push(conf[prop]['table']['field']);
        }
      }
    });
  }

  ngOnInit() {
    this.loading$ = this.store.select(selectors.jobs.getLoading);
    this.store.select(state => state.root.user.settings.jobCount).subscribe(limit => {
      this.limit = limit;
    });
    this.store.select(selectors.jobs.getFilters).subscribe(filters => {
      this.filters = Object.assign({}, filters);
    });

    this.totalJobNumber$ = this.store.select(state => state.root.jobs.currentJobs.length);

    this.subscriptions.push(this.store.select(selectors.jobs.getJobs)
      .subscribe(selected => {
        if (selected.length > 0) {
          this.jobs = selected.slice();
          this.dataSource = new MatTableDataSource(this.jobs);
          console.log(this.jobs);
        }
      }));

  }

  ngAfterViewInit() {
    this.store.dispatch(new JobActions.SortUpdateAction(this.filters['skip'], this.filters['limit']));
  }

  ngOnDestroy() {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }


  onRowSelect(event, job) {
    this.store.dispatch(new JobActions.CurrentJobAction(job));
    this.router.navigateByUrl('/user/job/' + encodeURIComponent(job.id));
  }

  nodeExpand(event) {
    this.store.dispatch(new JobActions.ChildRetrieveAction(event.node));
    event.node.children = [];
    this.store.select(state => state.root.jobs.ui).pipe(takeLast(1)).subscribe(jobs => {
      console.log(jobs);
      event.node.children = jobs;
    });
  }


  onPage(event) {
    this.filters['skip'] = this.paginator.pageIndex * this.paginator.pageSize;
    this.store.dispatch(new JobActions.SortUpdateAction(this.filters['skip'], this.filters['limit']));
  }


  // setCurrentPage(n: number) {
  //   this.jobsTable.onPageChange({'first': n, 'rows': this.jobsTable.rows});
  // }

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
