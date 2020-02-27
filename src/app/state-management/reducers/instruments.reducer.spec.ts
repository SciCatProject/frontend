import * as fromActions from "state-management/actions/instruments.actions";
import { Instrument } from "shared/sdk";
import { instrumentsReducer } from "./instruments.reducer";
import { initialInstrumentState } from "state-management/state/instruments.store";

describe("InstrumentsReducer", () => {
  describe("on fetchInstrumentsCompleteAction", () => {
    it("should set instruments property", () => {
      const instruments = [new Instrument()];
      const action = fromActions.fetchInstrumentsCompleteAction({
        instruments
      });
      const state = instrumentsReducer(initialInstrumentState, action);

      expect(state.instruments).toEqual(instruments);
    });
  });

  describe("on fetchCountCompleteAction", () => {
    it("should set totalCount property", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });
      const state = instrumentsReducer(initialInstrumentState, action);

      expect(state.totalCount).toEqual(count);
    });
  });
});
