import { LinkyPipe } from "ngx-linky";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SharedScicatFrontendModule } from "shared/shared.module";

import { Observable, of } from "rxjs";

import { StoreModule } from "@ngrx/store";

import { ActivatedRoute, Router } from "@angular/router";
import { MockActivatedRoute } from "shared/MockStubs";
import { AppConfigService } from "app-config.service";
import {
  TranslateLoader,
  TranslateModule,
  TranslationObject,
} from "@ngx-translate/core";
import { DatasetDetailDynamicComponent } from "./dataset-detail-dynamic.component";
import { InternalLinkType } from "state-management/models";
class MockTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({});
  }
}

describe("DatasetDetailDynamicComponent", () => {
  let component: DatasetDetailDynamicComponent;
  let fixture: ComponentFixture<DatasetDetailDynamicComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };

  const getConfig = () => ({});

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        SharedScicatFrontendModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader,
          },
        }),
        StoreModule.forRoot({}),
      ],
      declarations: [DatasetDetailDynamicComponent, LinkyPipe],
    });
    TestBed.overrideComponent(DatasetDetailDynamicComponent, {
      set: {
        providers: [
          { provide: Router, useValue: router },
          {
            provide: AppConfigService,
            useValue: {
              getConfig,
            },
          },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
        ],
      },
    });

    TestBed.compileComponents();
    fixture = TestBed.createComponent(DatasetDetailDynamicComponent);
    component = fixture.componentInstance;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("getInstrumentName", () => {
    beforeEach(() => {
      component.instruments = {
        instrument1: { pid: "instrument1", name: "Test Instrument 1" },
        instrument2: { pid: "instrument2", name: "Test Instrument 2" },
      } as any;
    });

    it("should return instrument name when instrument exists", () => {
      const result = component.getInstrumentName("instrument1");
      expect(result).toBe("Test Instrument 1");
    });

    it("should return '-' when instrument does not exist", () => {
      const result = component.getInstrumentName("nonexistent");
      expect(result).toBe("-");
    });

    it("should return '-' when instrumentId is null", () => {
      const result = component.getInstrumentName(null as any);
      expect(result).toBe("-");
    });

    it("should return '-' when instrumentId is undefined", () => {
      const result = component.getInstrumentName(undefined as any);
      expect(result).toBe("-");
    });

    it("should return '-' when instrumentId is empty string", () => {
      const result = component.getInstrumentName("");
      expect(result).toBe("-");
    });
  });

  describe("getNestedValue with instrument name resolution", () => {
    beforeEach(() => {
      component.instruments = {
        instrument1: { pid: "instrument1", name: "Test Instrument" },
      } as any;
    });

    it("should return instrument name when path is 'instrumentName' and instrumentId exists", () => {
      const dataset = { instrumentId: "instrument1" } as any;
      const result = component.getNestedValue(dataset, "instrumentName");
      expect(result).toBe("Test Instrument");
    });

    it("should return '-' when path is 'instrumentName' but instrument not found", () => {
      const dataset = { instrumentId: "nonexistent" } as any;
      const result = component.getNestedValue(dataset, "instrumentName");
      expect(result).toBe("-");
    });

    it("should return undefined when path is 'instrumentName' but no instrumentId", () => {
      const dataset = {} as any;
      const result = component.getNestedValue(dataset, "instrumentName");
      expect(result).toBeUndefined();
    });

    it("should work normally for non-instrumentName paths", () => {
      const dataset = { pid: "test-pid", instrumentId: "instrument1" } as any;
      const result = component.getNestedValue(dataset, "pid");
      expect(result).toBe("test-pid");
    });
  });

  describe("getInternalLinkValue", () => {
    beforeEach(() => {
      component.instruments = {
        instrument1: { pid: "instrument1", name: "Test Instrument" },
      } as any;
    });

    it("should return instrumentId when path is 'instrumentName'", () => {
      const dataset = { instrumentId: "instrument1" } as any;
      const result = component.getInternalLinkValue(dataset, "instrumentName");
      expect(result).toBe("instrument1");
    });

    it("should return instrumentId even when instrument name is available", () => {
      const dataset = {
        instrumentId: "instrument1",
        instrumentName: "Test Instrument",
      } as any;
      const result = component.getInternalLinkValue(dataset, "instrumentName");
      expect(result).toBe("instrument1");
    });

    it("should return undefined when path is 'instrumentName' but no instrumentId", () => {
      const dataset = {} as any;
      const result = component.getInternalLinkValue(dataset, "instrumentName");
      expect(result).toBeUndefined();
    });

    it("should use getNestedValue for non-instrumentName paths", () => {
      const dataset = { pid: "test-pid", instrumentId: "instrument1" } as any;
      const result = component.getInternalLinkValue(dataset, "pid");
      expect(result).toBe("test-pid");
    });

    it("should handle nested paths correctly", () => {
      const dataset = {
        nested: { value: "test-value" },
        instrumentId: "instrument1",
      } as any;
      const result = component.getInternalLinkValue(dataset, "nested.value");
      expect(result).toBe("test-value");
    });
  });

  describe("onClickInternalLink with instrument support", () => {
    beforeEach(() => {
      (component["router"].navigateByUrl as jasmine.Spy).calls.reset();
      spyOn(component["snackBar"], "open");
    });

    it("should navigate to instruments page when internalLinkType is 'instrumentName'", () => {
      component.onClickInternalLink("instrumentName", "instrument123");
      expect(component["router"].navigateByUrl).toHaveBeenCalledWith(
        "/instruments/instrument123",
      );
    });

    it("should navigate to instruments page when internalLinkType is 'instruments'", () => {
      component.onClickInternalLink(InternalLinkType.INSTRUMENTS, "instrument123");
      expect(component["router"].navigateByUrl).toHaveBeenCalledWith(
        "/instruments/instrument123",
      );
    });

    it("should encode special characters in instrument ID", () => {
      component.onClickInternalLink("instrumentName", "instrument with spaces");
      expect(component["router"].navigateByUrl).toHaveBeenCalledWith(
        "/instruments/instrument%20with%20spaces",
      );
    });

    it("should navigate to datasets page for dataset links", () => {
      component.onClickInternalLink(InternalLinkType.DATASETS, "dataset123");
      expect(component["router"].navigateByUrl).toHaveBeenCalledWith(
        "/datasets/dataset123",
      );
    });

    it("should show error message for invalid link types", () => {
      component.onClickInternalLink("invalid", "test123");
      expect(component["snackBar"].open).toHaveBeenCalledWith(
        "The URL is not valid",
        "Close",
        {
          duration: 2000,
        },
      );
    });
  });

  describe("getScientificMetadata", () => {
    type TestCase = {
      desc: string;
      dataset: any;
      path?: string;
      expected: any;
    };

    const testCases: TestCase[] = [
      {
        desc: "return null when dataset is null",
        dataset: null,
        path: "any.path",
        expected: null,
      },
      {
        desc: "return null when dataset is undefined",
        dataset: undefined,
        path: "any.path",
        expected: null,
      },
      {
        desc: "return null when dataset has no scientificMetadata",
        dataset: { pid: "test" },
        path: "any.path",
        expected: null,
      },
      {
        desc: "return entire scientificMetadata when no source is provided",
        dataset: { scientificMetadata: { key1: "value1", key2: "value2" } },
        expected: { key1: "value1", key2: "value2" },
      },
      {
        desc: "return entire scientificMetadata when empty source is provided",
        dataset: { scientificMetadata: { key1: "value1", key2: "value2" } },
        path: "",
        expected: { key1: "value1", key2: "value2" },
      },
      {
        desc: "return entire scientificMetadata when source is 'scientificMetadata'",
        dataset: { scientificMetadata: { key1: "value1", key2: "value2" } },
        path: "scientificMetadata",
        expected: { key1: "value1", key2: "value2" },
      },
      {
        desc: "return nested metadata when valid path is provided",
        dataset: {
          scientificMetadata: {
            sampleProperties: { temperature: "25°C", pressure: "1 atm" },
            otherData: "test",
          },
        },
        path: "scientificMetadata.sampleProperties",
        expected: { temperature: "25°C", pressure: "1 atm" },
      },
      {
        desc: "return nested metadata when path without 'scientificMetadata' prefix is provided",
        dataset: {
          scientificMetadata: {
            sampleProperties: { temperature: "25°C", pressure: "1 atm" },
          },
        },
        path: "sampleProperties",
        expected: { temperature: "25°C", pressure: "1 atm" },
      },
      {
        desc: "return deeply nested metadata",
        dataset: {
          scientificMetadata: {
            experiment: {
              conditions: {
                environmental: { humidity: "60%" },
              },
            },
          },
        },
        path: "experiment.conditions.environmental",
        expected: { humidity: "60%" },
      },
      {
        desc: "return null when path does not exist",
        dataset: {
          scientificMetadata: {
            sampleProperties: { temperature: "25°C" },
          },
        },
        path: "nonExistentPath",
        expected: null,
      },
      {
        desc: "return null when partial path exists but final key does not",
        dataset: {
          scientificMetadata: {
            sampleProperties: { temperature: "25°C" },
          },
        },
        path: "sampleProperties.nonExistentKey",
        expected: null,
      },
      {
        desc: "return null when path leads to non-object value",
        dataset: {
          scientificMetadata: {
            sampleProperties: { temperature: "25°C" },
          },
        },
        path: "sampleProperties.temperature",
        expected: null,
      },
      {
        desc: "return null when path leads to null value",
        dataset: {
          scientificMetadata: { sampleProperties: null },
        },
        path: "sampleProperties",
        expected: null,
      },
      {
        desc: "return null when path leads to undefined value",
        dataset: {
          scientificMetadata: { sampleProperties: undefined },
        },
        path: "sampleProperties",
        expected: null,
      },
      {
        desc: "handle array values correctly",
        dataset: {
          scientificMetadata: {
            measurements: [
              { value: 1, unit: "cm" },
              { value: 2, unit: "cm" },
            ],
          },
        },
        path: "measurements",
        expected: [
          { value: 1, unit: "cm" },
          { value: 2, unit: "cm" },
        ],
      },
      {
        desc: "handle empty object values",
        dataset: {
          scientificMetadata: { emptySection: {} },
        },
        path: "emptySection",
        expected: {},
      },
    ];

    testCases.forEach(({ desc, dataset, path, expected }) => {
      it(`should ${desc}`, () => {
        const result = component.getScientificMetadata(dataset, path);
        expect(result).toEqual(expected);
      });
    });
  });
});
