import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  ActionButtonStyle,
  ActionConfig,
  ActionItems,
} from "./configurable-action.interfaces";

import { AppConfigService } from "app-config.service";

@Component({
  selector: "configurable-actions",
  templateUrl: "./configurable-actions.component.html",
  styleUrls: ["./configurable-actions.component.scss"],
  standalone: false,
})
export class ConfigurableActionsComponent {
  @Input({ required: true }) actionsConfig: ActionConfig[] = [];
  @Input({ required: true }) actionItems: ActionItems;
  @Input({ required: false }) buttonsStyle: ActionButtonStyle = {
    raised: true,
    color: "accent",
  };
  @Output() actionFinished = new EventEmitter<{
    success: boolean;
    result?: unknown;
    error?: Error;
  }>();

  constructor(public appConfigService: AppConfigService) {}

  get visible(): boolean {
    return this.appConfigService.getConfig().datafilesActionsEnabled;
  }

  get maxFileSize(): number {
    return this.appConfigService.getConfig().maxDirectDownloadSize || 0;
  }

  get sortedActionsConfig(): ActionConfig[] {
    if (!this.actionsConfig) {
      return [];
    }
    return [...this.actionsConfig].sort((a: ActionConfig, b: ActionConfig) =>
      a.order && b.order ? a.order - b.order : 0,
    );
  }
}
