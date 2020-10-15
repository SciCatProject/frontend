import { Injectable, Inject } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { APP_CONFIG, AppConfig } from "app-config.module";

@Injectable({
  providedIn: "root",
})
export class PoliciesGuard implements CanActivate {
  constructor(
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private router: Router
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
