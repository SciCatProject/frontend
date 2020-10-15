import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MetadataViewComponent } from "./metadata-view.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { PipesModule } from "shared/pipes/pipes.module";
import { MatTableModule } from "@angular/material/table";

describe("MetadataViewComponent", () => {
  let component: MetadataViewComponent;
  let fixture: ComponentFixture<MetadataViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [MetadataViewComponent],
      imports: [MatTableModule, PipesModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetadataViewComponent);
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

      expect(metadataArray[0]["name"]).toEqual("typedTestName");
      expect(metadataArray[0]["type"]).toEqual("string");
      expect(metadataArray[0]["value"]).toEqual("test");
      expect(metadataArray[0]["unit"]).toEqual("");
    });

    it("should parse an untyped metadata object to an array", () => {
      const testMetadata = {
        untypedTestName: {
          v: "test",
          u: ""
        }
      };
      const metadataArray = component.createMetadataArray(testMetadata);

      expect(metadataArray[0]["name"]).toEqual("untypedTestName");
      expect(metadataArray[0]["type"]).toEqual("");
      expect(metadataArray[0]["value"]).toEqual('{"v":"test","u":""}');
      expect(metadataArray[0]["unit"]).toEqual("");
    });
  });
});
