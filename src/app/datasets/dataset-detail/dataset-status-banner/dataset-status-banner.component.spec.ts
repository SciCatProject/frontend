import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";

import { DatasetStatusBannerComponent } from "./dataset-status-banner.component";
import {
  AppConfigInterface,
  AppConfigService,
  DatasetStatusBannerRule,
} from "app-config.service";
import { OutputDatasetObsoleteDto } from "@scicatproject/scicat-sdk-ts-angular";

const DELETED_RULE: DatasetStatusBannerRule = {
  field: "datasetlifecycle.archiveStatusMessage",
  value: "deleted",
  message: "This dataset has been deleted.",
  code: "WARN",
};

const MARKED_FOR_DELETION_RULE: DatasetStatusBannerRule = {
  field: "datasetlifecycle.archiveStatusMessage",
  value: "markedForDeletion",
  message: "This dataset is marked for deletion.",
  code: "WARN",
};

describe("DatasetStatusBannerComponent", () => {
  let component: DatasetStatusBannerComponent;
  let fixture: ComponentFixture<DatasetStatusBannerComponent>;
  let appConfigServiceSpy: jasmine.SpyObj<AppConfigService>;

  function configureTestBed(config: Partial<AppConfigInterface>) {
    appConfigServiceSpy = jasmine.createSpyObj("AppConfigService", [
      "getConfig",
    ]);
    appConfigServiceSpy.getConfig.and.returnValue(config as AppConfigInterface);

    TestBed.configureTestingModule({
      declarations: [DatasetStatusBannerComponent],
      imports: [CommonModule, MatIconModule],
      providers: [{ provide: AppConfigService, useValue: appConfigServiceSpy }],
    });
  }

  function initComponent(dataset?: Partial<OutputDatasetObsoleteDto>): void {
    fixture = TestBed.createComponent(DatasetStatusBannerComponent);
    component = fixture.componentInstance;
    component.datasetItem = dataset as OutputDatasetObsoleteDto;
    component.ngOnChanges();
    fixture.detectChanges();
  }

  it("should create", () => {
    configureTestBed({
      datasetStatusBanner: { enabled: true, rules: [DELETED_RULE] },
    });
    initComponent();
    expect(component).toBeTruthy();
  });

  it("should not show a banner when the feature is disabled", () => {
    configureTestBed({
      datasetStatusBanner: { enabled: false, rules: [DELETED_RULE] },
    });
    initComponent({
      datasetlifecycle: { archiveStatusMessage: "deleted" },
    });
    expect(component.banner).toBeUndefined();
  });

  it("should not show a banner when no rule matches", () => {
    configureTestBed({
      datasetStatusBanner: {
        enabled: true,
        rules: [DELETED_RULE, MARKED_FOR_DELETION_RULE],
      },
    });
    initComponent({
      datasetlifecycle: { archiveStatusMessage: "available" },
    });
    expect(component.banner).toBeUndefined();
  });

  it("should show the message and code of the matching rule", () => {
    configureTestBed({
      datasetStatusBanner: {
        enabled: true,
        rules: [DELETED_RULE, MARKED_FOR_DELETION_RULE],
      },
    });
    initComponent({
      datasetlifecycle: { archiveStatusMessage: "deleted" },
    });
    expect(component.banner).toEqual({
      message: "This dataset has been deleted.",
      code: "WARN",
    });
  });

  it("should match a different rule for a different field value", () => {
    configureTestBed({
      datasetStatusBanner: {
        enabled: true,
        rules: [DELETED_RULE, MARKED_FOR_DELETION_RULE],
      },
    });
    initComponent({
      datasetlifecycle: { archiveStatusMessage: "markedForDeletion" },
    });
    expect(component.banner).toEqual({
      message: "This dataset is marked for deletion.",
      code: "WARN",
    });
  });

  it("should use the first matching rule when multiple rules could match", () => {
    const higherPriorityDeletedRule: DatasetStatusBannerRule = {
      ...DELETED_RULE,
      message: "Higher priority deleted message.",
    };
    configureTestBed({
      datasetStatusBanner: {
        enabled: true,
        rules: [higherPriorityDeletedRule, DELETED_RULE],
      },
    });
    initComponent({
      datasetlifecycle: { archiveStatusMessage: "deleted" },
    });
    expect(component.banner?.message).toBe("Higher priority deleted message.");
  });

  it("should default the code to WARN when a rule does not specify one", () => {
    configureTestBed({
      datasetStatusBanner: {
        enabled: true,
        rules: [{ ...DELETED_RULE, code: undefined }],
      },
    });
    initComponent({
      datasetlifecycle: { archiveStatusMessage: "deleted" },
    });
    expect(component.banner?.code).toBe("WARN");
  });

  it("should support arbitrary dot-path fields, not just datasetlifecycle ones", () => {
    configureTestBed({
      datasetStatusBanner: {
        enabled: true,
        rules: [
          {
            field: "scientificMetadata.status",
            value: "embargoed",
            message: "This dataset is embargoed.",
            code: "INFO",
          },
        ],
      },
    });
    initComponent({
      scientificMetadata: { status: "embargoed" } as never,
    });
    expect(component.banner).toEqual({
      message: "This dataset is embargoed.",
      code: "INFO",
    });
  });
});
