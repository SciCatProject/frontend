import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { filter, map, take } from "rxjs/operators";
import { selectAdminGuardViewModel } from "state-management/selectors/user.selectors";

/**
 * Ensure that the current user is admin
 * and has access to the requested page
 * @export
 * @class AdminGuard
 * @implements {CanActivate}
 */
@Injectable({
  providedIn: "root",
})
export class AdminGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router,
  ) {}

  /**
   * Needs to return either a boolean or an observable that maps to a boolean
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> {
    return this.store.select(selectAdminGuardViewModel).pipe(
      filter((vm) => !vm.isLoggingIn),
      take(1),
      map((vm) => {
        if (!vm.isLoggedIn) {
          return this.router.createUrlTree(["/login"], {
            queryParams: { url: state.url },
          });
        }
        return vm.isAdmin
          ? true
          : this.router.createUrlTree(["/401"], {
              queryParams: { url: state.url },
            });
      }),
    );
  }
}
