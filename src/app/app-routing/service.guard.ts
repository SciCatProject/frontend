import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { AppConfigService } from "app-config.service";

@Injectable({
  providedIn: "root",
})
export class ServiceGuard implements CanActivate {
  appConfig = this.appConfigService.getConfig();

  constructor(
    private appConfigService: AppConfigService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean | UrlTree {
    let shouldActivate = false;
    switch (route.data.service) {
      case "logbook":
        shouldActivate = this.appConfig.logbookEnabled;
        break;
      case "reduce":
        shouldActivate = this.appConfig.datasetReduceEnabled;
        break;
    }
    if (!shouldActivate) {
      this.router.navigate(["/404"], {
        skipLocationChange: true,
        queryParams: {
          url: state.url,
        },
      });
      return false;
    }
    return true;
  }
}
