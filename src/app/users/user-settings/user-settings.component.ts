import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { UserApi } from "shared/sdk/services";
import * as ua from "state-management/actions/user.actions";
import * as selectors from "state-management/selectors";
import { Message, MessageType } from "state-management/models";

@Component({
  selector: "app-user-settings",
  templateUrl: "./user-settings.component.html",
  styleUrls: ["./user-settings.component.css"]
})
export class UserSettingsComponent implements OnInit {
  user: object;
  settings$ = null;

  constructor(private us: UserApi, private store: Store<any>) {
    this.store.select(selectors.users.getCurrentUser).subscribe(user => {
      this.user = user;
    });
    console.log(this.us.getCurrentToken());
    this.settings$ = this.store.pipe(select(selectors.users.getSettings));

    // TODO handle service and endpoint for user settings
  }

  ngOnInit() {}

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
