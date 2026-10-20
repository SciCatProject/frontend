import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ConditionSettingScope, getSettingKey } from "state-management/models";
import { ConditionConfig } from "state-management/state/user.store";
import {
  updateConditionsConfigs,
  updateUserSettingsAction,
} from "state-management/actions/user.actions";

/** Keeps the configured conditions in the store and in the user settings. */
@Injectable({ providedIn: "root" })
export class ConditionFilterService {
  constructor(private store: Store) {}

  save(scope: ConditionSettingScope, configs: ConditionConfig[]): void {
    this.store.dispatch(
      updateConditionsConfigs({ conditionConfigs: configs, scope }),
    );
    this.store.dispatch(
      updateUserSettingsAction({
        property: { [getSettingKey(scope, "conditions")]: configs },
      }),
    );
  }

  clear(scope: ConditionSettingScope): void {
    this.save(scope, []);
  }
}
