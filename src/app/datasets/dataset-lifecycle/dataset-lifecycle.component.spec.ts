import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { DatasetLifecycleComponent } from "./dataset-lifecycle.component";

import { NO_ERRORS_SCHEMA } from "@angular/core";
import { PipesModule } from "shared/pipes/pipes.module";
import { DatePipe } from "@angular/common";
import { Dataset } from "shared/sdk";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { APP_CONFIG } from "app-config.module";
import { PageEvent } from "@angular/material/paginator";

const historyItems = [
  {
    property: "datasetName",
    value: {
      currentValue: "Test Dataset",
      previousValue: "Dataset for Tests",
    },
    updatedBy: "Test User",
    updatedAt: new Date().toISOString(),
  },
  {
    property: "description",
    value: {
      currentValue: "A new dataset description",
      previousValue: "An old dataset description",
    },
    updatedBy: "Test User",
    updatedAt: new Date().toISOString(),
  },
];

describe("DatasetLifecycleComponent", () => {
  let component: DatasetLifecycleComponent;
  let fixture: ComponentFixture<DatasetLifecycleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DatasetLifecycleComponent],
      imports: [MatCardModule, MatIconModule, MatTableModule, PipesModule],
      providers: [
        DatePipe,
        { provide: APP_CONFIG, useValue: { archiveWorkflowEnabled: true } },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetLifecycleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#onPageChange()", () => {
    it("should update historyItems slice for dataSource", () => {
      component.historyItems = historyItems;

      const event: PageEvent = {
        pageIndex: 0,
        pageSize: 1,
        length: 1,
      };

      component.onPageChange(event);

      expect(component.dataSource.length).toEqual(1);
      expect(component.dataSource[0]).toEqual(historyItems[0]);
    });
  });

  describe("#parseHistoryItems()", () => {
    it("should return empty array if dataset is undefined", () => {
      const parsedHistoryItems = component["parseHistoryItems"]();

      expect(Array.isArray(parsedHistoryItems)).toEqual(true);
      expect(parsedHistoryItems.length).toEqual(0);
    });

    it("should parse dataset.history into a HistoryItem array if dataset is defined", () => {
      const keywords = ["test", "parse"];
      const dataset = new Dataset();
      dataset.history = [
        {
          id: "testId",
          keywords,
          updatedBy: "Test User",
          updatedAt: new Date().toISOString(),
        },
      ];

      component.dataset = dataset;
      const parsedHistoryItems = component["parseHistoryItems"]();

      expect(parsedHistoryItems.length).toEqual(1);
      parsedHistoryItems.forEach((item) => {
        expect(Object.keys(item).includes("id")).toEqual(false);
        expect(item.property).toEqual("keywords");
        expect(item.value).toEqual(keywords);
      });
    });
  });

  describe("#downloadCsv()", () => {
    it("should create and download a csv file", () => {
      const spyObj = jasmine.createSpyObj("a", ["click", "remove"]);
      const createElementSpy = spyOn(document, "createElement").and.returnValue(spyObj);
      const url = "testUrl";
      spyOn(window.URL, "createObjectURL").and.returnValue(url);
      spyOn(window.URL, "revokeObjectURL").and.callThrough();

      component.historyItems = historyItems;
      const blob = createCsvBlob();

      component.downloadCsv();

      expect(createElementSpy).toHaveBeenCalledTimes(1);
      expect(createElementSpy).toHaveBeenCalledWith("a");

      expect(spyObj.href).toBe(url);
      expect(spyObj.download).toBe("history.csv");
      expect(spyObj.click).toHaveBeenCalledTimes(1);
      expect(spyObj.remove).toHaveBeenCalledTimes(1);

      expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
      expect(window.URL.createObjectURL).toHaveBeenCalledWith(blob);

      expect(window.URL.revokeObjectURL).toHaveBeenCalledTimes(1);
      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith(url);
    });
  });
});

function createCsvBlob() {
  const replacer = (key, value) => (value === null ? "" : value);
  const header = [
    "property",
    "currentValue",
    "previousValue",
    "updatedBy",
    "updatedAt",
  ];
  const csv = historyItems.map((row) =>
    header
      .map((fieldName) => {
        switch (fieldName) {
          case "currentValue": {
            return row.value[fieldName]
              ? JSON.stringify(row.value[fieldName], replacer)
              : JSON.stringify(row.value, replacer);
          }
          case "previousValue": {
            return row.value[fieldName]
              ? JSON.stringify(row.value[fieldName], replacer)
              : "";
          }
          default: {
            return JSON.stringify(row[fieldName], replacer);
          }
        }
      })
      .join(";")
  );
  csv.unshift(header.join(";"));
  const csvArray = csv.join("\r\n");
  return new Blob([csvArray], { type: "text/csv" });
}
