import { Pipe, PipeTransform } from "@angular/core";
import { AppConfigService } from "app-config.service";

type FormattableScalar = string | number | bigint | boolean;
type ValueWithUnit = { value: FormattableScalar; unit?: string };

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

  private isValueWithUnit(value: unknown): value is ValueWithUnit {
    return (
      typeof value === "object" &&
      value !== null &&
      "value" in value &&
      this.isFormattableScalar(value.value)
    );
  }

  private isFormattableScalar(value: unknown): value is FormattableScalar {
    return (
      typeof value === "number" ||
      typeof value === "bigint" ||
      typeof value === "string" ||
      typeof value === "boolean"
    );
  }

  private formatValueUnitObj(
    value: FormattableScalar | ValueWithUnit,
  ): FormattableScalar {
    return this.isValueWithUnit(value)
      ? `${value.value} ${value.unit ?? ""}`
      : value;
  }

  transform(
    value:
      | FormattableScalar
      | null
      | undefined
      | ValueWithUnit
      | (FormattableScalar | ValueWithUnit)[],
  ): string {
    if (Array.isArray(value))
      return String(
        value
          .filter((v) => this.isFormattableScalar(v) || this.isValueWithUnit(v))
          .map((v) => this.formatValueUnitObj(v)),
      );
    const innerValue = this.formatValueUnitObj(value);
    if (!this.isFormattableScalar(innerValue)) return "";

    // use old way if not enabled
    if (!this.enabled) {
      if (
        typeof innerValue === "number" &&
        innerValue !== 0 &&
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
