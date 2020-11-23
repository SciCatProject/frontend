import { TestBed } from "@angular/core/testing";

import { UnitsService } from "./units.service";

describe("UnitsService", () => {
  let service: UnitsService;

  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    service = TestBed.inject(UnitsService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  describe("#getSymbol()", () => {
    it("should return the unit symbol if present in dictionary", () => {
      const unit = "angstrom";
      const symbol = service.getSymbol(unit);

      expect(symbol).toEqual("Å");
    });

    it("should return the unit if unable to find symbol", () => {
      const unit = "foo";
      const symbol = service.getSymbol(unit);

      expect(symbol).toEqual(unit);
    });
  });

  describe("#getUnits()", () => {
    it("should get a list of associated units if `kind` exists", () => {
      const kind = "length";
      const units = service.getUnits(kind);

      expect(Array.isArray(units)).toEqual(true);
      expect(units.includes("angstrom")).toEqual(true);
    });

    it("should get a list of all units if `kind` does not exist", () => {
      const kind = "foobar";
      const units = service.getUnits(kind);

      expect(Array.isArray(units)).toEqual(true);
      expect(units.includes("angstrom")).toEqual(true);
      expect(units.includes("coulomb")).toEqual(true);
      expect(units.includes("hertz")).toEqual(true);
    });
  });

  describe("#getKind()", () => {
    it("should return a unit kind from the input arg", () => {
      const variable = "sample_temperature5_max";
      const kind = service["getKind"](variable);

      expect(kind).toEqual("temperature");
    });

    it("should return undefined if it cannot find a suitable unit kind", () => {
      const variable = "foo_bar";
      const kind = service["getKind"](variable);

      expect(kind).toEqual(undefined);
    });
  });

  describe("#parse()", () => {
    it("should return an array with containing possible unit kinds", () => {
      const args = ["sample_temperature5_max", "Wavelength[A]", "elapsed_time"];
      args.forEach(arg => {
        const suggestedKinds = service["parse"](arg);

        expect(Array.isArray(suggestedKinds)).toEqual(true);
        switch (arg) {
          case "sample_temperature5_max": {
            expect(suggestedKinds.includes("temperature")).toEqual(true);
            break;
          }
          case "Wavelength[A]": {
            expect(suggestedKinds.includes("length")).toEqual(true);
            break;
          }
          case "elapsed_time": {
            expect(suggestedKinds.includes("time")).toEqual(true);
            break;
          }
          default: {
            break;
          }
        }
      });
    });
  });
});
