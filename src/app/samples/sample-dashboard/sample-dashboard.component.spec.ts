import { MockStore, MockActivatedRoute, mockSample } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SampleDashboardComponent } from "./sample-dashboard.component";
import { Store, StoreModule } from "@ngrx/store";
import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";
import {
  setTextFilterAction,
  changePageAction,
  sortByColumnAction,
} from "state-management/actions/samples.actions";
import {
  PageChangeEvent,
  SortChangeEvent,
} from "shared/modules/table/table.component";
import { DatePipe } from "@angular/common";
import { SampleDialogComponent } from "samples/sample-dialog/sample-dialog.component";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { AppConfigService } from "app-config.service";
import {
  RowEventType,
  TableEventType,
} from "shared/modules/dynamic-material-table/models/table-row.model";

const getConfig = () => ({
  addSampleEnabled: true,
});

describe("SampleDashboardComponent", () => {
  let component: SampleDashboardComponent;
  let fixture: ComponentFixture<SampleDashboardComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        FlexLayoutModule,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatDialogModule,
        MatIconModule,
        MatTableModule,
        StoreModule.forRoot({}),
      ],
      declarations: [SampleDashboardComponent],
      providers: [DatePipe],
    });
    TestBed.overrideComponent(SampleDashboardComponent, {
      set: {
        providers: [
          { provide: AppConfigService, useValue: { getConfig } },
          { provide: Router, useValue: router },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
        ],
      },
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
      const samples = [mockSample];

      const data = component.formatTableData(samples);

      expect(data.length).toEqual(1);
    });
  });

  describe("#openDialog()", () => {
    it("should open the sample dialog", () => {
      spyOn(component.dialog, "open");

      component.name = "test";
      component.description = "test";

      component.openDialog();

      expect(component.dialog.open).toHaveBeenCalledTimes(1);
      expect(component.dialog.open).toHaveBeenCalledWith(
        SampleDialogComponent,
        {
          width: "250px",
          data: { name: component.name, description: component.description },
        },
      );
    });
  });

  describe("#onTextSearchChange()", () => {
    it("should dispatch a setTextFilterAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const query = "test";
      component.onTextSearchChange(query);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        setTextFilterAction({ text: query }),
      );
    });
  });

  describe("#onPageChange()", () => {
    it("should dispatch a changePageAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 25,
      };
      component.onPaginationChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changePageAction({ page: event.pageIndex, limit: event.pageSize }),
      );
    });
  });

  describe("#onSortChange()", () => {
    it("should dispatch a SampleSortByColumnAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const sender: SortChangeEvent = {
        active: "test",
        direction: "asc",
      };
      component.onTableEvent({ event: TableEventType.SortChanged, sender });

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        sortByColumnAction({
          column: sender.active,
          direction: sender.direction,
        }),
      );
    });
  });

  describe("#onRowClick()", () => {
    it("should navigate to a sample", () => {
      const sample = mockSample;

      component.onRowClick({
        event: RowEventType.RowClick,
        sender: { row: sample },
      });

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/samples/" + encodeURIComponent(sample.sampleId),
      );
    });
  });
});
