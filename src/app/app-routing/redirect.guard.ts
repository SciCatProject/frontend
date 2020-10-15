import { Injectable, Inject } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { APP_CONFIG, AppConfig } from "app-config.module";

@Injectable({
  providedIn: "root",
})
export class RedirectGuard implements CanActivate {
  constructor(@Inject(APP_CONFIG) public appConfig: AppConfig) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    window.location.href = this.appConfig[route.data["urlConfigItem"]];
    return true;
  }
}
