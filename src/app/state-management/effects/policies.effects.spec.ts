import { Observable } from "rxjs";
import { PolicyEffects } from "./policies.effects";
import { PolicyApi, PolicyInterface, Policy } from "shared/sdk";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import {
  getQueryParams,
  getEditableQueryParams
} from "state-management/selectors/policies.selectors";
import { getProfile } from "state-management/selectors/user.selectors";
import * as fromActions from "state-management/actions/policies.actions";
import { hot, cold } from "jasmine-marbles";
import {
  loadingAction,
  loadingCompleteAction
} from "state-management/actions/user.actions";
import { Type } from "@angular/core";

const data: PolicyInterface = {
  id: "testId",
  ownerGroup: "testGroup"
};
const policy = new Policy(data);

describe("PolicyEffects", () => {
  let actions: Observable<any>;
  let effects: PolicyEffects;
  let policyApi: jasmine.SpyObj<PolicyApi>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PolicyEffects,
        provideMockActions(() => actions),
        provideMockStore({
          selectors: [
            { selector: getQueryParams, value: {} },
            { selector: getEditableQueryParams, value: {} },
            { selector: getProfile, value: { email: "test@email.com" } }
          ]
        }),
        {
          provide: PolicyApi,
          useValue: jasmine.createSpyObj("policyApi", [
            "find",
            "count",
            "updatewhere"
          ])
        }
      ]
    });

    effects = TestBed.inject(PolicyEffects);
    policyApi = injectedStub(PolicyApi);
  });

  function injectedStub<S>(service: Type<S>): jasmine.SpyObj<S> {
    return TestBed.inject(service) as jasmine.SpyObj<S>;
  }

  describe("fetchPolicies$", () => {
    describe("ofType fetchPoliciesAction", () => {
      it("should result in a fetchPoliciesCompleteAction, a fetchCountAction, and a fetchEditablePoliciesAction", () => {
        const policies = [policy];
        const action = fromActions.fetchPoliciesAction();
        const outcome1 = fromActions.fetchPoliciesCompleteAction({ policies });
        const outcome2 = fromActions.fetchCountAction();
        const outcome3 = fromActions.fetchEditablePoliciesAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: policies });
        policyApi.find.and.returnValue(response);

        const expected = cold("--(bcd)", {
          b: outcome1,
          c: outcome2,
          d: outcome3
        });
        expect(effects.fetchPolicies$).toBeObservable(expected);
      });

      it("should result in a fetchPoliciesFailedAction", () => {
        const action = fromActions.fetchPoliciesAction();
        const outcome = fromActions.fetchPoliciesFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        policyApi.find.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchPolicies$).toBeObservable(expected);
      });
    });

    describe("ofType changePageAction", () => {
      it("should result in a fetchPoliciesCompleteAction, a fetchCountAction, and a fetchEditablePoliciesAction", () => {
        const page = 1;
        const limit = 25;
        const policies = [policy];
        const action = fromActions.changePageAction({ page, limit });
        const outcome1 = fromActions.fetchPoliciesCompleteAction({ policies });
        const outcome2 = fromActions.fetchCountAction();
        const outcome3 = fromActions.fetchEditablePoliciesAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: policies });
        policyApi.find.and.returnValue(response);

        const expected = cold("--(bcd)", {
          b: outcome1,
          c: outcome2,
          d: outcome3
        });
        expect(effects.fetchPolicies$).toBeObservable(expected);
      });

      it("should result in a fetchPoliciesFailedAction", () => {
        const page = 1;
        const limit = 25;
        const action = fromActions.changePageAction({ page, limit });
        const outcome = fromActions.fetchPoliciesFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        policyApi.find.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchPolicies$).toBeObservable(expected);
      });
    });

    describe("ofType sortByColumnAction", () => {
      it("should result in a fetchPoliciesCompleteAction, a fetchCountAction, and a fetchEditablePoliciesAction", () => {
        const column = "test";
        const direction = "desc";
        const policies = [policy];
        const action = fromActions.sortByColumnAction({ column, direction });
        const outcome1 = fromActions.fetchPoliciesCompleteAction({ policies });
        const outcome2 = fromActions.fetchCountAction();
        const outcome3 = fromActions.fetchEditablePoliciesAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: policies });
        policyApi.find.and.returnValue(response);

        const expected = cold("--(bcd)", {
          b: outcome1,
          c: outcome2,
          d: outcome3
        });
        expect(effects.fetchPolicies$).toBeObservable(expected);
      });

      it("should result in a fetchPoliciesFailedAction", () => {
        const column = "test";
        const direction = "desc";
        const action = fromActions.sortByColumnAction({ column, direction });
        const outcome = fromActions.fetchPoliciesFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        policyApi.find.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchPolicies$).toBeObservable(expected);
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
      policyApi.count.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });

    it("should result in a fetchCountFailedAction", () => {
      const action = fromActions.fetchCountAction();
      const outcome = fromActions.fetchCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      policyApi.count.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });
  });

  describe("fetchEditablePolicies$", () => {
    describe("ofType fetchEditablePolicieAction", () => {
      it("should result in a fetchEditablePoliciesCompleteAction and a fetchEditableCountAction", () => {
        const policies = [policy];
        const action = fromActions.fetchEditablePoliciesAction();
        const outcome1 = fromActions.fetchEditablePoliciesCompleteAction({
          policies
        });
        const outcome2 = fromActions.fetchEditableCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: policies });
        policyApi.find.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchEditablePolicies$).toBeObservable(expected);
      });

      it("should result in a fetchEditablePoliciesFailedAction", () => {
        const action = fromActions.fetchEditablePoliciesAction();
        const outcome = fromActions.fetchEditablePoliciesFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        policyApi.find.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchEditablePolicies$).toBeObservable(expected);
      });
    });

    describe("ofType changeEditablePageAction", () => {
      it("should result in a fetchEditablePoliciesCompleteAction and a fetchEditableCountAction", () => {
        const page = 1;
        const limit = 25;
        const policies = [policy];
        const action = fromActions.changeEditablePageAction({ page, limit });
        const outcome1 = fromActions.fetchEditablePoliciesCompleteAction({
          policies
        });
        const outcome2 = fromActions.fetchEditableCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: policies });
        policyApi.find.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchEditablePolicies$).toBeObservable(expected);
      });

      it("should result in a fetchEditablePoliciesFailedAction", () => {
        const page = 1;
        const limit = 25;
        const action = fromActions.changeEditablePageAction({ page, limit });
        const outcome = fromActions.fetchEditablePoliciesFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        policyApi.find.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchEditablePolicies$).toBeObservable(expected);
      });
    });

    describe("ofType sortEditableByColumnAction", () => {
      it("should result in a fetchEditablePoliciesCompleteAction and a fetchEditableCountAction", () => {
        const column = "test";
        const direction = "desc";
        const policies = [policy];
        const action = fromActions.sortEditableByColumnAction({
          column,
          direction
        });
        const outcome1 = fromActions.fetchEditablePoliciesCompleteAction({
          policies
        });
        const outcome2 = fromActions.fetchEditableCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: policies });
        policyApi.find.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchEditablePolicies$).toBeObservable(expected);
      });

      it("should result in a fetchEditablePoliciesFailedAction", () => {
        const column = "test";
        const direction = "desc";
        const action = fromActions.sortEditableByColumnAction({
          column,
          direction
        });
        const outcome = fromActions.fetchEditablePoliciesFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        policyApi.find.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchEditablePolicies$).toBeObservable(expected);
      });
    });
  });

  describe("fetchEditableCount$", () => {
    it("should result in fetchEditableCountCompleteAction", () => {
      const count = 100;
      const action = fromActions.fetchEditableCountAction();
      const outcome = fromActions.fetchEditableCountCompleteAction({ count });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: { count } });
      policyApi.count.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchEditableCount$).toBeObservable(expected);
    });

    it("should result in fetchEditableCountFailedAction", () => {
      const action = fromActions.fetchEditableCountAction();
      const outcome = fromActions.fetchEditableCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      policyApi.count.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchEditableCount$).toBeObservable(expected);
    });
  });

  describe("submitPolicy$", () => {
    it("should result in a submitPolicyCompleteAction and a fetchPoliciesAction", () => {
      const ownerList = ["test"];
      const action = fromActions.submitPolicyAction({ ownerList, policy });
      const outcome1 = fromActions.submitPolicyCompleteAction({ policy });
      const outcome2 = fromActions.fetchPoliciesAction();

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: { submissionResponse: policy } });
      policyApi.updatewhere.and.returnValue(response);

      const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
      expect(effects.submitPolicy$).toBeObservable(expected);
    });

    it("should result in a submitPolicyFailedAction", () => {
      const ownerList = ["test"];
      const action = fromActions.submitPolicyAction({ ownerList, policy });
      const outcome = fromActions.submitPolicyFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      policyApi.updatewhere.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.submitPolicy$).toBeObservable(expected);
    });
  });

  describe("loading$", () => {
    describe("ofType fetchPoliciesAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchPoliciesAction();
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

    describe("ofType fetchEditablePoliciesAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchEditablePoliciesAction();
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchEditableCountAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchEditableCountAction();
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType submitPolicyAction", () => {
      it("should dispatch a loadingAction", () => {
        const ownerList = ["test"];
        const action = fromActions.submitPolicyAction({ ownerList, policy });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });
  });

  describe("loadingComplete$", () => {
    /*describe("ofType fetchPoliciesCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const policies = [policy];
        const action = fromActions.fetchPoliciesCompleteAction({ policies });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });*/

    describe("ofType fetchPoliciesFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchPoliciesFailedAction();
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

    describe("ofType fetchEditablePoliciesFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchEditablePoliciesFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchEditableCountCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const count = 100;
        const action = fromActions.fetchEditableCountCompleteAction({ count });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchEditableCountFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchEditableCountFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType submitPolicyCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.submitPolicyCompleteAction({ policy });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType submitPolicyFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.submitPolicyFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });
  });
});
