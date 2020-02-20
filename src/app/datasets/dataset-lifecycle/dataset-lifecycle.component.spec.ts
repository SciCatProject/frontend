import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DatasetLifecycleComponent } from "./dataset-lifecycle.component";
import {
  MatCardModule,
  MatIconModule,
  MatTableModule
} from "@angular/material";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { PipesModule } from "shared/pipes/pipes.module";
import { DatePipe } from "@angular/common";
import { Dataset } from "shared/sdk";

describe("DatasetLifecycleComponent", () => {
  let component: DatasetLifecycleComponent;
  let fixture: ComponentFixture<DatasetLifecycleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DatasetLifecycleComponent],
      imports: [MatCardModule, MatIconModule, MatTableModule, PipesModule],
      providers: [DatePipe]
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

  describe("#parseHistoryItems()", () => {
    it("should return empty array if dataset is undefined", () => {
      const historyItems = component["parseHistoryItems"]();

      expect(Array.isArray(historyItems)).toEqual(true);
      expect(historyItems.length).toEqual(0);
    });

    it("should parse dataset.history into a HistoryItem array if dataset is defined", () => {
      const keywords = ["test", "parse"];
      const dataset = new Dataset();
      dataset.history = [
        {
          id: "testId",
          keywords,
          updatedBy: "Test User",
          updatedAt: new Date().toISOString()
        }
      ];

      component.dataset = dataset;
      const historyItems = component["parseHistoryItems"]();

      expect(historyItems.length).toEqual(1);
      historyItems.forEach(item => {
        expect(Object.keys(item).includes("id")).toEqual(false);
        expect(item.property).toEqual("keywords");
        expect(item.value).toEqual(keywords);
      });
    });
  });
});
