import { PrettyUnitPipe } from "./pretty-unit.pipe";
import { inject } from "@angular/core/testing";
import { UnitsService } from "shared/services/units.service";

describe("PrettyUnitPipe", () => {
  it("create an instance", inject(
    [UnitsService],
    (unitsService: UnitsService) => {
      const pipe = new PrettyUnitPipe(unitsService);
      expect(pipe).toBeTruthy();
    }
  ));
});
