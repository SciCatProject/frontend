import { OrigdatablocksService } from "@scicatproject/scicat-sdk-ts-angular";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import * as fromActions from "state-management/actions/files.actions";
import { hot, cold } from "jasmine-marbles";
import { provideMockStore } from "@ngrx/store/testing";
import {
  loadingAction,
  loadingCompleteAction,
} from "state-management/actions/user.actions";
import { Type } from "@angular/core";
import { TestObservable } from "jasmine-marbles/src/test-observables";
import { createMock } from "shared/MockStubs";
import { FilesEffects } from "./files.effects";

describe("FileEffects", () => {
  let actions: TestObservable;
  let effects: FilesEffects;
  let origDatablocksApi: jasmine.SpyObj<OrigdatablocksService>;

  const mockOrigDatablockFile = createMock<object>({
    _id: "2b568c4d-7b0f-47f5-b4af-b94098d6b98f",
    size: 913818,
    dataFileList: {
      path: "V20_ESSIntegration_2018-12-11_0952.nxs",
      size: 913818,
      time: "2018-12-11T08:53:29.000Z",
      chk: "string",
      uid: "10095",
      gid: "4064",
      perm: "755",
    },
    ownerGroup: "ess",
    accessGroups: ["brightness", "ess"],
    createdBy: "ingestor",
    updatedBy: "admin",
    datasetId: "20.500.12269/BRIGHTNESS/V200022",
    rawDatasetId: "20.500.12269/BRIGHTNESS/V200022",
    derivedDatasetId: "20.500.12269/BRIGHTNESS/V200022",
    createdAt: "2018-12-11T08:53:29.000Z",
    updatedAt: "2020-09-11T07:36:53.857Z",
    datasetExist: true,
  });

  const origDatablockFiles = [mockOrigDatablockFile];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FilesEffects,
        provideMockActions(() => actions),
        provideMockStore({
          selectors: [],
        }),
        {
          provide: OrigdatablocksService,
          useValue: jasmine.createSpyObj("origDatablocksApi", [
            "origDatablocksControllerFullqueryFilesV3",
            "origDatablocksControllerFullfacetFilesV3",
          ]),
        },
      ],
    });

    effects = TestBed.inject(FilesEffects);
    origDatablocksApi = injectedStub(OrigdatablocksService);
  });

  const injectedStub = <S>(service: Type<S>): jasmine.SpyObj<S> =>
    TestBed.inject(service) as jasmine.SpyObj<S>;

  describe("fetchAllOrigDatablocks$", () => {
    describe("ofType fetchAllOrigDatablocksAction", () => {
      it("should result in a fetchAllOrigDatablocksCompleteAction and a fetchCountAction", () => {
        const action = fromActions.fetchAllOrigDatablocksAction({});
        const outcome1 = fromActions.fetchAllOrigDatablocksCompleteAction({
          origDatablocks: origDatablockFiles,
        });
        const outcome2 = fromActions.fetchCountAction({
          fields: { text: undefined },
        });

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: origDatablockFiles });
        origDatablocksApi.origDatablocksControllerFullqueryFilesV3.and.returnValue(
          response,
        );

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchAllOrigDatablocks$).toBeObservable(expected);
      });

      it("should result in a fetchAllOrigDatablocksFailedAction", () => {
        const action = fromActions.fetchAllOrigDatablocksAction({});
        const outcome = fromActions.fetchAllOrigDatablocksFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        origDatablocksApi.origDatablocksControllerFullqueryFilesV3.and.returnValue(
          response,
        );

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchAllOrigDatablocks$).toBeObservable(expected);
      });
    });
  });

  describe("fetchCount$", () => {
    it("should result in a fetchCountCompleteAction", () => {
      const count = origDatablockFiles.length;
      const action = fromActions.fetchCountAction({});
      const outcome = fromActions.fetchCountCompleteAction({
        count,
      });

      const responseArray = [{ all: [{ totalSets: count }] }];

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: responseArray });
      origDatablocksApi.origDatablocksControllerFullfacetFilesV3.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });

    it("should result in a fetchCountFailedAction", () => {
      const action = fromActions.fetchCountAction({});
      const outcome = fromActions.fetchCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      origDatablocksApi.origDatablocksControllerFullfacetFilesV3.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });
  });

  describe("loading$", () => {
    describe("ofType fetchAllOrigDatablocksAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchAllOrigDatablocksAction({});
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchCountAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchCountAction({});
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });
  });

  describe("loadingComplete$", () => {
    describe("ofType fetchAllOrigDatablocksCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchAllOrigDatablocksCompleteAction({
          origDatablocks: origDatablockFiles,
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchAllOrigDatablocksFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchAllOrigDatablocksFailedAction();
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
  });
});
