import { Action } from '@ngrx/store';
import { DatasetFilters } from 'datasets/datasets-filter/dataset-filters';
import { AccessGroup, RawDataset } from 'shared/sdk/models';

export const SEARCH_COMPLETE =           '[Dataset] Search Complete';
export const SEARCH_FAILED =             '[Dataset] Search Failed';

export const SEARCH_ID =                 '[Dataset] Search ID';
export const SEARCH_ID_COMPLETE =        '[Dataset] Search ID Complete';
export const SEARCH_ID_FAILED =          '[Dataset] Search ID Failed';

export const FILTER_UPDATE =             '[Dataset] Filter Update';
export const FILTER_UPDATE_COMPLETE =    '[Dataset] Filter Update Complete';
export const FILTER_VALUE_UPDATE =       '[Dataset] Filter Update';
export const FILTER_FAILED =             '[Dataset] Filter Failed';

export const DATABLOCKS =                '[Dataset] Datablocks Update';
export const DATABLOCKS_COMPLETE =       '[Dataset] Datablocks Update Complete';
export const DATABLOCKS_FAILED =         '[Dataset] Datablocks Failed';

export const DATABLOCK_DELETE =          '[Dataset] Datablock Delete';
export const DATABLOCK_DELETE_COMPLETE = '[Dataset] Datablock Delete Complete';
export const DATABLOCK_DELETE_FAILED =   '[Dataset] Datablock Delete Failed';

export const ADD_GROUPS =                '[User] Add Groups';
export const ADD_GROUPS_COMPLETE =       '[User] Add Groups Complete';
export const ADD_GROUPS_FAILED =         '[User] Add Groups Failed';

export const RESET_STATUS =              '[Dataset] Status Reset';
export const RESET_STATUS_COMPLETE =     '[Dataset] Status Reset Complete';

export const SELECT_CURRENT =            '[Dataset] Current set selected';
export const SELECTED_UPDATE =           '[Dataset] Selected Datasets Update';
export const COUNT_COMPLETE =            '[Dataset] Complete';
export const LOAD =                      '[Dataset] Load';
export const TOTAL_UPDATE =              '[Dataset] Total Datasets Update';

export class SearchCompleteAction implements Action {
    readonly type = SEARCH_COMPLETE;
    constructor(public payload: {}[]) {}
}

export class SearchFailedAction implements Action {
    readonly type = SEARCH_FAILED;
    constructor(public payload: any) {}
}

export class UpdateFilterAction implements Action {
    readonly type = FILTER_UPDATE;
    constructor(public payload: any) {}
}

export class UpdateFilterCompleteAction implements Action {
    readonly type = FILTER_UPDATE_COMPLETE;
    constructor(public payload: any) {}
}

export class FilterFailedAction implements Action {
    readonly type = FILTER_FAILED;
    constructor(public payload: any) {}
}

export class FilterValueAction implements Action {
    readonly type = FILTER_VALUE_UPDATE;
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

export class DatablocksAction implements Action {
    readonly type = DATABLOCKS;
    constructor(public payload: string) {}
}

export class DatablocksCompleteAction implements Action {
    readonly type = DATABLOCKS_COMPLETE;
    constructor() {}
}

export class DatablocksFailedAction implements Action {
    readonly type = DATABLOCKS_FAILED;
    constructor(public payload: any) {}
}

export class DatablockDeleteAction implements Action {
    readonly type = DATABLOCK_DELETE;  
    constructor(public payload: Datablock) {}
}

export class DatablockDeleteCompleteAction implements Action {
    readonly type = DATABLOCK_DELETE_COMPLETE;
    constructor() {}
}

export class DatablockDeleteFailedAction implements Action {
    readonly type = DATABLOCK_DELETE_FAILED;
    constructor() {}
}

export class AddGroupsAction implements Action {
    readonly type = ADD_GROUPS;
    constructor(public payload: string) {}
}

export class AddGroupsCompleteAction implements Action {
    readonly type = ADD_GROUPS_COMPLETE;
    constructor(public payload: AccessGroup[]) {}
}

export class AddGroupsFailedAction implements Action {
    readonly type = ADD_GROUPS_FAILED;
    constructor(public payload: any) {}
}

export class UpdateSelectedAction implements Action {
    readonly type = SELECTED_UPDATE;
    constructor(public payload: any) {}
}

export class CurrentSetAction implements Action {
    readonly type = SELECT_CURRENT;
    constructor(public payload: RawDataset) {}
}

export class ResetStatusAction implements Action {
    readonly type = RESET_STATUS;
    constructor(public payload: any) {}
}

export class ResetStatusCompleteAction implements Action {
    readonly type = RESET_STATUS_COMPLETE;
    constructor(public payload: any) {}
}

export class TotalSetsAction implements Action {
    readonly type = TOTAL_UPDATE;
    constructor(public payload: number) {}
}

export type Actions =
        SearchCompleteAction | SearchFailedAction |
        UpdateFilterAction | UpdateFilterCompleteAction | FilterFailedAction |
        FilterValueAction | SearchIDAction | SearchIDCompleteAction |
        SearchIDFailedAction | DatablocksAction | DatablocksCompleteAction |
        DatablockDeleteAction | DatablockDeleteCompleteAction | DatablockDeleteFailedAction |
        DatablocksAction | AddGroupsAction | AddGroupsCompleteAction |
        AddGroupsFailedAction | UpdateSelectedAction | TotalSetsAction | ResetStatusAction | ResetStatusCompleteAction;
