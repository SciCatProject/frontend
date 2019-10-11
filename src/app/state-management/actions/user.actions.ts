import { Action } from "@ngrx/store";
import { Message, User, UserIdentity, Settings } from "../models";
import { AccessToken } from "shared/sdk";

export const LOGIN = "[User] Login";
export const LOGIN_COMPLETE = "[User] Login Complete";
export const LOGIN_FAILED = "[User] Login Failed";

export const LOGOUT = "[User] Logout";
export const LOGOUT_COMPLETE = "[User] Logout Complete";

export const AD_LOGIN = "[User] Active Directory Login";
export const AD_LOGIN_SUCCESS = "[User] Active Directory Login Success";
export const AD_LOGIN_FAILED = "[User] Active Directory Login Failed";

export const RETRIEVE_USER = "[User] Retrieve User";
export const RETRIEVE_USER_COMPLETE = "[User] Retrieve User Complete";
export const RETRIEVE_USER_FAILED = "[User] Retrieve User Failed";

export const RETRIEVE_USER_IDENTITY = "[UserIdentity] Retrieve User Identity";
export const RETRIEVE_USER_IDENTITY_COMPLETE =
  "[UserIdentity] Retrieve User Identity Complete";
export const RETRIEVE_USER_IDENTITY_FAILED =
  "[UserIdentity] Retrieve User Identity Failed";

export const FETCH_CATAMEL_TOKEN = "[User] Fetch Catamel Token";
export const FETCH_CATAMEL_TOKEN_COMPLETE =
  "[User] Fetch Catamel Token Complete";
export const FETCH_CATAMEL_TOKEN_FAILED = "[User] Fetch Catamel Token Failed";

export const ADD_GROUPS = "[User] Add Groups";
export const ADD_GROUPS_FAILED = "[User] Add Groups Failed";

export const ACCESS_USER_EMAIL = "[User] Access User Email";
export const ACCESS_USER_EMAIL_COMPLETE = "[User] Access User Email Complete";
export const ACCESS_USER_EMAIL_FAILED = "[User] Access User Email Failed";

export const SHOW_MESSAGE = "[User] Message Show";
export const CLEAR_MESSAGE = "[User] Message Clear";
export const SAVE_SETTINGS = "[User] Settings Save";

export const SELECT_COLUMN = "[User] Select Column";
export const SELECT_COLUMN_COMPLETE = "[User] Select Column Complete";
export const SELECT_COLUMN_FAILED = "[User] Select Column Failed";

export const DESELECT_COLUMN = "[User] Deselect Column";
export const DESELECT_COLUMN_COMPLETE = "[User] Deselect Column Complete";
export const DESELECT_COLUMN_FAILED = "[User] Deselect Column Failed";

export class ActiveDirLoginAction implements Action {
  readonly type = AD_LOGIN;
  constructor(
    public form: { username: string; password: string; rememberMe: boolean }
  ) {}
}

export class ActiveDirLoginSuccessAction implements Action {
  readonly type = AD_LOGIN_SUCCESS;
  constructor(readonly response: any) {}
}

export class ActiveDirLoginFailedAction implements Action {
  readonly type = AD_LOGIN_FAILED;
  constructor(
    readonly username: string,
    readonly password: string,
    readonly rememberMe: boolean
  ) {}
}

export class LoginAction implements Action {
  readonly type = LOGIN;
  constructor(
    public form: { username: string; password: string; rememberMe: boolean }
  ) {}
}

export class LoginCompleteAction implements Action {
  readonly type = LOGIN_COMPLETE;
  constructor(readonly user: User, readonly accountType: string) {}
}

export class LoginFailedAction implements Action {
  readonly type = LOGIN_FAILED;
  constructor() {}
}

export class LogoutAction implements Action {
  readonly type = LOGOUT;
}

export class LogoutCompleteAction implements Action {
  readonly type = LOGOUT_COMPLETE;
}

export class RetrieveUserAction implements Action {
  readonly type = RETRIEVE_USER;
}

export class RetrieveUserCompleteAction implements Action {
  readonly type = RETRIEVE_USER_COMPLETE;
  constructor(readonly user: User) {}
}

export class RetrieveUserFailedAction implements Action {
  readonly type = RETRIEVE_USER_FAILED;
  constructor(readonly error: Error) {}
}

export class RetrieveUserIdentAction implements Action {
  readonly type = RETRIEVE_USER_IDENTITY;
  constructor(readonly id: string) {}
}

export class RetrieveUserIdentCompleteAction implements Action {
  readonly type = RETRIEVE_USER_IDENTITY_COMPLETE;
  constructor(readonly userIdentity: UserIdentity) {}
}

export class RetrieveUserIdentFailedAction implements Action {
  readonly type = RETRIEVE_USER_IDENTITY_FAILED;
  constructor(readonly error: Error) {}
}

export class FetchCatamelTokenAction implements Action {
  readonly type = FETCH_CATAMEL_TOKEN;
}

export class FetchCatamelTokenCompleteAction implements Action {
  readonly type = FETCH_CATAMEL_TOKEN_COMPLETE;

  constructor(readonly catamelToken: AccessToken) {}
}

export class FetchCatamelTokenFailedAction implements Action {
  readonly type = FETCH_CATAMEL_TOKEN_FAILED;

  constructor(readonly error: Error) {}
}

export class SelectColumnAction implements Action {
  readonly type = SELECT_COLUMN;
  constructor(readonly columnName: string) {}
}

export class SelectColumnCompleteAction implements Action {
  readonly type = SELECT_COLUMN_COMPLETE;
  constructor(readonly columnName: string) {}
}

export class DeselectColumnAction implements Action {
  readonly type = DESELECT_COLUMN;
  constructor(readonly columnName: string) {}
}

export class DeselectColumnCompleteAction implements Action {
  readonly type = DESELECT_COLUMN_COMPLETE;
  constructor(readonly columnName: string) {}
}
export class DeselectColumnFailedAction implements Action {
  readonly type = DESELECT_COLUMN_FAILED;
  constructor(readonly columnName: string) {}
}
export class ShowMessageAction implements Action {
  readonly type = SHOW_MESSAGE;
  constructor(readonly message: Message) {}
}

export class ClearMessageAction implements Action {
  readonly type = CLEAR_MESSAGE;
}

export class SaveSettingsAction implements Action {
  readonly type = SAVE_SETTINGS;
  constructor(readonly values: Settings) {}
}

export type Actions =
  | LoginAction
  | LogoutCompleteAction
  | LoginFailedAction
  | LogoutAction
  | LogoutCompleteAction
  | RetrieveUserAction
  | RetrieveUserCompleteAction
  | RetrieveUserFailedAction
  | SelectColumnAction
  | SelectColumnCompleteAction
  | DeselectColumnAction
  | DeselectColumnCompleteAction
  | DeselectColumnFailedAction
  | ActiveDirLoginAction
  | ShowMessageAction
  | ClearMessageAction
  | SaveSettingsAction;
