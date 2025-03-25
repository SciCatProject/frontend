import { HttpErrorResponse } from "@angular/common/http";
import { createAction, props } from "@ngrx/store";
import {
  ReturnedUserDto,
  UserIdentity,
  UserSettings,
} from "@scicatproject/scicat-sdk-ts-angular";
import { Message, Settings, TableColumn } from "state-management/models";
import {
  ConditionConfig,
  FilterConfig,
} from "../../shared/modules/filters/filters.module";
import { AppConfig } from "app-config.service";
import { AccessTokenInterface } from "shared/services/auth/auth.service";

export const setDatasetTableColumnsAction = createAction(
  "[User] Set Dataset Table Columns",
  props<{ columns: TableColumn[] }>(),
);

export const loginOIDCAction = createAction(
  "[User] OIDC Login",
  props<{ oidcLoginResponse: any }>(),
);

export const loginAction = createAction(
  "[User] Login",
  props<{
    form: { username: string; password: string; rememberMe: boolean };
  }>(),
);
export const loginCompleteAction = createAction(
  "[User] Login Complete",
  props<{ user: ReturnedUserDto; accountType: string }>(),
);
export const loginFailedAction = createAction(
  "[User] Login Failed",
  props<{ error: HttpErrorResponse }>(),
);

export const activeDirLoginAction = createAction(
  "[User] Active Directory Login",
  props<{ username: string; password: string; rememberMe: boolean }>(),
);
export const activeDirLoginSuccessAction = createAction(
  "[User] Active Directory Login Success",
);
export const activeDirLoginFailedAction = createAction(
  "[User] Active Directory Login Failed",
  props<{ error: HttpErrorResponse }>(),
);

export const funcLoginAction = createAction(
  "[User] Functional Login",
  props<{
    form: { username: string; password: string; rememberMe: boolean };
  }>(),
);
export const funcLoginSuccessAction = createAction(
  "[User] Functional Login Success",
);
export const funcLoginFailedAction = createAction(
  "[User] Functional Login Failed",
  props<{ error: HttpErrorResponse }>(),
);

export const fetchUserAction = createAction(
  "[User] Fetch User",
  props<{ adLoginResponse: any }>(),
);
export const fetchUserCompleteAction = createAction(
  "[User] Fetch User Complete",
);
export const fetchUserFailedAction = createAction(
  "[User] Fetch User Failed",
  props<{ error: HttpErrorResponse }>(),
);

export const fetchCurrentUserAction = createAction("[User] Fetch Current User");
export const fetchCurrentUserCompleteAction = createAction(
  "[User] Fetch Current User Complete",
  props<{ user: ReturnedUserDto }>(),
);
export const fetchCurrentUserFailedAction = createAction(
  "[User] Fetch Current User Failed",
);

export const fetchUserIdentityAction = createAction(
  "[User] Fetch User Identity",
  props<{ id: string }>(),
);
export const fetchUserIdentityCompleteAction = createAction(
  "[User] Fetch User Identity Complete",
  props<{ userIdentity: UserIdentity }>(),
);
export const fetchUserIdentityFailedAction = createAction(
  "[User] Fetch User Identity Failed",
);

export const fetchUserSettingsAction = createAction(
  "[User] Fetch User Settings",
  props<{ id: string }>(),
);
export const fetchUserSettingsCompleteAction = createAction(
  "[User] Fetch User Settings Complete",
  props<{ userSettings: UserSettings }>(),
);
export const fetchUserSettingsFailedAction = createAction(
  "[User] Fetch User Settings Failed",
);

export const updateUserSettingsAction = createAction(
  "[User] Update User Settings",
  props<{ property: Record<string, unknown> }>(),
);
export const updateUserSettingsCompleteAction = createAction(
  "[User] Update User Settings Complete",
  props<{ userSettings: UserSettings }>(),
);
export const updateUserSettingsFailedAction = createAction(
  "[User] Update User Settings Failed",
);

export const fetchScicatTokenAction = createAction("[User] Fetch Scicat Token");
export const fetchScicatTokenCompleteAction = createAction(
  "[User] Fetch Scicat Token Complete",
  props<{ token: AccessTokenInterface }>(),
);
export const fetchScicatTokenFailedAction = createAction(
  "[User] Fetch Scicat Token Failed",
);

export const logoutAction = createAction("[User] Logout");
export const logoutCompleteAction = createAction(
  "[User] Logout Complete",
  props<{ logoutURL?: string }>(),
);
export const logoutFailedAction = createAction("[User] Logout Failed");

export const addCustomColumnsAction = createAction(
  "[User] Add Custom Columns",
  props<{ names: string[] }>(),
);
export const addCustomColumnsCompleteAction = createAction(
  "[User] Add Custom Columns Complete",
);

export const selectColumnAction = createAction(
  "[User] Select Column",
  props<{ name: string; columnType: "standard" | "custom" }>(),
);
export const deselectColumnAction = createAction(
  "[User] Deselect Column",
  props<{ name: string; columnType: "standard" | "custom" }>(),
);
export const deselectAllCustomColumnsAction = createAction(
  "[User] Deselect All Custom Columns",
);

export const showMessageAction = createAction(
  "[User] Show Message",
  props<{ message: Message }>(),
);
export const clearMessageAction = createAction("[User] Clear Message");

export const saveSettingsAction = createAction(
  "[User] Save Settings",
  props<{ settings: Settings }>(),
);

export const loadingAction = createAction("[User] Loading");
export const loadingCompleteAction = createAction("[User] Loading Complete");

export const updateFilterConfigs = createAction(
  "[User] Update Filter Configs",
  props<{ filterConfigs: FilterConfig[] }>(),
);

export const updateConditionsConfigs = createAction(
  "[User] Update Conditions Configs",
  props<{ conditionConfigs: ConditionConfig[] }>(),
);

export const loadDefaultSettings = createAction(
  "[User] Load Default Settings",
  props<{ config: AppConfig }>(),
);
