import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync
} from "@angular/core/testing";

import { JobsDashboardComponent } from "./jobs-dashboard.component";
import { MockStore } from "shared/MockStubs";
import { Router } from "@angular/router";
import { Store, StoreModule } from "@ngrx/store";
import { Job } from "shared/sdk";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SharedCatanieModule } from "shared/shared.module";
import { DatePipe } from "@angular/common";
import { JobViewMode } from "state-management/models";
import {
  setJobViewModeAction,
  changePageAction
} from "state-management/actions/jobs.actions";
import { PageChangeEvent } from "shared/modules/table/table.component";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

describe("JobsDashboardComponent", () => {
  let component: JobsDashboardComponent;
  let fixture: ComponentFixture<JobsDashboardComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [JobsDashboardComponent],
      imports: [
        MatButtonToggleModule,
        SharedCatanieModule,
        StoreModule.forRoot({})
      ],
      providers: [DatePipe]
    });
    TestBed.overrideComponent(JobsDashboardComponent, {
      set: {
        providers: [{ provide: Router, useValue: router }]
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
    it("should dispatch a setJobViewModeAction with an object on myJobs", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = "test";
      const mode = JobViewMode.myJobs;
      component.email = "test@email.com";
      const viewMode = { emailJobInitiator: component.email };
      component.onModeChange(event, mode);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setJobViewModeAction({ mode: viewMode })
      );
    });

    it("should dispatch a setJobViewModeAction with null on allJobs", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = "test";
      const mode = JobViewMode.allJobs;
      const viewMode = null;
      component.onModeChange(event, mode);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setJobViewModeAction({ mode: viewMode })
      );
    });
  });

  describe("#onPageChange()", () => {
    it("should dispatch a changePageAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 25
      };
      component.onPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changePageAction({ page: event.pageIndex, limit: event.pageSize })
      );
    });
  });

  describe("#onRowClick()", () => {
    it("should navigate to a job", () => {
      const job = new Job();
      job.id = "test";
      component.onRowClick(job);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/user/jobs/" + encodeURIComponent(job.id)
      );
    });
  });
});
