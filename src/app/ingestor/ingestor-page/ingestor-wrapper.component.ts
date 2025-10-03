import { Component, OnInit } from "@angular/core";
import { AppConfigService } from "app-config.service";
import { IngestorMode } from "./helper/ingestor.component-helper";
import { IngestorTransferComponent } from "./ingestor-transfer.component";
import { IngestorCreationComponent } from "./ingestor-creation.component";

@Component({
  selector: "ingestor",
  styleUrls: ["./ingestor.component.scss"],
  template: `
    <div>
      <ng-container *ngComponentOutlet="getIngestorComponent()" />
    </div>
  `,
  standalone: false,
})
export class IngestorWrapperComponent {
  appConfig = this.appConfigService.getConfig();
  ingestorMode: IngestorMode = "creation";

  constructor(public appConfigService: AppConfigService) {}
  getIngestorComponent() {
    return this.appConfigService.getConfig().ingestorComponent?.ingestorEnabled
      ? IngestorTransferComponent
      : IngestorCreationComponent;
  }
}
