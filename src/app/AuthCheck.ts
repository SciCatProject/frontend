import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { UserApi } from "shared/sdk/services";

import { Store } from "@ngrx/store";

/**
 * Ensure that the current user is logged in
 * and has access to the requested page
 * @export
 * @class AuthCheck
 * @implements {CanActivate}
 */
@Injectable()
export class AuthCheck implements CanActivate {
  constructor(
    private us: UserApi,
    private router: Router,
    private store: Store<any>
  ) {}

  /**
   * Needs to return either a boolean or an observable that maps to a boolean
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.us
      .getCurrent()
      .toPromise()
      .catch(error => {
        this.router.navigate(["/login"], {
          queryParams: { returnUrl: state.url }
        });
        return false;
      })
      .then(res => {
        return true;

        /*if (res !== false && 'name' in res && res['name'].toLowerCase().indexOf('error') === 0) {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
      } else {
        return true;
      }*/
      });
  }
}
