import { Pipe, PipeTransform } from "@angular/core";
import { UnitsService } from "shared/services/units.service";

@Pipe({
  name: "prettyUnit",
  standalone: false,
})
export class PrettyUnitPipe implements PipeTransform {
  constructor(private unitsService: UnitsService) {}

  transform(unit: string): string {
    const symbol = this.unitsService.getSymbol(unit);
    return symbol ? symbol : unit;
  }
}
