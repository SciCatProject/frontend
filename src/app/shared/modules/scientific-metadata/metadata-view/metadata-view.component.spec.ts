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
import { FormatNumberPipe } from "shared/pipes/format-number.pipe";
import { RowEventType } from "shared/modules/dynamic-material-table/models/table-row.model";
import { ScientificMetadataColumnsService } from "shared/services/scientific-metadata-columns.service";

describe("MetadataViewComponent", () => {
  let component: MetadataViewComponent;
  let fixture: ComponentFixture<MetadataViewComponent>;
  let scientificMetadataColumnsService: jasmine.SpyObj<ScientificMetadataColumnsService>;
  let appConfigService: jasmine.SpyObj<AppConfigService>;

  beforeEach(waitForAsync(() => {
    scientificMetadataColumnsService =
      jasmine.createSpyObj<ScientificMetadataColumnsService>(
        "ScientificMetadataColumnsService",
        ["addMetadataColumn"],
        {
          addAsColumnAction: {
            name: "addAsColumn",
            text: "Add as column",
            color: "primary",
            icon: "view_column",
          },
        },
      );
    appConfigService = jasmine.createSpyObj<AppConfigService>(
      "AppConfigService",
      ["getConfig"],
    );
    appConfigService.getConfig.and.returnValue({
      metadataFloatFormatEnabled: true,
      metadataFloatFormat: {
        significantDigits: 3,
        minCutoff: 0.001,
        maxCutoff: 1000,
      },
    } as any);

    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatTableModule, PipesModule],
      providers: [
        {
          provide: AppConfigService,
          useValue: appConfigService,
        },
        {
          provide: ScientificMetadataColumnsService,
          useValue: scientificMetadataColumnsService,
        },
        ReplaceUnderscorePipe,
        TitleCasePipe,
        DatePipe,
        LinkyPipe,
        PrettyUnitPipe,
        FormatNumberPipe,
      ],
      declarations: [MetadataViewComponent],
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

  it("should hide the add-as-column row action by default", () => {
    expect(component.rowContextMenuItems).toEqual([]);
  });

  it("should expose the add-as-column row action when enabled in config", () => {
    appConfigService.getConfig.and.returnValue({
      addScientificMetadataKeysAsColumn: true,
      metadataFloatFormatEnabled: true,
      metadataFloatFormat: {
        significantDigits: 3,
        minCutoff: 0.001,
        maxCutoff: 1000,
      },
    } as any);

    const enabledFixture = TestBed.createComponent(MetadataViewComponent);
    const enabledComponent = enabledFixture.componentInstance;
    enabledFixture.detectChanges();

    expect(enabledComponent.rowContextMenuItems).toEqual([
      scientificMetadataColumnsService.addAsColumnAction,
    ]);
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
      expect(metadataArray[0]["columnName"]).toEqual(
        "scientificMetadata.typedTestName.value",
      );
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
      expect(metadataArray[0]["columnName"]).toEqual(
        "scientificMetadata.untypedTestName",
      );
      expect(metadataArray[0]["value"]).toEqual(
        JSON.stringify({ v: "test", u: "" }),
      );
      expect(metadataArray[0]["unit"]).toEqual("");
    });

    it("should handle null metadata entries without throwing", () => {
      const metadataArray = component.createMetadataArray({
        nullValue: null,
      });

      expect(metadataArray[0]["name"]).toEqual("nullValue");
      expect(metadataArray[0]["columnName"]).toEqual(
        "scientificMetadata.nullValue",
      );
      expect(metadataArray[0]["value"]).toEqual("null");
      expect(metadataArray[0]["unit"]).toEqual("");
      expect(metadataArray[0]["human_name"]).toBeUndefined();
    });
  });

  describe("#onRowEvent()", () => {
    it("should delegate the selected scientific metadata entry to the shared service", async () => {
      appConfigService.getConfig.and.returnValue({
        addScientificMetadataKeysAsColumn: true,
        metadataFloatFormatEnabled: true,
        metadataFloatFormat: {
          significantDigits: 3,
          minCutoff: 0.001,
          maxCutoff: 1000,
        },
      } as any);

      const enabledFixture = TestBed.createComponent(MetadataViewComponent);
      const enabledComponent = enabledFixture.componentInstance;
      enabledFixture.detectChanges();

      await enabledComponent.onRowEvent({
        event: RowEventType.RowActionMenu,
        sender: {
          row: {
            name: "beam_size",
            human_name: "Beam Size",
            columnName: "scientificMetadata.beam_size.value",
            value: "2.4",
            unit: "mm",
          },
          action: { name: "addAsColumn" },
        },
      } as any);

      expect(
        scientificMetadataColumnsService.addMetadataColumn,
      ).toHaveBeenCalledWith(
        jasmine.objectContaining({
          name: "beam_size",
          human_name: "Beam Size",
          columnName: "scientificMetadata.beam_size.value",
        }),
      );
    });

    it("should not delegate when add-as-column is disabled in config", async () => {
      appConfigService.getConfig.and.returnValue({
        addScientificMetadataKeysAsColumn: false,
        metadataFloatFormatEnabled: true,
      } as any);

      const disabledFixture = TestBed.createComponent(MetadataViewComponent);
      const disabledComponent = disabledFixture.componentInstance;
      disabledFixture.detectChanges();

      expect(disabledComponent.rowContextMenuItems).toEqual([]);

      await disabledComponent.onRowEvent({
        event: RowEventType.RowActionMenu,
        sender: {
          row: {
            name: "beam_size",
            human_name: "Beam Size",
            columnName: "scientificMetadata.beam_size.value",
            value: "2.4",
            unit: "mm",
          },
          action: { name: "addAsColumn" },
        },
      } as any);

      expect(
        scientificMetadataColumnsService.addMetadataColumn,
      ).not.toHaveBeenCalled();
    });
  });
});
