import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { hot, cold } from "jasmine-marbles";
import { Observable } from "rxjs";
import { LogbookEffects } from "./logbooks.effects";
import { LogbookApi, Logbook } from "shared/sdk";
import * as fromActions from "state-management/actions/logbooks.actions";
import {
  loadingAction,
  loadingCompleteAction
} from "state-management/actions/user.actions";
import { provideMockStore } from "@ngrx/store/testing";
import { getFilters } from "state-management/selectors/logbooks.selectors";
import { Type } from "@angular/core";

const logbook: Logbook = {
  name: "test",
  roomId: "!test@site",
  messages: []
};

describe("LogbookEffects", () => {
  let actions: Observable<any>;
  let effects: LogbookEffects;
  let logbookApi: jasmine.SpyObj<LogbookApi>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LogbookEffects,
        provideMockActions(() => actions),
        provideMockStore({
          selectors: [
            {
              selector: getFilters,
              value: {
                textSearch: "",
                showBotMessages: true,
                showImages: true,
                showUserMessages: true
              }
            }
          ]
        }),
        {
          provide: LogbookApi,
          useValue: jasmine.createSpyObj("logbookApi", ["findAll", "filter"])
        }
      ]
    });

    effects = TestBed.inject(LogbookEffects);
    logbookApi = injectedStub(LogbookApi);
  });

  function injectedStub<S>(service: Type<S>): jasmine.SpyObj<S> {
    return TestBed.inject(service) as jasmine.SpyObj<S>;
  }

  describe("fetchLogbooks$", () => {
    it("should result in a fetchLogbooksCompleteAction", () => {
      const logbooks = [logbook];
      const action = fromActions.fetchLogbooksAction();
      const outcome = fromActions.fetchLogbooksCompleteAction({ logbooks });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: logbooks });
      logbookApi.findAll.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchLogbooks$).toBeObservable(expected);
    });

    it("should result in a fetchLogbooksFailedAction", () => {
      const action = fromActions.fetchLogbooksAction();
      const outcome = fromActions.fetchLogbooksFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      logbookApi.findAll.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchLogbooks$).toBeObservable(expected);
    });
  });

  describe("fetchLogbook$", () => {
    const name = "test";

    it("should result in a fetchLogbookCompleteAction and fetchCountAction", () => {
      const action = fromActions.fetchLogbookAction({ name });
      const outcome1 = fromActions.fetchLogbookCompleteAction({ logbook });
      const outcome2 = fromActions.fetchCountAction({ name });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: logbook });
      logbookApi.filter.and.returnValue(response);

      const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
      expect(effects.fetchLogbook$).toBeObservable(expected);
    });

    it("should result in a fetchLogbookFailedAction", () => {
      const action = fromActions.fetchLogbookAction({ name });
      const outcome = fromActions.fetchLogbookFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      logbookApi.filter.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchLogbook$).toBeObservable(expected);
    });
  });

  describe("fetchCount$", () => {
    const name = "test";
    it("should result in a fetchCountCompleteAction", () => {
      const count = 0;
      const action = fromActions.fetchCountAction({ name });
      const outcome = fromActions.fetchCountCompleteAction({ count });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: logbook });
      logbookApi.filter.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });

    it("should result in a fetchCountFailedAction", () => {
      const action = fromActions.fetchCountAction({ name });
      const outcome = fromActions.fetchCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      logbookApi.filter.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });
  });

  describe("loading$", () => {
    describe("ofType fetchLogbooksAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchLogbooksAction();
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchLogbookAction", () => {
      it("should dispatch a loadingAction", () => {
        const name = "test";
        const action = fromActions.fetchLogbookAction({ name });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchCountAction", () => {
      it("should dispatch a loadingAction", () => {
        const name = "test";
        const action = fromActions.fetchCountAction({ name });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });
  });

  describe("loadingComplete$", () => {
    describe("ofType fetchLogbooksCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const logbooks = [logbook];
        const action = fromActions.fetchLogbooksCompleteAction({ logbooks });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchLogbooksFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchLogbooksFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchLogbookCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchLogbookCompleteAction({ logbook });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchLogbookFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchLogbookFailedAction();
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
