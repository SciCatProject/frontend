import { Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import {
  fetchCurrentUserAction,
  fetchScicatTokenAction,
} from "state-management/actions/user.actions";
import {
  selectIsAdmin,
  selectUserSettingsPageViewModel,
} from "state-management/selectors/user.selectors";
import { ClipboardService } from "shared/services/clipboard.service";
import packageJson from "../../../../package.json";
import { AppConfigService } from "app-config.service";

@Component({
  selector: "app-user-settings",
  templateUrl: "./user-settings.component.html",
  styleUrls: ["./user-settings.component.scss"],
  standalone: false,
})
export class UserSettingsComponent implements OnInit {
  vm$ = this.store.select(selectUserSettingsPageViewModel);
  isAdmin$ = this.store.select(selectIsAdmin);
  appVersion: string | undefined = packageJson.version;
  appConfig = this.appConfigService.getConfig();
  tokenValue: string;
  showMore = true;
  showConfig = {
    //TODO backend settings to be implemented
    frontend: true,
    backend: true,
  };

  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
    private clipboardService: ClipboardService,
  ) {
    // TODO handle service and endpoint for user settings
  }

  ngOnInit() {
    this.vm$.subscribe((settings) => {
      this.tokenValue = settings.scicatToken;
    });

    this.store.dispatch(fetchCurrentUserAction());
    this.store.dispatch(fetchScicatTokenAction());
  }

  onCopy(token: string) {
    this.clipboardService.copyToClipboard(
      token,
      "SciCat token has been copied to your clipboard",
      5000,
    );
  }
  toggleShowConfig(event: MouseEvent | KeyboardEvent, config: string) {
    const isMouseEvent = event instanceof MouseEvent;
    const isKeyboardEvent =
      event instanceof KeyboardEvent &&
      (event.key === "Enter" || event.key === " ");

    if (isMouseEvent || isKeyboardEvent) {
      if (config === "frontend") {
        this.showConfig.frontend = !this.showConfig.frontend;
      } else {
        this.showConfig.backend = !this.showConfig.backend;
      }
      if (isKeyboardEvent) {
        event.preventDefault();
      }
    }
  }

  toggleShowMore(event: MouseEvent | KeyboardEvent) {
    const isMouseEvent = event instanceof MouseEvent;
    const isKeyboardEvent =
      event instanceof KeyboardEvent &&
      (event.key === "Enter" || event.key === " ");

    if (isMouseEvent || isKeyboardEvent) {
      this.showMore = !this.showMore;
      if (isKeyboardEvent) {
        event.preventDefault();
      }
    }
  }
}
