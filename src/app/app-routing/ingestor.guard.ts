import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { AppConfigService } from "app-config.service";

@Injectable({
  providedIn: "root",
})
export class IngestorGuard implements CanActivate {
  appConfig = this.appConfigService.getConfig();

  constructor(
    private appConfigService: AppConfigService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    if (this.appConfig.ingestorComponent?.ingestorEnabled) {
      return true;
    } else {
      this.router.navigate(["/404"], {
        skipLocationChange: true,
        queryParams: {
          url: state.url,
        },
      });
      return false;
    }
  }
}
