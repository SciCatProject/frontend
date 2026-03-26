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

  transform(
    value:
      | string
      | number
      | null
      | undefined
      | bigint
      | { value: number | string | bigint; unit?: string }
      | (
          | string
          | number
          | bigint
          | { value: number | string | bigint; unit?: string }
        )[],
  ): string {
    if (Array.isArray(value))
      return String(
        value
          .filter(
            (v) =>
              typeof v === "number" ||
              typeof v === "bigint" ||
              typeof v === "string" ||
              (typeof v === "object" && v !== null && "value" in v && !v.unit),
          )
          .map((v) => (typeof v === "object" ? v.value : v)),
      );
    const innerValue =
      typeof value === "object" && value !== null && "value" in value
        ? value.value
        : value;
    if (
      typeof innerValue !== "string" &&
      typeof innerValue !== "number" &&
      typeof innerValue !== "bigint"
    )
      return "";

    // use old way if not enabled
    if (!this.enabled) {
      if (
        typeof innerValue === "number" &&
        (innerValue >= 1e5 || innerValue <= 1e-5)
      ) {
        return innerValue.toExponential();
      }
      return String(innerValue);
    }

    if (typeof innerValue !== "number" || !Number.isFinite(innerValue)) {
      // value is not a finite number
      return String(innerValue);
    }

    // Do not format integers
    if (Number.isInteger(innerValue)) {
      return String(innerValue);
    }

    // use scientific notation if float value is large or small
    const absoluteValue = Math.abs(innerValue);
    if (absoluteValue < this.minCutoff || absoluteValue > this.maxCutoff) {
      // use scientific notation with (significantDigits - 1) decimals
      return innerValue.toExponential(this.significantDigits - 1);
    }

    return innerValue.toPrecision(this.significantDigits);
  }
}
