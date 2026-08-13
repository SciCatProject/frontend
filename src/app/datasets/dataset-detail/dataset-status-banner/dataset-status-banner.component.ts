import { Component, Input } from "@angular/core";
import { AppConfigService } from "app-config.service";
import { OutputDatasetObsoleteDto } from "@scicatproject/scicat-sdk-ts-angular";

export interface DatasetStatusBannerContent {
  message: string;
  code: "INFO" | "WARN";
}

/**
 * Displays a configurable warning banner driven by appConfig.datasetStatusBanner.
 * Each rule names a dot-path field on the dataset (e.g.
 * "datasetlifecycle.archiveStatusMessage") and a value it must equal; the
 * first matching rule's message/code is shown. Fully opt-in, so deployments
 * without datasetStatusBanner configured see no change in behavior.
 */
@Component({
  selector: "dataset-status-banner",
  templateUrl: "./dataset-status-banner.component.html",
  styleUrls: ["./dataset-status-banner.component.scss"],
  standalone: false,
})
export class DatasetStatusBannerComponent {
  @Input() datasetItem: OutputDatasetObsoleteDto | undefined;

  constructor(private appConfigService: AppConfigService) {}

  get banner(): DatasetStatusBannerContent | undefined {
    const config = this.appConfigService.getConfig().datasetStatusBanner;
    if (!config?.enabled || !this.datasetItem) {
      return undefined;
    }

    const rule = (config.rules || []).find(
      (candidate) => this.getFieldValue(candidate.field) === candidate.value,
    );

    if (!rule) {
      return undefined;
    }

    return { message: rule.message, code: rule.code || "WARN" };
  }

  private getFieldValue(path: string): unknown {
    if (!path) {
      return undefined;
    }

    return path
      .split(".")
      .reduce<unknown>(
        (value, key) =>
          value && typeof value === "object"
            ? (value as Record<string, unknown>)[key]
            : undefined,
        this.datasetItem,
      );
  }
}
