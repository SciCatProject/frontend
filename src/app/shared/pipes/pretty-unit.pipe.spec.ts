import { PrettyUnitPipe } from "./pretty-unit.pipe";
import { inject } from "@angular/core/testing";
import { UnitsService } from "shared/services/units.service";

describe("PrettyUnitPipe", () => {
  it("create an instance", inject(
    [UnitsService],
    (unitsService: UnitsService) => {
      const pipe = new PrettyUnitPipe(unitsService);
      expect(pipe).toBeTruthy();
    },
  ));

  it("returns the symbol of the provided unit if present in dictionary", inject(
    [UnitsService],
    (unitsService: UnitsService) => {
      const pipe = new PrettyUnitPipe(unitsService);

      const unit = "hertz";
      const symbol = pipe.transform(unit);

      expect(symbol).toEqual("Hz");
    },
  ));

  it("returns the provided unit if not present in dictionary", inject(
    [UnitsService],
    (unitsService: UnitsService) => {
      const pipe = new PrettyUnitPipe(unitsService);

      const unit = "foo";
      const symbol = pipe.transform(unit);

      expect(symbol).toEqual(unit);
    },
  ));
});
