import { Action } from "@ngrx/store";
import { DatasetFilters, ViewMode, ScientificCondition } from "state-management/models";
import { Dataset} from "shared/sdk/models";
import { FacetCounts } from "../state/datasets.store";

export const SEARCH_FAILED =                "[Dataset] Search Failed";

export const SEARCH_ID =                    "[Dataset] Search ID";
export const SEARCH_ID_COMPLETE =           "[Dataset] Search ID Complete";
export const SEARCH_ID_FAILED =             "[Dataset] Search ID Failed";

export const FILTER_UPDATE =                "[Dataset] Filter Update";
export const FILTER_VALUE_UPDATE =          "[Dataset] Filter Update";
export const FILTER_FAILED =                "[Dataset] Filter Failed";

export const DATABLOCKS =                   "[Dataset] Datablocks Update";
export const DATABLOCKS_COMPLETE =          "[Dataset] Datablocks Update Complete";
export const DATABLOCKS_FAILED =            "[Dataset] Datablocks Failed";

export const DATABLOCK_DELETE =             "[Dataset] Datablock Delete";
export const DATABLOCK_DELETE_COMPLETE =    "[Dataset] Datablock Delete Complete";
export const DATABLOCK_DELETE_FAILED =      "[Dataset] Datablock Delete Failed";

export const ADD_GROUPS =                   "[User] Add Groups";
export const ADD_GROUPS_FAILED =            "[User] Add Groups Failed";

export const RESET_STATUS =                 "[Dataset] Status Reset";
export const RESET_STATUS_COMPLETE =        "[Dataset] Status Reset Complete";

export const LOAD =                         "[Dataset] Load";
export const COUNT_COMPLETE =               "[Dataset] Complete";
export const SELECT_CURRENT =               "[Dataset] Current set selected";
export const CURRENT_BLOCKS_COMPLETE =      "[Dataset] Current set datablocks update complete";
export const TOTAL_UPDATE =                 "[Dataset] Total Datasets Update";
// export const FILTER_UPDATE_COMPLETE = "[Dataset]  Filter Update Complete";

export const SELECT_DATASET =               "[Dataset] Select Dataset";
export const DESELECT_DATASET =             "[Dataset] Deselect Dataset";

export const SELECT_ALL_DATASETS =          "[Dataset] Select all Datasets";
export const CLEAR_SELECTION =              "[Dataset] Clear Selection";

export const EXPORT_TO_CSV =                "[Dataset] Export to CSV";
export const SET_VIEW_MODE =                "[Dataset] Set View Mode";

export const FETCH_DATASETS =               "[Dataset] Fetch Datasets";
export const FETCH_DATASETS_COMPLETE =      "[Dataset] Fetch Datasets Complete";
export const FETCH_DATASETS_FAILED =        "[Dataset] Fetch Datasets Failed";

export const SAVE_DATASET =                 "[Dataset] Save Dataset";
export const SAVE_DATASET_COMPLETE =        "[Dataset] Save Dataset Complete";
export const SAVE_DATASET_FAILED =          "[Dataset] Save Dataset Failed";

export const FETCH_FACET_COUNTS =           "[Dataset] Fetch Facet Counts";
export const FETCH_FACET_COUNTS_COMPLETE =  "[Dataset] Fetch Facet Counts Complete";
export const FETCH_FACET_COUNTS_FAILED =    "[Dataset] Fetch Facet Counts Failed";

export const CHANGE_PAGE =                  "[Dataset] Change Page";
export const SORT_BY_COLUMN =               "[Dataset] Sort by Column";
export const SET_SEARCH_TERMS =             "[Dataset] Set Search Terms";

export const ADD_LOCATION_FILTER =          "[Dataset] Add Location Filter";
export const REMOVE_LOCATION_FILTER =       "[Dataset] Remove Location Filter";

export const ADD_GROUP_FILTER =             "[Dataset] Add Group Filter";
export const REMOVE_GROUP_FILTER =          "[Dataset] Remove Group Filter";

