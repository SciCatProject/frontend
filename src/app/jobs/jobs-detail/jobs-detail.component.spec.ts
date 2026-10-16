import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { MockActivatedRoute, mockJob } from "shared/MockStubs";

import { JobsDetailComponent } from "./jobs-detail.component";
import { ActivatedRoute } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { SharedTableModule } from "shared/modules/shared-table/shared-table.module";
import { selectCurrentJob } from "state-management/selectors/jobs.selectors";
import { selectIsLoading } from "state-management/selectors/user.selectors";
import { clearCurrentJobAction } from "state-management/actions/jobs.actions";

describe("JobsDetailComponent", () => {
  let component: JobsDetailComponent;
  let fixture: ComponentFixture<JobsDetailComponent>;
  let store: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatCardModule,
        MatIconModule,
        ReactiveFormsModule,
        SharedTableModule,
      ],
      declarations: [JobsDetailComponent],
      providers: [
        provideMockStore(),
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectCurrentJob, mockJob);
    store.overrideSelector(selectIsLoading, false);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#ngOnDestroy()", () => {
    it("should dispatch a clearCurrentJobAction", () => {
      const dispatchSpy = spyOn(store, "dispatch");

      component.ngOnDestroy();

      expect(dispatchSpy).toHaveBeenCalledOnceWith(clearCurrentJobAction());
    });
  });

  describe("job not found", () => {
    it("should not show the error page when the job is loaded", () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('[data-cy="job-not-found"]')).toBeNull();
    });

    it("should show the error page when the job is cleared", () => {
      store.overrideSelector(selectCurrentJob, undefined);
      store.refreshState();
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(
        compiled.querySelector('[data-cy="job-not-found"]'),
      ).not.toBeNull();
    });

    it("should not show the error page while loading", () => {
      store.overrideSelector(selectCurrentJob, undefined);
      store.overrideSelector(selectIsLoading, true);
      store.refreshState();
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('[data-cy="job-not-found"]')).toBeNull();
    });
  });
});
