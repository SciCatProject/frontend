import { NgModule } from "@angular/core";
import { UsersModule } from "users/users.module";
import { AuthCallbackRoutingModule } from "./auth-callback.routing.module";

@NgModule({
  imports: [UsersModule, AuthCallbackRoutingModule],
})
export class AuthCallbackFeatureModule {}
