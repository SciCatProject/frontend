import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { User } from "shared/sdk";
import { getIsLoggedIn } from "state-management/selectors/user.selectors";

@Injectable({
  providedIn: "root",
})
export class DatasetsGuard implements CanActivate {
  constructor(private router: Router, private store: Store<User>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store.pipe(
      select(getIsLoggedIn),
      map((isLoggedIn) => {
        if (isLoggedIn) {
          return true;
        }

        this.router.navigateByUrl("/anonymous" + state.url);
        return false;
      })
    );
  }
}
