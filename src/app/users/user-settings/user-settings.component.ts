import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { UserApi } from "shared/sdk/services";
import {
  SaveSettingsAction,
  ShowMessageAction
} from "state-management/actions/user.actions";
import * as selectors from "state-management/selectors";
import { Message, MessageType } from "state-management/models";
import { LoginService } from "users/login.service";
import { getSettings } from "state-management/selectors/users.selectors";

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
  groups: string[];
  settings: Object;

  constructor(
    private us: UserApi,
    private store: Store<any>,
    private loginService: LoginService
  ) {
    this.store.select(selectors.users.getCurrentUser).subscribe(user => {
      this.user = user;
    });
    console.log(this.us.getCurrentToken());
    this.settings$ = this.store.pipe(select(selectors.users.getSettings));

    // TODO handle service and endpoint for user settings
  }

  ngOnInit() {
    this.store
      .pipe(select(state => state.root.user.currentUser))
      .subscribe(current => {
        this.loginService.getUserIdent$(current.id).subscribe(currentIdent => {
          this.email = currentIdent.profile.email;
          this.displayName = currentIdent.profile.displayName;
          this.groups = currentIdent.profile.accessGroups;
          this.id = currentIdent.profile.id;
          if (currentIdent.profile.thumbnailPhoto.startsWith("data")) {
            this.profileImage = currentIdent.profile.thumbnailPhoto;
          } else {
            this.profileImage = "assets/images/user.png";
          }
          console.log(currentIdent.profile);
          // console.log(this.profileImage);
        });
      });

    this.store.pipe(select(getSettings)).subscribe(settings => {
      this.settings = settings;
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
