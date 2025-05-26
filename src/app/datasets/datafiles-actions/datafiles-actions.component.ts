import { Component, Input } from "@angular/core";
import { ActionConfig, ActionDataset } from "./datafiles-action.interfaces";
import { DataFiles_File } from "datasets/datafiles/datafiles.interfaces";
import { AppConfigService } from "app-config.service";
//import { DatafilesActionComponent } from "./datafiles-action.component";

@Component({
  selector: "datafiles-actions",
  //standalone: true,
  //imports: [DatafilesActionComponent],
  templateUrl: "./datafiles-actions.component.html",
  styleUrls: ["./datafiles-actions.component.scss"],
  standalone: false,
})
export class DatafilesActionsComponent {
  private _sortedActionsConfig: ActionConfig[];

  @Input({ required: true }) actionsConfig: ActionConfig[];
  @Input({ required: true }) actionDataset: ActionDataset;
  @Input({ required: true }) files: DataFiles_File[];

  constructor(public appConfigService: AppConfigService) {}

  // ngOnInit() {
  //   this.sortedActionsConfig = this.actionsConfig;
  //   this.sortedActionsConfig.sort((a: ActionConfig, b: ActionConfig) =>
  //     a.order && b.order ? a.order - b.order : 0,
  //   );
  // }

  get visible(): boolean {
    return (
      this.appConfigService.getConfig().datafilesActionsEnabled &&
      this.files.length > 0
    );
  }

  get maxFileSize(): number {
    return this.appConfigService.getConfig().maxDirectDownloadSize || 0;
  }

  get sortedActionsConfig(): ActionConfig[] {
    this._sortedActionsConfig = this.actionsConfig;
    this._sortedActionsConfig.sort((a: ActionConfig, b: ActionConfig) =>
      a.order && b.order ? a.order - b.order : 0,
    );
    return this._sortedActionsConfig;
  }
}
