import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { selectIsAdmin } from "state-management/selectors/user.selectors";

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
  ): Observable<boolean> {
    return this.store.select(selectIsAdmin).pipe<boolean>(
      map((isAdmin: boolean) => {
        if (!isAdmin) {
          this.router.navigate(["/401"], {
            skipLocationChange: true,
            queryParams: {
              url: state.url,
            },
          });
        }
        return isAdmin;
      }),
    );
  }
}
