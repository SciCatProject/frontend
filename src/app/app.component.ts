import { submitJob } from 'state-management/selectors/jobs.selectors';
import { getIsLoggedIn, getProfile, getCurrentUserAccountType } from './state-management/selectors/users.selectors';
import { APP_CONFIG, AppConfig } from "./app-config.module";
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { LoopBackConfig } from "shared/sdk";
import { UserApi } from "shared/sdk/services";
import * as ua from "state-management/actions/user.actions";
import { MatSnackBar } from "@angular/material";
import { Meta, Title } from "@angular/platform-browser";
import { environment } from "../environments/environment";
import * as selectors from "state-management/selectors";
import { getCurrentUser } from "state-management/selectors/users.selectors";

import { LoginService } from "users/login.service";
import { map } from 'rxjs/operators';

const { version: appVersion } = require("../../package.json");

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  providers: [UserApi],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnDestroy, OnInit {
  userObs$ = this.store.pipe(select(getCurrentUser));
  isLoggedIn$ = this.store.pipe(select(getIsLoggedIn));


  title = "SciCat";
  appVersion = 0;
  us: UserApi;
  darkTheme$;
  username: string = null;
  profileImage: string = null;
  message$ = null;
  msgClass$ = null;
  subscriptions = [];
  public options = {
    position: ["top", "right"],
    lastOnBottom: true,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    timeOut: 2000
  };

  constructor(
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
    public snackBar: MatSnackBar,
    private loginService: LoginService,
    // private _notif_service: NotificationsService,
    @Inject(APP_CONFIG) private appConfig: AppConfig,
    private store: Store<any>
  ) {
    this.appVersion = appVersion;
    this.darkTheme$ = this.store.pipe(select(selectors.users.getTheme));
    const facility = this.appConfig.facility;
    let status = "test";
    if (this.appConfig.production === true) {
      status = "";
    }
    this.title = "SciCat" + " " + facility + " " + status;
    this.setTitle(this.title);
    this.metaService.addTag({
      name: "description",
      content: "SciCat metadata catalogue at" + facility
    });
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  /**
   * Handles initial check of username and updates
   * auth service (loopback does not by default)
   * @memberof AppComponent
   */
  ngOnInit() {
    LoopBackConfig.setBaseURL(environment.lbBaseURL);
    console.log(LoopBackConfig.getPath());
    if ("lbApiVersion" in environment) {
      const lbApiVersion = environment["lbApiVersion"];
      LoopBackConfig.setApiVersion(lbApiVersion);
    }

    // localStorage.clear();
    if (window.location.pathname.indexOf("logout") !== -1) {
      this.logout();
      // this.router.navigate(['/login']);
    }

    this.subscriptions.push(
      this.store.pipe(select(getCurrentUserAccountType)).subscribe(type => {
        if (type === "functional") {
          this.profileImage = "assets/images/user.png";
      }})
    );
    this.subscriptions.push(
      this.store
        .pipe(select(state => state.root.user.message))
        .subscribe(current => {
          if (current.content !== undefined) {
            this.snackBar.open(current.content, undefined, {
              duration: current.duration
            });
            this.store.dispatch(new ua.ClearMessageAction());
          }
        })
    );
    this.subscriptions.push(
      this.store
        .pipe(select(state => state.root.user.currentUser))
        .subscribe(current => {
          console.log("current: ", current);
          if (current) {
            this.username = current.username.replace("ms-ad.", "");
            if (!current.realm && current.id) {
              this.loginService
                .getUserIdent$(current.id)
                .subscribe(currentIdent => {
                  if (currentIdent) {
                    this.username = currentIdent.profile.username;
                    this.profileImage = currentIdent.profile.thumbnailPhoto;
                    if (typeof currentIdent.profile.thumbnailPhoto === undefined){
                      this.profileImage = "assets/images/user.png";
                    }
                  }
                });
            }
            // TODO handle dataset loading
          }
        })
    );


    this.store.dispatch(new ua.RetrieveUserAction());
  }

  ngOnDestroy() {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  logout() {
    this.store.dispatch(new ua.LogoutAction());
  }

  login() {
    this.router.navigateByUrl("/login");
  }

}
