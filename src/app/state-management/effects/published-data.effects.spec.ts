import { Observable } from "rxjs";
import { PublishedDataEffects } from "./published-data.effects";
import {
  PublishedDataApi,
  PublishedDataInterface,
  PublishedData
} from "shared/sdk";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { getQueryParams } from "state-management/selectors/published-data.selectors";
import * as fromActions from "state-management/actions/published-data.actions";
import { hot, cold } from "jasmine-marbles";
import { MessageType } from "state-management/models";
import {
  showMessageAction,
  loadingAction,
  loadingCompleteAction
} from "state-management/actions/user.actions";
import { Type } from "@angular/core";

const data: PublishedDataInterface = {
  doi: "testDOI",
  affiliation: "test affiliation",
  creator: ["test creator"],
  publisher: "test publisher",
  publicationYear: 2019,
  title: "test title",
  abstract: "test abstract",
  dataDescription: "test description",
  resourceType: "test type",
  pidArray: ["testPid"],
};
const publishedData = new PublishedData(data);

describe("PublishedDataEffects", () => {
  let actions: Observable<any>;
  let effects: PublishedDataEffects;
  let publishedDataApi: jasmine.SpyObj<PublishedDataApi>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PublishedDataEffects,
        provideMockActions(() => actions),
        provideMockStore({
          selectors: [{ selector: getQueryParams, value: {} }]
        }),
        {
          provide: PublishedDataApi,
          useValue: jasmine.createSpyObj("publsihedDataApi", [
            "find",
            "count",
            "findById",
            "create",
            "register"
          ])
        }
      ]
    });

    effects = TestBed.inject(PublishedDataEffects);
    publishedDataApi = injectedStub(PublishedDataApi);
  });

  function injectedStub<S>(service: Type<S>): jasmine.SpyObj<S> {
    return TestBed.inject(service) as jasmine.SpyObj<S>;
  }

  describe("fetchAllPublishedData$", () => {
    describe("ofType fetchAllPublishedDataAction", () => {
      it("should result in a fetchAllPublishedDataCompleteAction and a fetchCountAction", () => {
        const allPublishedData = [publishedData];
        const action = fromActions.fetchAllPublishedDataAction();
        const outcome1 = fromActions.fetchAllPublishedDataCompleteAction({
          publishedData: allPublishedData
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: allPublishedData });
        publishedDataApi.find.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchAllPublishedData$).toBeObservable(expected);
      });

      it("should result in a fetchAllPublishedDataFailedAction", () => {
        const action = fromActions.fetchAllPublishedDataAction();
        const outcome = fromActions.fetchAllPublishedDataFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        publishedDataApi.find.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchAllPublishedData$).toBeObservable(expected);
      });
    });

    describe("ofType changePageAction", () => {
      const page = 1;
      const limit = 25;

      it("should result in a fetchAllPublishedDataCompleteAction and a fetchCountAction", () => {
        const allPublishedData = [publishedData];
        const action = fromActions.changePageAction({ page, limit });
        const outcome1 = fromActions.fetchAllPublishedDataCompleteAction({
          publishedData: allPublishedData
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: allPublishedData });
        publishedDataApi.find.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchAllPublishedData$).toBeObservable(expected);
      });

      it("should result in a fetchAllPublishedDataFailedAction", () => {
        const action = fromActions.changePageAction({ page, limit });
        const outcome = fromActions.fetchAllPublishedDataFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        publishedDataApi.find.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchAllPublishedData$).toBeObservable(expected);
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
      publishedDataApi.count.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });

    it("should result in a fetchCountFailedAction", () => {
      const action = fromActions.fetchCountAction();
      const outcome = fromActions.fetchCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      publishedDataApi.count.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });
  });

  describe("fetchPublishedData$", () => {
    it("should result in a fetchPublishedDataCompleteAction", () => {
      const id = "testId";
      const action = fromActions.fetchPublishedDataAction({ id });
      const outcome = fromActions.fetchPublishedDataCompleteAction({
        publishedData
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: publishedData });
      publishedDataApi.findById.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchPublishedData$).toBeObservable(expected);
    });

    it("should result in a fetchPublishedDataFailedAction", () => {
      const id = "testId";
      const action = fromActions.fetchPublishedDataAction({ id });
      const outcome = fromActions.fetchPublishedDataFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      publishedDataApi.findById.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchPublishedData$).toBeObservable(expected);
    });
  });

  describe("publishDataset$", () => {
    it("should result in a publishDatasetCompleteAction, a fetchPublishedDataAction", () => {
      const id = "testDOI";
      const action = fromActions.publishDatasetAction({ data: publishedData });
      const outcome1 = fromActions.publishDatasetCompleteAction({
        publishedData
      });
      const outcome2 = fromActions.fetchPublishedDataAction({ id });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: publishedData });
      publishedDataApi.create.and.returnValue(response);

      const expected = cold("--(bc)", {
        b: outcome1,
        c: outcome2,
      });
      expect(effects.publishDataset$).toBeObservable(expected);
    });

    it("should result in a publishDatasetFailedAction", () => {
      const action = fromActions.publishDatasetAction({ data: publishedData });
      const outcome = fromActions.publishDatasetFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      publishedDataApi.create.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.publishDataset$).toBeObservable(expected);
    });
  });

  describe("publishDatasetCompleteMessage$", () => {
    it("should return a success message", () => {
      const message = {
        type: MessageType.Success,
        content: "Publication Successful",
        duration: 5000
      };
      const action = fromActions.publishDatasetCompleteAction({
        publishedData
      });
      const outcome = showMessageAction({ message });

      actions = hot("-a", { a: action });

      const expected = cold("-b", { b: outcome });
      expect(effects.publishDatasetCompleteMessage$).toBeObservable(expected);
    });
  });

  describe("publishDatasetFailedMessage$", () => {
    it("should return an error message", () => {
      const message = {
        type: MessageType.Error,
        content: "Publication Failed",
        duration: 5000
      };
      const action = fromActions.publishDatasetFailedAction();
      const outcome = showMessageAction({ message });

      actions = hot("-a", { a: action });

      const expected = cold("-b", { b: outcome });
      expect(effects.publishDatasetFailedMessage$).toBeObservable(expected);
    });
  });

  describe("registerPublishedData$", () => {
    it("should result in a registerPublishedDataCompleteAction", () => {
      const doi = "testDOI";
      const action = fromActions.registerPublishedDataAction({ doi });
      const outcome = fromActions.registerPublishedDataCompleteAction({
        publishedData
      });
      const outcome1 = fromActions.fetchPublishedDataAction({ id: doi });


      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: publishedData });
      publishedDataApi.register.and.returnValue(response);

      const expected = cold("--(bc)", { b: outcome, c: outcome1 });
      expect(effects.registerPublishedData$).toBeObservable(expected);
    });

    it("should result in a registerPublishedDataFailedAction", () => {
      const doi = "testDOI";
      const action = fromActions.registerPublishedDataAction({ doi });
      const outcome = fromActions.registerPublishedDataFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      publishedDataApi.register.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.registerPublishedData$).toBeObservable(expected);
    });
  });

  describe("loading$", () => {
    describe("ofType fetchAllPublishedDataAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchAllPublishedDataAction();
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

    describe("ofType fetchPublishedDataAction", () => {
      it("should dispatch a loadingAction", () => {
        const id = "testId";
        const action = fromActions.fetchPublishedDataAction({ id });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType publishedDatasetAction", () => {
      it("should dispatch a loadingAction", () => {
        const id = "testId";
        const action = fromActions.publishDatasetAction({
          data: publishedData
        });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType registerPublishedDataAction", () => {
      it("should dispatch a loadingAction", () => {
        const doi = "testDOI";
        const action = fromActions.registerPublishedDataAction({ doi });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });
  });

  describe("loadingComplete$", () => {
    describe("ofType fetchAllPublishedDataCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const allPublishedData = [publishedData];
        const action = fromActions.fetchAllPublishedDataCompleteAction({
          publishedData: allPublishedData
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchAllPublishedDataFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchAllPublishedDataFailedAction();
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

    describe("ofType publishDatasetCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.publishDatasetCompleteAction({
          publishedData
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType publishDatasetFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.publishDatasetFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType registerPublishedDataCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.registerPublishedDataCompleteAction({
          publishedData
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType registerPublishedDataFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.registerPublishedDataFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });
  });
});
