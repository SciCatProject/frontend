import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { StoreModule } from "@ngrx/store";
import { MockHttp } from "shared/MockStubs";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
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
import { PidFilterStartsWithComponent } from "./pid-filter-startsWith.component";
import { HttpClient } from "@angular/common/http";

const getConfig = () => ({
  scienceSearchEnabled: false,
});

describe("PidFilterStartsWithComponent", () => {
  let component: PidFilterStartsWithComponent;
  let fixture: ComponentFixture<PidFilterStartsWithComponent>;

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
      declarations: [
        PidFilterStartsWithComponent,
        PidFilterComponent,
        SearchParametersDialogComponent,
      ],
      providers: [
        AsyncPipe,
        AppConfigService,
        { provide: HttpClient, useClass: MockHttp },
      ],
    });
    TestBed.overrideComponent(PidFilterStartsWithComponent, {
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
    fixture = TestBed.createComponent(PidFilterStartsWithComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe("#buildPidTermsCondition()", () => {
    const tests = [
      { input: "1", method: "startsWith", expected: { $regex: "^1" } },
    ];

    tests.forEach((test, index) => {
      it(`should return correct condition for test case #${index + 1}`, () => {
        component.appConfig.pidSearchMethod = test.method;
        const condition = component["buildPidTermsCondition"](test.input);
        expect(condition).toEqual(test.expected);
      });
    });
  });
});
