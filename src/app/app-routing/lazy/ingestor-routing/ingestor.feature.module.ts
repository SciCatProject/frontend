import { NgModule } from "@angular/core";
import { IngestorRoutingModule } from "./ingestor.routing.module";
import { IngestorModule } from "ingestor/ingestor.module";

@NgModule({
  imports: [IngestorModule, IngestorRoutingModule],
})
export class IngestorFeatureModule {}
