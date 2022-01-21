import { Component, OnInit, Inject } from "@angular/core";
import { Store } from "@ngrx/store";
import {
  saveSettingsAction,
  showMessageAction,
  fetchCurrentUserAction,
  fetchCatamelTokenAction,
} from "state-management/actions/user.actions";
import { Message, MessageType, Settings } from "state-management/models";
import { selectUserSettingsPageViewModel } from "state-management/selectors/user.selectors";
import { DOCUMENT } from "@angular/common";
import { map } from "rxjs/operators";

@Component({
  selector: "app-user-settings",
  templateUrl: "./user-settings.component.html",
  styleUrls: ["./user-settings.component.scss"],
})
export class UserSettingsComponent implements OnInit {
  vm$ = this.store.select(selectUserSettingsPageViewModel);

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private store: Store
  ) {
    // TODO handle service and endpoint for user settings
  }

  ngOnInit() {
    this.store.dispatch(fetchCurrentUserAction());
    this.store.dispatch(fetchCatamelTokenAction());
  }

  onSubmit(values: Settings) {
    // TODO validate here
    console.log(values);
    // values['darkTheme'] = (values['darkTheme'].toLowerCase() === 'true')
    this.store.dispatch(saveSettingsAction({ settings: values }));
    const message = new Message(
      "Settings saved locally",
      MessageType.Success,
      5000
    );
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

    const message = new Message(
      "Catamel token has been copied to your clipboard",
      MessageType.Success,
      5000
    );
    this.store.dispatch(showMessageAction({ message }));
  }
}
