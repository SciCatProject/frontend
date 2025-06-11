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

const getConfig = () => ({});

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
        JsonHeadPipe,
        DatePipe,
        FileSizePipe,
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

  describe("#wipCondition()", () => {
    xit("should...", () => {});
  });

  describe("#systemErrorCondition()", () => {
    xit("should...", () => {});
  });

  describe("#userErrorCondition()", () => {
    it("should return true if dataset has missingFilesError", () => {
      const dataset = createMock<DatasetClass>({});
      dataset.datasetlifecycle = {
        archiveStatusMessage: "missingFilesError",
      };

      const userError = component.userErrorCondition(dataset);

      expect(userError).toEqual(true);
    });

    it("should return false if dataset has no missingFilesError", () => {
      const dataset = createMock<DatasetClass>({});
      dataset.datasetlifecycle = {
        archiveStatusMessage: "",
      };

      const userError = component.userErrorCondition(dataset);

      expect(userError).toEqual(false);
    });
  });

  describe("#archivableCondition()", () => {
    it("should return false if dataset is not archivable and retrievable and does not have a missingFilesError", () => {
      const dataset = createMock<DatasetClass>({});
      dataset.datasetlifecycle = {
        archivable: false,
        retrievable: true,
        archiveStatusMessage: "",
      };

      const archivable = component.archivableCondition(dataset);

      expect(archivable).toEqual(false);
    });

    it("should return false if dataset is not archivable and retrievable and does have a missingFilesError", () => {
      const dataset = createMock<DatasetClass>({});
      dataset.datasetlifecycle = {
        archivable: false,
        retrievable: true,
        archiveStatusMessage: "missingFilesError",
      };

      const archivable = component.archivableCondition(dataset);

      expect(archivable).toEqual(false);
    });

    it("should return false if dataset is not archivable and not retrievable and does not have a missingFilesError", () => {
      const dataset = createMock<DatasetClass>({});
      dataset.datasetlifecycle = {
        archivable: false,
        retrievable: false,
        archiveStatusMessage: "",
      };

      const archivable = component.archivableCondition(dataset);

      expect(archivable).toEqual(false);
    });

    it("should return false if dataset is not archivable and not retrievable and does have a missingFilesError", () => {
      const dataset = createMock<DatasetClass>({});
      dataset.datasetlifecycle = {
        archivable: false,
        retrievable: false,
        archiveStatusMessage: "missingFilesError",
      };

      const archivable = component.archivableCondition(dataset);

      expect(archivable).toEqual(false);
    });

    it("should return false if dataset is not archivable and retrievable and does not have a missingFilesError", () => {
      const dataset = createMock<DatasetClass>({});
      dataset.datasetlifecycle = {
        archivable: false,
        retrievable: true,
        archiveStatusMessage: "",
      };

      const archivable = component.archivableCondition(dataset);

      expect(archivable).toEqual(false);
    });

    it("should return false if dataset is archivable and retrievable and does not have a missingFilesError", () => {
      const dataset = createMock<DatasetClass>({});
      dataset.datasetlifecycle = {
        archivable: true,
        retrievable: true,
        archiveStatusMessage: "",
      };

      const archivable = component.archivableCondition(dataset);

      expect(archivable).toEqual(false);
    });

    it("should return false if dataset is archivable and retrievable and does have a missingFilesError", () => {
      const dataset = createMock<DatasetClass>({});
      dataset.datasetlifecycle = {
        archivable: true,
        retrievable: true,
        archiveStatusMessage: "missingFilesError",
      };

      const archivable = component.archivableCondition(dataset);

      expect(archivable).toEqual(false);
    });

    it("should return true if dataset is archivable and not retrievable and does not have a missingFilesError", () => {
      const dataset = createMock<DatasetClass>({});
      dataset.datasetlifecycle = {
        archivable: true,
        retrievable: false,
        archiveStatusMessage: "",
      };

      const archivable = component.archivableCondition(dataset);

      expect(archivable).toEqual(true);
    });
  });

  describe("#retrievableCondition()", () => {
    it("should return false if dataset is archivable and not retrievable", () => {
      const dataset = createMock<DatasetClass>({});
      dataset.datasetlifecycle = {
        archivable: true,
        retrievable: false,
      };

      const retrievable = component.retrievableCondition(dataset);

      expect(retrievable).toEqual(false);
    });

    it("should return false if dataset is not archivable and not retrievable", () => {
      const dataset = createMock<DatasetClass>({});
      dataset.datasetlifecycle = {
        archivable: false,
        retrievable: false,
      };

      const retrievable = component.retrievableCondition(dataset);

      expect(retrievable).toEqual(false);
    });

    it("should return false if dataset is archivable and retrievable", () => {
      const dataset = createMock<DatasetClass>({});
      dataset.datasetlifecycle = {
        archivable: true,
        retrievable: true,
      };

      const retrievable = component.retrievableCondition(dataset);

      expect(retrievable).toEqual(false);
    });

    it("should return true if dataset is retrievable and not archivable", () => {
      const dataset = createMock<DatasetClass>({});
      dataset.datasetlifecycle = {
        archivable: false,
        retrievable: true,
      };

      const retrievable = component.retrievableCondition(dataset);

      expect(retrievable).toEqual(true);
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

  describe("#convertSavedColumns() with instrumentName", () => {
    beforeEach(() => {
      component.instruments = [
        {
          pid: "instrument1",
          uniqueName: "unique1",
          name: "Test Instrument 1",
        },
        {
          pid: "instrument2",
          uniqueName: "unique2",
          name: "Test Instrument 2",
        },
        { pid: "instrument3", uniqueName: "unique3", name: "" },
      ] as any[];

      component.instrumentMap = new Map(
        component.instruments.map((instrument) => [instrument.pid, instrument]),
      );
    });

    it("should render instrument name when instrument is found", () => {
      const columns = [
        {
          name: "instrumentName",
          order: 0,
          enabled: true,
          width: 200,
          type: "standard" as const,
        },
      ];

      const convertedColumns = component.convertSavedColumns(columns);
      const instrumentColumn = convertedColumns[0];

      const mockRow = { instrumentId: "instrument1" };
      const result = instrumentColumn.customRender(instrumentColumn, mockRow);

      expect(result).toBe("Test Instrument 1");
    });

    it("should render instrumentId when instrument is not found", () => {
      const columns = [
        {
          name: "instrumentName",
          order: 0,
          enabled: true,
          width: 200,
          type: "standard" as const,
        },
      ];

      const convertedColumns = component.convertSavedColumns(columns);
      const instrumentColumn = convertedColumns[0];

      const mockRow = { instrumentId: "nonexistent" };
      const result = instrumentColumn.customRender(instrumentColumn, mockRow);

      expect(result).toBe("nonexistent");
    });

    it("should render '-' when instrumentId is not present", () => {
      const columns = [
        {
          name: "instrumentName",
          order: 0,
          enabled: true,
          width: 200,
          type: "standard" as const,
        },
      ];

      const convertedColumns = component.convertSavedColumns(columns);
      const instrumentColumn = convertedColumns[0];

      const mockRow = {};
      const result = instrumentColumn.customRender(instrumentColumn, mockRow);

      expect(result).toBe("-");
    });

    it("should render instrumentId when instrument has empty name", () => {
      const columns = [
        {
          name: "instrumentName",
          order: 0,
          enabled: true,
          width: 200,
          type: "standard" as const,
        },
      ];

      const convertedColumns = component.convertSavedColumns(columns);
      const instrumentColumn = convertedColumns[0];

      const mockRow = { instrumentId: "instrument3" };
      const result = instrumentColumn.customRender(instrumentColumn, mockRow);

      expect(result).toBe("instrument3");
    });

    it("should export instrument name when instrument is found", () => {
      const columns = [
        {
          name: "instrumentName",
          order: 0,
          enabled: true,
          width: 200,
          type: "standard" as const,
        },
      ];

      const convertedColumns = component.convertSavedColumns(columns);
      const instrumentColumn = convertedColumns[0];

      const mockRow = { instrumentId: "instrument2" };
      const result = instrumentColumn.toExport(mockRow, instrumentColumn);

      expect(result).toBe("Test Instrument 2");
    });

    it("should export instrumentId when instrument is not found", () => {
      const columns = [
        {
          name: "instrumentName",
          order: 0,
          enabled: true,
          width: 200,
          type: "standard" as const,
        },
      ];

      const convertedColumns = component.convertSavedColumns(columns);
      const instrumentColumn = convertedColumns[0];

      const mockRow = { instrumentId: "unknown-instrument" };
      const result = instrumentColumn.toExport(mockRow, instrumentColumn);

      expect(result).toBe("unknown-instrument");
    });

    it("should not affect other column types", () => {
      const columns = [
        {
          name: "datasetName",
          order: 0,
          enabled: true,
          width: 200,
          type: "standard" as const,
        },
        {
          name: "instrumentName",
          order: 1,
          enabled: true,
          width: 200,
          type: "standard" as const,
        },
      ];

      const convertedColumns = component.convertSavedColumns(columns);

      expect(convertedColumns.length).toBe(2);
      expect(convertedColumns[0].name).toBe("datasetName");
      expect(convertedColumns[0].customRender).toBeUndefined();
      expect(convertedColumns[1].name).toBe("instrumentName");
      expect(convertedColumns[1].customRender).toBeDefined();
    });
  });

  describe("instruments subscription with Map optimization", () => {
    it("should update both instruments array and instrumentMap when instruments observable changes", () => {
      const mockInstruments = [
        { pid: "inst1", uniqueName: "unique1", name: "Instrument 1" },
        { pid: "inst2", uniqueName: "unique2", name: "Instrument 2" },
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
        { pid: "fast-lookup", uniqueName: "unique1", name: "Fast Instrument" },
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

  describe("#getInstrumentName() private method", () => {
    beforeEach(() => {
      const mockInstruments = [
        { pid: "inst1", uniqueName: "unique1", name: "Test Instrument 1" },
        { pid: "inst2", uniqueName: "unique2", name: "Test Instrument 2" },
        { pid: "inst3", uniqueName: "unique3", name: "" },
      ];

      component.instrumentMap = new Map(
        mockInstruments.map((instrument) => [instrument.pid, instrument]),
      );
    });

    it("should return instrument name when instrument is found", () => {
      const mockRow = { instrumentId: "inst1" } as any;
      const result = component["getInstrumentName"](mockRow);
      expect(result).toBe("Test Instrument 1");
    });

    it("should return instrumentId when instrument is not found", () => {
      const mockRow = { instrumentId: "nonexistent" } as any;
      const result = component["getInstrumentName"](mockRow);
      expect(result).toBe("nonexistent");
    });

    it("should return '-' when instrumentId is not present", () => {
      const mockRow = {} as any;
      const result = component["getInstrumentName"](mockRow);
      expect(result).toBe("-");
    });

    it("should return instrumentId when instrument has empty name", () => {
      const mockRow = { instrumentId: "inst3" } as any;
      const result = component["getInstrumentName"](mockRow);
      expect(result).toBe("inst3");
    });

    it("should handle undefined instrumentId gracefully", () => {
      const mockRow = { instrumentId: undefined } as any;
      const result = component["getInstrumentName"](mockRow);
      expect(result).toBe("-");
    });

    it("should handle null instrumentId gracefully", () => {
      const mockRow = { instrumentId: null } as any;
      const result = component["getInstrumentName"](mockRow);
      expect(result).toBe("-");
    });

    it("should handle empty string instrumentId gracefully", () => {
      const mockRow = { instrumentId: "" } as any;
      const result = component["getInstrumentName"](mockRow);
      expect(result).toBe("-");
    });

    it("should return instrument name even when instrumentId is empty but instrument exists", () => {
      // Add an instrument with empty string pid to test edge case
      component.instrumentMap.set("", {
        pid: "",
        name: "Empty PID Instrument",
      } as any);

      const mockRow = { instrumentId: "" } as any;
      const result = component["getInstrumentName"](mockRow);
      expect(result).toBe("Empty PID Instrument");
    });
  });
});
