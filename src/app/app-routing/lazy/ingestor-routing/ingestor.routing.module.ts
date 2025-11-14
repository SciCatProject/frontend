import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IngestorWrapperComponent } from "ingestor/ingestor-page/ingestor-wrapper.component";

const routes: Routes = [
  {
    path: "",
    component: IngestorWrapperComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IngestorRoutingModule {}
