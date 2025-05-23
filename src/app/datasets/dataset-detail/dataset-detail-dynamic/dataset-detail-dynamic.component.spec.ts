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
    it("should return null when dataset is null or undefined", () => {
      expect(component.getScientificMetadata(null, "any.path")).toBeNull();
      expect(component.getScientificMetadata(undefined, "any.path")).toBeNull();
    });

    it("should return null when dataset has no scientificMetadata", () => {
      const dataset = { pid: "test" } as any;
      expect(component.getScientificMetadata(dataset, "any.path")).toBeNull();
    });

    it("should return entire scientificMetadata when no source is provided", () => {
      const dataset = {
        scientificMetadata: { key1: "value1", key2: "value2" }
      } as any;
      
      const result = component.getScientificMetadata(dataset);
      expect(result).toEqual({ key1: "value1", key2: "value2" });
    });

    it("should return entire scientificMetadata when empty source is provided", () => {
      const dataset = {
        scientificMetadata: { key1: "value1", key2: "value2" }
      } as any;
      
      const result = component.getScientificMetadata(dataset, "");
      expect(result).toEqual({ key1: "value1", key2: "value2" });
    });

    it("should return entire scientificMetadata when source is 'scientificMetadata'", () => {
      const dataset = {
        scientificMetadata: { key1: "value1", key2: "value2" }
      } as any;
      
      const result = component.getScientificMetadata(dataset, "scientificMetadata");
      expect(result).toEqual({ key1: "value1", key2: "value2" });
    });

    it("should return nested metadata when valid path is provided", () => {
      const dataset = {
        scientificMetadata: {
          sampleProperties: {
            temperature: "25°C",
            pressure: "1 atm"
          },
          otherData: "test"
        }
      } as any;
      
      const result = component.getScientificMetadata(dataset, "scientificMetadata.sampleProperties");
      expect(result).toEqual({
        temperature: "25°C",
        pressure: "1 atm"
      });
    });

    it("should return nested metadata when path without 'scientificMetadata' prefix is provided", () => {
      const dataset = {
        scientificMetadata: {
          sampleProperties: {
            temperature: "25°C",
            pressure: "1 atm"
          }
        }
      } as any;
      
      const result = component.getScientificMetadata(dataset, "sampleProperties");
      expect(result).toEqual({
        temperature: "25°C",
        pressure: "1 atm"
      });
    });

    it("should return deeply nested metadata", () => {
      const dataset = {
        scientificMetadata: {
          experiment: {
            conditions: {
              environmental: {
                humidity: "60%"
              }
            }
          }
        }
      } as any;
      
      const result = component.getScientificMetadata(dataset, "experiment.conditions.environmental");
      expect(result).toEqual({ humidity: "60%" });
    });

    it("should return null when path does not exist", () => {
      const dataset = {
        scientificMetadata: {
          sampleProperties: {
            temperature: "25°C"
          }
        }
      } as any;
      
      const result = component.getScientificMetadata(dataset, "nonExistentPath");
      expect(result).toBeNull();
    });

    it("should return null when partial path exists but final key does not", () => {
      const dataset = {
        scientificMetadata: {
          sampleProperties: {
            temperature: "25°C"
          }
        }
      } as any;
      
      const result = component.getScientificMetadata(dataset, "sampleProperties.nonExistentKey");
      expect(result).toBeNull();
    });

    it("should return null when path leads to non-object value", () => {
      const dataset = {
        scientificMetadata: {
          sampleProperties: {
            temperature: "25°C"
          }
        }
      } as any;
      
      const result = component.getScientificMetadata(dataset, "sampleProperties.temperature");
      expect(result).toBeNull();
    });

    it("should return null when path leads to null value", () => {
      const dataset = {
        scientificMetadata: {
          sampleProperties: null
        }
      } as any;
      
      const result = component.getScientificMetadata(dataset, "sampleProperties");
      expect(result).toBeNull();
    });

    it("should return null when path leads to undefined value", () => {
      const dataset = {
        scientificMetadata: {
          sampleProperties: undefined
        }
      } as any;
      
      const result = component.getScientificMetadata(dataset, "sampleProperties");
      expect(result).toBeNull();
    });

    it("should handle array values correctly", () => {
      const dataset = {
        scientificMetadata: {
          measurements: [
            { value: 1, unit: "cm" },
            { value: 2, unit: "cm" }
          ]
        }
      } as any;
      
      const result = component.getScientificMetadata(dataset, "measurements");
      expect(result).toEqual([
        { value: 1, unit: "cm" },
        { value: 2, unit: "cm" }
      ]);
    });

    it("should handle empty object values", () => {
      const dataset = {
        scientificMetadata: {
          emptySection: {}
        }
      } as any;
      
      const result = component.getScientificMetadata(dataset, "emptySection");
      expect(result).toEqual({});
    });
  });
});
