import { runtimeConfigReducer } from "./runtime-config.reducer";
import { initialRuntimeConfigState } from "state-management/state/runtimeConfig.store";
import * as fromActions from "state-management/actions/runtime-config.action";

describe("RuntimeConfigReducer", () => {
  describe("on loadConfigurationSuccess", () => {
    it("should set config", () => {
      const config = { siteTitle: "SciCat", policiesEnabled: true } as any;

      const action = fromActions.loadConfigurationSuccess({ config });
      const state = runtimeConfigReducer(initialRuntimeConfigState, action);

      expect(state.config).toEqual(config);
    });
  });

  describe("on updateConfigurationSuccess", () => {
    it("should set config", () => {
      const config = { siteTitle: "Updated", jobsEnabled: false } as any;

      const action = fromActions.updateConfigurationSuccess({ config });
      const state = runtimeConfigReducer(initialRuntimeConfigState, action);

      expect(state.config).toEqual(config);
    });
  });
});
