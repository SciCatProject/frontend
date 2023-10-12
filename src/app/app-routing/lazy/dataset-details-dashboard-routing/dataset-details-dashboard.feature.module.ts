import { NgModule } from "@angular/core";
import { DatasetsModule } from "datasets/datasets.module";
import { DatasetDetailsDashboardRoutingModule } from "./dataset-details-dashboard.routing.module";

@NgModule({
  imports: [DatasetsModule, DatasetDetailsDashboardRoutingModule],
})
export class DatasetDetailsDashboardFeatureModule {}
