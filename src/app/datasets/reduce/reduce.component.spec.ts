import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";

import { ReduceComponent } from "./reduce.component";
import { MockStore, createMock, mockDataset } from "shared/MockStubs";

import { Router } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideMockStore } from "@ngrx/store/testing";
import {
  selectOpenwhiskResult,
  selectDatasets,
} from "state-management/selectors/datasets.selectors";
import { reduceDatasetAction } from "state-management/actions/datasets.actions";
import { FormBuilder } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatOptionModule } from "@angular/material/core";
import { DatasetClass } from "@scicatproject/scicat-sdk-ts-angular";

describe("ReduceComponent", () => {
  let component: ReduceComponent;
  let fixture: ComponentFixture<ReduceComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatOptionModule,
        MatRadioModule,
        MatSelectModule,
        MatStepperModule,
        MatTableModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        FormBuilder,
        provideMockStore({
          selectors: [
            { selector: selectOpenwhiskResult, value: {} },
            { selector: selectDatasets, value: [] },
          ],
        }),
      ],
      declarations: [ReduceComponent],
    });
    TestBed.overrideComponent(ReduceComponent, {
      set: {
        providers: [{ provide: Router, useValue: router }],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReduceComponent);
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

  describe("#reduceDataset()", () => {
    it("should dispatch a reduceDatasetAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const dataset = mockDataset;

      component.reduceDataset(dataset);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        reduceDatasetAction({ dataset }),
      );
    });
  });

  describe("#onRowClick()", () => {
    it("should navigate to a dataset", () => {
      const dataset = createMock<DatasetClass>({});
      component.onRowClick(dataset);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/datasets/" + encodeURIComponent(dataset.pid),
      );
    });
  });
});
