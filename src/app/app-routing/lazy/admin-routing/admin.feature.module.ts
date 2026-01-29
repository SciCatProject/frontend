import { NgModule } from "@angular/core";
import { AdminModule } from "admin/admin.module";
import { AdminRoutingModule } from "./admin.routing.module";

@NgModule({
  imports: [AdminModule, AdminRoutingModule],
})
export class AdminFeatureModule {}
