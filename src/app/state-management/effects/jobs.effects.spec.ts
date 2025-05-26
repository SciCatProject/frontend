import { JobEffects } from "./jobs.effects";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { selectQueryParams } from "state-management/selectors/jobs.selectors";
import * as fromActions from "state-management/actions/jobs.actions";
import { hot, cold } from "jasmine-marbles";
import {
  showMessageAction,
  loadingAction,
  loadingCompleteAction,
  updateUserSettingsAction,
} from "state-management/actions/user.actions";
import { MessageType } from "state-management/models";
import { Type } from "@angular/core";
import {
  CreateJobDtoV3,
  OutputJobV3Dto,
  JobsService,
} from "@scicatproject/scicat-sdk-ts-angular";
import { TestObservable } from "jasmine-marbles/src/test-observables";
import { createMock } from "shared/MockStubs";

const createJob = createMock<CreateJobDtoV3>({
  emailJobInitiator: "test@email.com",
  type: "archive",
  jobParams: {},
  datasetList: [],
  executionTime: "",
  jobStatusMessage: "",
  jobResultObject: {},
});

const outputJob = createMock<OutputJobV3Dto>({
  id: "testId",
  emailJobInitiator: "test@email.com",
  type: "archive",
  creationTime: "",
  executionTime: "",
  jobParams: {},
  jobStatusMessage: "",
  datasetList: [],
  jobResultObject: {},
});

