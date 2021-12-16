import { Location } from "@angular/common";
import { Injectable, Inject } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { APP_CONFIG, AppConfig } from "app-config.module";

@Injectable({
  providedIn: "root",
})
export class ServiceGuard implements CanActivate {
  constructor(
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree{
    let shouldActivate = false;
    switch(route.data.service) {
      case "logbook":
        shouldActivate = this.appConfig.logbookEnabled;
        break;
      case "reduce":
        shouldActivate = this.appConfig.datasetReduceEnabled
        break;
    }
    if (!shouldActivate) {
      this.router.navigate(["/404"], {skipLocationChange: true, queryParams: {
        url: state.url
      }});
      return false;
    }
    return true;
  }
}
