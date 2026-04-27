import { CommonModule } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppConfigInterface, AppConfigService } from "app-config.service";
import { DatafilesWrapperComponent } from "./datafiles-wrapper.component";
import { DynamicDatafilesComponent } from "./dynamic-datafiles/dynamic-datafiles.component";
import { DatafilesComponent } from "./static-datafiles/datafiles.component";

describe("DatafilesWrapperComponent", () => {
  let component: DatafilesWrapperComponent;
  let fixture: ComponentFixture<DatafilesWrapperComponent>;
  let appConfigService: jasmine.SpyObj<AppConfigService>;

  beforeEach(() => {
    const appConfigServiceSpy = jasmine.createSpyObj("AppConfigService", [
      "getConfig",
    ]);

    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [DatafilesWrapperComponent],
      providers: [{ provide: AppConfigService, useValue: appConfigServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(DatafilesWrapperComponent);
    component = fixture.componentInstance;
    appConfigService = TestBed.inject(
      AppConfigService,
    ) as jasmine.SpyObj<AppConfigService>;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should load DynamicDatafilesComponent when dynamicDatafilesViewEnabled is true", () => {
    appConfigService.getConfig.and.returnValue({
      dynamicDatafilesViewEnabled: true,
    } as AppConfigInterface);

    expect(component.getDatafilesComponent()).toBe(DynamicDatafilesComponent);
  });

  it("should load DatafilesComponent when dynamicDatafilesViewEnabled is false", () => {
    appConfigService.getConfig.and.returnValue({
      dynamicDatafilesViewEnabled: false,
    } as AppConfigInterface);

    expect(component.getDatafilesComponent()).toBe(DatafilesComponent);
  });
});
