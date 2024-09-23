import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import { DatasetsFilterComponent } from "datasets/datasets-filter/datasets-filter.component";
import { MockHttp, MockStore } from "shared/MockStubs";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  clearFacetsAction,
  fetchDatasetsAction,
  fetchFacetCountsAction,
} from "state-management/actions/datasets.actions";
import { of } from "rxjs";
import { deselectAllCustomColumnsAction } from "state-management/actions/user.actions";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { SearchParametersDialogComponent } from "shared/modules/search-parameters-dialog/search-parameters-dialog.component";
import { AsyncPipe } from "@angular/common";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatChipsModule } from "@angular/material/chips";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AppConfigService } from "app-config.service";
import { DatasetsFilterSettingsComponent } from "./settings/datasets-filter-settings.component";
import { FilterConfig } from "../../shared/modules/filters/filters.module";
import {
  selectConditions,
  selectFilters,
} from "../../state-management/selectors/user.selectors";
import { HttpClient } from "@angular/common/http";

const filterConfigs: FilterConfig[] = [
  { LocationFilter: true },
  { PidFilter: true },
  { GroupFilter: true },
  { TypeFilter: true },
  { KeywordFilter: true },
  { DateRangeFilter: true },
  { TextFilter: true },
  { PidFilterContains: false },
  { PidFilterStartsWith: false },
];

const labelMaps = {
  LocationFilter: "Location Filter",
  PidFilter: "Pid Filter",
  GroupFilter: "Group Filter",
  TypeFilter: "Type Filter",
  KeywordFilter: "Keyword Filter",
  DateRangeFilter: "Start Date - End Date",
  TextFilter: "Text Filter",
  PidFilterContains: "PID filter (Contains)- Not implemented",
  PidFilterStartsWith: "PID filter (Starts With)- Not implemented",
};
export class MockStoreWithFilters extends MockStore {
  public select(selector: any) {
    if (selector === selectFilters) {
      return of(filterConfigs);
    }
    if (selector === selectConditions) {
      return of([]);
    }
    return of(null);
  }
}

export class MockMatDialog {
  open() {
    return {
      afterClosed: () => of(filterConfigs, selectConditions),
    };
  }
}

const getConfig = () => ({
  scienceSearchEnabled: false,
});

describe("DatasetsFilterComponent", () => {
  let component: DatasetsFilterComponent;
  let fixture: ComponentFixture<DatasetsFilterComponent>;

  let store: MockStoreWithFilters;
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
      declarations: [DatasetsFilterComponent, SearchParametersDialogComponent],
      providers: [
        AsyncPipe,
        AppConfigService,
        { provide: HttpClient, useClass: MockHttp },
        { provide: Store, useClass: MockStoreWithFilters },
      ],
    });
    TestBed.overrideComponent(DatasetsFilterComponent, {
      set: {
        providers: [
          {
            provide: AppConfigService,
            useValue: {
              getConfig,
            },
          },
          { provide: MatDialog, useClass: MockMatDialog },
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

  beforeEach(inject([Store], (mockStore: MockStoreWithFilters) => {
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

  it("should contain a clear all button", () => {
    const compiled = fixture.debugElement.nativeElement;
    const btn = compiled.querySelector(".datasets-filters-clear-all-button");
    expect(btn.textContent).toContain("undo Reset");
  });

  it("should contain a search button", () => {
    const compiled = fixture.debugElement.nativeElement;
    const btn = compiled.querySelector(".datasets-filters-search-button");
    expect(btn.textContent).toContain("search Apply");
  });

  describe("#reset()", () => {
    it("should dispatch a ClearFacetsAction and a deselectAllCustomColumnsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      component.reset();

      expect(dispatchSpy).toHaveBeenCalledTimes(4);
      expect(dispatchSpy).toHaveBeenCalledWith(clearFacetsAction());
      expect(dispatchSpy).toHaveBeenCalledWith(
        deselectAllCustomColumnsAction(),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(fetchDatasetsAction());
      expect(dispatchSpy).toHaveBeenCalledWith(fetchFacetCountsAction());
    });
  });

  describe("#showDatasetsFilterSettingsDialog()", () => {
    it("should open DatasetsFilterSettingsComponent", async () => {
      spyOn(component.dialog, "open").and.callThrough();
      dispatchSpy = spyOn(store, "dispatch");

      await component.showDatasetsFilterSettingsDialog();

      expect(component.dialog.open).toHaveBeenCalledTimes(1);
      expect(component.dialog.open).toHaveBeenCalledWith(
        DatasetsFilterSettingsComponent,
        {
          width: "60vw",
          data: {
            filterConfigs: filterConfigs,
            conditionConfigs: [],
            labelMaps: labelMaps,
          },
        },
      );
    });
  });
});
