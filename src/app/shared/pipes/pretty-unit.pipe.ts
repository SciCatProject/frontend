import { Pipe, PipeTransform } from "@angular/core";
import { UnitsService } from "shared/services/units.service";

@Pipe({
  name: "prettyUnit"
})
export class PrettyUnitPipe implements PipeTransform {
  transform(value: string): string {
    const symbol = this.unitsService.getSymbol(value);
    return symbol ? symbol : value;
  }

  constructor(private unitsService: UnitsService) {}
}
