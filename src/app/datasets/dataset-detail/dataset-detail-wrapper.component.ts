import { Component, Type } from "@angular/core";
import { AppConfigService } from "app-config.service";
import { DatasetDetailComponent } from "./dataset-detail/dataset-detail.component";
import { DatasetDetailDynamicComponent } from "./dataset-detail-dynamic/dataset-detail-dynamic.component";

@Component({
  selector: "app-dataset-wrapper",
  template: `
    <ng-container *ngComponentOutlet="getDatasetDetailsComponent()" />
  `,
  standalone: false,
})
export class DatasetDetailWrapperComponent {
  constructor(private appConfigService: AppConfigService) {}

  getDatasetDetailsComponent(): Type<
    DatasetDetailDynamicComponent | DatasetDetailComponent
  > {
    return this.appConfigService.getConfig().datasetDetailComponent
      ?.enableCustomizedComponent
      ? DatasetDetailDynamicComponent
      : DatasetDetailComponent;
  }
}
