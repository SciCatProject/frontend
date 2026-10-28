import { FilterCondition } from "state-management/models";
import { ConditionConfig } from "state-management/state/user.store";
import {
  conditionsToQuery,
  describeCondition,
  getRelationOption,
  isConditionComplete,
  metadataPath,
  isPlainConditionList,
  normalizeCondition,
  splitValues,
  toActiveConditions,
  withoutSwitchedOff,
  toFacetConditions,
  withPlainDates,
} from "./advanced-search.utils";

const condition = (
  overrides: Partial<FilterCondition> = {},
): FilterCondition => ({
  lhs: "temperature",
  relation: "EQUAL_TO",
  rhs: "20",
  unit: "",
  ...overrides,
});

const datasetCondition = (
  overrides: Partial<FilterCondition> = {},
): FilterCondition =>
  condition({
    lhs: "keywords",
    relation: "IN",
    rhs: "beam, test",
    source: "dataset",
    ...overrides,
  });

describe("condition filter utils", () => {
  describe("splitValues", () => {
    it("should split a typed list and leave out empty values", () => {
      expect(splitValues("beam, test,, ")).toEqual(["beam", "test"]);
    });

    it("should keep a list as it is", () => {
      expect(splitValues(["a", "b"])).toEqual(["a", "b"]);
    });
  });

  describe("isConditionComplete", () => {
    it("should need a field and a value", () => {
      expect(isConditionComplete(condition())).toBeTrue();
      expect(isConditionComplete(condition({ rhs: "" }))).toBeFalse();
      expect(isConditionComplete(condition({ lhs: "" }))).toBeFalse();
    });

    it("should accept a range with one bound", () => {
      const range = (rhs: (string | number)[]) =>
        condition({ relation: "RANGE", rhs });

      expect(isConditionComplete(range(["1", ""]))).toBeTrue();
      expect(isConditionComplete(range(["", "9"]))).toBeTrue();
      expect(isConditionComplete(range(["", ""]))).toBeFalse();
    });

    it("should need a value in the list of a dataset field", () => {
      expect(isConditionComplete(datasetCondition())).toBeTrue();
      expect(isConditionComplete(datasetCondition({ rhs: " , " }))).toBeFalse();
    });

    it("should need text for a dataset field that contains text", () => {
      const contains = datasetCondition({ relation: "CONTAINS", rhs: "ref" });

      expect(isConditionComplete(contains)).toBeTrue();
      expect(isConditionComplete({ ...contains, rhs: "  " })).toBeFalse();
    });
  });

  describe("date range of a dataset field", () => {
    const dates = (rhs: (string | undefined)[], overrides = {}) =>
      datasetCondition({
        lhs: "creationTime",
        relation: "RANGE",
        rhs,
        ...overrides,
      });

    it("should be complete with one date", () => {
      expect(isConditionComplete(dates(["2026-01-01", ""]))).toBeTrue();
      expect(isConditionComplete(dates(["", "2026-02-01"]))).toBeTrue();
      expect(isConditionComplete(dates(["", ""]))).toBeFalse();
    });

    it("should keep the dates and leave out the empty one", () => {
      expect(normalizeCondition(dates(["2026-01-01", ""]))).toEqual(
        dates(["2026-01-01", undefined]),
      );
    });

    it("should describe the range with an open end", () => {
      expect(describeCondition(dates(["2026-01-01", "2026-02-01"]))).toBe(
        "Creation time: 2026-01-01 – 2026-02-01",
      );
      expect(describeCondition(dates(["2026-01-01", undefined]))).toBe(
        "Creation time: 2026-01-01 – …",
      );
    });

    it("should query from the start of the first day to the end of the last day", () => {
      expect(conditionsToQuery([dates(["2026-01-01", "2026-01-31"])])).toEqual({
        creationTime: {
          $gte: { $date: new Date(2026, 0, 1).toISOString() },
          $lt: { $date: new Date(2026, 1, 1).toISOString() },
        },
      });
    });

    it("should leave out the next midnight, the end day is the last one", () => {
      const { creationTime } = conditionsToQuery([
        dates(["", "2026-01-31"]),
      ]) as { creationTime: Record<string, unknown> };
      expect(creationTime).toEqual({
        $lt: { $date: new Date(2026, 1, 1).toISOString() },
      });
      expect(creationTime["$lte"]).toBeUndefined();
    });

    it("should leave out a bound that is not a date instead of failing", () => {
      expect(() => conditionsToQuery([dates(["bad-date", ""])])).not.toThrow();
      expect(conditionsToQuery([dates(["bad-date", ""])])).toEqual({});
      expect(conditionsToQuery([dates(["bad-date", "2026-01-31"])])).toEqual({
        creationTime: { $lt: { $date: new Date(2026, 1, 1).toISOString() } },
      });
    });

    it("should give the count plain dates", () => {
      expect(
        withPlainDates<unknown>({
          $and: [{ creationTime: { $gte: { $date: "2026-01-01" } } }, { a: 1 }],
        }),
      ).toEqual({ $and: [{ creationTime: { $gte: "2026-01-01" } }, { a: 1 }] });
    });

    it("should query with one date only", () => {
      expect(conditionsToQuery([dates(["", "2026-01-31"])])).toEqual({
        creationTime: { $lt: { $date: new Date(2026, 1, 1).toISOString() } },
      });
      expect(conditionsToQuery([dates(["", ""])])).toEqual({});
    });
  });

  describe("normalizeCondition", () => {
    it("should turn numeric equality into numeric equality", () => {
      expect(normalizeCondition(condition({ unit: "cm" }))).toEqual(
        condition({ relation: "EQUAL_TO_NUMERIC", rhs: 20, unit: "cm" }),
      );
    });

    it("should turn text equality into string equality without a unit", () => {
      expect(
        normalizeCondition(condition({ rhs: "hello", unit: "cm" })),
      ).toEqual(
        condition({ relation: "EQUAL_TO_STRING", rhs: "hello", unit: "" }),
      );
    });

    it("should convert numbers for the other operators", () => {
      expect(
        normalizeCondition(condition({ relation: "GREATER_THAN", rhs: "3.5" })),
      ).toEqual(condition({ relation: "GREATER_THAN", rhs: 3.5 }));
    });

    it("should convert the bounds of a range and keep missing ones empty", () => {
      expect(
        normalizeCondition(condition({ relation: "RANGE", rhs: ["1", ""] })),
      ).toEqual(condition({ relation: "RANGE", rhs: [1, undefined] }));
    });

    it("should turn the values of a dataset field into a list", () => {
      expect(normalizeCondition(datasetCondition())).toEqual(
        datasetCondition({ rhs: ["beam", "test"] }),
      );
    });

    it("should keep the text of a dataset field and drop its unit", () => {
      expect(
        normalizeCondition(
          datasetCondition({
            relation: "CONTAINS",
            rhs: " ref, 1 ",
            unit: "cm",
          }),
        ),
      ).toEqual(
        datasetCondition({ relation: "CONTAINS", rhs: "ref, 1", unit: "" }),
      );
    });

    it("should leave out the defaults and keep what differs", () => {
      const normalized = normalizeCondition(
        condition({
          source: "scientificMetadata",
          exclude: false,
        }),
      );
      expect("source" in normalized).toBeFalse();
      expect("exclude" in normalized).toBeFalse();

      expect(normalizeCondition(condition({ exclude: true }))).toEqual(
        jasmine.objectContaining({ exclude: true }),
      );
    });
  });

  describe("withoutSwitchedOff", () => {
    const config = (enabled?: boolean): ConditionConfig => ({
      condition: condition(),
      ...(enabled !== undefined && { enabled }),
    });

    it("should leave out only what older settings switched off", () => {
      const [missing, on, off] = [config(), config(true), config(false)];

      expect(withoutSwitchedOff([missing, on, off])).toEqual([missing, on]);
    });
  });

  describe("toActiveConditions", () => {
    const config = (
      overrides: Partial<ConditionConfig> & { rhs?: string } = {},
    ): ConditionConfig => ({
      condition: condition({ rhs: overrides.rhs ?? "20" }),
      ...overrides,
    });

    it("should keep conditions that have a value, normalized, without them saying they are on", () => {
      expect(toActiveConditions([config()])).toEqual([
        condition({ relation: "EQUAL_TO_NUMERIC", rhs: 20 }),
      ]);
      expect(toActiveConditions([config({ enabled: true })]).length).toBe(1);
    });

    it("should skip conditions that older settings switched off, and empty ones", () => {
      expect(
        toActiveConditions([config({ enabled: false }), config({ rhs: "" })]),
      ).toEqual([]);
    });

    it("should cope with missing configs", () => {
      expect(toActiveConditions(undefined)).toEqual([]);
    });
  });

  describe("getRelationOption", () => {
    it("should share one option between the equality variants", () => {
      expect(getRelationOption("EQUAL_TO_NUMERIC").value).toBe("EQUAL_TO");
      expect(getRelationOption("EQUAL_TO_STRING").value).toBe("EQUAL_TO");
      expect(getRelationOption("LESS_THAN").symbol).toBe("<");
    });
  });

  describe("describeCondition", () => {
    it("should describe a comparison", () => {
      expect(
        describeCondition(
          condition({ relation: "GREATER_THAN_OR_EQUAL", unit: "celsius" }),
        ),
      ).toBe("temperature ≥ 20 celsius");
    });

    it("should describe a range with an open end", () => {
      expect(
        describeCondition(condition({ relation: "RANGE", rhs: [1, ""] })),
      ).toBe("temperature: 1 – …");
    });

    it("should describe a dataset field by its name", () => {
      expect(
        describeCondition(datasetCondition({ rhs: ["beam", "test"] })),
      ).toBe("Keywords: beam, test");
      expect(
        describeCondition(
          datasetCondition({
            lhs: "datasetName",
            relation: "CONTAINS",
            rhs: "ref",
          }),
        ),
      ).toBe('Dataset name contains "ref"');
    });

    it("should start with not for a condition with NOT", () => {
      expect(describeCondition(condition({ exclude: true }))).toBe(
        "not temperature = 20",
      );
    });
  });

  describe("conditionsToQuery", () => {
    const metadata = (lhs: string, rhs: number) =>
      condition({ lhs, relation: "GREATER_THAN", rhs });

    it("should give an empty query without conditions", () => {
      expect(conditionsToQuery([])).toEqual({});
    });

    it("should query the value of a metadata key", () => {
      expect(
        conditionsToQuery([
          condition({ relation: "EQUAL_TO_STRING", rhs: "hello" }),
        ]),
      ).toEqual({ "scientificMetadata.temperature.value": { $eq: "hello" } });
    });

    it("should compare in SI units when a unit is given", () => {
      expect(
        conditionsToQuery([
          condition({ relation: "GREATER_THAN", rhs: 100, unit: "cm" }),
        ]),
      ).toEqual({
        "scientificMetadata.temperature.valueSI": { $gt: 1 },
        "scientificMetadata.temperature.unitSI": { $eq: "m" },
      });
    });

    it("should use the bound that is set when a range is open", () => {
      expect(
        conditionsToQuery([
          condition({ relation: "RANGE", rhs: [undefined, 200], unit: "cm" }),
        ]),
      ).toEqual({
        "scientificMetadata.temperature.valueSI": { $lte: 2 },
        "scientificMetadata.temperature.unitSI": { $eq: "m" },
      });
    });

    it("should need all conditions to match", () => {
      expect(conditionsToQuery([metadata("a", 1), metadata("b", 2)])).toEqual({
        $and: [
          { "scientificMetadata.a.value": { $gt: 1 } },
          { "scientificMetadata.b.value": { $gt: 2 } },
        ],
      });
    });

    it("should keep two conditions on the same key", () => {
      const query = conditionsToQuery([
        metadata("a", 1),
        condition({ lhs: "a", relation: "LESS_THAN", rhs: 9 }),
      ]);

      expect(query.$and).toEqual([
        { "scientificMetadata.a.value": { $gt: 1 } },
        { "scientificMetadata.a.value": { $lt: 9 } },
      ]);
    });

    it("should leave out what a condition with NOT matches", () => {
      expect(
        conditionsToQuery([
          condition({ relation: "LESS_THAN", rhs: 5, exclude: true }),
        ]),
      ).toEqual({
        $nor: [{ "scientificMetadata.temperature.value": { $lt: 5 } }],
      });
    });

    it("should query a dataset field for any of its values", () => {
      expect(
        conditionsToQuery([datasetCondition({ rhs: ["beam", "test"] })]),
      ).toEqual({ keywords: { $in: ["beam", "test"] } });
    });

    it("should query a dataset field that contains text without special characters", () => {
      expect(
        conditionsToQuery([
          datasetCondition({
            lhs: "datasetName",
            relation: "CONTAINS",
            rhs: "run (1).*",
          }),
        ]),
      ).toEqual({
        datasetName: { $regex: "run \\(1\\)\\.\\*", $options: "i" },
      });
    });

    it("should combine dataset fields and metadata keys", () => {
      expect(
        conditionsToQuery([
          datasetCondition({ rhs: ["beam"], exclude: true }),
          metadata("a", 1),
        ]),
      ).toEqual({
        $and: [
          { $nor: [{ keywords: { $in: ["beam"] } }] },
          { "scientificMetadata.a.value": { $gt: 1 } },
        ],
      });
    });
  });

  describe("metadata keys in the query", () => {
    it("should leave a plain key as it is", () => {
      expect(metadataPath("sample_temperature")).toBe(
        "scientificMetadata.sample_temperature",
      );
    });

    it("should write a key with a space, a colon or a slash like the backend stores it", () => {
      expect(metadataPath("silicon BC offset")).toBe(
        "scientificMetadata.silicon%20BC%20offset",
      );
      expect(metadataPath("BL17:Chop:Skf1:EnergyReq")).toBe(
        "scientificMetadata.BL17%3AChop%3ASkf1%3AEnergyReq",
      );
      expect(metadataPath("entry:AI6/data/Decimation factor")).toBe(
        "scientificMetadata.entry%3AAI6%2Fdata%2FDecimation%20factor",
      );
    });

    it("should still go one level down at a dot", () => {
      expect(metadataPath("parent.child key")).toBe(
        "scientificMetadata.parent.child%20key",
      );
    });

    it("should use the written key in the query", () => {
      expect(
        conditionsToQuery([
          condition({ lhs: "BL17:Chop", relation: "GREATER_THAN", rhs: 1 }),
        ]),
      ).toEqual({ "scientificMetadata.BL17%3AChop.value": { $gt: 1 } });
    });
  });

  describe("isPlainConditionList", () => {
    it("should accept metadata conditions", () => {
      expect(isPlainConditionList([])).toBeTrue();
      expect(isPlainConditionList([condition(), condition()])).toBeTrue();
    });

    it("should not accept what the facets can't take", () => {
      expect(isPlainConditionList([datasetCondition()])).toBeFalse();
      expect(isPlainConditionList([condition({ exclude: true })])).toBeFalse();
    });
  });

  describe("toFacetConditions", () => {
    it("should only keep what the facets take", () => {
      expect(toFacetConditions([condition({ exclude: false })])).toEqual([
        { lhs: "temperature", relation: "EQUAL_TO", rhs: "20", unit: "" },
      ]);
    });
  });
});
