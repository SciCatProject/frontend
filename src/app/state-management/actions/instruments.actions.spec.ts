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

  describe("fetchCountAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCountAction();

      expect({ ...action }).toEqual({
        type: "[Instrument] Fetch Count"
      });
    });
  });

  describe("fetchCountCompleteAction", () => {
    it("should create an action", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });

      expect({ ...action }).toEqual({
        type: "[Instrument] Fetch Count Complete",
        count
      });
    });
  });

  describe("fetchCountFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCountFailedAction();

      expect({ ...action }).toEqual({
        type: "[Instrument] Fetch Count Failed"
      });
    });
  });
});
