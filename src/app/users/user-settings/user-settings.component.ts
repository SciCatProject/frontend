import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserApi } from 'shared/sdk/services';
import * as ua from 'state-management/actions/user.actions';
import * as selectors from 'state-management/selectors';
import { MessageType } from 'state-management/models';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit {

  user: object;
  settings$ = null;

  constructor(private us: UserApi, private store: Store<any>) {
    this.store.select(selectors.users.getCurrentUser).subscribe(user => {
      this.user = user;
    });
    console.log(this.us.getCurrentToken());
    this.settings$ = this.store.select(selectors.users.getSettings);
    // TODO handle service and endpoint for user settings
  }

  ngOnInit() {}

  onSubmit(values) {
    // TODO validate here
    console.log(values);
    // values['darkTheme'] = (values['darkTheme'].toLowerCase() === 'true')
    this.store.dispatch(new ua.SaveSettingsAction(values));
    this.store.dispatch(new ua.ShowMessageAction({
        content: 'Settings Saved Locally',
        title: 'Settings Saved Locally',
        timeout: 3,
        type: MessageType.Success,
        class: 'ui positive message'
      }));
  }
}
