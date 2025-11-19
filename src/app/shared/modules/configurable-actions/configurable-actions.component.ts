import { Component, Input } from "@angular/core";
import { ActionConfig, ActionItems } from "./configurable-action.interfaces";

import { AppConfigService } from "app-config.service";

@Component({
  selector: "configurable-actions",
  templateUrl: "./configurable-actions.component.html",
  styleUrls: ["./configurable-actions.component.scss"],
  standalone: false,
})
export class ConfigurableActionsComponent {
  private _sortedActionsConfig: ActionConfig[];

  @Input({ required: true }) actionsConfig: ActionConfig[];
  @Input({ required: true }) actionItems: ActionItems;

  constructor(public appConfigService: AppConfigService) {}

  visible(): boolean {
    return this.appConfigService.getConfig().datafilesActionsEnabled;
  }

  maxFileSize(): number {
    return this.appConfigService.getConfig().maxDirectDownloadSize || 0;
  }

  sortedActionsConfig(): ActionConfig[] {
    if (!this.actionsConfig) return [];
    this._sortedActionsConfig = this.actionsConfig;
    this._sortedActionsConfig.sort((a: ActionConfig, b: ActionConfig) =>
      a.order && b.order ? a.order - b.order : 0,
    );
    return this._sortedActionsConfig;
  }
}
