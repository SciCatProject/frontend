import { DatePipe } from "@angular/common";
import { SimpleChange } from "@angular/core";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormatNumberPipe } from "shared/pipes/format-number.pipe";
import { PrettyUnitPipe } from "shared/pipes/pretty-unit.pipe";
import { ScientificMetadataTreeModule } from "../scientific-metadata-tree.module";
import { TreeViewComponent } from "./tree-view.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppConfigService } from "app-config.service";
import { provideHttpClient } from "@angular/common/http";
import { ScientificMetadataColumnsService } from "shared/services/scientific-metadata-columns.service";

const metadataFloatFormatConfig = {
  metadataFloatFormatEnabled: true,
  metadataFloatFormat: {
    significantDigits: 3,
    minCutoff: 0.001,
    maxCutoff: 1000,
  },
};

const addAsColumnEnabledConfig = {
  ...metadataFloatFormatConfig,
  addScientificMetadataKeysAsColumn: true,
};

describe("TreeViewComponent", () => {
  let component: TreeViewComponent;
  let fixture: ComponentFixture<TreeViewComponent>;
  let scientificMetadataColumnsService: jasmine.SpyObj<ScientificMetadataColumnsService>;
  let appConfigService: jasmine.SpyObj<AppConfigService>;

  beforeEach(waitForAsync(() => {
    TestBed.resetTestingModule();
    scientificMetadataColumnsService =
      jasmine.createSpyObj<ScientificMetadataColumnsService>(
        "ScientificMetadataColumnsService",
        ["addMetadataColumn"],
      );
    appConfigService = jasmine.createSpyObj<AppConfigService>(
      "AppConfigService",
      ["getConfig"],
    );
    appConfigService.getConfig.and.returnValue(
      metadataFloatFormatConfig as any,
    );
    TestBed.configureTestingModule({
      declarations: [TreeViewComponent],
      imports: [ScientificMetadataTreeModule, BrowserAnimationsModule],
      providers: [
        DatePipe,
        PrettyUnitPipe,
        FormatNumberPipe,
        {
          provide: AppConfigService,
          useValue: appConfigService,
        },
        {
          provide: ScientificMetadataColumnsService,
          useValue: scientificMetadataColumnsService,
        },
        provideHttpClient(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeViewComponent);
    component = fixture.componentInstance;
    component.metadata = {
      motors: {
        sampx: -0.03949844939218141,
        sampy: 0.003037629787175808,
        phi: 85.62724999999955,
        zoom: 35007.46875,
        focus: -0.2723789062500003,
        phiz: 0.18436550301217358,
        phiy: 0.21792454481296603,
      },
    };
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should hide add-as-column actions by default", () => {
    const leafNode = component.treeControl.dataNodes.find(
      (node) => node.key === "sampx",
    );

    expect(component.canShowAddAsColumn(leafNode)).toBeFalse();
  });

  it("should expose add-as-column actions for scientific metadata leaves when enabled", () => {
    appConfigService.getConfig.and.returnValue(addAsColumnEnabledConfig as any);

    const enabledFixture = TestBed.createComponent(TreeViewComponent);
    const enabledComponent = enabledFixture.componentInstance;
    enabledComponent.allowAddAsColumn = true;
    enabledComponent.metadata = {
      beam_size: {
        value: 2.4,
        unit: "mm",
        human_name: "Beam Size",
      },
    };
    enabledFixture.detectChanges();

    const leafNode = enabledComponent.treeControl.dataNodes.find(
      (node) => node.key === "beam_size",
    );

    expect(enabledComponent.canShowAddAsColumn(leafNode)).toBeTrue();
    expect(leafNode.columnName).toBe("scientificMetadata.beam_size.value");
    expect(enabledComponent.rowContextMenuItems).toEqual([
      scientificMetadataColumnsService.addAsColumnAction,
    ]);
  });

  it("should delegate nested scientific metadata leaves to the saved-column service", async () => {
    appConfigService.getConfig.and.returnValue(addAsColumnEnabledConfig as any);

    const enabledFixture = TestBed.createComponent(TreeViewComponent);
    const enabledComponent = enabledFixture.componentInstance;
    enabledComponent.allowAddAsColumn = true;
    enabledComponent.metadata = {
      sample: {
        beam_size: {
          value: 2.4,
          unit: "mm",
          human_name: "Beam Size",
        },
      },
    };
    enabledFixture.detectChanges();

    const leafNode = enabledComponent.treeControl.dataNodes.find(
      (node) => node.key === "beam_size",
    );

    await enabledComponent.addAsColumn(leafNode);

    expect(
      scientificMetadataColumnsService.addMetadataColumn,
    ).toHaveBeenCalledWith({
      name: "sample.beam_size",
      human_name: "Beam Size",
      columnName: "scientificMetadata.sample.beam_size.value",
    });
  });

  it("should derive the column entry name from the configured metadata path", async () => {
    appConfigService.getConfig.and.returnValue(addAsColumnEnabledConfig as any);

    const enabledFixture = TestBed.createComponent(TreeViewComponent);
    const enabledComponent = enabledFixture.componentInstance;
    enabledComponent.allowAddAsColumn = true;
    enabledComponent.metadataPath = "scientificMetadata.sample";
    enabledComponent.metadata = {
      beam_size: {
        value: 2.4,
        unit: "mm",
      },
    };
    enabledFixture.detectChanges();

    const leafNode = enabledComponent.treeControl.dataNodes.find(
      (node) => node.key === "beam_size",
    );

    await enabledComponent.addAsColumn(leafNode);

    expect(
      scientificMetadataColumnsService.addMetadataColumn,
    ).toHaveBeenCalledWith({
      name: "beam_size",
      human_name: undefined,
      columnName: "scientificMetadata.sample.beam_size.value",
    });
  });

  it("should rebuild the tree once when metadata and metadataPath change together", () => {
    spyOn(component, "buildDataTree").and.callThrough();

    const metadata = {
      beam_size: {
        value: 2.4,
        unit: "mm",
      },
    };

    component.ngOnChanges({
      metadata: new SimpleChange(component.metadata, metadata, false),
      metadataPath: new SimpleChange(
        component.metadataPath,
        "scientificMetadata.sample",
        false,
      ),
    });

    expect(component.buildDataTree).toHaveBeenCalledTimes(1);
    expect(component.buildDataTree).toHaveBeenCalledWith(
      metadata,
      0,
      "scientificMetadata.sample",
    );
    expect(component.dataSource.data[0].columnName).toBe(
      "scientificMetadata.sample.beam_size.value",
    );
  });
});
