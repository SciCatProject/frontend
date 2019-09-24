import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Job } from "shared/sdk";
import { Subscription } from "rxjs";
import {
  getJobs,
  getFilters,
  getJobsCount
} from "state-management/selectors/jobs.selectors";
import { DatePipe } from "@angular/common";
import {
  TableColumn,
  PageChangeEvent
} from "shared/modules/table/table.component";
import { JobViewMode, JobFilters } from "state-management/models";
import {
  SortUpdateAction,
  CurrentJobAction
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
  constructor(
    private datePipe: DatePipe,
    private router: Router,
    private store: Store<Job>
  ) {}

  jobs: any[] = [];
  jobsSubscription: Subscription;

  filters: JobFilters;
  filtersSubscription: Subscription;

  profile: any;
  email: string;
  userSubscription: Subscription;

  modes = Object.keys(JobViewMode).map(key => JobViewMode[key]);
  currentMode = JobViewMode.myJobs;

  paginate = true;
  jobsCount$ = this.store.pipe(select(getJobsCount));

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
    switch (mode) {
      case JobViewMode.allJobs: {
        this.filters.mode = "";
        break;
      }
      case JobViewMode.myJobs: {
        this.filters.mode = { emailJobInitiator: this.email };
        break;
      }
      default: {
        break;
      }
    }
    this.filters.skip = 0;
    this.store.dispatch(
      new SortUpdateAction(
        this.filters.skip,
        this.filters.limit,
        this.filters.mode
      )
    );
  }

  onPageChange(event: PageChangeEvent) {
    this.filters.skip = event.pageIndex * event.pageSize;
    this.filters.limit = event.pageSize;
    this.store.dispatch(
      new SortUpdateAction(
        this.filters.skip,
        this.filters.limit,
        this.filters.mode
      )
    );
  }

  onRowClick(job: Job) {
    this.store.dispatch(new CurrentJobAction(job));
    const id = encodeURIComponent(job.id);
    this.router.navigateByUrl("/user/jobs/" + id);
  }

  ngOnInit() {
    this.jobsSubscription = this.store.pipe(select(getJobs)).subscribe(jobs => {
      this.jobs = this.formatTableData(jobs);
    });

    this.filtersSubscription = this.store
      .pipe(select(getFilters))
      .subscribe(filters => {
        this.filters = filters;
      });

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
    this.filtersSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
