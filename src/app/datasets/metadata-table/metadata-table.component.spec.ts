import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MetadataTableComponent } from "./metadata-table.component";
import { MatTableModule } from "@angular/material";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Store } from "@ngrx/store";
import { MockStore } from "shared/MockStubs";
import { SharedCatanieModule } from "shared/shared.module";

describe("MetadataTableComponent", () => {
  let component: MetadataTableComponent;
  let fixture: ComponentFixture<MetadataTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MetadataTableComponent],
      imports: [MatTableModule, SharedCatanieModule]
    });
    TestBed.overrideComponent(MetadataTableComponent, {
      set: {
        providers: [{ provide: Store, useClass: MockStore }]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#createMetadataArray()", () => {
    it("should parse a typed metadata object to an array", () => {
      const testMetadata = {
        typedTestName: {
          type: "string",
          value: "test",
          unit: ""
        }
      };
      const metadataArray = component.createMetadataArray(testMetadata);

      expect(metadataArray[0].name).toEqual("typedTestName");
      expect(metadataArray[0].type).toEqual("string");
      expect(metadataArray[0].value).toEqual("test");
      expect(metadataArray[0].unit).toEqual("");
    });

    it("should parse an untyped metadata object to an array", () => {
      const testMetadata = {
        untypedTestName: {
          v: "test",
          u: ""
        }
      };
      const metadataArray = component.createMetadataArray(testMetadata);

      expect(metadataArray[0].name).toEqual("untypedTestName");
      expect(metadataArray[0].type).toEqual("");
      expect(metadataArray[0].value).toEqual("{\"v\":\"test\",\"u\":\"\"}");
      expect(metadataArray[0].unit).toEqual("");
    });
  });
});
