import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  fetchUserAction,
  loginOIDCAction,
} from "state-management/actions/user.actions";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-auth-callback",
  templateUrl: "./auth-callback.component.html",
  styleUrls: ["./auth-callback.component.scss"],
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // External authentication will redirect to this component with a access-token and user-id query parameter
      const accessToken = params["access-token"];
      const userId = params["user-id"];

      if (accessToken && userId) {
        // If the user is authenticated, we will store the access token and user id in the store
        this.store.dispatch(
          loginOIDCAction({ oidcLoginResponse: { accessToken, userId } }),
        );

        // We will also fetch the user from the backend
        this.store.dispatch(
          fetchUserAction({
            adLoginResponse: { access_token: accessToken, userId: userId },
          }),
        );

        // After the user is authenticated, we will redirect to the home page
        const returnUrl = params["returnUrl"];
        this.router.navigateByUrl(returnUrl || "/");
      }
    });
  }
}
