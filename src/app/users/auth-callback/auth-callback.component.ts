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

  private parseJwt(token: string) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );

    return JSON.parse(jsonPayload);
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      // External authentication will redirect to this component with a access-token and user-id query parameter
      const accessToken = params["access-token"];
      const userId = params["user-id"];
      const parsedToken = this.parseJwt(params["access-token"]);
      const ttl = parsedToken.exp - parsedToken.iat;
      const created = new Date(parsedToken.iat * 1000);

      if (accessToken && userId) {
        // If the user is authenticated, we will store the access token and user id in the store
        this.store.dispatch(
          loginOIDCAction({
            oidcLoginResponse: { accessToken, userId, ttl, created },
          }),
        );

        // We will also fetch the user from the backend
        this.store.dispatch(
          fetchUserAction({
            adLoginResponse: {
              access_token: accessToken,
              userId: userId,
              ttl: ttl,
              created: created,
            },
          }),
        );

        // After the user is authenticated, we will redirect to the home page
        const returnUrl = params["returnUrl"];
        this.router.navigateByUrl(returnUrl || "/");
      }
    });
  }
}
