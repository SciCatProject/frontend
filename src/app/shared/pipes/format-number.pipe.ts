import { Pipe, PipeTransform } from "@angular/core";
import { AppConfigService } from "app-config.service";
@Pipe({
  name: "formatNumber",
  standalone: false,
  pure: true,
})
export class FormatNumberPipe implements PipeTransform {
  private enabled: boolean;
  private significantDigits: number;
  private minCutoff: number;
  private maxCutoff: number;

  constructor(private configService: AppConfigService) {
    const config = this.configService.getConfig();
    this.enabled = config.metadataFloatFormatEnabled ?? false;

    if (this.enabled) {
      const format = config.metadataFloatFormat;
      this.significantDigits = format.significantDigits;
      this.minCutoff = format.minCutoff;
      this.maxCutoff = format.maxCutoff;
    }
  }

  transform(value: unknown): string | number {
    // use old way if not enabled
    if (!this.enabled) {
      if (typeof value === "number" && (value >= 1e5 || value <= 1e-5)) {
        return value.toExponential();
      }
      return String(value);
    }

    if (typeof value !== "number" || !Number.isFinite(value)) {
      // value is not a finite number
      return String(value);
    }

    // Do not format integers
    if (Number.isInteger(value)) {
      return String(value);
    }

    // use scientific notation if float value is large or small
    const absoluteValue = Math.abs(value);
    if (absoluteValue < this.minCutoff || absoluteValue > this.maxCutoff) {
      // use scientific notation with (significantDigits - 1) decimals
      return value.toExponential(this.significantDigits - 1);
    }

    return value.toPrecision(this.significantDigits);
  }
}
