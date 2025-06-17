import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AppConfigService } from "app-config.service";

@Injectable({ providedIn: "root" })
export class MainPageGuard implements CanActivate {
  constructor(
    private router: Router,
    private appConfigService: AppConfigService 
  ) {}

  canActivate(): boolean {
    const defaultMainPage = this.appConfigService.getConfig().defaultMainPage;

    this.router.navigate([defaultMainPage]);
    return false;
  }
}