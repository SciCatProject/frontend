import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import { DatasetsFilterComponent } from "datasets/datasets-filter/datasets-filter.component";
import { MockStore } from "shared/MockStubs";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
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
  addScientificConditionAction,
  setPidTermsAction,
} from "state-management/actions/datasets.actions";
import { of } from "rxjs";
import {
  selectColumnAction,
  deselectColumnAction,
  deselectAllCustomColumnsAction,
} from "state-management/actions/user.actions";
import { ScientificCondition } from "state-management/models";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { SearchParametersDialogComponent } from "shared/modules/search-parameters-dialog/search-parameters-dialog.component";
import { AsyncPipe } from "@angular/common";
import { DateTime } from "luxon";
import {
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from "@angular/material/datepicker";
import { MatChipsModule } from "@angular/material/chips";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AppConfigService } from "app-config.service";
import { LocationFilterComponent } from "./location-filter.component";

describe("LocationFilterComponent", () => {
  let component: LocationFilterComponent;
  let fixture: ComponentFixture<LocationFilterComponent>;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        BrowserAnimationsModule,
        FormsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        SharedScicatFrontendModule,
        StoreModule.forRoot({}),
      ],
      declarations: [LocationFilterComponent, SearchParametersDialogComponent],
      providers: [AsyncPipe],
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  describe("#onLocationInput()", () => {
    it("should call next on locationInput$", () => {
      const nextSpy = spyOn(component.locationInput$, "next");

      const event = {
        target: {
          value: "location",
        },
      };

      component.onLocationInput(event);

      expect(nextSpy).toHaveBeenCalledOnceWith(event.target.value);
    });
  });

  describe("#locationSelected()", () => {
    it("should dispatch an AddLocationFilterAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const location = "test";
      component.locationSelected(location);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        addLocationFilterAction({ location }),
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
        removeLocationFilterAction({ location }),
      );
    });
  });
});
