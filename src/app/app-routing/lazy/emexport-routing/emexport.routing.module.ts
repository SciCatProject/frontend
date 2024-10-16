import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { OneDepComponent } from 'emexport/onedep/onedep.component';
import { EmpiarComponent } from 'emexport/empiar/empiar.component';
import { EmExportComponent } from "emexport/emexport/emexport.component";

const routes: Routes = [
  {
    path: "",
    component: EmExportComponent,
  },
  { 
    path: "onedep", 
    component: OneDepComponent, 
  }, 
  {
    path: "empiar",
    component: EmpiarComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmExportRoutingModule {}
