import { samplesReducer } from "./samples.reducer";
import { initialSampleState } from "../state/samples.store";
import { SelectSampleAction } from "../actions/samples.actions";

describe("ProposalsReducer", () => {
  it("should set proposal id", () => {
    const id = "my proposal id";
    const action = new SelectSampleAction(id);
    const state = samplesReducer(initialSampleState, action);
    expect(state.selectedId).toEqual(id);
  });
});
