import { TestBed } from "@angular/core/testing";
import { APP_DI_CONFIG, AppConfigModule, AppConfig } from "app-config.module";
import { environment } from "../environments/environment";

// see https://testing-angular.com/testing-modules/
describe("AppConfigModule", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppConfigModule],
    });
  });

  it("initializes", () => {
    const module = TestBed.inject(AppConfigModule);
    expect(module).toBeTruthy();
  });

  describe("initial environment", () => {
    it("initialized", () => {
      expect(environment.production).toEqual(false);
    });
  });

  describe("empty app_config", () => {
    it("has defaults", () => {
      const emptyAppConfig = new AppConfig();
      expect(emptyAppConfig.production).toEqual(false);
    });
  });

  describe("AppConfig init", () => {
    it("constructs", () => {
      const appConfig: AppConfig = {
        production: false,
      };
      expect(appConfig.production).toEqual(false);
    });
  });

  describe("APP_DI_CONFIG", () => {
    it("initialized", () => {
      expect(APP_DI_CONFIG.production).toEqual(false);
    });
  });
});
