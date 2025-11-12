import { Pipe, PipeTransform } from "@angular/core";
@Pipe({
  name: "formatNumber",
})
export class FormatNumberPipe implements PipeTransform {
  transform(value: any) {
    if (typeof value === "number" && (value >= 1e5 || value <= 1e-5)) {
      return value.toExponential();
    }
    return value;
  }
}
