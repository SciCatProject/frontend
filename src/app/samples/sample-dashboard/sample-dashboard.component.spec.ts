import { APP_CONFIG } from "app-config.module";
import { MatTableModule, MatDialog, MatCardModule } from "@angular/material";
import { MockStore } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";
import { SampleDashboardComponent } from "./sample-dashboard.component";
import { Store, StoreModule } from "@ngrx/store";
import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
import { rootReducer } from "state-management/reducers/root.reducer";
import {
  setTextFilterAction,
  changePageAction,
  sortByColumnAction
} from "state-management/actions/samples.actions";
import { Sample } from "shared/sdk";
import {
  PageChangeEvent,
  SortChangeEvent
} from "shared/modules/table/table.component";
import { DatePipe } from "@angular/common";

describe("SampleDashboardComponent", () => {
  let component: SampleDashboardComponent;
  let fixture: ComponentFixture<SampleDashboardComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };
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
      declarations: [SampleDashboardComponent],
      providers: [DatePipe]
    });
    TestBed.overrideComponent(SampleDashboardComponent, {
      set: {
        providers: [
          { provide: APP_CONFIG, useValue: { editSampleEnabled: true } },
          { provide: MatDialog, useValue: {} },
          { provide: Router, useValue: router }
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

  describe("#formatTableData", () => {
    it("should return an array of sample objects formatted for the table", () => {
      const samples = [new Sample()];

      const data = component.formatTableData(samples);

      expect(data.length).toEqual(1);
    });
  });

  describe("#openDialog()", () => {
    xit("should...", () => {});
  });

  describe("#onTextSearchChange()", () => {
    it("should dispatch a setTextFilterAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const query = "test";
      component.onTextSearchChange(query);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setTextFilterAction({ text: query })
      );
    });
  });

  describe("#onPageChange()", () => {
    it("should dispatch a changePageAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 25
      };
      component.onPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changePageAction({ page: event.pageIndex, limit: event.pageSize })
      );
    });
  });

  describe("#onSortChange()", () => {
    it("should dispatch a SampleSortByColumnAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: SortChangeEvent = {
        active: "test",
        direction: "asc"
      };
      component.onSortChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        sortByColumnAction({ column: event.active, direction: event.direction })
      );
    });
  });

  describe("#onRowClick()", () => {
    it("should navigate to a sample", () => {
      const sample = new Sample();

      component.onRowClick(sample);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/samples/" + encodeURIComponent(sample.sampleId)
      );
    });
  });
});