describe("JobEffects", () => {
  let actions: TestObservable;
  let effects: JobEffects;
  let jobApi: jasmine.SpyObj<JobsService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JobEffects,
        provideMockActions(() => actions),
        provideMockStore({
          selectors: [{ selector: selectQueryParams, value: {} }],
        }),
        {
          provide: JobsService,
          useValue: jasmine.createSpyObj("jobApi", [
            "jobsControllerFindAllV3V3",
            "jobsControllerFindOneV3V3",
            "jobsControllerCreateV3V3",
          ]),
        },
      ],
    });

    effects = TestBed.inject(JobEffects);
    jobApi = injectedStub(JobsService);
  });

  const injectedStub = <S>(service: Type<S>): jasmine.SpyObj<S> =>
    TestBed.inject(service) as jasmine.SpyObj<S>;

  describe("fetchJobs$", () => {
    describe("on fetchJobsAction", () => {
      it("should result in a fetchJobsCompleteAction and a fetchCountAction", () => {
        const jobs = [outputJob];
        const action = fromActions.fetchJobsAction();
        const outcome1 = fromActions.fetchJobsCompleteAction({ jobs });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: jobs });
        jobApi.jobsControllerFindAllV3V3.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchJobs$).toBeObservable(expected);
      });

      it("should result in a fetchJobsFailedAction", () => {
        const action = fromActions.fetchJobsAction();
        const outcome = fromActions.fetchJobsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        jobApi.jobsControllerFindAllV3V3.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchJobs$).toBeObservable(expected);
      });
    });

    describe("on changePageAction", () => {
      const page = 1;
      const limit = 25;

      it("should result in a fetchJobsCompleteAction and a fetchCountAction", () => {
        const jobs = [outputJob];
        const action = fromActions.changePageAction({ page, limit });
        const outcome1 = fromActions.fetchJobsCompleteAction({ jobs });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: jobs });
        jobApi.jobsControllerFindAllV3V3.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchJobs$).toBeObservable(expected);
      });

      it("should result in a fetchJobsFailedAction", () => {
        const action = fromActions.changePageAction({ page, limit });
        const outcome = fromActions.fetchJobsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        jobApi.jobsControllerFindAllV3V3.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchJobs$).toBeObservable(expected);
      });
    });

    describe("on sortByColumnAction", () => {
      const column = "test";
      const direction = "desc";

      it("should result in a fetchJobsCompleteAction and a fetchCountAction", () => {
        const jobs = [outputJob];
        const action = fromActions.sortByColumnAction({ column, direction });
        const outcome1 = fromActions.fetchJobsCompleteAction({ jobs });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: jobs });
        jobApi.jobsControllerFindAllV3V3.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchJobs$).toBeObservable(expected);
      });

      it("should result in a fetchJobsFailedAction", () => {
        const action = fromActions.sortByColumnAction({ column, direction });
        const outcome = fromActions.fetchJobsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        jobApi.jobsControllerFindAllV3V3.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchJobs$).toBeObservable(expected);
      });
    });

    describe("on sortByColumnAction", () => {
      const mode = null;

      it("should result in a fetchJobsCompleteAction and a fetchCountAction", () => {
        const jobs = [outputJob];
        const action = fromActions.setJobViewModeAction({ mode });
        const outcome1 = fromActions.fetchJobsCompleteAction({ jobs });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: jobs });
        jobApi.jobsControllerFindAllV3V3.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchJobs$).toBeObservable(expected);
      });

      it("should result in a fetchJobsFailedAction", () => {
        const action = fromActions.setJobViewModeAction({ mode });
        const outcome = fromActions.fetchJobsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        jobApi.jobsControllerFindAllV3V3.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchJobs$).toBeObservable(expected);
      });
    });
  });

  describe("updateUserJobsLimit$", () => {
    it("should result in an updateUserSettingsAction", () => {
      const page = 0;
      const limit = 25;
      const property = { jobCount: limit };
      const action = fromActions.changePageAction({ page, limit });
      const outcome = updateUserSettingsAction({ property });

      actions = hot("-a", { a: action });

      const expected = cold("-b", { b: outcome });
      expect(effects.updateUserJobsLimit$).toBeObservable(expected);
    });
  });

  describe("fetchJob$", () => {
    const jobId = "testId";

    it("should result in a fetchJobCompleteAction", () => {
      const action = fromActions.fetchJobAction({ jobId });
      const outcome = fromActions.fetchJobCompleteAction({ job: outputJob });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: outputJob });
      jobApi.jobsControllerFindOneV3V3.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchJob$).toBeObservable(expected);
    });

    it("should result in a fetchJobFailedAction", () => {
      const action = fromActions.fetchJobAction({ jobId });
      const outcome = fromActions.fetchJobFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      jobApi.jobsControllerFindOneV3V3.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchJob$).toBeObservable(expected);
    });
  });

  describe("submitJob$", () => {
    it("should result in a submitJobCompleteAction", () => {
      const action = fromActions.submitJobAction({ job: createJob });
      const outcome = fromActions.submitJobCompleteAction({ job: outputJob });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: outputJob });
      jobApi.jobsControllerCreateV3V3.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.submitJob$).toBeObservable(expected);
    });
  });

  describe("submitJobCompleteMessage$", () => {
    it("should dispatch a showMessageAction", () => {
      const message = {
        type: MessageType.Success,
        content: "Job Created Successfully",
        duration: 5000,
      };
      const action = fromActions.submitJobCompleteAction({ job: outputJob });
      const outcome = showMessageAction({ message });

      actions = hot("-a", { a: action });

      const expected = cold("-b", { b: outcome });
      expect(effects.submitJobCompleteMessage$).toBeObservable(expected);
    });
  });

  describe("submitJobFailed$", () => {
    it("should dispatch a showMessageAction", () => {
      const err = new Error("Test");
      const message = {
        type: MessageType.Error,
        content: "Job Not Submitted: " + err.message,
        duration: 5000,
      };
      const action = fromActions.submitJobFailedAction({ err });
      const outcome = showMessageAction({ message });

      actions = hot("-a", { a: action });

      const expected = cold("-b", { b: outcome });
      expect(effects.submitJobFailedMessage$).toBeObservable(expected);
    });
  });

  describe("loading$", () => {
    describe("ofType fetchJobsAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchJobsAction();
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchCountAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchCountAction();
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchJobAction", () => {
      it("should dispatch a loadingAction", () => {
        const jobId = "testId";
        const action = fromActions.fetchJobAction({ jobId });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType submitJobAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.submitJobAction({
          job: createJob,
        });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });
  });

  describe("loadingComplete$", () => {
    describe("ofType fetchJobsFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchJobsFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchCountCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const count = 100;
        const action = fromActions.fetchCountCompleteAction({ count });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchCountFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchCountFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchJobFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchJobFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType submitJobCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.submitJobCompleteAction({ job: outputJob });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType submitJobFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const err = new Error("test");
        const action = fromActions.submitJobFailedAction({ err });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });
  });
});
