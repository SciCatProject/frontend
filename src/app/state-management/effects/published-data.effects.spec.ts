import { PublishedDataEffects } from "./published-data.effects";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { selectQueryParams } from "state-management/selectors/published-data.selectors";
import * as fromActions from "state-management/actions/published-data.actions";
import { clearBatchAction } from "state-management/actions/datasets.actions";
import { hot, cold } from "jasmine-marbles";
import { MessageType } from "state-management/models";
import {
  showMessageAction,
  loadingAction,
  loadingCompleteAction,
} from "state-management/actions/user.actions";
import { Type } from "@angular/core";
import { Router } from "@angular/router";
import { MockRouter, createMock } from "shared/MockStubs";
import {
  DatasetsV4Service,
  PublishedData,
  PublishedDataV4Service,
} from "@scicatproject/scicat-sdk-ts-angular";
import { TestObservable } from "jasmine-marbles/src/test-observables";

const publishedData = createMock<PublishedData>({
  doi: "testDOI",
  title: "test title",
  abstract: "test abstract",
  datasetPids: ["testPid"],
  createdAt: "",
  registeredTime: "",
  updatedAt: "",
  numberOfFiles: 1,
  sizeOfArchive: 1,
  metadata: {
    creators: ["test creator"],
    affiliation: "test affiliation",
    publisher: { name: "test publisher" },
    resourceType: "test type",
    url: "",
  },
  status: PublishedData.StatusEnum.private,
});

