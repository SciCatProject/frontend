import { proposalsReducer } from "./proposals.reducer";
import { initialProposalsState } from "../state/proposals.store";
import * as proposalsActions from "../actions/proposals.actions";
import { Dataset, DatasetInterface } from "../models";

describe("ProposalsReducer", () => {
  it("should set proposal id", () => {
    const id = "my proposal id";
    const action = new proposalsActions.SelectProposalAction(id);
    const state = proposalsReducer(initialProposalsState, action);
    expect(state.selectedId).toEqual(id);
  });

  it("should have the correct number of datasets after fetch datasets complete", () => {
    const data: DatasetInterface = {
      owner: "",
      contactEmail: "",
      sourceFolder: "",
      creationTime: new Date(),
      type: "",
      ownerGroup: ""
    };

    const datasets = [
      new Dataset({ pid: "pid 1", ...data }),
      new Dataset({ pid: "pid 2", ...data }),
      new Dataset({ pid: "pid 3", ...data })
    ];

    const action = new proposalsActions.FetchDatasetsForProposalCompleteAction(
      datasets
    );
    const state = proposalsReducer(initialProposalsState, action);
    const ids = Object.keys(state.datasets);
    expect(ids.length).toEqual(3);
  });

  it("should set hasFetched to true after fetch proposals complete", () => {
    const action = new proposalsActions.FetchProposalsCompleteAction([]);
    const state = proposalsReducer(initialProposalsState, action);
    expect(state.hasFetched).toEqual(true);
  });
});
