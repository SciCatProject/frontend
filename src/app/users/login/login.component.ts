import { DOCUMENT } from '@angular/common';
import { Component, OnDestroy, OnInit, Inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { loginAction, loginOIDCAction } from "state-management/actions/user.actions";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import {
  getIsLoggedIn,
  getIsLoggingIn
} from "state-management/selectors/user.selectors";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { MatDialog } from "@angular/material/dialog";
import { PrivacyDialogComponent } from "users/privacy-dialog/privacy-dialog.component";

interface LoginForm {
  username: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Component to handle user login. Allows for AD and
 * functional account login.
 *
 * @export
 * @class LoginComponent
 */
@Component({
  selector: "login-form",
  templateUrl: "./login.component.html",
  styleUrls: ["login.component.scss"]
})
export class LoginComponent implements OnInit, OnDestroy {
  private proceedSubscription: Subscription;
  private hasUser$ = this.store.pipe(
    select(getIsLoggedIn),
    filter(is => is)
  );

  returnUrl: string;
  hide = true;

  public loginForm = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required],
    rememberMe: true
  });

  loading$ = this.store.pipe(select(getIsLoggingIn));

  constructor(
    public dialog: MatDialog,
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<any>,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
  }

  redirectOIDC() {
    this.document.location.href = 'http://localhost:3000/auth/oidc';
  }

  openPrivacyDialog() {
    this.dialog.open(PrivacyDialogComponent, {
      width: "auto"
    });
  }

  /**
   * Default to an Active directory login attempt initially. Fallback to `local`
   * accounts if fails
   * @memberof LoginComponent
   */
  onLogin() {
    const form: LoginForm = this.loginForm.value;
    this.store.dispatch(loginAction({ form }));
  }


  ngOnInit() {
    this.proceedSubscription = this.hasUser$.subscribe(() => {
      console.log(this.returnUrl);
      this.router.navigateByUrl("/datasets");
    });

    this.route.queryParams.subscribe(params => {
      if (!!params.returnUrl){
        console.log("!!!!!!!", params.returnUrl);
        const urlqp = new URLSearchParams(params.returnUrl.split('?')[1]);
        this.store.dispatch(loginOIDCAction({accessToken: urlqp.get('access-token'), userId: urlqp.get('user-id')}));
      }});
  }

  ngOnDestroy() {
    this.proceedSubscription.unsubscribe();
  }
}
