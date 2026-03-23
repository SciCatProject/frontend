import { ComponentFixture, TestBed } from "@angular/core/testing";

import { StatusBannerComponent } from "./status-banner.component";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { AppConfigInterface, AppConfigService } from "app-config.service";

describe("StatusBannerComponent", () => {
  let component: StatusBannerComponent;
  let fixture: ComponentFixture<StatusBannerComponent>;
  let appConfigServiceSpy: jasmine.SpyObj<AppConfigService>;

  beforeEach(async () => {
    appConfigServiceSpy = jasmine.createSpyObj("AppConfigService", [
      "getConfig",
    ]);
    appConfigServiceSpy.getConfig.and.returnValue({
      statusBannerMessage: "test",
      statusBannerCode: "INFO",
    } as AppConfigInterface);
    await TestBed.configureTestingModule({
      declarations: [StatusBannerComponent],
      imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule],
      providers: [
        {
          provide: AppConfigService,
          useValue: appConfigServiceSpy,
        },
      ],
    }).compileComponents();
  });

  function initComponent() {
    fixture = TestBed.createComponent(StatusBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it("should create", () => {
    initComponent();
    expect(component).toBeTruthy();
  });

  it("should set the status banner message and code from the app config", () => {
    initComponent();
    expect(component.message).toBe("test");
    expect(component.code).toBe("INFO");
  });

  it("should set default code to INFO when neither INFO or WARN is provided", () => {
    appConfigServiceSpy.getConfig.and.returnValue({
      statusBannerMessage: "test123",
      statusBannerCode: "ERROR",
    } as unknown as AppConfigInterface);
    initComponent();
    expect(component.code).toBe("INFO");
    expect(component.message).toBe("test123");
  });
});
