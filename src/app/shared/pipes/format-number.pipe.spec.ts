import { TestBed } from "@angular/core/testing";
import { FormatNumberPipe } from "./format-number.pipe";
import { AppConfigInterface, AppConfigService } from "app-config.service";

describe("FormatNumberPipe", () => {
  let mockConfigService: jasmine.SpyObj<AppConfigService>;

  beforeEach(() => {
    mockConfigService = jasmine.createSpyObj("AppConfigService", ["getConfig"]);

    TestBed.configureTestingModule({
      providers: [{ provide: AppConfigService, useValue: mockConfigService }],
    });
  });

  function setConfig(
    options?: Partial<{
      enabled: boolean;
      significantDigits: number;
      minCutoff: number;
      maxCutoff: number;
    }>,
  ) {
    const mockConfig: Partial<AppConfigInterface> = {
      metadataFloatFormatEnabled: options?.enabled ?? true,
      metadataFloatFormat: {
        significantDigits: options?.significantDigits ?? 3,
        minCutoff: options?.minCutoff ?? 0.001,
        maxCutoff: options?.maxCutoff ?? 1000,
      },
    };

    mockConfigService.getConfig.and.returnValue(
      mockConfig as AppConfigInterface,
    );
  }

  describe("Legacy formatting", () => {
    it("create an instance", () => {
      setConfig({ enabled: false });
      const pipe = new FormatNumberPipe(mockConfigService);
      expect(pipe).toBeTruthy();
    });

    it("returns exponential number when number >= 1e5 ", () => {
      setConfig({ enabled: false });
      const pipe = new FormatNumberPipe(mockConfigService);
      const nbr = 100000;
      const formatted = pipe.transform(nbr);
      expect(formatted.toString()).toEqual("1e+5");
    });

    it("returns exponential number when number <= 1e-5", () => {
      setConfig({ enabled: false });
      const pipe = new FormatNumberPipe(mockConfigService);
      const nbr = 0.00001;
      const formatted = pipe.transform(nbr);
      expect(formatted.toString()).toEqual("1e-5");
    });

    it("returns number when 1e-5 <= number <= 1e5", () => {
      setConfig({ enabled: false });
      const pipe = new FormatNumberPipe(mockConfigService);
      const nbr = 0.0001;
      const formatted = pipe.transform(nbr);
      expect(formatted).toEqual(String(nbr));
    });

    it("returns 'null' when number is null", () => {
      setConfig({ enabled: false });
      const pipe = new FormatNumberPipe(mockConfigService);
      const nbr = null;
      const formatted = pipe.transform(nbr);
      expect(formatted).toEqual("null");
    });

    it("returns 'undefined' when number is undefined", () => {
      setConfig({ enabled: false });
      const pipe = new FormatNumberPipe(mockConfigService);
      const nbr = undefined;
      const formatted = pipe.transform(nbr);
      expect(formatted).toEqual("undefined");
    });

    it("returns string when number is a string", () => {
      setConfig({ enabled: false });
      const pipe = new FormatNumberPipe(mockConfigService);
      const nbr = "test";
      const formatted = pipe.transform(nbr);
      expect(formatted).toEqual("test");
    });
  });

  describe("metadataFloatFormatEnabled is true", () => {
    it("should return string as-is for non-number values", () => {
      setConfig();
      const pipe = new FormatNumberPipe(mockConfigService);
      expect(pipe.transform("abc")).toBe("abc");
      expect(pipe.transform("")).toBe("");
    });

    it("should return string representation for non-finite numbers", () => {
      setConfig();
      const pipe = new FormatNumberPipe(mockConfigService);
      expect(pipe.transform(NaN)).toBe("NaN");
      expect(pipe.transform(Infinity)).toBe("Infinity");
      expect(pipe.transform(-Infinity)).toBe("-Infinity");
    });

    it("should return string representation for integers", () => {
      setConfig();
      const pipe = new FormatNumberPipe(mockConfigService);
      expect(pipe.transform(42)).toBe("42");
      expect(pipe.transform(-10)).toBe("-10");
    });

    it("should omit decimals when significant digits fit within the integer part", () => {
      setConfig({ significantDigits: 2 });
      const pipe = new FormatNumberPipe(mockConfigService);
      expect(pipe.transform(12.3456)).toBe("12");
    });

    it("should use exponential notation for very small numbers", () => {
      setConfig({ significantDigits: 3, minCutoff: 0.001 });
      const pipe = new FormatNumberPipe(mockConfigService);
      expect(pipe.transform(0.0000123)).toBe("1.23e-5");
    });

    it("should use exponential notation for very large numbers", () => {
      setConfig({ significantDigits: 4, maxCutoff: 1e6 });
      const pipe = new FormatNumberPipe(mockConfigService);
      expect(pipe.transform(50004313.487)).toBe("5.000e+7");
    });

    it("should handle values just above minCutoff correctly", () => {
      setConfig({ minCutoff: 0.001, significantDigits: 4 });
      const pipe = new FormatNumberPipe(mockConfigService);
      expect(pipe.transform(0.0023456)).toBe("0.002346");
    });

    it("should handle values just below maxCutoff correctly", () => {
      setConfig({ maxCutoff: 1e6, significantDigits: 3 });
      const pipe = new FormatNumberPipe(mockConfigService);
      expect(pipe.transform(999999.99)).toBe("1.00e+6");
    });

    it("should respect significantDigits when using exponential notation", () => {
      setConfig({ significantDigits: 5, minCutoff: 1e-3 });
      const pipe = new FormatNumberPipe(mockConfigService);
      expect(pipe.transform(0.0000123)).toBe("1.2300e-5");
    });
  });
});
