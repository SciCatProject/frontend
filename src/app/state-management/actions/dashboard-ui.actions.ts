import { Action } from '@ngrx/store';

export const SAVE =      '[DashboardUI] Save';
export const RESTORE =   '[DashboardUI] Restore';
export const SAVE_MODE = '[Dashboard] Save Mode';

export class SaveAction implements Action {
    readonly type = SAVE;
    constructor(public payload?: any) {}
}

export class SaveModeAction implements Action {
    readonly type = SAVE_MODE;
    constructor(public payload: string) {}
}

export class RestoreAction implements Action {
    readonly type = RESTORE;
}

export type Actions = SaveAction | SaveModeAction | RestoreAction;
