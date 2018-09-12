import { Dataset } from "shared/sdk/models";
import { UpdateFilterAction, FILTER_UPDATE } from "./datasets.actions";
import { SearchIDCompleteAction, SEARCH_ID_COMPLETE } from "./datasets.actions";
import { DatablocksAction, DATABLOCKS } from "./datasets.actions";
import { DatablocksFailedAction, DATABLOCKS_FAILED } from "./datasets.actions";
import { CurrentSetAction, SELECT_CURRENT } from "./datasets.actions";
import { SelectDatasetAction, SELECT_DATASET } from "./datasets.actions";
import { DeselectDatasetAction, DESELECT_DATASET } from "./datasets.actions";
import { ClearSelectionAction, CLEAR_SELECTION } from "./datasets.actions";
import { ExportToCsvAction, EXPORT_TO_CSV } from "./datasets.actions";
import { SortByColumnAction, SORT_BY_COLUMN } from "./datasets.actions";
import { SetViewModeAction, SET_VIEW_MODE } from "./datasets.actions";

describe("UpdateFilterAction", () => {
  it("should create an action", () => {
    const payload = [{ id: 1 }];
    const action = new UpdateFilterAction(payload);
    expect({ ...action }).toEqual({ type: FILTER_UPDATE, payload });
  });
});

describe("SearchIDCompleteAction", () => {
  it("should create an action", () => {
    const dataset = new Dataset();
    const action = new SearchIDCompleteAction(dataset);
    expect({ ...action }).toEqual({ type: SEARCH_ID_COMPLETE, dataset });
  });
});

describe("DatablocksAction", () => {
  it("should create an action", () => {
    const id = "idstring";
    const action = new DatablocksAction(id);
    expect({ ...action }).toEqual({ type: DATABLOCKS, id });
  });
});

describe("DatablocksFailedAction", () => {
  it("should create an action", () => {
    const error = new Error();
    const action = new DatablocksFailedAction(error);
    expect({ ...action }).toEqual({ type: DATABLOCKS_FAILED, error });
  });
});

describe("CurrentSetAction", () => {
  it("should create an action", () => {
    const dataset = new Dataset();
    const action = new CurrentSetAction(dataset);
    expect({ ...action }).toEqual({ type: SELECT_CURRENT, dataset });
  });
});

describe("SelectDatasetAction", () => {
  it("should create an action", () => {
    const dataset = new Dataset();
    const action = new SelectDatasetAction(dataset);
    expect({ ...action }).toEqual({ type: SELECT_DATASET, dataset });
  });
});

describe("DeselectDatasetAction", () => {
  it("should create an action", () => {
    const dataset = new Dataset();
    const action = new DeselectDatasetAction(dataset);
    expect({ ...action }).toEqual({ type: DESELECT_DATASET, dataset });
  });
});

describe("ClearSelectionAction", () => {
  it("should create an action", () => {
    const action = new ClearSelectionAction();
    expect({ ...action }).toEqual({ type: CLEAR_SELECTION });
  });
});

describe("ExportToCsvAction", () => {
  it("should create an action", () => {
    const action = new ExportToCsvAction();
    expect({ ...action }).toEqual({ type: EXPORT_TO_CSV });
  });
});

describe("SortByColumnAction", () => {
  it("should create an action", () => {
    const column = "3";
    const direction = "1";
    const action = new SortByColumnAction(column, direction);
    expect({ ...action }).toEqual({ type: SORT_BY_COLUMN, column, direction });
  });
});

describe("SetViewModeAction", () => {
  it("should create an action", () => {
    const mode = "view";
    const action = new SetViewModeAction(mode);
    expect({ ...action }).toEqual({ type: SET_VIEW_MODE, mode });
  });
});
