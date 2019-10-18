import { createAction, props } from "@ngrx/store";
import { User, AccessToken, UserIdentity } from "shared/sdk";
import { Message, Settings } from "state-management/models";

export const loginAction = createAction(
  "[User] Login",
  props<{ form: { username: string; password: string; rememberMe: boolean } }>()
);
export const loginCompleteAction = createAction(
  "[User] Login Complete",
  props<{ user: User; accountType: string }>()
);
export const loginFailedAction = createAction("[User] Login Failed");

export const activeDirLoginAction = createAction(
  "[User] Active Directory Login",
  props<{ username: string; password: string; rememberMe: boolean }>()
);
export const activeDirLoginSuccessAction = createAction(
  "[User] Active Directory Login Success"
);
export const activeDirLoginFailedAction = createAction(
  "[User] Active Directory Login Failed",
  props<{ username: string; password: string; rememberMe: boolean }>()
);

export const funcLoginAction = createAction(
  "[User] Functional Login",
  props<{ username: string; password: string; rememberMe: boolean }>()
);
export const funcLoginSuccessAction = createAction(
  "[User] Functional Login Success"
);
export const funcLoginFailedAction = createAction(
  "[User] Functional Login Failed"
);

export const fetchUserAction = createAction(
  "[User] Fetch User",
  props<{ adLoginResponse: any }>()
);
export const fetchUserCompleteAction = createAction(
  "[User] Fetch User Complete"
);
export const fetchUserFailedAction = createAction("[User] Fetch User Failed");

export const fetchCurrentUserAction = createAction("[User] Fetch Current User");
export const fetchCurrentUserCompleteAction = createAction(
  "[User] Fetch Current User Complete",
  props<{ user: User }>()
);
export const fetchCurrentUserFailedAction = createAction(
  "[User] Fetch Current User Failed"
);

export const fetchUserIdentityAction = createAction(
  "[User] Fetch User Identity",
  props<{ id: string }>()
);
export const fetchUserIdentityCompleteAction = createAction(
  "[User] Fetch User Identity Complete",
  props<{ userIdentity: UserIdentity }>()
);
export const fetchUserIdentityFailedAction = createAction(
  "[User] Fetch User Identity Failed"
);

export const fetchCatamelTokenAction = createAction(
  "[User] Fetch Catamel Token"
);
export const fetchCatamelTokenCompleteAction = createAction(
  "[User] Fetch Catamel Token Complete",
  props<{ token: AccessToken }>()
);
export const fetchCatamelTokenFailedAction = createAction(
  "[User] Fetch Catamel Token Failed"
);

export const logoutAction = createAction("[User] Logout");
export const logoutCompleteAction = createAction("[User] Logout Complete");
export const logoutFailedAction = createAction("[User] Logout Failed");

export const selectColumnAction = createAction(
  "[User] Select Column",
  props<{ column: string }>()
);
export const deselectColumnAction = createAction(
  "[User] Deselect Column",
  props<{ column: string }>()
);

export const showMessageAction = createAction(
  "[User] Show Message",
  props<{ message: Message }>()
);
export const clearMessageAction = createAction("[User] Clear Message");

export const saveSettingsAction = createAction(
  "[User] Save Settings",
  props<{ settings: Settings }>()
);

export const loadingAction = createAction("[User] Loading");
export const loadingCompleteAction = createAction("[User] Loading Complete");
