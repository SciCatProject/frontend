import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AppConfigService } from "app-config.service";

@Injectable({
  providedIn: "root",
})
export class JobsGuard implements CanActivate {
  appConfig = this.appConfigService.getConfig();

  constructor(
    private appConfigService: AppConfigService,
    private router: Router,
  ) {}

  canActivate(): boolean {
    if (this.appConfig.jobsEnabled) {
      return true;
    } else {
      this.router.navigate(["/datasets"]);
      return false;
    }
  }
}