export const ADD_KEYWORD_FILTER =           "[Dataset] Add Keyword Filter";
export const REMOVE_KEYWORD_FILTER =        "[Dataset] Remove Keyword Filter";

export const ADD_TYPE_FILTER =              "[Dataset] Add Type Filter";
export const REMOVE_TYPE_FILTER =           "[Dataset] Remove Type Filter";

export const SET_TEXT_FILTER =              "[Dataset] Set Text Filter";
export const SET_DATE_RANGE =               "[Dataset] Set Date Range Filter";

export const PREFILL_FILTERS =              "[Dataset] Prefill Filter";
export const CLEAR_FACETS =                 "[Dataset] Clear Facets";

export const ADD_TO_BATCH =                 "[Dataset] Add to Batch";
export const REMOVE_FROM_BATCH =            "[Dataset] Remove from Batch";
export const CLEAR_BATCH =                  "[Dataset] Clear Batch";

export const PREFILL_BATCH =                "[Dataset] Prefill Batch";
export const PREFILL_BATCH_COMPLETE =       "[Dataset] Prefill Batch Complete";

export const ADD_SCIENTIFIC_CONDITION =     "[Dataset] Add Scientific Condition";
export const REMOVE_SCIENTIFIC_CONDITION =  "[Dataset] Remove Scientific Condition";

export class UpdateFilterAction implements Action { // Inte gjord då den eventuellt ska tas bort
    readonly type = FILTER_UPDATE;
    constructor(public payload: {}) {}
}

export class SearchIDCompleteAction implements Action {
    readonly type = SEARCH_ID_COMPLETE;
    constructor(readonly dataset: Dataset) {}
}

export class DatablocksAction implements Action {
    readonly type = DATABLOCKS;
    constructor(readonly id: string) {}
}

export class DatablocksFailedAction implements Action {
    readonly type = DATABLOCKS_FAILED;
    constructor(readonly error: Error) {}
}

export class CurrentSetAction implements Action {
    readonly type = SELECT_CURRENT;
    constructor(readonly dataset: Dataset) {}
}

export class SelectDatasetAction implements Action {
    readonly type = SELECT_DATASET;
    constructor(readonly dataset: Dataset) {}
}

export class DeselectDatasetAction implements Action {
    readonly type = DESELECT_DATASET;
    constructor(readonly dataset: Dataset) {}
}

export class SelectAllDatasetsAction implements Action {
    readonly type = SELECT_ALL_DATASETS;
}

export class ClearSelectionAction implements Action {
    readonly type = CLEAR_SELECTION;
}

export class ExportToCsvAction implements Action {
    readonly type = EXPORT_TO_CSV;
}

export class ChangePageAction implements Action {
    readonly type = CHANGE_PAGE;
    constructor(readonly page: number, readonly limit: number) {}
}

export class SortByColumnAction implements Action {
    readonly type = SORT_BY_COLUMN;
    constructor(readonly column: string, readonly direction: string) {}
}

export class SetViewModeAction implements Action {
    readonly type = SET_VIEW_MODE;
    constructor(readonly mode: ViewMode) {}
}

export class SetSearchTermsAction implements Action {
    readonly type = SET_SEARCH_TERMS;
    constructor(readonly terms: string) {}
}

export class AddLocationFilterAction implements Action {
    readonly type = ADD_LOCATION_FILTER;
    constructor(readonly location: string) {}
}

export class RemoveLocationFilterAction implements Action {
    readonly type = REMOVE_LOCATION_FILTER;
    constructor(readonly location: string) {}
}

export class AddGroupFilterAction implements Action {
    readonly type = ADD_GROUP_FILTER;
    constructor(readonly group: string) {}
}

export class RemoveGroupFilterAction implements Action {
    readonly type = REMOVE_GROUP_FILTER;
    constructor(readonly group: string) {}
}

