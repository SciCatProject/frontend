import { NgModule } from "@angular/core";
import { EmExportRoutingModule } from "./emexport.routing.module";
import { EmExportModule } from "emexport/emexport.module";

@NgModule({
  imports: [EmExportModule, EmExportRoutingModule],
})
export class EmExportFeatureModule {}
