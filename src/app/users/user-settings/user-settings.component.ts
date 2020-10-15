import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { select, Store } from "@ngrx/store";
import {
  saveSettingsAction,
  showMessageAction,
  fetchCurrentUserAction,
  fetchCatamelTokenAction
} from "state-management/actions/user.actions";
import { Message, MessageType } from "state-management/models";
import {
  getSettings,
  getProfile,
  getCurrentUser,
  getCatamelToken
} from "state-management/selectors/user.selectors";
import { Subscription } from "rxjs";
import { DOCUMENT } from "@angular/common";

@Component({
  selector: "app-user-settings",
  templateUrl: "./user-settings.component.html",
  styleUrls: ["./user-settings.component.scss"]
})
export class UserSettingsComponent implements OnInit, OnDestroy {
  settings$ = this.store.pipe(select(getSettings));

  user: object;
  profileImage = "assets/images/user.png";
  profile: object;
  email: string;
  id: string;
  displayName: string;
  datasetCount: number;
  jobCount: number;
  groups: string[];
  settings: Object;
  catamelToken: string;

  subscriptions: Subscription[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private store: Store<any>
  ) {
    // TODO handle service and endpoint for user settings
  }

  ngOnInit() {
    this.store.dispatch(fetchCurrentUserAction());
    this.store.dispatch(fetchCatamelTokenAction());

    this.subscriptions.push(
      this.store.pipe(select(getCurrentUser)).subscribe(user => {
        this.user = user;
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getProfile)).subscribe(profile => {
        if (profile) {
          this.email = profile.email;
          this.displayName = profile.displayName;
          this.groups = profile.accessGroups;
          this.id = profile.id;
          if (profile.thumbnailPhoto.startsWith("data")) {
            this.profileImage = profile.thumbnailPhoto;
          } else {
            this.profileImage = "assets/images/user.png";
          }
        }
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getSettings)).subscribe(settings => {
        this.settings = settings;
        if (settings.hasOwnProperty("datasetCount")) {
          this.datasetCount = settings.datasetCount;
        }
        if (settings.hasOwnProperty("jobCount")) {
          this.jobCount = settings.jobCount;
        }
        console.log("settings", settings);
      })
    );

    this.subscriptions.push(
      this.store.pipe(select(getCatamelToken)).subscribe(catamelToken => {
        if (catamelToken) {
          this.catamelToken = catamelToken.id;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  onSubmit(values) {
    // TODO validate here
    console.log(values);
    // values['darkTheme'] = (values['darkTheme'].toLowerCase() === 'true')
    this.store.dispatch(saveSettingsAction({ settings: values }));
    const message = new Message();
    message.content = "Settings saved locally";
    message.type = MessageType.Success;
    message.duration = 5000;
    this.store.dispatch(showMessageAction({ message }));
  }

  onCopy(token: string) {
    const selectionBox = this.document.createElement("textarea");
    selectionBox.style.position = "fixed";
    selectionBox.style.left = "0";
    selectionBox.style.top = "0";
    selectionBox.style.opacity = "0";
    selectionBox.value = token;
    this.document.body.appendChild(selectionBox);
    selectionBox.focus();
    selectionBox.select();
    this.document.execCommand("copy");
    this.document.body.removeChild(selectionBox);
  }
}
