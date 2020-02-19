import { Pipe, PipeTransform } from "@angular/core";
import { UnitsService } from "shared/services/units.service";

@Pipe({
  name: "prettyUnit"
})
export class PrettyUnitPipe implements PipeTransform {
  transform(unit: string): string {
    const symbol = this.unitsService.getSymbol(unit);
    return symbol ? symbol : unit;
  }

  constructor(private unitsService: UnitsService) {}
}
