import { APP_CONFIG, AppConfig } from "./app-config.module";
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import { select, Store } from "@ngrx/store";
import { LoopBackConfig } from "shared/sdk";
import { UserApi } from "shared/sdk/services";
import * as ua from "state-management/actions/user.actions";
import { MatSnackBar } from "@angular/material";
import { Meta } from "@angular/platform-browser";
import { environment } from "../environments/environment";
import { getCurrentUser } from "state-management/selectors/users.selectors";

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

  facility: string;
  appVersion: number;
  us: UserApi;
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
    private metaService: Meta,
    public snackBar: MatSnackBar,
    // private _notif_service: NotificationsService,
    @Inject(APP_CONFIG) public appConfig: AppConfig,
    private store: Store<any>
  ) {
    this.appVersion = appVersion;
    this.facility = this.appConfig.facility;
    this.metaService.addTag({
      name: "description",
      content: "SciCat metadata catalogue at" + this.facility
    });
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

    // TODO handle dataset loading

    // this.store.dispatch(new ua.RetrieveUserAction());
  }

  ngOnDestroy() {
    for (let i = 0; i < this.subscriptions.length; i++) {
      this.subscriptions[i].unsubscribe();
    }
  }

  logout() {
    this.store.dispatch(new ua.LogoutAction());
  }
}
