import { localStorageSync } from "ngrx-store-localstorage";
import { getCurrentUserId } from "./../../state-management/selectors/users.selectors";
import {
  RetrieveUserIdentAction,
  RetrieveUserAction
} from "./../../state-management/actions/user.actions";
import { map, pluck } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { UserApi } from "shared/sdk/services";
import * as ua from "state-management/actions/user.actions";
import * as selectors from "state-management/selectors";
import { Message, MessageType } from "state-management/models";
import { getProfile } from "state-management/selectors/users.selectors";
import { LoginService } from "users/login.service";

@Component({
  selector: "app-user-settings",
  templateUrl: "./user-settings.component.html",
  styleUrls: ["./user-settings.component.css"]
})
export class UserSettingsComponent implements OnInit {
  user: object;
  settings$ = null;
  profileImage:  string;
  profile: object;
  email: string;
  displayName: string;

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

  b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode("0x" + p1);
    }));
  }

  ngOnInit() {
    this.store
      .pipe(select(state => state.root.user.currentUser))
      .subscribe(current => {
        this.loginService.getUserIdent$(current.id).subscribe(userId => {
          this.email = userId.profile.email;
          this.displayName = userId.profile.displayName;
          this.profileImage = "data:image/jpeg;base64," + this.b64EncodeUnicode( userId.profile.thumbnailPhoto);
          console.log(userId.profile);
          console.log(this.profileImage);
        });
      });
  }

  onSubmit(values) {
    // TODO validate here
    console.log(values);
    // values['darkTheme'] = (values['darkTheme'].toLowerCase() === 'true')
    this.store.dispatch(new ua.SaveSettingsAction(values));
    const msg = new Message();
    msg.content = "Settings saved locally";
    msg.type = MessageType.Success;
    this.store.dispatch(new ua.ShowMessageAction(msg));
  }
}
