import { Injectable } from "@angular/core";
import { AppConfigService } from "app-config.service";

@Injectable({
  providedIn: "root",
})
export class MetadataValueService {
  private enabled: boolean;
  private significantDigits: number;
  private minCutoff: number;
  private maxCutoff: number;

  constructor(private configService: AppConfigService) {
    const config = this.configService.getConfig();
    this.enabled = config.metadataFloatFormatEnabled ?? false;
    if (this.enabled) {
      const metadataFloatFormat = config.metadataFloatFormat;
      this.significantDigits = metadataFloatFormat.significantDigits;
      this.minCutoff = metadataFloatFormat.minCutoff;
      this.maxCutoff = metadataFloatFormat.maxCutoff;
    }
  }

  valueFormat(value: string | number): string {
    if (!this.enabled) {
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
