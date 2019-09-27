import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";

import { PoliciesDashboardComponent } from "./policies-dashboard.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SharedCatanieModule } from "shared/shared.module";
import { DatasetApi, Policy } from "shared/sdk";
import { MockDatasetApi, MockStore } from "shared/MockStubs";
import { StoreModule, Store } from "@ngrx/store";
import { rootReducer } from "state-management/reducers/root.reducer";
import {
  PageChangeEvent,
  SortChangeEvent,
  CheckboxEvent
} from "shared/modules/table/table.component";
import {
  ChangePageAction,
  SortByColumnAction,
  SelectPolicyAction,
  DeselectPolicyAction,
  SubmitPolicyAction,
  ClearSelectionAction
} from "state-management/actions/policies.actions";
import { MatCheckboxChange } from "@angular/material";

describe("PoliciesDashboardComponent", () => {
  let component: PoliciesDashboardComponent;
  let fixture: ComponentFixture<PoliciesDashboardComponent>;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PoliciesDashboardComponent],
      imports: [SharedCatanieModule, StoreModule.forRoot({ rootReducer })]
    });
    TestBed.overrideComponent(PoliciesDashboardComponent, {
      set: {
        providers: [{ provide: DatasetApi, useClass: MockDatasetApi }]
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

  describe("#onPageChange()", () => {
    it("should dispatch a ChangePageAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 25
      };
      component.onPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new ChangePageAction(event.pageIndex, event.pageSize)
      );
    });
  });

  describe("#onSortChange()", () => {
    it("should dispatch a SortByColumnAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: SortChangeEvent = {
        active: "test",
        direction: "asc"
      };
      component.onSortChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new SortByColumnAction(event.active, event.direction)
      );
    });
  });

  describe("#onSelectOne()", () => {
    it("should dispatch a SelectPolicyAction if checked is true", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const checkboxEvent: CheckboxEvent = {
        event: new MatCheckboxChange(),
        row: new Policy()
      };
      checkboxEvent.event.checked = true;
      component.onSelectOne(checkboxEvent);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new SelectPolicyAction(checkboxEvent.row)
      );
    });

    it("should dispatch a DeselectPolicyAction if checked is false", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const checkboxEvent: CheckboxEvent = {
        event: new MatCheckboxChange(),
        row: new Policy()
      };
      checkboxEvent.event.checked = false;
      component.onSelectOne(checkboxEvent);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new DeselectPolicyAction(checkboxEvent.row)
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

    it("should dispatch a SubmitPolicyAction and a ClearSelectionAction if there is a result", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const result = new Policy();
      component.selectedGroups = ["test"];
      component.onDialogClose(result);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        new SubmitPolicyAction(component.selectedGroups, result)
      );
      expect(dispatchSpy).toHaveBeenCalledWith(new ClearSelectionAction());
    });
  });
});
