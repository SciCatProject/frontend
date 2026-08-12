import { Component, Input } from "@angular/core";
import { AppConfigService } from "app-config.service";
import {
  LifecycleClass,
  OutputDatasetObsoleteDto,
} from "@scicatproject/scicat-sdk-ts-angular";

type DatasetLifecycleWithDeletionFlags = LifecycleClass & {
  deleted?: boolean;
  markedForDeletion?: boolean;
};

export interface DatasetStatusBannerContent {
  message: string;
  code: "INFO" | "WARN";
}

const DEFAULT_DELETED_MESSAGE = "This dataset has been deleted.";
const DEFAULT_MARKED_FOR_DELETION_MESSAGE =
  "This dataset is marked for deletion.";

/**
 * Displays a configurable warning banner when a dataset's lifecycle is
 * flagged as deleted or markedForDeletion. Fully opt-in via
 * appConfig.datasetStatusBanner so deployments without these lifecycle
 * flags see no change in behavior.
 */
@Component({
  selector: "dataset-status-banner",
  templateUrl: "./dataset-status-banner.component.html",
  styleUrls: ["./dataset-status-banner.component.scss"],
  standalone: false,
})
export class DatasetStatusBannerComponent {
  // Named datasetItem (not "dataset") to avoid colliding with the native
  // HTMLElement.dataset getter-only property when this element is ever
  // rendered under NO_ERRORS_SCHEMA (e.g. host component tests that stub
  // out children).
  @Input() datasetItem: OutputDatasetObsoleteDto | undefined;

  constructor(private appConfigService: AppConfigService) {}

  get banner(): DatasetStatusBannerContent | undefined {
    const config = this.appConfigService.getConfig().datasetStatusBanner;
    if (!config?.enabled) {
      return undefined;
    }

    const lifecycle = this.datasetItem
      ?.datasetlifecycle as DatasetLifecycleWithDeletionFlags;

    if (lifecycle?.deleted) {
      return {
        message: config.deleted?.message || DEFAULT_DELETED_MESSAGE,
        code: config.deleted?.code || "WARN",
      };
    }

    if (lifecycle?.markedForDeletion) {
      return {
        message:
          config.markedForDeletion?.message ||
          DEFAULT_MARKED_FOR_DELETION_MESSAGE,
        code: config.markedForDeletion?.code || "WARN",
      };
    }

    return undefined;
  }
}
