import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import * as ua from "state-management/actions/user.actions";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import {
  getIsLoggedIn,
  getIsLoggingIn
} from "state-management/selectors/users.selectors";

interface LoginForm {
  username: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Component to handle user login. Allows for AD and
 * functional account login.
 * @export
 * @class LoginComponent
 */
@Component({
  selector: "login-form",
  templateUrl: "./login.component.html",
  styleUrls: ["login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy {
  returnUrl: string;
  // postError = '';

  public loginForm = this.fb.group({
    username: ["", Validators.required],
    password: ["", Validators.required],
    rememberMe: true
  });

  loading$ = this.store.pipe(select(getIsLoggingIn));
  private hasUser$ = this.store.pipe(
    select(getIsLoggedIn),
    filter(is => is)
  );

  private proceedSubscription: Subscription = null;

  /**
   * Creates an instance of LoginComponent.
   * @param {FormBuilder} fb - generates model driven user login form
   * @param {Router} router - handles page nav
   * @param {ActivatedRoute} route - access parameters in URL
   * @param {Store<any>} store
   * @memberof LoginComponent
   */
  constructor(
    public fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<any>
  ) {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"] || "/";
    /* this.store.select(selectors.users.getCurrentUser)
    .subscribe(result => {
      console.log(result);
      if (result && result['username']) {
        this.router.navigateByUrl('/datasets');
        // self.router.navigateByUrl(decodeURIComponent(self.returnUrl));
      } else if (result && result['errSrc']) {
        const msg = new Message();
        msg.content = 'Prob: ' + JSON.stringify(result['message']);
        msg.type = MessageType.Error;
        this.store.dispatch(new ua.ShowMessageAction(msg));
      } else if (!(result instanceof Object)) {
        const msg = new Message();
        msg.content = result;
        msg.type = MessageType.Error;
        this.store.dispatch(new ua.ShowMessageAction(msg));
      }
    });
    */
  }

  ngOnInit() {
    this.proceedSubscription = this.hasUser$.subscribe(() => {
      // this.router.navigate(["datasets"]);
      console.log(this.returnUrl);
      this.router.navigateByUrl("/datasets");
    });
  }

  ngOnDestroy() {
    this.proceedSubscription.unsubscribe();
  }

  /**
   * Default to an Active directory login attempt initially. Fallback to `local`
   * accounts if fails
   * @param {any} event - form submission event (not currently used)
   * @memberof LoginComponent
   */
  onLogin(event) {
    const form: LoginForm = this.loginForm.value;
    this.store.dispatch(new ua.LoginAction(form));
  }
}
