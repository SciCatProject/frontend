import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync
} from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import {
  DatasetsFilterComponent,
  DateRange
} from "datasets/datasets-filter/datasets-filter.component";
import { MockStore } from "shared/MockStubs";

import * as moment from "moment";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { APP_CONFIG } from "app-config.module";
import { FacetCount } from "state-management/state/datasets.store";
import {
  setSearchTermsAction,
  addLocationFilterAction,
  removeLocationFilterAction,
  addGroupFilterAction,
  removeGroupFilterAction,
  addKeywordFilterAction,
  removeKeywordFilterAction,
  addTypeFilterAction,
  removeTypeFilterAction,
  clearFacetsAction,
  removeScientificConditionAction,
  setDateRangeFilterAction,
  addScientificConditionAction
} from "state-management/actions/datasets.actions";
import { of } from "rxjs";
import {
  selectColumnAction,
  deselectColumnAction,
  deselectAllCustomColumnsAction
} from "state-management/actions/user.actions";
import { ScientificCondition } from "state-management/models";
import { SharedCatanieModule } from "shared/shared.module";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { SearchParametersDialogComponent } from "shared/modules/search-parameters-dialog/search-parameters-dialog.component";
import { AsyncPipe } from "@angular/common";

export class MockMatDialog {
  open() {
    return {
      afterClosed: () =>
        of({
          data: { lhs: "", rhs: "", relation: "EQUAL_TO_STRING", unit: "" }
        })
    };
  }
}

