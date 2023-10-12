import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AppConfigService } from "app-config.service";

@Injectable({
  providedIn: "root",
})
export class PoliciesGuard implements CanActivate {
  appConfig = this.appConfigService.getConfig();

  constructor(
    private appConfigService: AppConfigService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.appConfig.policiesEnabled) {
      return true;
    } else {
      this.router.navigate(["/datasets"]);
      return false;
    }
  }
}
