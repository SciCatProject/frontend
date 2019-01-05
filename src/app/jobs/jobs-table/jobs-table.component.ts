import * as JobActions from "state-management/actions/jobs.actions";
import * as selectors from "state-management/selectors";
import { JobViewMode } from "state-management/models";
import { AfterViewInit } from "@angular/core/src/metadata/lifecycle_hooks";
import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ConfigService } from "shared/services/config.service";
import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Job } from "shared/sdk/models";
import { MatPaginator } from "@angular/material";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { takeLast } from "rxjs/operators";
import { LoginService } from "users/login.service";


@Component({
  selector: "jobs-table",
  templateUrl: "./jobs-table.component.html",
  styleUrls: ["./jobs-table.component.scss"],
  providers: [LoginService]
})
export class JobsTableComponent implements OnInit, OnDestroy, AfterViewInit {
  jobs$ = this.store.pipe(select(selectors.jobs.getJobs));
  totalJobNumber$ = this.store.pipe(select(selectors.jobs.getJobsCount));
  cols = [
    "emailJobInitiator",
    "type",
    "creationTime",
    // "executionTime",
    // "jobParams",
    "jobStatusMessage",
    "datasetList"
  ];
  modes = Object.keys(JobViewMode).map(k => JobViewMode[k as any]);
  currentMode = JobViewMode.myJobs;


  loading$: any = false;
  limit: any = 50;

  selectedSets: Array<Job> = [];
  subscriptions = [];
  jobsCount = 1000;
  filters = {};
  event: any;

  displayedColumns = this.cols.concat();
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  profile: any;
  email: string;

  constructor(
    public http: HttpClient,
    private configSrv: ConfigService,
    private router: Router,
    private store: Store<any>,
    private loginService: LoginService
  ) {
    /*this.configSrv.getConfigFile('Job').subscribe(conf => {

      for (const prop in conf) {
        if (prop in conf  ) {
          this.cols.push(conf[prop]['table']);
          this.displayedColumns.push(conf[prop]['table']['field']);
        }
      }
    });*/
  }

  ngOnInit() {
    this.loading$ = this.store.pipe(select(selectors.jobs.getLoading));
    this.subscriptions.push(
      this.store
        .pipe(select(state => state.root.user.settings.jobCount))
        .subscribe(limit => {
          this.limit = limit;
        })
    );

    this.subscriptions.push(
      this.store.pipe(select(selectors.jobs.getFilters)).subscribe(filters => {
        this.filters = Object.assign({}, filters);
      })
    );

    this.subscriptions.push(
      this.store
        .pipe(select(state => state.root.user.currentUser))
        .subscribe(current => {
          if (current) {
            // set this email for functional users. Override for MSAD
            this.email = current.email;
            // realm is only defined for functional users
            if (!current.realm) {
              this.loginService
                .getUserIdent$(current.id)
                .subscribe(currentIdent => {
                  if (currentIdent && currentIdent.profile) {
                    this.profile = currentIdent.profile;
                    this.email = this.profile.email;
                  }
                  this.onModeChange(null, JobViewMode.myJobs);
                });
            } else {
              this.onModeChange(null, JobViewMode.myJobs);
            }
          }
        })
    );
  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  /**
   * Handle changing of view mode
   * @param event
   * @param mode
   */
  onModeChange(event, mode: JobViewMode): void {
    switch (mode) {
      case JobViewMode.allJobs: {
        this.filters["mode"] = "";
        break;
      }
      case JobViewMode.myJobs: {
        this.filters["mode"] = JSON.parse(
          '{"emailJobInitiator":"' + this.email + '"}'
        );
        break;
      }
    }
    this.filters["skip"] = 0;
    this.paginator.pageIndex = 0;
    this.store.dispatch(
      new JobActions.SortUpdateAction(
        this.filters["skip"],
        this.filters["limit"],
        this.filters["mode"]
      )
    );
  }

  onRowSelect(event, job) {
    this.store.dispatch(new JobActions.CurrentJobAction(job));
    this.router.navigateByUrl("/user/job/" + encodeURIComponent(job.id));
  }

  nodeExpand(event) {
    this.store.dispatch(new JobActions.ChildRetrieveAction(event.node));
    event.node.children = [];
    this.store
      .pipe(
        select(state => state.root.jobs.ui),
        takeLast(1)
      )
      .subscribe(jobs => {
        console.log(jobs);
        event.node.children = jobs;
      });
  }

  onPage(event) {
    this.filters["skip"] = this.paginator.pageIndex * this.paginator.pageSize;
    this.store.dispatch(
      new JobActions.SortUpdateAction(
        this.filters["skip"],
        this.filters["limit"],
        this.filters["mode"]
      )
    );
  }

  // setCurrentPage(n: number) {
  //   this.jobsTable.onPageChange({'first': n, 'rows': this.jobsTable.rows});
  // }

  getFormat(key, value, ds) {
    if (key === "creationTime") {
      const date = new Date(value);
      const datePipe = new DatePipe("en-US");
      const formattedDate = datePipe.transform(date, "yyyy/MM/dd HH:mm");
      return formattedDate;
    } else if (key in ds) {
      return value;
    } else {
      return key;
    }
  }
}
