import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Store } from "@ngrx/store";
import { combineLatest, Observable } from "rxjs";
import { filter, map, switchMap, take, tap } from "rxjs/operators";
import {
  selectIsAdmin,
  selectIsLoggedIn,
  selectIsLoggingIn,
} from "state-management/selectors/user.selectors";

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
    return combineLatest([
      this.store.select(selectIsLoggingIn),
      this.store.select(selectIsLoggedIn),
      this.store.select(selectIsAdmin),
    ]).pipe(
      filter(([isLoggingIn]) => {
        return !isLoggingIn;
      }),
      take(1),
      map(([, isLoggedIn, isAdmin]) => {
        if (!isLoggedIn) {
          return this.router.createUrlTree(["/login"], {
            queryParams: { url: state.url },
          });
        }
        return isAdmin
          ? true
          : this.router.createUrlTree(["/401"], {
              queryParams: { url: state.url },
            });
      }),
    );
  }
}
