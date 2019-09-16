import { APP_CONFIG } from "app-config.module";
import { MatTableModule, MatDialog, MatCardModule } from "@angular/material";
import { MockStore, MockRouter } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";
import { SampleDashboardComponent } from "./sample-dashboard.component";
import { SampleTableComponent } from "samples/sample-table/sample-table.component";
import { Store, StoreModule } from "@ngrx/store";
import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
import { rootReducer } from "state-management/reducers/root.reducer";
import { SearchSampleAction } from "state-management/actions/samples.actions";

describe("SampleDashboardComponent", () => {
  let component: SampleDashboardComponent;
  let fixture: ComponentFixture<SampleDashboardComponent>;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatCardModule,
        MatTableModule,
        StoreModule.forRoot({ rootReducer })
      ],
      declarations: [SampleDashboardComponent, SampleTableComponent]
    });
    TestBed.overrideComponent(SampleDashboardComponent, {
      set: {
        providers: [
          { provide: APP_CONFIG, useValue: { editSampleEnabled: true } },
          { provide: MatDialog, useValue: {} },
          { provide: Router, useClass: MockRouter }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleDashboardComponent);
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

  describe("#onTextSearchChange()", () => {
    it("should dispatch a SearchSampleAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const query = "test";
      component.onTextSearchChange(query);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(new SearchSampleAction(query));
    });
  });
});
