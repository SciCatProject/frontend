import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IngestorComponent } from "ingestor/ingestor/ingestor.component";

const routes: Routes = [
  {
    path: "",
    component: IngestorComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IngestorRoutingModule {}
