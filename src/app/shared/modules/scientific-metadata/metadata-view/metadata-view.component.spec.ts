import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { MetadataViewComponent } from "./metadata-view.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { PipesModule } from "shared/pipes/pipes.module";
import { MatTableModule } from "@angular/material/table";

describe("MetadataViewComponent", () => {
  let component: MetadataViewComponent;
  let fixture: ComponentFixture<MetadataViewComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [MetadataViewComponent],
        imports: [MatTableModule, PipesModule],
      }).compileComponents();
    })
  );

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
          value: "test",
          unit: "",
        },
      };
      const metadataArray = component.createMetadataArray(testMetadata);

      expect(metadataArray[0]["name"]).toEqual("typedTestName");
      expect(metadataArray[0]["value"]).toEqual("test");
      expect(metadataArray[0]["unit"]).toEqual("");
    });

    it("should parse an untyped metadata object to an array", () => {
      const testMetadata = {
        untypedTestName: {
          v: "test",
          u: "",
        },
      };
      const metadataArray = component.createMetadataArray(testMetadata);

      expect(metadataArray[0]["name"]).toEqual("untypedTestName");
      expect(metadataArray[0]["value"]).toEqual(
        JSON.stringify({ v: "test", u: "" })
      );
      expect(metadataArray[0]["unit"]).toEqual("");
    });
  });

  describe("#isDate()", () => {
    it("should return false if scientificMetadata item is a quantity", () => {
      const metadata = {
        name: "wavelength",
        value: 1024,
        unit: "nanometers",
      };

      const isDate = component.isDate(metadata);

      expect(isDate).toEqual(false);
    });

    it("should return false if scientificMetadata value is a number", () => {
      const metadata = {
        name: "test",
        value: 1024,
        unit: "",
      };

      const isDate = component.isDate(metadata);

      expect(isDate).toEqual(false);
    });

    it("should return false if scientificMetadata value is a string", () => {
      const metadata = {
        name: "test",
        value: "test value",
        unit: "",
      };

      const isDate = component.isDate(metadata);

      expect(isDate).toEqual(false);
    });
    it("should return true if scientificMetadata item is a date string", () => {
      const metadata = {
        name: "today",
        value: new Date().toISOString(),
        unit: "",
      };

      const isDate = component.isDate(metadata);

      expect(isDate).toEqual(true);
    });
  });
});
