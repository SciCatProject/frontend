import {
  ACTION_TYPES,
  ActionConfig,
  isActionType,
  validateActionConfigs,
  validateAllActionConfigsIn,
} from "./configurable-action.interfaces";

describe("configurable-action.interfaces", () => {
  describe("isActionType", () => {
    it("returns true for every value in ACTION_TYPES", () => {
      ACTION_TYPES.forEach((type) => {
        expect(isActionType(type)).toBeTrue();
      });
    });

    it("returns false for unknown values", () => {
      expect(isActionType("not-a-real-type")).toBeFalse();
      expect(isActionType(undefined)).toBeFalse();
    });
  });

  describe("validateActionConfigs", () => {
    let warnSpy: jasmine.Spy;

    beforeEach(() => {
      warnSpy = spyOn(console, "warn");
    });

    const baseAction: ActionConfig = {
      id: "test-action",
      order: 0,
      label: "Test",
      url: "https://example.com",
      authorization: [],
    };

    it("does not warn for valid type/onSuccess values", () => {
      validateActionConfigs(
        [{ ...baseAction, type: "form", onSuccess: "xhr" }],
        "datasetActions",
      );
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it("warns when type is not a known ActionType", () => {
      validateActionConfigs(
        [{ ...baseAction, type: "unsupported" as ActionConfig["type"] }],
        "datasetActions",
      );
      expect(warnSpy).toHaveBeenCalledWith(
        jasmine.stringMatching(/unknown type "unsupported"/),
      );
    });

    it("warns when onSuccess is not a known ActionType", () => {
      validateActionConfigs(
        [
          {
            ...baseAction,
            onSuccess: "unsupported" as ActionConfig["onSuccess"],
          },
        ],
        "datasetActions",
      );
      expect(warnSpy).toHaveBeenCalledWith(
        jasmine.stringMatching(/unknown onSuccess type "unsupported"/),
      );
    });

    it("does nothing when actions is undefined", () => {
      validateActionConfigs(undefined, "datasetActions");
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });

  describe("validateAllActionConfigsIn", () => {
    let warnSpy: jasmine.Spy;

    beforeEach(() => {
      warnSpy = spyOn(console, "warn");
    });

    const baseAction: ActionConfig = {
      id: "test-action",
      order: 0,
      label: "Test",
      url: "https://example.com",
      authorization: [],
    };

    it("discovers and validates an ActionConfig[] under any key, without it being named explicitly", () => {
      validateAllActionConfigsIn({
        someBrandNewActions: [
          { ...baseAction, type: "unsupported" as ActionConfig["type"] },
        ],
      });
      expect(warnSpy).toHaveBeenCalledWith(
        jasmine.stringMatching(
          /someBrandNewActions: action "test-action" has unknown type/,
        ),
      );
    });

    it("ignores arrays that are not ActionConfig[]", () => {
      validateAllActionConfigsIn({
        datasetPageSizeOptions: [5, 10, 25],
        oAuth2Endpoints: [{ authURL: "x", displayText: "y" }],
        emptyActions: [],
      });
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it("ignores non-array and primitive config values", () => {
      validateAllActionConfigsIn({
        siteTitle: "SciCat",
        datasetActionsEnabled: true,
        helpSettings: { enabled: true },
      });
      expect(warnSpy).not.toHaveBeenCalled();
    });
  });
});
