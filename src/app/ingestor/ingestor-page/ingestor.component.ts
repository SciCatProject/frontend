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
  ingestorMode: IngestorMode = "creation";

  constructor(public appConfigService: AppConfigService) {}

  ngOnInit() {
    // Render the ingestor component based on the mode
    const mode = this.appConfig.ingestorMode;

    if (mode === "transfer") {
      this.ingestorMode = "transfer";
    } else {
      this.ingestorMode = "creation";
    }
  }
}
