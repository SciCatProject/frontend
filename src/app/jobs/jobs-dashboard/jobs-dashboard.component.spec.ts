import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";

import { JobsDashboardComponent } from "./jobs-dashboard.component";
import { MockStore, MockLoginService } from "shared/MockStubs";
import { Router } from "@angular/router";
import { Store, StoreModule } from "@ngrx/store";
import { Job } from "shared/sdk";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MatButtonToggleModule } from "@angular/material";
import { SharedCatanieModule } from "shared/shared.module";
import { DatePipe } from "@angular/common";
import { LoginService } from "users/login.service";
import { rootReducer } from "state-management/reducers/root.reducer";
import { JobViewMode } from "state-management/models";
import {
  SortUpdateAction,
  CurrentJobAction
} from "state-management/actions/jobs.actions";
import { PageChangeEvent } from "shared/modules/table/table.component";

describe("JobsDashboardComponent", () => {
  let component: JobsDashboardComponent;
  let fixture: ComponentFixture<JobsDashboardComponent>;

  let router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [JobsDashboardComponent],
      imports: [
        MatButtonToggleModule,
        SharedCatanieModule,
        StoreModule.forRoot({ rootReducer })
      ],
      providers: [DatePipe]
    });
    TestBed.overrideComponent(JobsDashboardComponent, {
      set: {
        providers: [
          { provide: LoginService, useClass: MockLoginService },
          { provide: Router, useValue: router }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#formatTableData()", () => {
    it("should return nothing if there are no jobs", () => {
      const data = component.formatTableData(null);

      expect(data).toBeUndefined();
    });

    it("should return an array of data object jobs are defined", () => {
      const jobs = [new Job()];

      const data = component.formatTableData(jobs);

      expect(data.length).toEqual(1);
      data.forEach(item => {
        expect(item.id).toEqual(jobs[0].id);
      });
    });
  });

  describe("#onModeChange()", () => {
    it("should dispatch a SortUpdateAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.filters = {
        skip: 0,
        limit: 25,
        mode: ""
      };

      const event = "test";
      const mode = JobViewMode.allJobs;
      component.onModeChange(event, mode);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new SortUpdateAction(
          component.filters.skip,
          component.filters.limit,
          component.filters.mode
        )
      );
    });
  });

  describe("#onPageChange()", () => {
    it("should dispatch a SortUpdateAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.filters = {
        skip: 0,
        limit: 25,
        mode: ""
      };
      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 25
      };
      component.onPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new SortUpdateAction(
          event.pageIndex * event.pageSize,
          event.pageSize,
          component.filters.mode
        )
      );
    });
  });

  describe("#onRowClick()", () => {
    it("should dispatch a CurrentJobAction and navigate to a job", () => {
      dispatchSpy = spyOn(store, "dispatch");

      let job = new Job();
      job.id = "test";
      component.onRowClick(job);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(new CurrentJobAction(job));
      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/user/jobs/" + encodeURIComponent(job.id)
      );
    });
  });
});
