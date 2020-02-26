import * as fromActions from "./instruments.actions";
import { Instrument } from "shared/sdk";

describe("Instrument Actions", () => {
  describe("fetchInstrumentsAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchInstrumentsAction();

      expect({ ...action }).toEqual({ type: "[Instrument] Fetch Instruments" });
    });
  });

  describe("fetchInstrumentsCompleteAction", () => {
    it("should create an action", () => {
      const instruments = [new Instrument()];
      const action = fromActions.fetchInstrumentsCompleteAction({
        instruments
      });

      expect({ ...action }).toEqual({
        type: "[Instrument] Fetch Instruments Complete",
        instruments
      });
    });
  });

  describe("fetchInstrumentsFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchInstrumentsFailedAction();

      expect({ ...action }).toEqual({
        type: "[Instrument] Fetch Instruments Failed"
      });
    });
  });
});
