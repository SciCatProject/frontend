import { JobInterface, Job, JobApi } from "shared/sdk";
import { Observable } from "rxjs";
import { JobEffects } from "./jobs.effects";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { getQueryParams } from "state-management/selectors/jobs.selectors";
import * as fromActions from "state-management/actions/jobs.actions";
import { hot, cold } from "jasmine-marbles";
import {
  showMessageAction,
  setLoadingStatusAction
} from "state-management/actions/user.actions";
import { MessageType } from "state-management/models";

const data: JobInterface = {
  id: "testId",
  emailJobInitiator: "test@email.com",
  type: "archive",
  datasetList: {}
};
const job = new Job(data);

describe("JobEffects", () => {
  let actions: Observable<any>;
  let effects: JobEffects;
  let jobApi: jasmine.SpyObj<JobApi>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JobEffects,
        provideMockActions(() => actions),
        provideMockStore({
          selectors: [{ selector: getQueryParams, value: {} }]
        }),
        {
          provide: JobApi,
          useValue: jasmine.createSpyObj("jobApi", [
            "find",
            "count",
            "findById",
            "create"
          ])
        }
      ]
    });

    effects = TestBed.get(JobEffects);
    jobApi = TestBed.get(JobApi);
  });

  describe("fetchJobs$", () => {
    describe("on fetchJobsAction", () => {
      it("should result in a fetchJobsCompleteAction and a fetchCountAction", () => {
        const jobs = [job];
        const action = fromActions.fetchJobsAction();
        const outcome1 = fromActions.fetchJobsCompleteAction({ jobs });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: jobs });
        jobApi.find.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchJobs$).toBeObservable(expected);
      });

      it("should result in a fetchJobsFailedAction", () => {
        const action = fromActions.fetchJobsAction();
        const outcome = fromActions.fetchJobsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        jobApi.find.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchJobs$).toBeObservable(expected);
      });
    });

    describe("on changePageAction", () => {
      const page = 1;
      const limit = 25;

      it("should result in a fetchJobsCompleteAction and a fetchCountAction", () => {
        const jobs = [job];
        const action = fromActions.changePageAction({ page, limit });
        const outcome1 = fromActions.fetchJobsCompleteAction({ jobs });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: jobs });
        jobApi.find.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchJobs$).toBeObservable(expected);
      });

      it("should result in a fetchJobsFailedAction", () => {
        const action = fromActions.changePageAction({ page, limit });
        const outcome = fromActions.fetchJobsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        jobApi.find.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchJobs$).toBeObservable(expected);
      });
    });

    describe("on sortByColumnAction", () => {
      const column = "test";
      const direction = "desc";

      it("should result in a fetchJobsCompleteAction and a fetchCountAction", () => {
        const jobs = [job];
        const action = fromActions.sortByColumnAction({ column, direction });
        const outcome1 = fromActions.fetchJobsCompleteAction({ jobs });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: jobs });
        jobApi.find.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchJobs$).toBeObservable(expected);
      });

      it("should result in a fetchJobsFailedAction", () => {
        const action = fromActions.sortByColumnAction({ column, direction });
        const outcome = fromActions.fetchJobsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        jobApi.find.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchJobs$).toBeObservable(expected);
      });
    });

    describe("on sortByColumnAction", () => {
      const mode = null;

      it("should result in a fetchJobsCompleteAction and a fetchCountAction", () => {
        const jobs = [job];
        const action = fromActions.setJobViewModeAction({ mode });
        const outcome1 = fromActions.fetchJobsCompleteAction({ jobs });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: jobs });
        jobApi.find.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchJobs$).toBeObservable(expected);
      });

      it("should result in a fetchJobsFailedAction", () => {
        const action = fromActions.setJobViewModeAction({ mode });
        const outcome = fromActions.fetchJobsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        jobApi.find.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchJobs$).toBeObservable(expected);
      });
    });
  });

  describe("fetchCount$", () => {
    it("should result in a fetchCountCompleteAction", () => {
      const count = 100;
      const action = fromActions.fetchCountAction();
      const outcome = fromActions.fetchCountCompleteAction({ count });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: { count } });
      jobApi.count.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });

    it("should result in a fetchCountFailedAction", () => {
      const action = fromActions.fetchCountAction();
      const outcome = fromActions.fetchCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      jobApi.count.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });
  });

  describe("fetchJob$", () => {
    const jobId = "testId";

    it("should result in a fetchJobCompleteAction", () => {
      const action = fromActions.fetchJobAction({ jobId });
      const outcome = fromActions.fetchJobCompleteAction({ job });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: job });
      jobApi.findById.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchJob$).toBeObservable(expected);
    });

    it("should result in a fetchJobFailedAction", () => {
      const action = fromActions.fetchJobAction({ jobId });
      const outcome = fromActions.fetchJobFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      jobApi.findById.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchJob$).toBeObservable(expected);
    });
  });

  describe("submitJob$", () => {
    it("should result in a submitJobCompleteAction", () => {
      const action = fromActions.submitJobAction({ job });
      const outcome = fromActions.submitJobCompleteAction({ job });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: job });
      jobApi.create.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.submitJob$).toBeObservable(expected);
    });
  });

  describe("submitJobCompleteMessage$", () => {
    it("should dispatch a showMessageAction", () => {
      const message = {
        type: MessageType.Success,
        content: "Job Created Successfully",
        duration: 5000
      };
      const action = fromActions.submitJobCompleteAction({ job });
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
        duration: 5000
      };
      const action = fromActions.submitJobFailedAction({ err });
      const outcome = showMessageAction({ message });

      actions = hot("-a", { a: action });

      const expected = cold("-b", { b: outcome });
      expect(effects.submitJobFailedMessage$).toBeObservable(expected);
    });
  });

  describe("isLoading$", () => {
    describe("ofType fetchJobsAction", () => {
      it("should dispatch a setLoadingStatusAction with value true", () => {
        const value = true;
        const action = fromActions.fetchJobsAction();
        const outcome = setLoadingStatusAction({ value });

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.isLoading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchCountAction", () => {
      it("should dispatch a setLoadingStatusAction with value true", () => {
        const value = true;
        const action = fromActions.fetchCountAction();
        const outcome = setLoadingStatusAction({ value });

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.isLoading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchJobAction", () => {
      it("should dispatch a setLoadingStatusAction with value true", () => {
        const jobId = "testId";
        const value = true;
        const action = fromActions.fetchJobAction({ jobId });
        const outcome = setLoadingStatusAction({ value });

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.isLoading$).toBeObservable(expected);
      });
    });

    describe("ofType submitJobAction", () => {
      it("should dispatch a setLoadingStatusAction with value true", () => {
        const value = true;
        const action = fromActions.submitJobAction({ job });
        const outcome = setLoadingStatusAction({ value });

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.isLoading$).toBeObservable(expected);
      });
    });
  });

  describe("isNotLoading$", () => {
    describe("ofType fetchJobsCompleteAction", () => {
      it("should dispatch a setLoadingStatusAction with value false", () => {
        const jobs = [job];
        const value = false;
        const action = fromActions.fetchJobsCompleteAction({ jobs });
        const outcome = setLoadingStatusAction({ value });

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.isNotLoading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchJobsFailedAction", () => {
      it("should dispatch a setLoadingStatusAction with value false", () => {
        const value = false;
        const action = fromActions.fetchJobsFailedAction();
        const outcome = setLoadingStatusAction({ value });

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.isNotLoading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchCountCompleteAction", () => {
      it("should dispatch a setLoadingStatusAction with value false", () => {
        const count = 100;
        const value = false;
        const action = fromActions.fetchCountCompleteAction({ count });
        const outcome = setLoadingStatusAction({ value });

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.isNotLoading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchCountFailedAction", () => {
      it("should dispatch a setLoadingStatusAction with value false", () => {
        const value = false;
        const action = fromActions.fetchCountFailedAction();
        const outcome = setLoadingStatusAction({ value });

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.isNotLoading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchJobCompleteAction", () => {
      it("should dispatch a setLoadingStatusAction with value false", () => {
        const value = false;
        const action = fromActions.fetchJobCompleteAction({ job });
        const outcome = setLoadingStatusAction({ value });

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.isNotLoading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchJobFailedAction", () => {
      it("should dispatch a setLoadingStatusAction with value false", () => {
        const value = false;
        const action = fromActions.fetchJobFailedAction();
        const outcome = setLoadingStatusAction({ value });

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.isNotLoading$).toBeObservable(expected);
      });
    });

    describe("ofType submitJobCompleteAction", () => {
      it("should dispatch a setLoadingStatusAction with value false", () => {
        const value = false;
        const action = fromActions.submitJobCompleteAction({ job });
        const outcome = setLoadingStatusAction({ value });

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.isNotLoading$).toBeObservable(expected);
      });
    });

    describe("ofType submitJobFailedAction", () => {
      it("should dispatch a setLoadingStatusAction with value false", () => {
        const err = new Error("test");
        const value = false;
        const action = fromActions.submitJobFailedAction({ err });
        const outcome = setLoadingStatusAction({ value });

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.isNotLoading$).toBeObservable(expected);
      });
    });
  });
});
