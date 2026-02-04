import * as fromSelectors from "./runtime-config.selectors";
import {
  initialRuntimeConfigState,
  RuntimeConfigState,
} from "state-management/state/runtimeConfig.store";

describe("selectConfig", () => {
  it("should return config object", () => {
    const state: RuntimeConfigState = {
      config: { siteTitle: "SciCat" },
    };

    expect(fromSelectors.selectConfig.projector(state)).toEqual({
      siteTitle: "SciCat",
    });
  });

  it("should return empty object for initial state", () => {
    expect(
      fromSelectors.selectConfig.projector(initialRuntimeConfigState),
    ).toEqual({});
  });
});
