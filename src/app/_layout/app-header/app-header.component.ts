import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { APP_CONFIG, AppConfig } from "app-config.module";
import { Store } from "@ngrx/store";
import {
  fetchCurrentUserAction,
  logoutAction,
} from "state-management/actions/user.actions";
import { Subscription } from "rxjs";
import {
  selectCurrentUserAccountType,
  selectCurrentUser,
  selectProfile,
  selectIsLoggedIn,
} from "state-management/selectors/user.selectors";
import { selectDatasetsInBatch } from "state-management/selectors/datasets.selectors";

@Component({
  selector: "app-app-header",
  templateUrl: "./app-header.component.html",
  styleUrls: ["./app-header.component.scss"],
})
export class AppHeaderComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  facility: string;
  status: string;

  username = "";
  profileImage: string;
  batch$ = this.store.select(selectDatasetsInBatch);
  inBatchPids: string[] = [];
  inBatchCount = 0;
  inBatchIndicator = "";
  loggedIn$ = this.store.select(selectIsLoggedIn);

  constructor(
    private store: Store,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {
    this.facility = appConfig.facility ?? "";
    if (appConfig.production === true) {
      this.status = "";
    } else {
      this.status = "test";
    }
    this.profileImage = "assets/images/user.png";
  }

  logout(): void {
    this.store.dispatch(logoutAction());
  }

  ngOnInit() {
    this.store.dispatch(fetchCurrentUserAction());

    this.subscriptions.push(
      this.batch$.subscribe((datasets) => {
        if (datasets) {
          this.inBatchPids = datasets.map((dataset) => dataset.pid);
          this.inBatchCount = this.inBatchPids.length;
          this.inBatchIndicator =
            this.inBatchCount > 99 ? "99+" : this.inBatchCount + "";
        }
      })
    );

    this.subscriptions.push(
      this.store.select(selectCurrentUserAccountType).subscribe((type) => {
        if (type === "functional") {
          this.profileImage = "assets/images/user.png";
        }
      })
    );

    this.subscriptions.push(
      this.store.select(selectCurrentUser).subscribe((current) => {
        console.log("current: ", current);
        if (current) {
          this.username = current.username.replace("ms-ad.", "");
          if (!current.realm && current.id) {
            this.store.select(selectProfile).subscribe((profile) => {
              if (profile) {
                this.username = profile.username;
                if (profile.thumbnailPhoto.startsWith("data")) {
                  this.profileImage = profile.thumbnailPhoto;
                }
              }
            });
          }
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
