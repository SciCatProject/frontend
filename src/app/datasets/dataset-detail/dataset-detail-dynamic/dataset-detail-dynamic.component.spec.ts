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
