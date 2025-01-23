import { InstrumentEffects } from "./instruments.effects";
import { InstrumentsService } from "@scicatproject/scicat-sdk-ts-angular";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import * as fromActions from "state-management/actions/instruments.actions";
import { hot, cold } from "jasmine-marbles";
import { provideMockStore } from "@ngrx/store/testing";
import { selectFilters } from "state-management/selectors/instruments.selectors";
import {
  loadingAction,
  loadingCompleteAction,
} from "state-management/actions/user.actions";
import { Type } from "@angular/core";
import { TestObservable } from "jasmine-marbles/src/test-observables";
import { mockInstrument as instrument } from "shared/MockStubs";

describe("InstrumentEffects", () => {
  let actions: TestObservable;
  let effects: InstrumentEffects;
  let instrumentApi: jasmine.SpyObj<InstrumentsService>;

  const instruments = [instrument];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InstrumentEffects,
        provideMockActions(() => actions),
        provideMockStore({
          selectors: [
            {
              selector: selectFilters,
              value: { sortField: "test asc", skip: 0, limit: 25 },
            },
          ],
        }),
        {
          provide: InstrumentsService,
          useValue: jasmine.createSpyObj("instrumentApi", [
            "instrumentsControllerFindAll",
            "instrumentsControllerFindById",
            "instrumentsControllerUpdate",
          ]),
        },
      ],
    });

    effects = TestBed.inject(InstrumentEffects);
    instrumentApi = injectedStub(InstrumentsService);
  });

  const injectedStub = <S>(service: Type<S>): jasmine.SpyObj<S> =>
    TestBed.inject(service) as jasmine.SpyObj<S>;

  describe("fetchInstruments$", () => {
    describe("ofType fetchInstrumentAction", () => {
      it("should result in a fetchInstrumentsCompleteAction and a fetchCountAction", () => {
        const action = fromActions.fetchInstrumentsAction();
        const outcome1 = fromActions.fetchInstrumentsCompleteAction({
          instruments,
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: instruments });
        instrumentApi.instrumentsControllerFindAll.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchInstruments$).toBeObservable(expected);
      });

      it("should result in a fetchInstrumentsFailedAction", () => {
        const action = fromActions.fetchInstrumentsAction();
        const outcome = fromActions.fetchInstrumentsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        instrumentApi.instrumentsControllerFindAll.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchInstruments$).toBeObservable(expected);
      });
    });

    describe("ofType changePageAction", () => {
      const page = 0;
      const limit = 25;

      it("should result in a fetchInstrumentsCompleteAction and a fetchCountAction", () => {
        const action = fromActions.changePageAction({ page, limit });
        const outcome1 = fromActions.fetchInstrumentsCompleteAction({
          instruments,
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: instruments });
        instrumentApi.instrumentsControllerFindAll.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchInstruments$).toBeObservable(expected);
      });

      it("should result in a fetchInstrumentsFailedAction", () => {
        const action = fromActions.changePageAction({ page, limit });
        const outcome = fromActions.fetchInstrumentsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        instrumentApi.instrumentsControllerFindAll.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchInstruments$).toBeObservable(expected);
      });
    });
    describe("ofType changePageAction", () => {
      const page = 0;
      const limit = 25;

      it("should result in a fetchInstrumentsCompleteAction and a fetchCountAction", () => {
        const action = fromActions.changePageAction({ page, limit });
        const outcome1 = fromActions.fetchInstrumentsCompleteAction({
          instruments,
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: instruments });
        instrumentApi.instrumentsControllerFindAll.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchInstruments$).toBeObservable(expected);
      });

      it("should result in a fetchInstrumentsFailedAction", () => {
        const action = fromActions.changePageAction({ page, limit });
        const outcome = fromActions.fetchInstrumentsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        instrumentApi.instrumentsControllerFindAll.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchInstruments$).toBeObservable(expected);
      });
    });

    describe("ofType sortByColumnAction", () => {
      const column = "test";
      const direction = "asc";

      it("should result in a fetchInstrumentsCompleteAction and a fetchCountAction", () => {
        const action = fromActions.sortByColumnAction({ column, direction });
        const outcome1 = fromActions.fetchInstrumentsCompleteAction({
          instruments,
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: instruments });
        instrumentApi.instrumentsControllerFindAll.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchInstruments$).toBeObservable(expected);
      });

      it("should result in a fetchInstrumentsFailedAction", () => {
        const action = fromActions.sortByColumnAction({ column, direction });
        const outcome = fromActions.fetchInstrumentsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        instrumentApi.instrumentsControllerFindAll.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchInstruments$).toBeObservable(expected);
      });
    });
  });

  describe("fetchCount$", () => {
    it("should result in a fetchCountCompleteAction", () => {
      const action = fromActions.fetchCountAction();
      const outcome = fromActions.fetchCountCompleteAction({
        count: instruments.length,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: instruments });
      instrumentApi.instrumentsControllerFindAll.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });

    it("should result in a fetchCountFailedAction", () => {
      const action = fromActions.fetchCountAction();
      const outcome = fromActions.fetchCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      instrumentApi.instrumentsControllerFindAll.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });
  });

  describe("fetchInstrument$", () => {
    const pid = "testPid";

    it("should result in a fetchInstrumentCompleteAction", () => {
      const action = fromActions.fetchInstrumentAction({ pid });
      const outcome = fromActions.fetchInstrumentCompleteAction({ instrument });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: instrument });
      instrumentApi.instrumentsControllerFindById.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchInstrument$).toBeObservable(expected);
    });

    it("should result in a fetchInstrumentFailedAction", () => {
      const action = fromActions.fetchInstrumentAction({ pid });
      const outcome = fromActions.fetchInstrumentFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      instrumentApi.instrumentsControllerFindById.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchInstrument$).toBeObservable(expected);
    });
  });

  describe("saveCustomMetadata$", () => {
    const pid = "testPid";
    const customMetadata = {};

    it("should result in a saveCustomMetadataCompleteAction", () => {
      const action = fromActions.saveCustomMetadataAction({
        pid,
        customMetadata,
      });
      const outcome = fromActions.saveCustomMetadataCompleteAction({
        instrument,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: instrument });
      instrumentApi.instrumentsControllerUpdate.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.saveCustomMetadata$).toBeObservable(expected);
    });

    it("should result in a saveCustomMetadataFailedAction", () => {
      const action = fromActions.saveCustomMetadataAction({
        pid,
        customMetadata,
      });
      const outcome = fromActions.saveCustomMetadataFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      instrumentApi.instrumentsControllerUpdate.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.saveCustomMetadata$).toBeObservable(expected);
    });
  });

  describe("loading$", () => {
    describe("ofType fetchInstrumentsAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchInstrumentsAction();
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

    describe("ofType fetchInstrumentAction", () => {
      it("should dispatch a loadingAction", () => {
        const pid = "testPid";
        const action = fromActions.fetchInstrumentAction({ pid });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType saveCustomMetadataAction", () => {
      it("should dispatch a loadingAction", () => {
        const pid = "testPid";
        const customMetadata = {};
        const action = fromActions.saveCustomMetadataAction({
          pid,
          customMetadata,
        });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });
  });

  describe("loadingComplete$", () => {
    describe("ofType fetchInstrumentsCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchInstrumentsCompleteAction({
          instruments,
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchInstrumentsFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchInstrumentsFailedAction();
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

    describe("ofType fetchInstrumentCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchInstrumentCompleteAction({
          instrument,
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchInstrumentFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchInstrumentFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType saveCustomMetadataCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.saveCustomMetadataCompleteAction({
          instrument,
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType saveCustomMetadataFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.saveCustomMetadataFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });
  });
});
