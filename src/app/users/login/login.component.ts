import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {Http} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as ua from 'state-management/actions/user.actions';

/**
 * Component to handle user login. Allows for AD and
 * functional account login.
 * @export
 * @class LoginComponent
 */
@Component({selector : 'login-form', templateUrl : './login.component.html'})
export class LoginComponent implements OnInit {

  returnUrl: string;
  postError = '';

  public loginForm = this.fb.group({
    username : [ '', Validators.required ],
    password : [ '', Validators.required ],
    rememberMe : true
  });

  /**
   * Creates an instance of LoginComponent.
   * @param {FormBuilder} fb - generates model driven user login form
   * @param {UserApi} us - user service for local accounts
   * @param {ADAuthService} ad - custom active directory account service
   * @param {Router} router - handles page nav
   * @param {ActivatedRoute} route - access parameters in URL
   * @param {Http} http - make requests
   * @param {LoopBackAuth} auth - add logged in user to auth service
   * @memberof LoginComponent
   */
  constructor(public fb: FormBuilder, private router: Router,
              private route: ActivatedRoute, private store: Store<any>) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    const self = this;
    this.store.select(state => state.root.user.currentUser)
        .subscribe(result => {
          console.log(result);
          if (result && result['username']) {
            self.router.navigateByUrl(decodeURIComponent(self.returnUrl));
          } else if (result && result['errSrc']) {
            self.store.dispatch({
              type : ua.SHOW_MESSAGE,
              payload : {
                content :  result.message,
                type : 'error',
                title : 'Login Failed'
              }
            });
          } else if (!(result instanceof Object)) {
            self.store.dispatch({
              type : ua.SHOW_MESSAGE,
              payload : {
                content :  result,
                type : 'error',
                title : 'Login Failed'
              }
            });
          }
        });
  }

  ngOnInit() {}

  /**
   * Default to an Active directory login attempt initially. Fallback to `local`
   * accounts if fails
   * @param {any} event - form submission event (not currently used)
   * @memberof LoginComponent
   */
  doADLogin(event) {
    const self = this;
    this.store.dispatch({type : ua.LOGIN, payload : self.loginForm.value});
  }
}
