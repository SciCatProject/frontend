import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync
} from "@angular/core/testing";

import { PoliciesDashboardComponent } from "./policies-dashboard.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SharedCatanieModule } from "shared/shared.module";
import { DatasetApi, Policy } from "shared/sdk";
import { MockDatasetApi, MockStore } from "shared/MockStubs";
import { StoreModule, Store } from "@ngrx/store";
import {
  PageChangeEvent,
  SortChangeEvent,
  CheckboxEvent
} from "shared/modules/table/table.component";
import {
  changePageAction,
  sortByColumnAction,
  selectPolicyAction,
  deselectPolicyAction,
  submitPolicyAction,
  clearSelectionAction,
  selectAllPoliciesAction,
  changeEditablePageAction,
  sortEditableByColumnAction
} from "state-management/actions/policies.actions";

import { Router } from "@angular/router";
import { GenericFilters } from "state-management/models";
import * as rison from "rison";
import { RouterTestingModule } from "@angular/router/testing";
import { provideMockStore } from "@ngrx/store/testing";
import {
  getFilters,
  getEditableFilters
} from "state-management/selectors/policies.selectors";
import { MatTabChangeEvent, MatTab } from "@angular/material/tabs";
import { MatCheckboxChange } from "@angular/material/checkbox";

describe("PoliciesDashboardComponent", () => {
  let component: PoliciesDashboardComponent;
  let fixture: ComponentFixture<PoliciesDashboardComponent>;

  const router = {
    navigate: jasmine.createSpy("navigate"),
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PoliciesDashboardComponent],
      imports: [
        RouterTestingModule.withRoutes([]),
        SharedCatanieModule,
        StoreModule.forRoot({})
      ],
      providers: [
        provideMockStore({
          selectors: [
            { selector: getFilters, value: {} },
            { selector: getEditableFilters, value: {} }
          ]
        })
      ]
    });
    TestBed.overrideComponent(PoliciesDashboardComponent, {
      set: {
        providers: [{ provide: DatasetApi, useClass: MockDatasetApi }, {provide: Router, useValue: router}]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PoliciesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#onTabChange()", () => {
    it("should call #updatePoliciesRouterState() if index = 0", () => {
      const methodSpy = spyOn(component, "updatePoliciesRouterState");

      const event: MatTabChangeEvent = {
        index: 0,
        tab: {} as MatTab
      };
      component.onTabChange(event);

      expect(methodSpy).toHaveBeenCalled();
    });

    it("should call #updateEditableRouterState() if index = 1", () => {
      const methodSpy = spyOn(component, "updateEditableRouterState");

      const event: MatTabChangeEvent = {
        index: 1,
        tab: {} as MatTab
      };
      component.onTabChange(event);

      expect(methodSpy).toHaveBeenCalled();
    });
  });

  describe("#updatePoliciesRouterState()", () => {
    it("should call #addToQueryParams()", () => {
      const methodSpy = spyOn(component, "addToQueryParams");

      component.updatePoliciesRouterState();

      expect(methodSpy).toHaveBeenCalled();
    });
  });

  describe("#updateEditableRouterState()", () => {
    it("should call #addToQueryParams()", () => {
      const methodSpy = spyOn(component, "addToQueryParams");

      component.updateEditableRouterState();

      expect(methodSpy).toHaveBeenCalled();
    });
  });

  describe("#addToQueryParams()", () => {
    it("should call router.navigate", () => {
      const filters: GenericFilters = {
        sortField: "test asc",
        skip: 0,
        limit: 25
      };
      component.addToQueryParams(filters);

      // expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(["/policies"], {
        queryParams: { args: rison.encode(filters) }
      });
    });
  });

  describe("#onPoliciesPageChange()", () => {
    it("should dispatch a changePageAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 25
      };
      component.onPoliciesPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changePageAction({ page: event.pageIndex, limit: event.pageSize })
      );
    });
  });

  describe("#onEditablePoliciesPageChange()", () => {
    it("should dispatch a changeEditablePageAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 25
      };
      component.onEditablePoliciesPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changeEditablePageAction({
          page: event.pageIndex,
          limit: event.pageSize
        })
      );
    });
  });

  describe("#onPoliciesSortChange()", () => {
    it("should dispatch a sortByColumnAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: SortChangeEvent = {
        active: "test",
        direction: "asc"
      };
      component.onPoliciesSortChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        sortByColumnAction({ column: event.active, direction: event.direction })
      );
    });
  });

  describe("#onEditablePoliciesSortChange()", () => {
    it("should dispatch a sortEditableByColumnAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: SortChangeEvent = {
        active: "test",
        direction: "asc"
      };
      component.onEditablePoliciesSortChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        sortEditableByColumnAction({
          column: event.active,
          direction: event.direction
        })
      );
    });
  });

  describe("#onSelectAll()", () => {
    it("should dispatch a selectAllPoliciesAction if checked is true", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = new MatCheckboxChange();
      event.checked = true;
      component.onSelectAll(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(selectAllPoliciesAction());
    });

    it("should dispatch a clearSelectionAction if checked is false", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = new MatCheckboxChange();
      event.checked = false;
      component.onSelectAll(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(clearSelectionAction());
    });
  });

  describe("#onSelectOne()", () => {
    it("should dispatch a selectPolicyAction if checked is true", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const checkboxEvent: CheckboxEvent = {
        event: new MatCheckboxChange(),
        row: new Policy()
      };
      checkboxEvent.event.checked = true;
      component.onSelectOne(checkboxEvent);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        selectPolicyAction({ policy: checkboxEvent.row })
      );
    });

    it("should dispatch a deselectPolicyAction if checked is false", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const checkboxEvent: CheckboxEvent = {
        event: new MatCheckboxChange(),
        row: new Policy()
      };
      checkboxEvent.event.checked = false;
      component.onSelectOne(checkboxEvent);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        deselectPolicyAction({ policy: checkboxEvent.row })
      );
    });
  });

  describe("#openDialog()", () => {
    xit("should...", () => {});
  });

  describe("#onDialogClose()", () => {
    it("should do nothing if there is no result", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.onDialogClose(null);

      expect(dispatchSpy).toHaveBeenCalledTimes(0);
    });

    it("should dispatch a submitPolicyAction and a clearSelectionAction if there is a result", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const result = new Policy();
      component.selectedGroups = ["test"];
      component.onDialogClose(result);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        submitPolicyAction({
          ownerList: component.selectedGroups,
          policy: result
        })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(clearSelectionAction());
    });
  });
});
