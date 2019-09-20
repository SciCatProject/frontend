import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import {
  SaveSettingsAction,
  ShowMessageAction,
  RetrieveUserAction
} from "state-management/actions/user.actions";
import * as selectors from "state-management/selectors";
import { Message, MessageType } from "state-management/models";
import {
  getSettings,
  getProfile
} from "state-management/selectors/users.selectors";

@Component({
  selector: "app-user-settings",
  templateUrl: "./user-settings.component.html",
  styleUrls: ["./user-settings.component.scss"]
})
export class UserSettingsComponent implements OnInit {
  user: object;
  settings$ = null;
  profileImage = "assets/images/user.png";
  profile: object;
  email: string;
  id: string;
  displayName: string;
  datasetCount: number;
  jobCount: number;
  groups: string[];
  settings: Object;

  constructor(private store: Store<any>) {
    this.store.select(selectors.users.getCurrentUser).subscribe(user => {
      this.user = user;
    });
    this.settings$ = this.store.pipe(select(selectors.users.getSettings));

    // TODO handle service and endpoint for user settings
  }

  ngOnInit() {
    this.store.dispatch(new RetrieveUserAction());

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
    });

    this.store.pipe(select(getSettings)).subscribe(settings => {
      this.settings = settings;
      if (settings.hasOwnProperty("datasetCount")) {
        this.datasetCount = settings.datasetCount;
      }
      if (settings.hasOwnProperty("jobCount")) {
        this.jobCount = settings.jobCount;
      }
      console.log("settings", settings);
    });
  }

  onSubmit(values) {
    // TODO validate here
    console.log(values);
    // values['darkTheme'] = (values['darkTheme'].toLowerCase() === 'true')
    this.store.dispatch(new SaveSettingsAction(values));
    const msg = new Message();
    msg.content = "Settings saved locally";
    msg.type = MessageType.Success;
    this.store.dispatch(new ShowMessageAction(msg));
  }
}
