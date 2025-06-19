import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import {
  AppConfigService,
  MainPageConfiguration,
  MainPageOptions,
} from "app-config.service";
import { AuthService } from "shared/services/auth/auth.service";

@Injectable({ providedIn: "root" })
export class MainPageGuard implements CanActivate {
  constructor(
    private router: Router,
    private appConfigService: AppConfigService,
    private authService: AuthService,
  ) {}

  canActivate(): boolean {
    const defaultMainPage: MainPageConfiguration =
      this.appConfigService.getConfig().defaultMainPage;

    const userLoggedIn = this.authService.isAuthenticated();

    this.router.navigate([
      MainPageOptions[
        userLoggedIn
          ? defaultMainPage.authenticatedUser
          : defaultMainPage.nonAuthenticatedUser
      ],
    ]);
    return false;
  }
}
