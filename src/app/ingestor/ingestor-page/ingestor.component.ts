import { Component, OnInit } from "@angular/core";
import { AppConfigService } from "app-config.service";
import { IngestorMode } from "./helper/ingestor.component-helper";

@Component({
  selector: "ingestor",
  styleUrls: ["./ingestor.component.scss"],
  template: `
    <div>
      <ingestor-transfer *ngIf="ingestorMode === 'transfer'" />
      <ingestor-creation *ngIf="ingestorMode === 'creation'" />
    </div>
  `,
  standalone: false,
})
export class IngestorComponent implements OnInit {
  appConfig = this.appConfigService.getConfig();
  ingestorMode: IngestorMode = "default";

  constructor(public appConfigService: AppConfigService) {}

  ngOnInit() {
    // Render the ingestor component based on the mode
    const mode = this.appConfig.ingestorMode;

    if (mode === undefined || mode === null || mode === "default") {
      this.ingestorMode = "transfer";
    } else if (mode === "creation") {
      this.ingestorMode = "creation";
    } else if (mode === "transfer") {
      this.ingestorMode = "transfer";
    } else {
      console.error(
        `Unknown ingestor mode: ${mode} - Falling back to transfer mode.`,
      );
      this.ingestorMode = "transfer"; // Fallback to transfer mode
    }
  }
}
