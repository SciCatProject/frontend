import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { AppThemeService } from "app-theme.service";
import { of } from "rxjs";
import { MockHttp } from "shared/MockStubs";
import { Theme } from "theme";

const theme: Theme = {
  name: "testTheme",
  properties: {
    "--theme-primary-default": "#000000",
  },
};

describe("AppThemeService", () => {
  let service: AppThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppThemeService, { provide: HttpClient, useClass: MockHttp }],
    });

    service = TestBed.inject(AppThemeService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("#loadTheme()", () => {
    it("should load the theme from the provided source", async () => {
      spyOn(service["http"], "get").and.returnValue(of(theme));
      await service.loadTheme();

      expect(service["activeTheme"].name).toEqual("testTheme");
    });
  });

  describe("#setActiveTheme()", () => {
    it("should set the active theme", () => {
      service["activeTheme"] = theme;
      service.setActiveTheme();

      const color = document.documentElement.style.getPropertyValue(
        "--theme-primary-default",
      );

      expect(color).toEqual("#000000");
    });
  });
});
