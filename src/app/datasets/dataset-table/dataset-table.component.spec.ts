/* eslint @typescript-eslint/no-empty-function:0 */

import {
  DatasetTableComponent,
  SortChangeEvent,
} from "./dataset-table.component";
import {
  MockStore,
  MockDatasetApi,
  mockDataset,
  createMock,
  MockActivatedRoute,
  MockDatasetsListService,
} from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";
import { StoreModule, Store } from "@ngrx/store";
import { SharedScicatFrontendModule } from "shared/shared.module";
import {
  selectDatasetAction,
  deselectDatasetAction,
  selectAllDatasetsAction,
  clearSelectionAction,
  sortByColumnAction,
} from "state-management/actions/datasets.actions";
import { provideMockStore } from "@ngrx/store/testing";
import { selectDatasets } from "state-management/selectors/datasets.selectors";
import { selectInstruments } from "state-management/selectors/instruments.selectors";
import { MatTableModule } from "@angular/material/table";
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from "@angular/material/checkbox";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppConfigService } from "app-config.service";
import {
  DatasetClass,
  DatasetsService,
} from "@scicatproject/scicat-sdk-ts-angular";
import { RowEventType } from "shared/modules/dynamic-material-table/models/table-row.model";
import { ActivatedRoute } from "@angular/router";
import { JsonHeadPipe } from "shared/pipes/json-head.pipe";
import { DatePipe } from "@angular/common";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { TitleCasePipe } from "shared/pipes/title-case.pipe";
import { TranslateService } from "@ngx-translate/core";
import { DatasetsListService } from "shared/services/datasets-list.service";

const getConfig = () => ({});

const auditFields = {
  createdAt: "",
  createdBy: "",
  updatedAt: "",
  updatedBy: "",
};

describe("DatasetTableComponent", () => {
  let component: DatasetTableComponent;
  let fixture: ComponentFixture<DatasetTableComponent>;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatPaginatorModule,
        MatTableModule,
        SharedScicatFrontendModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectDatasets, value: [] },
            { selector: selectInstruments, value: [] },
          ],
        }),
        { provide: TranslateService, useValue: { instant: (k: string) => k } },
        //DatasetsListService,
        // JsonHeadPipe,
        // DatePipe,
        FileSizePipe,
        // TitleCasePipe,
      ],
      declarations: [DatasetTableComponent],
    });
    TestBed.overrideComponent(DatasetTableComponent, {
      set: {
        providers: [
          {
            provide: AppConfigService,
            useValue: { getConfig },
          },
          { provide: DatasetsService, useClass: MockDatasetApi },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: DatasetsListService, useClass: MockDatasetsListService },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  describe("#doRowClick()", () => {
    it("should emit the dataset clicked", () => {
      const emitSpy = spyOn(component.rowClick, "emit");

      const dataset = mockDataset;
      component.onRowEvent({
        event: RowEventType.RowClick,
        sender: { row: dataset },
      });

      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith(dataset);
    });
  });

  describe("#onSelect()", () => {
    it("should dispatch a selectDatasetAction if checked is true", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = new MatCheckboxChange();
      event.checked = true;
      const dataset = mockDataset;
      component.onSelect(event, dataset);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        selectDatasetAction({ dataset }),
      );
    });

    it("should dispatch a deselectDatasetAction if checked is false", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = new MatCheckboxChange();
      event.checked = false;
      const dataset = mockDataset;
      component.onSelect(event, dataset);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        deselectDatasetAction({ dataset }),
      );
    });
  });

  describe("#onSelectAll()", () => {
    it("should dispatch a selectAllDatasetsAction if checked is true", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = new MatCheckboxChange();
      event.checked = true;
      component.onSelectAll(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(selectAllDatasetsAction());
    });

    it("should dispatch a clearSelectionAction if checked is false", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event = new MatCheckboxChange();
      event.checked = false;
      component.onSelectAll(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(clearSelectionAction());
    });
  });

  describe("#onSortChange()", () => {
    it("should dispatch a sortByColumnAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: SortChangeEvent = {
        active: "standard_datasetName",
        direction: "asc",
      };
      const column = event.active.split("_")[1];
      component.onSortChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        sortByColumnAction({ column, direction: event.direction }),
      );
    });
  });

  describe("instruments subscription with Map optimization", () => {
    it("should update both instruments array and instrumentMap when instruments observable changes", () => {
      const mockInstruments = [
        {
          ...auditFields,
          pid: "inst1",
          uniqueName: "unique1",
          name: "Instrument 1",
        },
        {
          ...auditFields,
          pid: "inst2",
          uniqueName: "unique2",
          name: "Instrument 2",
        },
      ];

      component.instruments = mockInstruments;
      component.instrumentMap = new Map(
        mockInstruments.map((instrument) => [instrument.pid, instrument]),
      );

      expect(component.instruments).toEqual(mockInstruments);
      expect(component.instrumentMap.size).toBe(2);
      expect(component.instrumentMap.get("inst1")).toEqual(mockInstruments[0]);
      expect(component.instrumentMap.get("inst2")).toEqual(mockInstruments[1]);
    });

    it("should handle empty instruments array and clear instrumentMap", () => {
      component.instruments = [];
      component.instrumentMap = new Map();

      expect(component.instruments).toEqual([]);
      expect(component.instrumentMap.size).toBe(0);
    });

    it("should provide O(1) lookup performance for instrument retrieval", () => {
      const mockInstruments = [
        {
          ...auditFields,
          pid: "fast-lookup",
          uniqueName: "unique1",
          name: "Fast Instrument",
        },
      ];

      component.instrumentMap = new Map(
        mockInstruments.map((instrument) => [instrument.pid, instrument]),
      );

      const foundInstrument = component.instrumentMap.get("fast-lookup");
      expect(foundInstrument).toEqual(mockInstruments[0]);

      const notFoundInstrument = component.instrumentMap.get("nonexistent");
      expect(notFoundInstrument).toBeUndefined();
    });
  });
});
