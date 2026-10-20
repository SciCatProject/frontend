import { TestBed } from "@angular/core/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import {
  updateConditionsConfigs,
  updateUserSettingsAction,
} from "state-management/actions/user.actions";
import { ConditionConfig } from "state-management/state/user.store";
import { ConditionFilterService } from "./condition-filter.service";

describe("ConditionFilterService", () => {
  let service: ConditionFilterService;
  let dispatchSpy: jasmine.Spy;

  const configs: ConditionConfig[] = [
    {
      enabled: true,
      condition: {
        lhs: "temperature",
        relation: "GREATER_THAN",
        rhs: 20,
        unit: "celsius",
      },
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideMockStore({})] });
    service = TestBed.inject(ConditionFilterService);
    dispatchSpy = spyOn(TestBed.inject(MockStore), "dispatch");
  });

  it("should keep the conditions in the store and in the user settings", () => {
    service.save("dataset", configs);

    expect(dispatchSpy).toHaveBeenCalledWith(
      updateConditionsConfigs({ conditionConfigs: configs, scope: "dataset" }),
    );
    expect(dispatchSpy).toHaveBeenCalledWith(
      updateUserSettingsAction({
        property: { fe_dataset_table_conditions: configs },
      }),
    );
  });

  it("should use the setting of the scope", () => {
    service.save("sample", configs);

    expect(dispatchSpy).toHaveBeenCalledWith(
      updateUserSettingsAction({
        property: { fe_sample_table_conditions: configs },
      }),
    );
  });

  it("should clear the conditions", () => {
    service.clear("dataset");

    expect(dispatchSpy).toHaveBeenCalledWith(
      updateConditionsConfigs({ conditionConfigs: [], scope: "dataset" }),
    );
  });
});
