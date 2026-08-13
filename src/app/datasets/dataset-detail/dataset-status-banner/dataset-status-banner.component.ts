import { Component, Input, OnChanges } from "@angular/core";
import { get } from "lodash-es";
import {
  AppConfigService,
  DatasetStatusBannerConfig,
} from "app-config.service";
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
export class DatasetStatusBannerComponent implements OnChanges {
  private readonly config: DatasetStatusBannerConfig | undefined;
  @Input() datasetItem: OutputDatasetObsoleteDto | undefined;

  banner: DatasetStatusBannerContent | undefined;

  constructor(private appConfigService: AppConfigService) {
    this.config = this.appConfigService.getConfig().datasetStatusBanner;
  }

  private resolveBanner(): DatasetStatusBannerContent | undefined {
    if (!this.config?.enabled || !this.datasetItem) return undefined;

    const rule = (this.config.rules || []).find(
      (candidate) => get(this.datasetItem, candidate.field) === candidate.value,
    );

    if (!rule) {
      return undefined;
    }

    return { message: rule.message, code: rule.code || "WARN" };
  }

  ngOnChanges(): void {
    this.banner = this.resolveBanner();
  }
}
