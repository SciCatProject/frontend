import { isDevMode, NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import { MockStore } from "shared/MockStubs";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { setDateRangeFilterAction } from "state-management/actions/datasets.actions";
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
import { DateRangeFilterComponent } from "./date-range-filter.component";

describe("DateRangeFilterComponent", () => {
  let component: DateRangeFilterComponent;
  let fixture: ComponentFixture<DateRangeFilterComponent>;

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
        StoreModule.forRoot(
          {},
          {
            runtimeChecks: {
              strictActionImmutability: false,
              strictActionSerializability: false,
              strictActionTypeUniqueness: false,
              strictActionWithinNgZone: false,
              strictStateImmutability: false,
              strictStateSerializability: false,
            },
          },
        ),
      ],
      declarations: [DateRangeFilterComponent, SearchParametersDialogComponent],
      providers: [AsyncPipe],
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateRangeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  describe("#dateChanged()", () => {
    it("should dispatch setDateRangeFilterAction with empty string values if event.value is null", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = {
        targetElement: {
          getAttribute: (name: string) => "begin",
        },
        value: null,
      } as MatDatepickerInputEvent<DateTime>;

      component.dateChanged(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setDateRangeFilterAction({ begin: "", end: "" }),
      );
    });

    it("should set dateRange.begin if event has value and event.targetElement name is begin", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const beginDate = DateTime.fromJSDate(new Date("2021-01-01"));
      const event = {
        targetElement: {
          getAttribute: (name: string) => "begin",
        },
        value: beginDate,
      } as MatDatepickerInputEvent<DateTime>;

      component.dateChanged(event);

      const expected = beginDate.toUTC().toISO();
      expect(component.dateRange.begin).toEqual(expected);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it("should set dateRange.end if event has value and event.targetElement name is end", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const endDate = DateTime.fromJSDate(new Date("2021-07-08"));
      const event = {
        targetElement: {
          getAttribute: (name: string) => "end",
        },
        value: endDate,
      } as MatDatepickerInputEvent<DateTime>;

      component.dateChanged(event);

      const expected = endDate.toUTC().plus({ days: 1 }).toISO();
      expect(component.dateRange.end).toEqual(expected);
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it("should dispatch a setDateRangeFilterAction if dateRange.begin and dateRange.end have values", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const beginDate = DateTime.fromJSDate(new Date("2021-01-01"));
      const endDate = DateTime.fromJSDate(new Date("2021-07-08"));
      component.dateRange.begin = beginDate.toUTC().toISO();
      const event = {
        targetElement: {
          getAttribute: (name: string) => "end",
        },
        value: endDate,
      } as MatDatepickerInputEvent<DateTime>;

      component.dateChanged(event);

      const expected = {
        begin: beginDate.toUTC().toISO(),
        end: endDate.toUTC().plus({ days: 1 }).toISO(),
      };
      expect(dispatchSpy).toHaveBeenCalledOnceWith(
        setDateRangeFilterAction(expected),
      );
    });
  });
});
