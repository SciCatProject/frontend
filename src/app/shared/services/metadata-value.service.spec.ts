import { TestBed } from "@angular/core/testing";
import { MetadataValueService } from "./metadata-value.service";
import { AppConfigInterface, AppConfigService } from "app-config.service";

describe("MetadataValueService", () => {
  let service: MetadataValueService;
  let mockConfigService: jasmine.SpyObj<AppConfigService>;

  beforeEach(() => {
    mockConfigService = jasmine.createSpyObj("AppConfigService", ["getConfig"]);

    TestBed.configureTestingModule({
      providers: [
        MetadataValueService,
        { provide: AppConfigService, useValue: mockConfigService },
      ],
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

  it("should not format float if not enabled", () => {
    setConfig({ enabled: false });
    service = TestBed.inject(MetadataValueService);
    expect(service.valueFormat(1.23456789)).toBe("1.23456789");
  });

  it("should return string as-is for non-number values", () => {
    setConfig();
    service = TestBed.inject(MetadataValueService);
    expect(service.valueFormat("abc")).toBe("abc");
    expect(service.valueFormat("")).toBe("");
  });

  it("should return string representation for non-finite numbers", () => {
    setConfig();
    service = TestBed.inject(MetadataValueService);
    expect(service.valueFormat(NaN)).toBe("NaN");
    expect(service.valueFormat(Infinity)).toBe("Infinity");
    expect(service.valueFormat(-Infinity)).toBe("-Infinity");
  });

  it("should return string representation for integers", () => {
    setConfig();
    service = TestBed.inject(MetadataValueService);
    expect(service.valueFormat(42)).toBe("42");
    expect(service.valueFormat(-10)).toBe("-10");
  });

  it("should omit decimals when significant digits fit within the integer part", () => {
    setConfig({ significantDigits: 2 });
    service = TestBed.inject(MetadataValueService);
    expect(service.valueFormat(12.3456)).toBe("12");
  });

  it("should use exponential notation for very small numbers", () => {
    setConfig({ significantDigits: 3, minCutoff: 0.001 });
    service = TestBed.inject(MetadataValueService);
    expect(service.valueFormat(0.0000123)).toBe("1.23e-5");
  });

  it("should use exponential notation for very large numbers", () => {
    setConfig({ significantDigits: 4, maxCutoff: 1e6 });
    service = TestBed.inject(MetadataValueService);
    expect(service.valueFormat(50004313.487)).toBe("5.000e+7");
  });

  it("should handle values just above minCutoff correctly", () => {
    setConfig({ minCutoff: 0.001, significantDigits: 4 });
    service = TestBed.inject(MetadataValueService);
    expect(service.valueFormat(0.0023456)).toBe("0.002346");
  });

  it("should handle values just below maxCutoff correctly", () => {
    setConfig({ maxCutoff: 1e6, significantDigits: 3 });
    service = TestBed.inject(MetadataValueService);
    expect(service.valueFormat(999999.99)).toBe("1.00e+6");
  });

  it("should respect significantDigits when using exponential notation", () => {
    setConfig({ significantDigits: 5, minCutoff: 1e-3 });
    service = TestBed.inject(MetadataValueService);
    expect(service.valueFormat(0.0000123)).toBe("1.2300e-5");
  });
});
