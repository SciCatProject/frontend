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
import { KeywordFilterComponent } from "./keyword-filter.component";

describe("KeywordFilterComponent", () => {
  let component: KeywordFilterComponent;
  let fixture: ComponentFixture<KeywordFilterComponent>;

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
      declarations: [KeywordFilterComponent, SearchParametersDialogComponent],
      providers: [AsyncPipe],
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeywordFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  describe("#onKeywordInput()", () => {
    it("should call next on keywordsInput$", () => {
      const nextSpy = spyOn(component.keywordsInput$, "next");

      const event = {
        target: {
          value: "keyword",
        },
      };

      component.onKeywordInput(event);

      expect(nextSpy).toHaveBeenCalledOnceWith(event.target.value);
    });
  });

  describe("#keywordSelected()", () => {
    it("should dispatch an AddKeywordFilterAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const keyword = "test";
      component.keywordSelected(keyword);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        addKeywordFilterAction({ keyword }),
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
        removeKeywordFilterAction({ keyword }),
      );
    });
  });
});
