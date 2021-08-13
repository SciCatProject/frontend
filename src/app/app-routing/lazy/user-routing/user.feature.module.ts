import { NgModule } from "@angular/core";
import { UsersModule } from "users/users.module";
import { UsersRoutingModule } from "./user.routing.module";

@NgModule({
  imports: [
    UsersModule,
    UsersRoutingModule
  ]
})
export class UsersFeatureModule {}
