import { Component } from "@angular/core";
import { AppConfigService } from "app-config.service";
import { DatasetDetailComponent } from "./dataset-detail/dataset-detail.component";
import { DatasetDetailsComponent } from "./dataset-details/dataset-details.component";

@Component({
  selector: "app-dataset-wrapper",
  template: `
    <ng-container *ngComponentOutlet="getDatasetDetailsComponent()" />
  `,
  standalone: false,
})
export class DatasetDetailWrapperComponent {
  constructor(private appConfigService: AppConfigService) {}

  /**
   * Dataset details are rendered by the configurable component. The default
   * layout is supplied by the frontend configuration, so facilities can
   * customize it without maintaining a second implementation.
   */
  getDatasetDetailsComponent(): any {
    // Keep an explicit false value working for existing deployments and test
    // fixtures. New/default configurations set this to true and use the
    // configurable implementation.
    return this.appConfigService.getConfig().datasetDetailComponent
      ?.enableCustomizedComponent === false
      ? DatasetDetailComponent
      : DatasetDetailsComponent;
  }
}
