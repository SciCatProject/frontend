import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import { MockHttp, MockStore } from "shared/MockStubs";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { setPidTermsFilterAction } from "state-management/actions/datasets.actions";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDialogModule } from "@angular/material/dialog";
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
import { PidFilterComponent } from "./pid-filter.component";
import { HttpClient } from "@angular/common/http";

const getConfig = () => ({
  scienceSearchEnabled: false,
});

describe("PidFilterComponent", () => {
  let component: PidFilterComponent;
  let fixture: ComponentFixture<PidFilterComponent>;

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
      declarations: [PidFilterComponent, SearchParametersDialogComponent],
      providers: [
        AsyncPipe,
        AppConfigService,
        { provide: HttpClient, useClass: MockHttp },
      ],
    });
    TestBed.overrideComponent(PidFilterComponent, {
      set: {
        providers: [
          {
            provide: AppConfigService,
            useValue: {
              getConfig,
            },
          },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PidFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  describe("#onPidInput()", () => {
    it("should dispatch a SetSearchTermsAction", fakeAsync(() => {
      dispatchSpy = spyOn(store, "dispatch");

      const pid = "xxxxxx";
      const event = { target: { value: pid } };
      component.onPidInput(event);

      tick(500); //wait for it

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setPidTermsFilterAction({ pid }),
      );
    }));
  });

  describe("#buildPidTermsCondition()", () => {
    const tests = [
      { input: "", method: "", expected: "" },
      { input: "1", method: "equals", expected: "1" },
      { input: "1", method: "", expected: "1" },
    ];

    tests.forEach((test, index) => {
      it(`should return correct condition for test case #${index + 1}`, () => {
        component.appConfig.pidSearchMethod = test.method;
        const condition = component.buildPidTermsCondition(test.input);
        expect(condition).toEqual(test.expected);
      });
    });
  });
});
