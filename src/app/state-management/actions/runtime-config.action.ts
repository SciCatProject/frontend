import { createAction, props } from "@ngrx/store";
import { Configuration } from "state-management/effects/runtime-config.effects";

export const loadConfiguration = createAction(
  "[RunTimeConfig] Load Configuration",
  props<{ id: string }>(),
);
export const loadConfigurationSuccess = createAction(
  "[RunTimeConfig] Load Configuration Success",
  props<{ config: Configuration }>(),
);
export const loadConfigurationFailure = createAction(
  "[RunTimeConfig] Load Configuration Failure",
  props<{ error: any }>(),
);

export const updateConfiguration = createAction(
  "[RunTimeConfig] Update Configuration",
  props<{ id: string; config: Partial<Configuration> }>(),
);
export const updateConfigurationSuccess = createAction(
  "[RunTimeConfig] Update Configuration Success",
  props<{ config: Configuration }>(),
);
export const updateConfigurationFailure = createAction(
  "[RunTimeConfig] Update Configuration Failure",
  props<{ error: any }>(),
);
