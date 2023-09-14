import { NgModule } from "@angular/core";
import { DatasetsModule } from "datasets/datasets.module";
import { DatasetsRoutingModule } from "./datasets.routing.module";
@NgModule({
  imports: [DatasetsModule, DatasetsRoutingModule],
})
export class DatasetsFeatureModule {}
