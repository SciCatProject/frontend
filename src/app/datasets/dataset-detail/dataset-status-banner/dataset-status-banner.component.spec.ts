import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";

import { DatasetStatusBannerComponent } from "./dataset-status-banner.component";
import { AppConfigInterface, AppConfigService } from "app-config.service";
import { OutputDatasetObsoleteDto } from "@scicatproject/scicat-sdk-ts-angular";

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
    fixture.detectChanges();
  }

  it("should create", () => {
    configureTestBed({ datasetStatusBanner: { enabled: true } });
    initComponent();
    expect(component).toBeTruthy();
  });

  it("should not show a banner when the feature is disabled", () => {
    configureTestBed({ datasetStatusBanner: { enabled: false } });
    initComponent({ datasetlifecycle: { deleted: true } as never });
    expect(component.banner).toBeUndefined();
  });

  it("should not show a banner when the dataset is not deleted or marked for deletion", () => {
    configureTestBed({ datasetStatusBanner: { enabled: true } });
    initComponent({ datasetlifecycle: {} });
    expect(component.banner).toBeUndefined();
  });

  it("should show the default deleted message when deleted is true", () => {
    configureTestBed({ datasetStatusBanner: { enabled: true } });
    initComponent({ datasetlifecycle: { deleted: true } as never });
    expect(component.banner).toEqual({
      message: "This dataset has been deleted.",
      code: "WARN",
    });
  });

  it("should show the default markedForDeletion message when markedForDeletion is true", () => {
    configureTestBed({ datasetStatusBanner: { enabled: true } });
    initComponent({
      datasetlifecycle: { markedForDeletion: true } as never,
    });
    expect(component.banner).toEqual({
      message: "This dataset is marked for deletion.",
      code: "WARN",
    });
  });

  it("should prefer deleted over markedForDeletion when both are true", () => {
    configureTestBed({ datasetStatusBanner: { enabled: true } });
    initComponent({
      datasetlifecycle: { deleted: true, markedForDeletion: true } as never,
    });
    expect(component.banner?.message).toBe("This dataset has been deleted.");
  });

  it("should use configured message and code overrides", () => {
    configureTestBed({
      datasetStatusBanner: {
        enabled: true,
        deleted: { message: "Custom deleted message", code: "INFO" },
      },
    });
    initComponent({ datasetlifecycle: { deleted: true } as never });
    expect(component.banner).toEqual({
      message: "Custom deleted message",
      code: "INFO",
    });
  });
});
