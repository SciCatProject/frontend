import { DatePipe } from "@angular/common";
import { waitForAsync, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormatNumberPipe } from "shared/pipes/format-number.pipe";
import { PrettyUnitPipe } from "shared/pipes/pretty-unit.pipe";
import { ScientificMetadataTreeModule } from "../scientific-metadata-tree.module";
import { TreeViewComponent } from "./tree-view.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppConfigService } from "app-config.service";
import { MetadataValueService } from "shared/services/metadata-value.service";
import { provideHttpClient } from "@angular/common/http";

describe("TreeViewComponent", () => {
  let component: TreeViewComponent;
  let fixture: ComponentFixture<TreeViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [TreeViewComponent],
      imports: [ScientificMetadataTreeModule, BrowserAnimationsModule],
      providers: [
        DatePipe,
        PrettyUnitPipe,
        FormatNumberPipe,
        MetadataValueService,
        AppConfigService,
        provideHttpClient(),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    const appConfigService = TestBed.inject(AppConfigService);
    (appConfigService as any).appConfig = {
      metadataFloatFormatEnabled: true,
      metadataFloatFormat: {
        significantDigits: 3,
        minCutoff: 0.001,
        maxCutoff: 1000,
      },
    };
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

  it("should format flatNode.value when float formatting is enabled", () => {
    const nodes = component.treeControl.dataNodes;
    const focusNode = nodes.find((node) => node.key === "focus");
    expect(focusNode.value).toBe("-0.272");
  });
});
