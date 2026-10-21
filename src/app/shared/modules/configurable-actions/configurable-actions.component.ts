import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  ActionButtonStyle,
  ActionConfig,
  ActionItems,
} from "./configurable-action.interfaces";

import { AppConfigService } from "app-config.service";
import { Store } from "@ngrx/store";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import {
  selectHasFetchedProfile,
  selectIsLoggedIn,
} from "state-management/selectors/user.selectors";

@Component({
  selector: "configurable-actions",
  templateUrl: "./configurable-actions.component.html",
  styleUrls: ["./configurable-actions.component.scss"],
  standalone: false,
})
export class ConfigurableActionsComponent {
  @Input({ required: true }) actionsConfig: ActionConfig[] = [];
  @Input({ required: true }) actionItems: ActionItems;
  @Input({ required: false }) buttonsStyle: ActionButtonStyle = {
    raised: true,
    color: "accent",
  };
  @Output() actionFinished = new EventEmitter<{
    success: boolean;
    result?: unknown;
    error?: Error;
  }>();

  // actions read the user's groups and #user fields: for a logged-in user,
  // wait until the profile request has finished
  profileReady$ = combineLatest([
    this.store.select(selectIsLoggedIn),
    this.store.select(selectHasFetchedProfile),
  ]).pipe(
    map(([loggedIn, hasFetchedProfile]) => !loggedIn || hasFetchedProfile),
  );

  constructor(
    public appConfigService: AppConfigService,
    private store: Store,
  ) {}

  get maxFileSize(): number {
    return this.appConfigService.getConfig().maxDirectDownloadSize || 0;
  }

  get sortedActionsConfig(): ActionConfig[] {
    if (!this.actionsConfig) {
      return [];
    }
    return [...this.actionsConfig].sort((a: ActionConfig, b: ActionConfig) =>
      a.order && b.order ? a.order - b.order : 0,
    );
  }
}
