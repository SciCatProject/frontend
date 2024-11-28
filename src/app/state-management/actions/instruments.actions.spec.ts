import { mockInstrument as instrument } from "shared/MockStubs";
import * as fromActions from "./instruments.actions";

describe("Instrument Actions", () => {
  const instruments = [instrument];

  describe("fetchInstrumentsAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchInstrumentsAction();

      expect({ ...action }).toEqual({ type: "[Instrument] Fetch Instruments" });
    });
  });

  describe("fetchInstrumentsCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchInstrumentsCompleteAction({
        instruments,
      });

      expect({ ...action }).toEqual({
        type: "[Instrument] Fetch Instruments Complete",
        instruments,
      });
    });
  });

  describe("fetchInstrumentsFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchInstrumentsFailedAction();

      expect({ ...action }).toEqual({
        type: "[Instrument] Fetch Instruments Failed",
      });
    });
  });

  describe("fetchCountAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCountAction();

      expect({ ...action }).toEqual({
        type: "[Instrument] Fetch Count",
      });
    });
  });

  describe("fetchCountCompleteAction", () => {
    it("should create an action", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });

      expect({ ...action }).toEqual({
        type: "[Instrument] Fetch Count Complete",
        count,
      });
    });
  });

  describe("fetchCountFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCountFailedAction();

      expect({ ...action }).toEqual({
        type: "[Instrument] Fetch Count Failed",
      });
    });
  });

  describe("fetchInstrumentAction", () => {
    it("should create an action", () => {
      const pid = "testPid";
      const action = fromActions.fetchInstrumentAction({ pid });

      expect({ ...action }).toEqual({
        type: "[Instrument] Fetch Instrument",
        pid,
      });
    });
  });

  describe("fetchInstrumentCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchInstrumentCompleteAction({
        instrument,
      });

      expect({ ...action }).toEqual({
        type: "[Instrument] Fetch Instrument Complete",
        instrument,
      });
    });
  });

  describe("fetchInstrumentFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchInstrumentFailedAction();

      expect({ ...action }).toEqual({
        type: "[Instrument] Fetch Instrument Failed",
      });
    });
  });

  describe("saveCustomMetadataAction", () => {
    it("should create an action", () => {
      const pid = "testPid";
      const customMetadata = {};
      const action = fromActions.saveCustomMetadataAction({
        pid,
        customMetadata,
      });
      expect({ ...action }).toEqual({
        type: "[Instrument] Save Custom Metadata",
        pid,
        customMetadata,
      });
    });
  });

  describe("saveCustomMetadataCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.saveCustomMetadataCompleteAction({
        instrument,
      });
      expect({ ...action }).toEqual({
        type: "[Instrument] Save Custom Metadata Complete",
        instrument,
      });
    });
  });

  describe("saveCustomMetadataFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.saveCustomMetadataFailedAction();
      expect({ ...action }).toEqual({
        type: "[Instrument] Save Custom Metadata Failed",
      });
    });
  });

  describe("changePageAction", () => {
    it("should create an action", () => {
      const page = 0;
      const limit = 25;
      const action = fromActions.changePageAction({ page, limit });

      expect({ ...action }).toEqual({
        type: "[Instrument] Change Page",
        page,
        limit,
      });
    });
  });

  describe("changePageAction", () => {
    it("should create an action", () => {
      const column = "test";
      const direction = "desc";
      const action = fromActions.sortByColumnAction({ column, direction });

      expect({ ...action }).toEqual({
        type: "[Instrument] Sort By Column",
        column,
        direction,
      });
    });
  });

  describe("clearInstrumentsStateAction", () => {
    it("should create an action", () => {
      const action = fromActions.clearInstrumentsStateAction();

      expect({ ...action }).toEqual({ type: "[Instrument] Clear State" });
    });
  });
});
