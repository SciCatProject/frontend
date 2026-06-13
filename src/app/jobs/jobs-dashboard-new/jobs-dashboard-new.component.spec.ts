import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { JobsDashboardNewComponent } from "./jobs-dashboard-new.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";
import { AppConfigService } from "app-config.service";
import { ScicatDataService } from "shared/services/scicat-data-service";
import { ExportExcelService } from "shared/services/export-excel.service";
import { RowEventType } from "shared/modules/dynamic-material-table/models/table-row.model";
import { provideMockStore } from "@ngrx/store/testing";
import { selectJobsDashboardPageViewModel } from "state-management/selectors/jobs.selectors";

const getConfig = () => ({});

describe("JobsDashboardNewComponent", () => {
  let component: JobsDashboardNewComponent;
  let fixture: ComponentFixture<JobsDashboardNewComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };

  const jobsVm = {
    jobs: [],
    count: 0,
    filters: {
      skip: 0,
      limit: 5,
      sortField: "creationTime:desc",
      mode: undefined,
    },
    tableSettings: { columns: [] },
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [JobsDashboardNewComponent],
      providers: [
        { provide: Router, useValue: router },
        { provide: AppConfigService, useValue: { getConfig } },
        { provide: ScicatDataService, useValue: {} },
        { provide: ExportExcelService, useValue: {} },
        provideMockStore({
          selectors: [
            { selector: selectJobsDashboardPageViewModel, value: jobsVm },
          ],
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsDashboardNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
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
});
