import {
  ACTION_TYPES,
  ActionConfig,
  isActionType,
  normalizeEnabled,
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

  describe("normalizeEnabled", () => {
    const never = { conditions: [{ condition: "false" }] };

    it("turns a string into a single condition", () => {
      expect(normalizeEnabled({ enabled: "@a > 0" })).toEqual({
        conditions: [{ condition: "@a > 0" }],
      });
    });

    it("keeps the conditions form as is", () => {
      const enabled = {
        conditions: [{ condition: "@a", disabledTooltip: "No a" }],
        enabledTooltip: "May fail",
      };
      expect(normalizeEnabled({ enabled })).toBe(enabled);
    });

    it("turns booleans and missing values into no or a false condition", () => {
      expect(normalizeEnabled({})).toEqual({ conditions: [] });
      expect(normalizeEnabled({ enabled: "" })).toEqual({ conditions: [] });
      expect(normalizeEnabled({ enabled: true })).toEqual({ conditions: [] });
      expect(normalizeEnabled({ enabled: false })).toEqual(never);
    });

    it("covers disabled with the previous precedence", () => {
      expect(normalizeEnabled({ enabled: "@a", disabled: true })).toEqual(
        never,
      );
      expect(normalizeEnabled({ enabled: false, disabled: false })).toEqual({
        conditions: [],
      });
      expect(normalizeEnabled({ enabled: "@a", disabled: "@b" })).toEqual({
        conditions: [{ condition: "@a" }],
      });
      expect(normalizeEnabled({ disabled: "@b" })).toEqual({
        conditions: [{ condition: "!(@b)" }],
      });
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

    it("does not warn for valid enabled conditions", () => {
      validateActionConfigs(
        [
          {
            ...baseAction,
            enabled: {
              conditions: [
                { condition: "true", disabledTooltip: "Not now" },
                { condition: "true" },
              ],
              enabledTooltip: "May fail",
            },
          },
        ],
        "batchActions",
      );
      expect(warnSpy).not.toHaveBeenCalled();
    });

    it("warns when enabled conditions are malformed", () => {
      validateActionConfigs(
        [
          {
            ...baseAction,
            enabled: [{ condition: "true" }],
          } as unknown as ActionConfig,
          {
            ...baseAction,
            enabled: { conditions: [{ when: "true" }] },
          } as unknown as ActionConfig,
          {
            ...baseAction,
            enabled: { conditions: [], enabledTooltip: 1 },
          } as unknown as ActionConfig,
        ],
        "batchActions",
      );
      expect(warnSpy).toHaveBeenCalledTimes(3);
      expect(warnSpy).toHaveBeenCalledWith(
        jasmine.stringContaining("invalid enabled conditions"),
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
