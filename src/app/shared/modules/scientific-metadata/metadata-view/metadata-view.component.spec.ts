import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { MetadataViewComponent } from "./metadata-view.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { PipesModule } from "shared/pipes/pipes.module";
import { MatTableModule } from "@angular/material/table";
import { ReplaceUnderscorePipe } from "shared/pipes/replace-underscore.pipe";
import { LinkyPipe } from "ngx-linky";
import { DatePipe, TitleCasePipe } from "@angular/common";
import { PrettyUnitPipe } from "shared/pipes/pretty-unit.pipe";
import { AppConfigService } from "app-config.service";
import { provideHttpClient } from "@angular/common/http";
import { FormatNumberPipe } from "shared/pipes/format-number.pipe";

describe("MetadataViewComponent", () => {
  let component: MetadataViewComponent;
  let fixture: ComponentFixture<MetadataViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatTableModule, PipesModule],
      providers: [
        ReplaceUnderscorePipe,
        TitleCasePipe,
        DatePipe,
        LinkyPipe,
        PrettyUnitPipe,
        FormatNumberPipe,
        AppConfigService,
        provideHttpClient(),
      ],
      declarations: [MetadataViewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    const appConfigService = TestBed.inject(AppConfigService);
    spyOn(appConfigService as any, "getConfig").and.returnValue({
      metadataFloatFormatEnabled: true,
      metadataFloatFormat: {
        significantDigits: 3,
        minCutoff: 0.001,
        maxCutoff: 1000,
      },
    });

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

    it("should round float value if float formatting enabled", () => {
      const testMetadata = {
        someMetadata: {
          value: 12.39421321511,
          unit: "m",
        },
      };
      const metadataArray = component.createMetadataArray(testMetadata);

      expect(metadataArray[0]["value"]).toEqual("12.4");
      expect(metadataArray[0]["unit"]).toEqual("m");
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
        JSON.stringify({ v: "test", u: "" }),
      );
      expect(metadataArray[0]["unit"]).toEqual("");
    });
  });
});
