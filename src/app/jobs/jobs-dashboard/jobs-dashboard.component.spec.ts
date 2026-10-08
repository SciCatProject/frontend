import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { JobsDashboardComponent } from "./jobs-dashboard.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";
import {
  RowEventType,
  TableEventType,
} from "shared/modules/dynamic-material-table/models/table-row.model";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { selectJobsDashboardPageViewModel } from "state-management/selectors/jobs.selectors";
import {
  changePageAction,
  fetchJobsAction,
  setTextFilterAction,
  sortByColumnAction,
} from "state-management/actions/jobs.actions";

describe("JobsDashboardComponent", () => {
  let component: JobsDashboardComponent;
  let fixture: ComponentFixture<JobsDashboardComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };

  const jobsVm = {
    jobs: [{ id: "job-1", type: "archive" }],
    count: 1,
    currentPage: 0,
    jobsPerPage: 25,
    filters: {
      skip: 0,
      limit: 25,
      sortField: "creationTime:desc",
      mode: undefined,
      text: "",
    },
    hasFetchedSettings: true,
    isLoading: false,
    tableSettings: { columns: [] },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [JobsDashboardComponent],
      providers: [
        { provide: Router, useValue: router },
        provideMockStore({
          selectors: [
            { selector: selectJobsDashboardPageViewModel, value: jobsVm },
          ],
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, "dispatch");
    fixture = TestBed.createComponent(JobsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#ngOnInit", () => {
    it("should dispatch fetchJobsAction once settings are fetched", () => {
      expect(dispatchSpy).toHaveBeenCalledOnceWith(fetchJobsAction());
    });

    it("should map jobs from the store to table rows", () => {
      expect(component.dataSource.value).toEqual([
        { id: "job-1", type: "archive", jobId: "job-1" } as any,
      ]);
      expect(component.pagination.length).toEqual(1);
    });
  });

  describe("#onRowEvent", () => {
    it("should navigate to a Job detail", () => {
      const job = { jobId: "job-1" };
      const id = encodeURIComponent(job.jobId);

      component.onRowEvent({
        event: RowEventType.RowClick,
        sender: { row: job },
      } as any);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith("/user/jobs/" + id);
    });
  });

  describe("#onPaginationChange", () => {
    it("should dispatch a changePageAction", () => {
      component.onPaginationChange({ pageIndex: 2, pageSize: 10 });

      expect(dispatchSpy).toHaveBeenCalledWith(
        changePageAction({ page: 2, limit: 10 }),
      );
    });
  });

  describe("#onTableEvent", () => {
    it("should dispatch a sortByColumnAction mapping jobId to id", () => {
      component.onTableEvent({
        event: TableEventType.SortChanged,
        sender: { active: "jobId", direction: "asc" },
      });

      expect(dispatchSpy).toHaveBeenCalledWith(
        sortByColumnAction({ column: "id", direction: "asc" }),
      );
    });
  });

  describe("#onGlobalTextSearchAction", () => {
    it("should dispatch a setTextFilterAction", () => {
      component.onGlobalTextSearchChange("archive");
      component.onGlobalTextSearchAction();

      expect(dispatchSpy).toHaveBeenCalledWith(
        setTextFilterAction({ text: "archive" }),
      );
    });
  });
});