describe("DatasetsFilterComponent", () => {
  let component: DatasetsFilterComponent;
  let fixture: ComponentFixture<DatasetsFilterComponent>;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatAutocompleteModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ReactiveFormsModule,
        SharedCatanieModule,
        StoreModule.forRoot({})
      ],
      declarations: [
        DatasetsFilterComponent,
        SearchParametersDialogComponent
      ],
      providers: [AsyncPipe]
    });
    TestBed.overrideComponent(DatasetsFilterComponent, {
      set: {
        providers: [
          {
            provide: APP_CONFIG,
            useValue: {
              scienceSearchEnabled: false,
            },
          },
          { provide: MatDialog, useClass: MockMatDialog }
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should contain a date range field", () => {
    const compiled = fixture.debugElement.nativeElement;
    const beamline = compiled.querySelector(".date-input");
    expect(beamline).toBeTruthy();
  });

  it("should contain a beamline input", () => {
    const compiled = fixture.debugElement.nativeElement;
    const beamline = compiled.querySelector(".location-input");
    expect(beamline).toBeTruthy();
  });

  it("should contain a groups input", () => {
    const compiled = fixture.debugElement.nativeElement;
    const group = compiled.querySelector(".group-input");
    expect(group).toBeTruthy();
  });

  it("should contain a type input", () => {
    const compiled = fixture.debugElement.nativeElement;
    const type = compiled.querySelector(".type-input");
    expect(type).toBeTruthy();
  });

  it("should contain a clear button", () => {
    const compiled = fixture.debugElement.nativeElement;
    const btn = compiled.querySelector(".clear-button");
    expect(btn.textContent).toContain("Clear");
  });

  describe("#getFacetId()", () => {
    it("should return the FacetCount id if present", () => {
      const facetCount: FacetCount = {
        _id: "test1",
        count: 0
      };
      const fallback = "test2";

      const id = component.getFacetId(facetCount, fallback);

      expect(id).toEqual("test1");
    });

    it("should return the FacetCount id if present", () => {
      const facetCount: FacetCount = {
        count: 0
      };
      const fallback = "test";

      const id = component.getFacetId(facetCount, fallback);

      expect(id).toEqual(fallback);
    });
  });

  describe("#getFacetCount()", () => {
    it("should return the FacetCount", () => {
      const facetCount: FacetCount = {
        count: 0
      };

      const count = component.getFacetCount(facetCount);

      expect(count).toEqual(facetCount.count);
    });
  });

  describe("#textSearchChanged()", () => {
    it("should dispatch a SetSearchTermsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const terms = "test";
      component.textSearchChanged(terms);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(setSearchTermsAction({ terms }));
    });
  });

  describe("#locationSelected()", () => {
    it("should dispatch an AddLocationFilterAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const location = "test";
      component.locationSelected(location);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        addLocationFilterAction({ location })
      );
    });
  });

  describe("#locationRemoved()", () => {
    it("should dispatch a RemoveLocationFilterAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const location = "test";
      component.locationRemoved(location);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        removeLocationFilterAction({ location })
      );
    });
  });

  describe("#groupSelected()", () => {
    it("should dispatch an AddGroupFilterAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const group = "test";
      component.groupSelected(group);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(addGroupFilterAction({ group }));
    });
  });

  describe("#groupRemoved()", () => {
    it("should dispatch a RemoveGroupFilterAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const group = "test";
      component.groupRemoved(group);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        removeGroupFilterAction({ group })
      );
    });
  });

  describe("#keywordSelected()", () => {
    it("should dispatch an AddKeywordFilterAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const keyword = "test";
      component.keywordSelected(keyword);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        addKeywordFilterAction({ keyword })
      );
    });
  });

  describe("#keywordRemoved()", () => {
    it("should dispatch a RemoveKeywordFilterAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const keyword = "test";
      component.keywordRemoved(keyword);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        removeKeywordFilterAction({ keyword })
      );
    });
  });

  describe("#typeSelected()", () => {
    it("should dispatch an AddTypeFilterAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const datasetType = "string";
      component.typeSelected(datasetType);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        addTypeFilterAction({ datasetType })
      );
    });
  });

  describe("#typeRemoved()", () => {
    it("should dispatch a RemoveTypeFilterAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const datasetType = "string";
      component.typeRemoved(datasetType);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        removeTypeFilterAction({ datasetType })
      );
    });
  });

  describe("#dateChanged()", () => {
    it("should dispatch a SetDateRangeFilterAction if event has value", () => {
      dispatchSpy = spyOn(store, "dispatch");


      const event = {
        value: {
          begin: new Date("1995-12-17T03:24:00.000Z"),
          end: new Date("1995-12-17T03:24:00.000Z")
        }
      };
      component.dateChanged(event as MatDatepickerInputEvent<DateRange>);
      const begin = moment(event.value.begin);
      const endplus1day = moment(event.value.end).add(1, "days");

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setDateRangeFilterAction({
          begin: begin.toISOString(),
          end: endplus1day.milliseconds(0).toISOString()
        })
      );
    });
    it("should dispatch a SetDateRangeFilterAction if event does not have value", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = {};
      component.dateChanged(event as MatDatepickerInputEvent<DateRange>);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setDateRangeFilterAction({ begin: null, end: null })
      );
    });
  });

  describe("#clearFacets()", () => {
    it("should dispatch a ClearFacetsAction and a deselectAllCustomColumnsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.clearFacets();

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(clearFacetsAction());
      expect(dispatchSpy).toHaveBeenCalledWith(
        deselectAllCustomColumnsAction()
      );
    });
  });

  describe("#showAddConditionDialog()", () => {
    it("should open SearchParametersDialogComponent and dispatch an addScientificConditionAction and a selectColumnAction if dialog returns data", () => {
      spyOn(component.dialog, "open").and.callThrough();
      dispatchSpy = spyOn(store, "dispatch");

      component.metadataKeys$ = of(["test", "keys"]);
      component.showAddConditionDialog();

      expect(component.dialog.open).toHaveBeenCalledTimes(1);
      expect(component.dialog.open).toHaveBeenCalledWith(
        SearchParametersDialogComponent,
        {
          data: {
            parameterKeys: component["asyncPipe"].transform(
              component.metadataKeys$
            ),
          },
        }
      );
      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        addScientificConditionAction({
          condition: {
            lhs: "",
            rhs: "",
            relation: "EQUAL_TO_STRING",
            unit: "",
          },
        })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        selectColumnAction({ name: "", columnType: "custom" })
      );
    });
  });

  describe("#removeCondition()", () => {
    it("should dispatch a removeScientificConditionAction and a deselectColumnAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const condition: ScientificCondition = {
        lhs: "test",
        relation: "EQUAL_TO_NUMERIC",
        rhs: 5,
        unit: "s"
      };
      const index = 0;
      component.removeCondition(condition, index);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        removeScientificConditionAction({ index })
      );
      expect(dispatchSpy).toHaveBeenCalledWith(
        deselectColumnAction({ name: condition.lhs, columnType: "custom" })
      );
    });
  });
});
