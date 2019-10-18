import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { hot, cold } from "jasmine-marbles";
import { Observable } from "rxjs";
import { LogbookEffects } from "./logbooks.effects";
import { LogbookApi, Logbook } from "shared/sdk";
import * as fromActions from "state-management/actions/logbooks.actions";
import { LogbookFilters } from "state-management/models";
import {
  loadingAction,
  loadingCompleteAction
} from "state-management/actions/user.actions";

const logbook = new Logbook();

describe("LogbookEffects", () => {
  let actions: Observable<any>;
  let effects: LogbookEffects;
  let logbookApi: jasmine.SpyObj<LogbookApi>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LogbookEffects,
        provideMockActions(() => actions),
        {
          provide: LogbookApi,
          useValue: jasmine.createSpyObj("logbookApi", [
            "findAll",
            "findByName",
            "filter"
          ])
        }
      ]
    });

    effects = TestBed.get(LogbookEffects);
    logbookApi = TestBed.get(LogbookApi);
  });

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

    it("should result in a fetchLogbookCompleteAction", () => {
      const action = fromActions.fetchLogbookAction({ name });
      const outcome = fromActions.fetchLogbookCompleteAction({ logbook });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: logbook });
      logbookApi.findByName.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchLogbook$).toBeObservable(expected);
    });

    it("should result in a fetchLogbookFailedAction", () => {
      const action = fromActions.fetchLogbookAction({ name });
      const outcome = fromActions.fetchLogbookFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      logbookApi.findByName.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchLogbook$).toBeObservable(expected);
    });
  });

  describe("fetchFilteredEntries$", () => {
    const name = "testName";
    const filters: LogbookFilters = {
      textSearch: "test",
      showBotMessages: true,
      showImages: true,
      showUserMessages: true
    };

    it("should result in a fetchFilteredEntriesCompleteAction", () => {
      const action = fromActions.fetchFilteredEntriesAction({ name, filters });
      const outcome = fromActions.fetchFilteredEntriesCompleteAction({
        logbook
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: logbook });
      logbookApi.filter.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchFilteredEntries$).toBeObservable(expected);
    });

    it("should result in a fetchFilteredEntriesFailedAction", () => {
      const action = fromActions.fetchFilteredEntriesAction({ name, filters });
      const outcome = fromActions.fetchFilteredEntriesFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      logbookApi.filter.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchFilteredEntries$).toBeObservable(expected);
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

    describe("ofType fetchFilteredEntriesAction", () => {
      it("should dispatch a loadingAction", () => {
        const name = "test";
        const filters: LogbookFilters = {
          textSearch: "test",
          showBotMessages: true,
          showImages: true,
          showUserMessages: true
        };
        const action = fromActions.fetchFilteredEntriesAction({
          name,
          filters
        });
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

    describe("ofType fetchFilteredEntriesCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchFilteredEntriesCompleteAction({
          logbook
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchFilteredEntriesFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchFilteredEntriesFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });
  });
});
