import { Component, Input, OnInit } from "@angular/core";
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
})
export class DatafilesActionsComponent implements OnInit {
  @Input({ required: true }) actionsConfig: ActionConfig[];
  @Input({ required: true }) dataset: ActionDataset;
  @Input({ required: true }) files: DataFiles_File[];

  appConfig = this.appConfigService.getConfig();
  maxFileSize: number | null = this.appConfig.maxDirectDownloadSize || 0;

  sortedActionsConfig: ActionConfig[];

  constructor(public appConfigService: AppConfigService) {}

  ngOnInit() {
    this.sortedActionsConfig = this.actionsConfig;
    this.sortedActionsConfig.sort((a: ActionConfig, b: ActionConfig) =>
      a.order && b.order ? a.order - b.order : 0,
    );
  }

  visible() {
    return this.appConfig.datafilesActionsEnabled && this.files.length > 0;
  }
}
