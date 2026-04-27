/* eslint @typescript-eslint/no-empty-function:0 */

import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { BatchViewComponent } from "./batch-view.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  MockActivatedRoute,
  MockArchivingService,
  MockDatasetApi,
  mockDataset as dataset,
} from "shared/MockStubs";
import { ArchivingService } from "../archiving.service";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

import { MatDialogModule } from "@angular/material/dialog";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { MatTableModule } from "@angular/material/table";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { DatasetState } from "state-management/state/datasets.store";
import { selectDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import { removeFromBatchAction } from "state-management/actions/datasets.actions";
import { fetchInstrumentsAction } from "state-management/actions/instruments.actions";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatChipsModule } from "@angular/material/chips";
import { MatInputModule } from "@angular/material/input";
import { AppConfigService } from "app-config.service";
import { DatasetsService } from "@scicatproject/scicat-sdk-ts-angular";
import { selectColumnsWithHasFetchedSettings } from "state-management/selectors/user.selectors";
import { DatasetsListService } from "shared/services/datasets-list.service";
import { TableService } from "shared/modules/dynamic-material-table/table/dynamic-mat-table.service";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";
import { TableColumn } from "state-management/models";
import { TranslateService } from "@ngx-translate/core";

describe("BatchViewComponent", () => {
  let component: BatchViewComponent;
  let fixture: ComponentFixture<BatchViewComponent>;

  let dispatchSpy;
  let store: MockStore<DatasetState>;
  let tableService: jasmine.SpyObj<TableService>;
  let datasetsListService: jasmine.SpyObj<DatasetsListService>;
  let translateService: jasmine.SpyObj<TranslateService>;

  const configuredColumns: TableColumn[] = [
    { name: "select", order: 0, type: "standard", enabled: true },
    { name: "pid", order: 1, type: "standard", enabled: true, header: "PID" },
    {
      name: "datasetName",
      order: 2,
      type: "standard",
      enabled: true,
      header: "Dataset name",
    },
    {
      name: "sourceFolder",
      order: 3,
      type: "standard",
      enabled: false,
      header: "Source Folder",
    },
  ];

  const convertedColumns: TableField<any>[] = [
    {
      name: "pid",
      header: "PID",
      display: "visible",
      toExport: (row) => row.pid,
    },
    {
      name: "datasetName",
      header: "Dataset name",
      display: "visible",
      toExport: (row) => row.datasetName,
    },
    {
      name: "sourceFolder",
      header: "Source Folder",
      display: "hidden",
      toExport: (row) => row.sourceFolder,
    },
  ];

  const router = {
    navigate: jasmine.createSpy("navigate"),
  };

  const getConfig = () => ({
    archiveWorkflowEnabled: true,
    shareEnabled: false,
    defaultDatasetsListSettings: {
      columns: configuredColumns,
    },
    labelsLocalization: {
      dataset: {
        pid: "PID",
        datasetName: "Dataset Name",
        creationTime: "Creation Time",
      },
    },
  });

  beforeEach(waitForAsync(() => {
    tableService = jasmine.createSpyObj<TableService>("TableService", [
      "exportToCsv",
    ]);
    translateService = jasmine.createSpyObj<TranslateService>(
      "TranslateService",
      ["instant"],
    );
    translateService.instant.and.callFake((key: string) => {
      const translations = {
        "dataset.PID": "PID",
        "dataset.creationTime": "Creation Time",
      };

      return translations[key] || key;
    });
    datasetsListService = jasmine.createSpyObj<DatasetsListService>(
      "DatasetsListService",
      ["convertSavedDatasetColumns"],
    );
    datasetsListService.convertSavedDatasetColumns.and.returnValue(
      convertedColumns,
    );

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [BatchViewComponent],
      imports: [
        MatButtonModule,
        MatChipsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        SharedScicatFrontendModule,
      ],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectDatasetsInBatch, value: [dataset] },
            {
              selector: selectColumnsWithHasFetchedSettings,
              value: {
                columns: configuredColumns,
                hasFetchedSettings: true,
              },
            },
          ],
        }),
      ],
    });

    TestBed.overrideComponent(BatchViewComponent, {
      set: {
        providers: [
          { provide: ArchivingService, useClass: MockArchivingService },
          { provide: Router, useValue: router },
          { provide: DatasetsService, useClass: MockDatasetApi },
          { provide: AppConfigService, useValue: { getConfig } },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: TableService, useValue: tableService },
          { provide: DatasetsListService, useValue: datasetsListService },
          { provide: TranslateService, useValue: translateService },
        ],
      },
    });
    TestBed.compileComponents();

    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    dispatchSpy = spyOn(store, "dispatch").and.callThrough();
    fixture = TestBed.createComponent(BatchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should request instruments on init for export formatting", () => {
    expect(dispatchSpy).toHaveBeenCalledWith(
      fetchInstrumentsAction({ limit: 1000, skip: 0 }),
    );
  });

  describe("#clearBatch()", () => {
    it("should dispatch a clearBatchAction", () => {
      dispatchSpy.calls.reset();

      component["clearBatch"]();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("#onEmpty()", () => {
    xit("should ...", () => {});
  });

  describe("#onRemove()", () => {
    it("should dispatch a removeFromBatchAction", () => {
      dispatchSpy.calls.reset();
      component.onRemove(dataset);

      expect(dispatchSpy).toHaveBeenCalledOnceWith(
        removeFromBatchAction({ dataset }),
      );
    });
  });

  describe("#onPublish()", () => {
    it("should navigate to datasets/selection/publish", () => {
      component.onPublish();

      expect(component["router"].navigate).toHaveBeenCalledOnceWith([
        "datasets",
        "selection",
        "publish",
      ]);
    });
  });

  describe("#onExportCsv()", () => {
    it("should export csv using visible saved dataset columns", () => {
      component.onExportCsv();

      expect(
        datasetsListService.convertSavedDatasetColumns,
      ).toHaveBeenCalledWith(configuredColumns);
      expect(tableService.exportToCsv).toHaveBeenCalled();

      const [columns, rows, selection, filename] =
        tableService.exportToCsv.calls.mostRecent().args;

      expect(columns.map((column) => column.name)).toEqual([
        "pid",
        "datasetName",
      ]);
      expect(columns.map((column) => column.header)).toEqual([
        "PID",
        "Dataset name",
      ]);
      expect(rows).toEqual([dataset]);
      expect(selection.selected).toEqual([]);
      expect(filename).toMatch(
        /^datasets-selection-\d{4}-\d{1,2}-\d{1,2}\.csv$/,
      );
    });

    it("should fall back to default config columns when user settings are unavailable", () => {
      store.overrideSelector(selectColumnsWithHasFetchedSettings, {
        columns: [],
        hasFetchedSettings: false,
      });
      store.refreshState();

      component.onExportCsv();

      expect(
        datasetsListService.convertSavedDatasetColumns,
      ).toHaveBeenCalledWith(configuredColumns);
    });

    it("should export translated dataset table headers when a column has no explicit header", () => {
      datasetsListService.convertSavedDatasetColumns.and.returnValue([
        {
          name: "creationTime",
          display: "visible",
          toExport: () => "2026-03-25 12:00",
        },
      ]);

      component.onExportCsv();

      const [columns] = tableService.exportToCsv.calls.mostRecent().args;

      expect(columns[0].header).toBe("Creation Time");
      expect(translateService.instant).toHaveBeenCalledWith(
        "dataset.creationTime",
      );
    });
  });

  describe("template", () => {
    it("should render the export button when not editing a published dataset list", () => {
      const button: HTMLButtonElement | null =
        fixture.nativeElement.querySelector("#exportCsvButton");

      expect(button).not.toBeNull();
      expect(button?.textContent).toContain("Export CSV");
    });

    it("should hide the export button while editing a published dataset list", () => {
      component.editingPublishedDataDoi = "10.1234/example";
      fixture.detectChanges();

      const button = fixture.nativeElement.querySelector("#exportCsvButton");

      expect(button).toBeNull();
    });
  });

  describe("#onShare()", () => {
    xit("should ...", () => {});
  });

  describe("#onArchive()", () => {
    xit("should ...", () => {});
  });

  describe("#onRetrieve()", () => {
    xit("should ...", () => {});
  });
});
