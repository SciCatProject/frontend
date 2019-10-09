import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Job } from "shared/sdk";
import { Subscription } from "rxjs";
import {
  getJobs,
  getFilters,
  getJobsCount,
  getJobsPerPage,
  getPage
} from "state-management/selectors/jobs.selectors";
import { DatePipe } from "@angular/common";
import {
  TableColumn,
  PageChangeEvent
} from "shared/modules/table/table.component";
import { JobViewMode, JobFilters } from "state-management/models";
import {
  changePageAction,
  sortByColumnAction,
  fetchJobAction,
  setJobViewModeAction,
  fetchJobsAction
} from "state-management/actions/jobs.actions";
import {
  getCurrentUser,
  getProfile
} from "state-management/selectors/users.selectors";

@Component({
  selector: "app-jobs-dashboard",
  templateUrl: "./jobs-dashboard.component.html",
  styleUrls: ["./jobs-dashboard.component.scss"]
})
export class JobsDashboardComponent implements OnInit, OnDestroy {
  jobsCount$ = this.store.pipe(select(getJobsCount));
  jobsPerPage$ = this.store.pipe(select(getJobsPerPage));
  currentPage$ = this.store.pipe(select(getPage));

  jobs: any[] = [];
  jobsSubscription: Subscription;

  // filters: JobFilters;
  // filtersSubscription: Subscription;

  profile: any;
  email: string;
  userSubscription: Subscription;

  modes = Object.keys(JobViewMode).map(key => JobViewMode[key]);
  currentMode = JobViewMode.myJobs;

  paginate = true;

  tableColumns: TableColumn[] = [
    { name: "initiator", icon: "mail", sort: false, inList: true },
    { name: "type", icon: "bubble_chart", sort: false, inList: true },
    {
      name: "createdAt",
      icon: "brightness_high",
      sort: false,
      inList: true
    },
    { name: "statusMessage", icon: "comment", sort: false, inList: true }
  ];
  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private store: Store<Job>
  ) {}

  formatTableData(jobs: Job[]): any[] {
    if (jobs) {
      return jobs.map(job => {
        return {
          id: job.id,
          initiator: job.emailJobInitiator,
          type: job.type,
          createdAt: this.datePipe.transform(
            job.creationTime,
            "yyyy-MM-dd HH:mm"
          ),
          statusMessage: job.jobStatusMessage
        };
      });
    }
  }

  onModeChange(event: any, mode: JobViewMode) {
    let viewMode: object;
    switch (mode) {
      case JobViewMode.allJobs: {
        viewMode = null;
        break;
      }
      case JobViewMode.myJobs: {
        viewMode = { emailJobInitiator: this.email };
        break;
      }
      default: {
        break;
      }
    }
    this.store.dispatch(setJobViewModeAction({ mode: viewMode }));
  }

  onPageChange(event: PageChangeEvent) {
    this.store.dispatch(
      changePageAction({ page: event.pageIndex, limit: event.pageSize })
    );
  }

  onRowClick(job: Job) {
    this.store.dispatch(fetchJobAction({ jobId: job.id }));
    const id = encodeURIComponent(job.id);
    this.router.navigateByUrl("/user/jobs/" + id);
  }

  ngOnInit() {
    this.store.dispatch(fetchJobsAction());

    this.jobsSubscription = this.store.pipe(select(getJobs)).subscribe(jobs => {
      this.jobs = this.formatTableData(jobs);
    });

    // this.filtersSubscription = this.store
    //   .pipe(select(getFilters))
    //   .subscribe(filters => {
    //     this.filters = filters;
    //   });

    this.userSubscription = this.store
      .pipe(select(getCurrentUser))
      .subscribe(current => {
        if (current) {
          this.email = current.email;

          if (!current.realm) {
            this.store.pipe(select(getProfile)).subscribe(profile => {
              if (profile) {
                this.profile = profile;
                this.email = profile.email;
              }
              this.onModeChange(null, JobViewMode.myJobs);
            });
          } else {
            this.onModeChange(null, JobViewMode.myJobs);
          }
        }
      });
  }

  ngOnDestroy() {
    this.jobsSubscription.unsubscribe();
    // this.filtersSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
