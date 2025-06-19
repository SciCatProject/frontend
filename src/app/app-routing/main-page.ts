import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AppConfigService, MainPageConfiguration, MainPageOptions } from "app-config.service";
import { Store } from "@ngrx/store";
import { selectIsLoggedIn } from "state-management/selectors/user.selectors";

@Injectable({ providedIn: "root" })
export class MainPageGuard implements CanActivate {
  constructor(
    private router: Router,
    private appConfigService: AppConfigService,
    private store: Store,
  ) {}

  canActivate(): boolean {
    const defaultMainPage: MainPageConfiguration = this.appConfigService.getConfig().defaultMainPage;

    this.router.navigate([MainPageOptions[
      this.store.select(selectIsLoggedIn) ? defaultMainPage.authenticatedUser : defaultMainPage.unauthenticatedUser
    ]]);
    return false;
  }
}
