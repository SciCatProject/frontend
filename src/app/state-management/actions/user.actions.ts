import { Action } from '@ngrx/store';
import { Message, MessageType, User, AccessGroup, Settings } from '../models';

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
    constructor(public form: {username: string, password: string, rememberMe: boolean}) {}
}

export class ActiveDirLoginAction implements Action {
    readonly type = AD_LOGIN;
    constructor(public form: {username:string, password:string, rememberMe:boolean}) {}
}


export class LoginCompleteAction implements Action {
    readonly type = LOGIN_COMPLETE;
    constructor(public payload: {username:User, id:string, rememberMe:boolean, accountType?: string}) {}
}

export class LoginFailedAction implements Action {
    readonly type = LOGIN_FAILED;
    constructor(readonly message: string, readonly errSrc: string ) {}
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

export class AccessUserEmailAction implements Action {
    readonly type = ACCESS_USER_EMAIL;
    constructor(readonly userId: string) {}
}

export class AccessUserEmailCompleteAction implements Action {
    readonly type = ACCESS_USER_EMAIL_COMPLETE;
    constructor(readonly email: string) {}
}

export class AccessUserEmailFailedAction implements Action {
    readonly type = ACCESS_USER_EMAIL_FAILED;
    constructor(readonly error: Error) {}
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
    LoginAction | LogoutCompleteAction | LoginFailedAction |
    LogoutAction | LogoutCompleteAction |
    RetrieveUserAction | RetrieveUserCompleteAction | RetrieveUserFailedAction |
    ActiveDirLoginAction | 
    AccessUserEmailAction | AccessUserEmailCompleteAction | AccessUserEmailFailedAction |
    ShowMessageAction |
    ClearMessageAction |
    SaveSettingsAction;
    // AddGroupsAction
