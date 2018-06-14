import {Action} from '@ngrx/store';
import {Job} from 'shared/sdk/models';

export const SUBMIT =                  '[Jobs] Submit';
export const SUBMIT_COMPLETE =         '[Jobs] Submit Complete';

export const RETRIEVE =                '[Jobs] Retrieve';
export const RETRIEVE_COMPLETE =       '[Jobs] Retrieve Complete';

export const FAILED =                  '[Jobs] Action Failed';
export const UI_STORE =                '[Jobs] UI Store';
export const SELECT_CURRENT =          '[Jobs] Current set selected';
export const SORT_VALUE_UPDATE =       '[Jobs] Sort Update';
export const SORT_FAILED =             '[Jobs] Sort Failed';

export const CHILD_RETRIEVE =          '[Jobs] Child Retrieve';
export const CHILD_RETRIEVE_COMPLETE = '[Jobs] Child Retrieve Complete';

export const SEARCH_ID =               '[Jobs] Search ID';
export const SEARCH_ID_COMPLETE =      '[Jobs] Search ID Complete';
export const SEARCH_ID_FAILED =        '[Jobs] Search ID Failed';

export const SORT_UPDATE =             '[Jobs] Sort Update'; // Duplicate of SORT_VALUE_UPDATE?
export const SORT_UPDATE_COMPLETE =    '[Jobs] Sort Update Complete';

export class SubmitAction implements Action {
    readonly type = SUBMIT;
    constructor(public payload?: any) {}
}

export class SubmitCompleteAction implements Action {
    readonly type = SUBMIT_COMPLETE;
    constructor(public payload?: any) {}
}

export class FailedAction implements Action {
    readonly type = FAILED;
    constructor(public payload?: any) {}
}

export class RetrieveCompleteAction implements Action {
    readonly type = RETRIEVE_COMPLETE;
    constructor(public payload?: any) {}
}

export class ChildRetrieveAction implements Action {
    readonly type = CHILD_RETRIEVE;
    constructor(public payload?: any) {}
}

export class ChildRetrieveCompleteAction implements Action {
    readonly type = CHILD_RETRIEVE_COMPLETE;
    constructor(public payload?: any) {}
}

export class SearchIDAction implements Action {
    readonly type = SEARCH_ID;
    constructor(public payload: string) {}
}

export class SearchIDCompleteAction implements Action {
    readonly type = SEARCH_ID_COMPLETE;
    constructor(public payload: {}) {}
}

export class SearchIDFailedAction implements Action {
    readonly type = SEARCH_ID_FAILED;
    constructor(public payload: any) {}
}

export class CurrentJobAction implements Action {
    readonly type = SELECT_CURRENT;
    constructor(public payload: Job) {}
}

export class SortUpdateAction implements Action {
    readonly type = SORT_UPDATE;
    constructor(public payload: any) {}
}


export type Actions =
    SortUpdateAction |
    CurrentJobAction |
    SubmitAction |
    FailedAction |
    SubmitCompleteAction |
    SearchIDAction | SearchIDCompleteAction |
    SearchIDFailedAction |
    RetrieveCompleteAction;
