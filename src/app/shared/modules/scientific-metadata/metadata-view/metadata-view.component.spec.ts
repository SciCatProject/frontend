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
import { Store } from "@ngrx/store";

describe("MetadataViewComponent", () => {
  let component: MetadataViewComponent;
  let fixture: ComponentFixture<MetadataViewComponent>;
  let scientificMetadataColumnsService: jasmine.SpyObj<ScientificMetadataColumnsService>;
  let appConfigService: jasmine.SpyObj<AppConfigService>;
  let store: jasmine.SpyObj<Store>;

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
    store = jasmine.createSpyObj<Store>("Store", ["dispatch", "select"]);
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
        {
          provide: Store,
          useValue: store,
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

  it("should expose a stable scientific metadata table identifier", () => {
    expect(fixture.nativeElement.querySelector("#scientific-metadata-table")).toBeTruthy();
    expect(
      fixture.nativeElement
        .querySelector("#scientific-metadata-table")
        .classList.contains("scientific-metadata-table"),
    ).toBeTrue();
  });

  it("should expose copy row actions by default", () => {
    expect(component.rowContextMenuItems.map((action) => action.name)).toEqual([
      "copyName",
      "copyMachineName",
      "copyValue",
      "copyFullValue",
      "copyEntry",
    ]);
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
      jasmine.objectContaining({ name: "copyName", text: "Copy name" }),
      jasmine.objectContaining({
        name: "copyMachineName",
        text: "Copy machine name",
      }),
      jasmine.objectContaining({ name: "copyValue", text: "Copy value" }),
      jasmine.objectContaining({
        name: "copyFullValue",
        text: "Copy full value",
      }),
      jasmine.objectContaining({ name: "copyEntry", text: "Copy entry" }),
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
      expect(metadataArray[0]["rawValue"]).toEqual({ v: "test", u: "" });
      expect(metadataArray[0]["originalEntry"]).toEqual({ v: "test", u: "" });
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

  describe("#copy actions", () => {
    it("should copy the requested metadata representation", async () => {
      const writeText = spyOn(navigator.clipboard, "writeText").and.resolveTo();
      const row = {
        name: "beam_size",
        human_name: "Beam Size",
        rawValue: 2.4,
        unit: "mm",
        originalEntry: { value: 2.4, unit: "mm", type: "quantity" },
      } as any;

      await component.onRowEvent({
        event: RowEventType.RowActionMenu,
        sender: { row, action: { name: "copyName" } },
      } as any);
      await component.onRowEvent({
        event: RowEventType.RowActionMenu,
        sender: { row, action: { name: "copyMachineName" } },
      } as any);
      await component.onRowEvent({
        event: RowEventType.RowActionMenu,
        sender: { row, action: { name: "copyValue" } },
      } as any);
      await component.onRowEvent({
        event: RowEventType.RowActionMenu,
        sender: { row, action: { name: "copyFullValue" } },
      } as any);
      await component.onRowEvent({
        event: RowEventType.RowActionMenu,
        sender: { row, action: { name: "copyEntry" } },
      } as any);

      expect(writeText.calls.allArgs()).toEqual([
        ["Beam Size"],
        ["beam_size"],
        ["2.4"],
        [JSON.stringify({ value: 2.4, unit: "mm" })],
        [JSON.stringify(row.originalEntry)],
      ]);
    });

    it("should serialize object values as JSON and omit absent units", async () => {
      const writeText = spyOn(navigator.clipboard, "writeText").and.resolveTo();
      const row = {
        name: "sample",
        rawValue: { nested: true },
        unit: "",
        originalEntry: { nested: true },
      } as any;

      await component.onRowEvent({
        event: RowEventType.RowActionMenu,
        sender: { row, action: { name: "copyValue" } },
      } as any);
      await component.onRowEvent({
        event: RowEventType.RowActionMenu,
        sender: { row, action: { name: "copyFullValue" } },
      } as any);

      expect(writeText.calls.allArgs()).toEqual([
        [JSON.stringify(row.rawValue)],
        [JSON.stringify(row.rawValue)],
      ]);
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

      expect(disabledComponent.rowContextMenuItems.length).toBe(5);

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
