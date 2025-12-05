import { createAction, props } from "@ngrx/store";
import { AdminConfiguration } from "state-management/effects/admin.effects";

export const loadConfiguration = createAction("[Admin] Load Configuration");
export const loadConfigurationSuccess = createAction(
  "[Admin] Load Configuration Success",
  props<{ config: AdminConfiguration }>(),
);
export const loadConfigurationFailure = createAction(
  "[Admin] Load Configuration Failure",
  props<{ error: any }>(),
);

export const updateConfiguration = createAction(
  "[Admin] Update Configuration",
  props<{ config: Partial<AdminConfiguration> }>(),
);
export const updateConfigurationSuccess = createAction(
  "[Admin] Update Configuration Success",
  props<{ config: AdminConfiguration }>(),
);
export const updateConfigurationFailure = createAction(
  "[Admin] Update Configuration Failure",
  props<{ error: any }>(),
);
