import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { UserApi } from "shared/sdk/services";

/**
 * Ensure that the current user is logged in
 * and has access to the requested page
 * @export
 * @class AuthGuard
 * @implements {CanActivate}
 */
@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private us: UserApi,
    private router: Router,
  ) {}

  /**
   * Needs to return either a boolean or an observable that maps to a boolean
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean> {
    return this.us
      .getCurrent()
      .toPromise()
      .catch(() => {
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      })
      .then(() => true);
  }
}