export class AddKeywordFilterAction implements Action {
    readonly type = ADD_KEYWORD_FILTER;
    constructor(readonly keyword: string) {}
}

export class RemoveKeywordFilterAction implements Action {
    readonly type = REMOVE_KEYWORD_FILTER;
    constructor(readonly keyword: string) {}
}

export class AddTypeFilterAction implements Action {
    readonly type = ADD_TYPE_FILTER;
    constructor(readonly datasetType: string) {}
}

export class RemoveTypeFilterAction implements Action {
    readonly type = REMOVE_TYPE_FILTER;
    constructor(readonly datasetType: string) {}
}

export class SetTextFilterAction implements Action {
    readonly type = SET_TEXT_FILTER;
    constructor(readonly text: string) {}
}

export class SetDateRangeFilterAction implements Action {
    readonly type = SET_DATE_RANGE;
    constructor(readonly begin: string, readonly end: string) {}
}

export class PrefillFiltersAction implements Action {
    readonly type = PREFILL_FILTERS;
    constructor(readonly values: Partial<DatasetFilters>) {}
}

export class ClearFacetsAction implements Action {
    readonly type = CLEAR_FACETS;
}

export class FetchDatasetsAction implements Action {
    readonly type = FETCH_DATASETS;
}

export class FetchDatasetsCompleteAction implements Action {
    readonly type = FETCH_DATASETS_COMPLETE;
    constructor(readonly datasets: Dataset[]) {}
}

export class FetchDatasetsFailedAction implements Action {
    readonly type = FETCH_DATASETS_FAILED;
}

export class SaveDatasetAction implements Action {
    readonly type = SAVE_DATASET;
    constructor(readonly dataset: Dataset) {}
}

export class SaveDatasetCompleteAction implements Action {
    readonly type = SAVE_DATASET_COMPLETE;
    constructor(readonly datasets: Dataset[]) {}
}

export class SaveDatasetFailedAction implements Action {
    readonly type = SAVE_DATASET_FAILED;
}

export class FetchFacetCountsAction implements Action {
    readonly type = FETCH_FACET_COUNTS;
}

export class FetchFacetCountsCompleteAction implements Action {
    readonly type = FETCH_FACET_COUNTS_COMPLETE;
    constructor(readonly facetCounts: FacetCounts, readonly allCounts: number) {}
}
export class FetchFacetCountsFailedAction implements Action {
    readonly type = FETCH_FACET_COUNTS_FAILED;
}

export class AddToBatchAction implements Action {
    readonly type = ADD_TO_BATCH;
}

export class RemoveFromBatchAction implements Action {
    readonly type = REMOVE_FROM_BATCH;
    constructor(readonly dataset: Dataset) {}
}

export class ClearBatchAction implements Action {
    readonly type = CLEAR_BATCH;
}

export class PrefillBatchAction implements Action {
    readonly type = PREFILL_BATCH;
}

export class PrefillBatchCompleteAction implements Action {
    readonly type = PREFILL_BATCH_COMPLETE;
    constructor(readonly batch: Dataset[]) {}
}

export class AddScientificConditionAction implements Action {
    readonly type = ADD_SCIENTIFIC_CONDITION;
    constructor(readonly condition: ScientificCondition) {}
}

export class RemoveScientificConditionAction implements Action {
    readonly type = REMOVE_SCIENTIFIC_CONDITION;
    constructor(readonly index: number) {}
}

export type Actions =
    UpdateFilterAction |
    SearchIDCompleteAction |
    DatablocksAction |
    DatablocksAction |
    SaveDatasetFailedAction |
    SaveDatasetAction |
    SaveDatasetCompleteAction |
    SelectDatasetAction | DeselectDatasetAction | SelectAllDatasetsAction |
    ExportToCsvAction | ChangePageAction | SortByColumnAction | SetViewModeAction |
    SetSearchTermsAction | ClearFacetsAction |
    AddToBatchAction |
    AddScientificConditionAction | RemoveScientificConditionAction;
