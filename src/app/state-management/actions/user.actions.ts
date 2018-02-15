import { Action } from '@ngrx/store';
import { MessageType, User, AccessGroup } from '../models';

export const LOGIN =                      '[User] Login';
export const LOGIN_COMPLETE =             '[User] Login Complete';
export const LOGIN_FAILED =               '[User] Login Failed';

export const LOGOUT =                     '[User] Logout';
export const LOGOUT_COMPLETE =            '[User] Logout Complete';

export const AD_LOGIN =                   '[User] Active Directory Login';
export const AD_LOGIN_COMPLETE =          '[User] Active Directory Login Complete';

export const RETRIEVE_USER =              '[User] Retrieve User';
export const RETRIEVE_USER_COMPLETE =     '[User] Retrieve User Complete';
export const RETRIEVE_USER_FAILED =       '[User] Retrieve User Failed';

export const ADD_GROUPS =                 '[User] Add Groups';
export const ADD_GROUPS_COMPLETE =        '[User] Add Groups Complete';
export const ADD_GROUPS_FAILED =          '[User] Add Groups Failed';

export const ACCESS_USER_EMAIL =          '[User] Access User Email';
export const ACCESS_USER_EMAIL_COMPLETE = '[User] Access User Email Complete';
export const ACCESS_USER_EMAIL_FAILED =   '[User] Access User Email Failed';

export const SHOW_MESSAGE =               '[User] Message Show';
export const CLEAR_MESSAGE =              '[User] Message Clear';
export const SAVE_SETTINGS =              '[User] Settings Save';

export class LoginAction implements Action {
    readonly type = LOGIN;
    constructor(public payload: {username: string, password: string, rememberMe: boolean}) {}
}

export class ActiveDirLoginAction implements Action {
    readonly type = AD_LOGIN;
    constructor(public payload: any) {}
}

export class ActiveDirLoginCompleteAction implements Action {
    readonly type = AD_LOGIN_COMPLETE;
    constructor(public payload: any) {}
}

export class LoginCompleteAction implements Action {
    readonly type = LOGIN_COMPLETE;
    constructor(public payload: any) {}
}

export class LoginFailedAction implements Action {
    readonly type = LOGIN_FAILED;
    constructor(public payload?: any) {}
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
    constructor(public payload?: any) {}
}

export class RetrieveUserFailedAction implements Action {
    readonly type = RETRIEVE_USER_FAILED;
    constructor(public payload?: any) {}
}

export class AddGroupsAction implements Action {
    readonly type = ADD_GROUPS;
    constructor(public payload: User) {}
}

export class AddGroupsCompleteAction implements Action {
    readonly type = ADD_GROUPS_COMPLETE;
    constructor(public payload: AccessGroup[]) {}
}

export class AddGroupsFailedAction implements Action {
    readonly type = ADD_GROUPS_FAILED;
    constructor(public payload: any) {}
}

export class AccessUserEmailAction implements Action {
    readonly type = ACCESS_USER_EMAIL;
    constructor(public payload: string) {}
}

export class AccessUserEmailCompleteAction implements Action {
    readonly type = ACCESS_USER_EMAIL_COMPLETE;
    constructor(public payload: string) {}
}

export class AccessUserEmailFailedAction implements Action {
    readonly type = ACCESS_USER_EMAIL_FAILED;
    constructor(public payload?: {}) {}
}

export class ShowMessageAction implements Action {
    readonly type = SHOW_MESSAGE;
    constructor(public payload: {content: string, type: MessageType, title?: string, timeout?: number, class?: string}) {
        this.payload = {title: '', timeout: 0, class: '', ...payload};
    }
}

export class ClearMessageAction implements Action {
    readonly type = CLEAR_MESSAGE;
}

export class SaveSettingsAction implements Action {
    readonly type = SAVE_SETTINGS;
    constructor(public payload: {}) {}
}

export type Actions = 
    LoginAction | LogoutCompleteAction | LoginFailedAction |
    LogoutAction | LogoutCompleteAction |
    RetrieveUserAction | RetrieveUserCompleteAction | RetrieveUserFailedAction |
    ActiveDirLoginAction | ActiveDirLoginCompleteAction |
    AccessUserEmailAction | AccessUserEmailCompleteAction | AccessUserEmailFailedAction |
    ShowMessageAction |
    ClearMessageAction |
    SaveSettingsAction;
    // AddGroupsAction | AddGroupsCompleteAction | AddGroupsFailedAction
