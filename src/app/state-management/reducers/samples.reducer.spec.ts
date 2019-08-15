import { samplesReducer } from "./samples.reducer";
import { initialSampleState } from "../state/samples.store";
import { SelectSampleAction } from "../actions/samples.actions";

describe("SamplesReducer", () => {
  it("should set sample id", () => {
    const id = "my sample id";
    const action = new SelectSampleAction(id);
    const state = samplesReducer(initialSampleState, action);
    expect(state.selectedId).toEqual(id);
  });
});
