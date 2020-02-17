import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";

import { ReduceComponent } from "./reduce.component";
import { MockStore } from "shared/MockStubs";
import {
  MatCardModule,
  MatStepperModule,
  MatButtonModule,
  MatIconModule,
  MatRadioModule,
  MatSelectModule,
  MatTableModule
} from "@angular/material";
import { Router } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { provideMockStore } from "@ngrx/store/testing";
import {
  getOpenwhiskResult,
  getDatasets
} from "state-management/selectors/datasets.selectors";
import { Dataset } from "shared/sdk";
import { reduceDatasetAction } from "state-management/actions/datasets.actions";
import { FormBuilder } from "@angular/forms";

describe("ReduceComponent", () => {
  let component: ReduceComponent;
  let fixture: ComponentFixture<ReduceComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatRadioModule,
        MatSelectModule,
        MatStepperModule,
        MatTableModule,
        StoreModule.forRoot({})
      ],
      providers: [
        FormBuilder,
        provideMockStore({
          selectors: [
            { selector: getOpenwhiskResult, value: {} },
            { selector: getDatasets, value: [] }
          ]
        })
      ],
      declarations: [ReduceComponent]
    });
    TestBed.overrideComponent(ReduceComponent, {
      set: {
        providers: [{ provide: Router, useValue: router }]
      }
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

      const dataset = new Dataset();

      component.reduceDataset(dataset);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        reduceDatasetAction({ dataset })
      );
    });
  });

  describe("#onRowClick()", () => {
    it("should navigate to a dataset", () => {
      const dataset = new Dataset();
      component.onRowClick(dataset);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/datasets/" + encodeURIComponent(dataset.pid)
      );
    });
  });
});
