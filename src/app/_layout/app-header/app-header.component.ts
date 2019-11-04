import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { Store, select } from "@ngrx/store";
import {
  fetchCurrentUserAction,
  logoutAction
} from "state-management/actions/user.actions";
import { Subscription } from "rxjs";
import {
  getCurrentUserAccountType,
  getCurrentUser,
  getProfile
} from "state-management/selectors/user.selectors";

@Component({
  selector: "app-app-header",
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.scss"]
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  facility: string;
  status: string;

  username: string;
  profileImage: string;
  userSubscription: Subscription;
  accountTypeSubscription: Subscription;

  constructor(
    private store: Store<any>,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {
    this.facility = appConfig.facility;
    if (appConfig.production === true) {
      this.status = "";
    } else {
      this.status = "test";
    }
    this.profileImage = "assets/images/user.png";
  }

  ngOnInit() {
    this.store.dispatch(fetchCurrentUserAction());

    this.accountTypeSubscription = this.store
      .pipe(select(getCurrentUserAccountType))
      .subscribe(type => {
        if (type === "functional") {
          this.profileImage = "assets/images/user.png";
        }
      });

    this.userSubscription = this.store
      .pipe(select(getCurrentUser))
      .subscribe(current => {
        console.log("current: ", current);
        if (current) {
          this.username = current.username.replace("ms-ad.", "");
          if (!current.realm && current.id) {
            this.store.pipe(select(getProfile)).subscribe(profile => {
              if (profile) {
                this.username = profile.username;
                if (profile.thumbnailPhoto.startsWith("data")) {
                  this.profileImage = profile.thumbnailPhoto;
                }
              }
            });
          }
        }
      });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.accountTypeSubscription.unsubscribe();
  }

  logout(): void {
    this.store.dispatch(logoutAction());
  }
}
