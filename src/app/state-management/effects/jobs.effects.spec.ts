import { JobInterface, Job, JobApi } from "shared/sdk";
import { Observable } from "rxjs";
import { JobEffects } from "./jobs.effects";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { getQueryParams } from "state-management/selectors/jobs.selectors";
import * as fromActions from "state-management/actions/jobs.actions";
import { hot, cold } from "jasmine-marbles";

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
    it("should result in a fetchJobsCompleteAction", () => {
      const jobs = [job];
      const action = fromActions.fetchJobsAction();
      const outcome = fromActions.fetchJobsCompleteAction({ jobs });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: jobs });
      jobApi.find.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
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

  describe("fetchCount$", () => {
    it("should result in a fetchCountCompleteAction", () => {
      const count = 100;
      const action = fromActions.fetchJobsAction();
      const outcome = fromActions.fetchCountCompleteAction({ count });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: { count } });
      jobApi.count.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });

    it("should result in a fetchCountFailedAction", () => {
      const action = fromActions.fetchJobsAction();
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
});