describe("PublishedDataEffects", () => {
  let actions: TestObservable;
  let effects: PublishedDataEffects;
  let publishedDataApi: jasmine.SpyObj<PublishedDataV4Service>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PublishedDataEffects,
        provideMockActions(() => actions),
        provideMockStore({
          selectors: [{ selector: selectQueryParams, value: {} }],
        }),
        {
          provide: PublishedDataV4Service,
          useValue: jasmine.createSpyObj("publsihedDataApi", [
            "publishedDataV4ControllerFindAllV4",
            "publishedDataV4ControllerCountV4",
            "publishedDataV4ControllerFindOneV4",
            "publishedDataV4ControllerCreateV4",
            "publishedDataV4ControllerRegisterV4",
          ]),
        },
        {
          provide: DatasetsV4Service,
          useValue: jasmine.createSpyObj("datasetsV4Service", [
            "datasetsV4ControllerFindAllV4",
          ]),
        },
        { provide: Router, useClass: MockRouter },
      ],
    });

    effects = TestBed.inject(PublishedDataEffects);
    publishedDataApi = injectedStub(PublishedDataV4Service);
  });

  const injectedStub = <S>(service: Type<S>): jasmine.SpyObj<S> =>
    TestBed.inject(service) as jasmine.SpyObj<S>;

  describe("fetchAllPublishedData$", () => {
    describe("ofType fetchAllPublishedDataAction", () => {
      it("should result in a fetchAllPublishedDataCompleteAction and a fetchCountAction", () => {
        const allPublishedData = [publishedData];
        const action = fromActions.fetchAllPublishedDataAction();
        const outcome1 = fromActions.fetchAllPublishedDataCompleteAction({
          publishedData: allPublishedData,
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: allPublishedData });
        publishedDataApi.publishedDataV4ControllerFindAllV4.and.returnValue(
          response,
        );

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchAllPublishedData$).toBeObservable(expected);
      });

      it("should result in a fetchAllPublishedDataFailedAction", () => {
        const action = fromActions.fetchAllPublishedDataAction();
        const outcome = fromActions.fetchAllPublishedDataFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        publishedDataApi.publishedDataV4ControllerFindAllV4.and.returnValue(
          response,
        );

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
          publishedData: allPublishedData,
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: allPublishedData });
        publishedDataApi.publishedDataV4ControllerFindAllV4.and.returnValue(
          response,
        );

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchAllPublishedData$).toBeObservable(expected);
      });

      it("should result in a fetchAllPublishedDataFailedAction", () => {
        const action = fromActions.changePageAction({ page, limit });
        const outcome = fromActions.fetchAllPublishedDataFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        publishedDataApi.publishedDataV4ControllerFindAllV4.and.returnValue(
          response,
        );

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
      publishedDataApi.publishedDataV4ControllerCountV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });

    it("should result in a fetchCountFailedAction", () => {
      const action = fromActions.fetchCountAction();
      const outcome = fromActions.fetchCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      publishedDataApi.publishedDataV4ControllerCountV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });
  });

  describe("fetchPublishedData$", () => {
    it("should result in a fetchPublishedDataCompleteAction", () => {
      const id = "testId";
      const action = fromActions.fetchPublishedDataAction({ id });
      const outcome = fromActions.fetchPublishedDataCompleteAction({
        publishedData,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: publishedData });
      publishedDataApi.publishedDataV4ControllerFindOneV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchPublishedData$).toBeObservable(expected);
    });

    it("should result in a fetchPublishedDataFailedAction", () => {
      const id = "testId";
      const action = fromActions.fetchPublishedDataAction({ id });
      const outcome = fromActions.fetchPublishedDataFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      publishedDataApi.publishedDataV4ControllerFindOneV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchPublishedData$).toBeObservable(expected);
    });
  });

  describe("publishDataset$", () => {
    it("should result in a publishDatasetCompleteAction, a fetchPublishedDataAction", () => {
      const id = "testDOI";
      const action = fromActions.createPublishedDataAction({
        data: publishedData,
      });
      const outcome1 = fromActions.createPublishedDataCompleteAction({
        publishedData,
      });
      const outcome2 = fromActions.fetchPublishedDataAction({ id });
      const outcome3 = clearBatchAction();
      const outcome4 = fromActions.clearPublishedDataFromLocalStorage();

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: publishedData });
      publishedDataApi.publishedDataV4ControllerCreateV4.and.returnValue(
        response,
      );

      const expected = cold("--(bcde)", {
        b: outcome1,
        c: outcome2,
        d: outcome3,
        e: outcome4,
      });
      expect(effects.createPublishedData$).toBeObservable(expected);
    });

    it("should result in a publishDatasetFailedAction", () => {
      const action = fromActions.createPublishedDataAction({
        data: publishedData,
      });
      const outcome = fromActions.createPublishedDataFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      publishedDataApi.publishedDataV4ControllerCreateV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.createPublishedData$).toBeObservable(expected);
    });
  });

  describe("publishDatasetCompleteMessage$", () => {
    it("should return a success message", () => {
      const message = {
        type: MessageType.Success,
        content: "Publication Successful",
        duration: 5000,
      };
      const action = fromActions.createPublishedDataCompleteAction({
        publishedData,
      });
      const outcome = showMessageAction({ message });

      actions = hot("-a", { a: action });

      const expected = cold("-b", { b: outcome });
      expect(effects.createPublishedDataCompleteMessage$).toBeObservable(
        expected,
      );
    });
  });

  describe("publishDatasetFailedMessage$", () => {
    it("should return an error message", () => {
      const message = {
        type: MessageType.Error,
        content: "Publication Failed",
        duration: 5000,
      };
      const action = fromActions.createPublishedDataFailedAction();
      const outcome = showMessageAction({ message });

      actions = hot("-a", { a: action });

      const expected = cold("-b", { b: outcome });
      expect(effects.createPublishedDataFailedMessage$).toBeObservable(
        expected,
      );
    });
  });

  describe("registerPublishedData$", () => {
    it("should result in a registerPublishedDataCompleteAction", () => {
      const doi = "testDOI";
      const action = fromActions.registerPublishedDataAction({ doi });
      const outcome = fromActions.registerPublishedDataCompleteAction({
        publishedData,
      });
      const outcome1 = fromActions.fetchPublishedDataAction({ id: doi });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: publishedData });
      publishedDataApi.publishedDataV4ControllerRegisterV4.and.returnValue(
        response,
      );

      const expected = cold("--(bc)", { b: outcome, c: outcome1 });
      expect(effects.registerPublishedData$).toBeObservable(expected);
    });

    it("should result in a registerPublishedDataFailedAction", () => {
      const error = new Error("Test");
      const message = {
        type: MessageType.Error,
        content: "Registration Failed. " + error.message,
        duration: 5000,
      };
      const action = fromActions.registerPublishedDataFailedAction({
        error: [error.message],
      });
      const outcome = showMessageAction({ message });

      actions = hot("-a", { a: action });

      const expected = cold("-b", { b: outcome });
      expect(effects.registerPublishedDataFailedMessage$).toBeObservable(
        expected,
      );
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
        const action = fromActions.createPublishedDataAction({
          data: publishedData,
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
          publishedData: allPublishedData,
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
        const action = fromActions.createPublishedDataCompleteAction({
          publishedData,
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType publishDatasetFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.createPublishedDataFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType registerPublishedDataCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.registerPublishedDataCompleteAction({
          publishedData,
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType registerPublishedDataFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.registerPublishedDataFailedAction({
          error: [],
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });
  });
});
