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
          selectors: [{ selector: selectDatasets, value: [] }],
        }),
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
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetTableComponent);
    component = fixture.componentInstance;
    component.tableColumns = [];
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

  describe("#doSettingsClick()", () => {
    it("should emit a MouseEvent on click", () => {
      const emitSpy = spyOn(component.settingsClick, "emit");

      const event = {} as MouseEvent;
      component.doSettingsClick(event);

      expect(emitSpy).toHaveBeenCalledTimes(1);
      expect(emitSpy).toHaveBeenCalledWith(event);
    });
  });

  describe("#doRowClick()", () => {
    it("should emit the dataset clicked", () => {
      const emitSpy = spyOn(component.rowClick, "emit");

      const dataset = mockDataset;
      component.doRowClick(dataset);

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

  describe("#isSelected()", () => {
    it("should return false if dataset is not selected", () => {
      const dataset = createMock<DatasetClass>({});
      const selected = component.isSelected(dataset);

      expect(selected).toEqual(false);
    });
  });

  describe("#isAllSelected()", () => {
    it("should return false if length of datasets and length of selectedSets are not equal", () => {
      component.datasets = [mockDataset];

      const allSelected = component.isAllSelected();

      expect(allSelected).toEqual(false);
    });

    it("should return true if length of datasets and length of selectedSets are equal", () => {
      const allSelected = component.isAllSelected();

      expect(allSelected).toEqual(true);
    });
  });

  describe("#isInBatch()", () => {
    it("should return false if dataset is not in batch", () => {
      const dataset = createMock<DatasetClass>({});
      const inBatch = component.isInBatch(dataset);

      expect(inBatch).toEqual(false);
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

  describe("#countDerivedDatasets()", () => {
    xit("should return the number of derived datasets for a dataset", () => {
      // const dataset = mockDataset;
      // const numberOfDerivedDataset = component.countDerivedDatasets(dataset);
      // expect(numberOfDerivedDataset).toEqual(0);
    });
  });
});
