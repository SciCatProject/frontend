import { FilterCondition } from "state-management/models";
import { ConditionConfig } from "state-management/state/user.store";
import {
  conditionsToQuery,
  describeCondition,
  getRelationOption,
  groupByJoin,
  isConditionComplete,
  isPlainConditionList,
  normalizeCondition,
  splitValues,
  toActiveConditions,
  toFacetConditions,
  withPlainDates,
} from "./condition-filter.utils";

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
          $lte: { $date: new Date(2026, 1, 1).toISOString() },
        },
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
        creationTime: { $lte: { $date: new Date(2026, 1, 1).toISOString() } },
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
          join: "AND",
        }),
      );
      expect("source" in normalized).toBeFalse();
      expect("exclude" in normalized).toBeFalse();
      expect("join" in normalized).toBeFalse();

      expect(
        normalizeCondition(condition({ exclude: true, join: "OR" })),
      ).toEqual(jasmine.objectContaining({ exclude: true, join: "OR" }));
    });
  });

  describe("toActiveConditions", () => {
    const config = (
      overrides: Partial<ConditionConfig> & { rhs?: string } = {},
    ): ConditionConfig => ({
      enabled: true,
      condition: condition({ rhs: overrides.rhs ?? "20" }),
      ...overrides,
    });

    it("should keep enabled conditions that have a value, normalized", () => {
      expect(toActiveConditions([config()])).toEqual([
        condition({ relation: "EQUAL_TO_NUMERIC", rhs: 20 }),
      ]);
    });

    it("should skip switched off and empty conditions", () => {
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

    it("should start with not for a condition that is not included", () => {
      expect(describeCondition(condition({ exclude: true }))).toBe(
        "not temperature = 20",
      );
    });
  });

  describe("conditionsToQuery", () => {
    const metadata = (lhs: string, rhs: number, join?: "OR") =>
      condition({ lhs, relation: "GREATER_THAN", rhs, join });

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

    it("should need all conditions to match by default", () => {
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

    it("should apply AND before OR", () => {
      // a AND b OR c is (a AND b) OR c
      expect(
        conditionsToQuery([
          metadata("a", 1),
          metadata("b", 2),
          metadata("c", 3, "OR"),
        ]),
      ).toEqual({
        $or: [
          {
            $and: [
              { "scientificMetadata.a.value": { $gt: 1 } },
              { "scientificMetadata.b.value": { $gt: 2 } },
            ],
          },
          { "scientificMetadata.c.value": { $gt: 3 } },
        ],
      });
    });

    it("should ignore the join of the first condition", () => {
      expect(conditionsToQuery([metadata("a", 1, "OR")])).toEqual({
        "scientificMetadata.a.value": { $gt: 1 },
      });
    });

    it("should leave out what a condition that is not included matches", () => {
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
          metadata("a", 1, "OR"),
        ]),
      ).toEqual({
        $or: [
          { $nor: [{ keywords: { $in: ["beam"] } }] },
          { "scientificMetadata.a.value": { $gt: 1 } },
        ],
      });
    });
  });

  describe("groupByJoin", () => {
    const join = (item: { join?: "AND" | "OR" }) => item.join;

    it("should keep filters joined by AND in one group and start a new one at OR", () => {
      const [a, b, c, d] = [
        {},
        { join: "OR" as const },
        { join: "AND" as const },
        {},
      ];

      expect(groupByJoin([a, b, c, d], join)).toEqual([[a], [b, c, d]]);
    });

    it("should start with a group even when the first filter says OR", () => {
      const first = { join: "OR" as const };

      expect(groupByJoin([first], join)).toEqual([[first]]);
      expect(groupByJoin([], join)).toEqual([]);
    });
  });

  describe("isPlainConditionList", () => {
    it("should accept metadata conditions that all have to match", () => {
      expect(isPlainConditionList([])).toBeTrue();
      expect(
        isPlainConditionList([condition(), condition({ join: "AND" })]),
      ).toBeTrue();
    });

    it("should not accept what the facets can't take", () => {
      expect(isPlainConditionList([datasetCondition()])).toBeFalse();
      expect(isPlainConditionList([condition({ exclude: true })])).toBeFalse();
      expect(
        isPlainConditionList([condition(), condition({ join: "OR" })]),
      ).toBeFalse();
    });

    it("should accept a join on the first condition, it is not used", () => {
      expect(isPlainConditionList([condition({ join: "OR" })])).toBeTrue();
    });
  });

  describe("toFacetConditions", () => {
    it("should only keep what the facets take", () => {
      expect(
        toFacetConditions([condition({ exclude: false, join: "AND" })]),
      ).toEqual([
        { lhs: "temperature", relation: "EQUAL_TO", rhs: "20", unit: "" },
      ]);
    });
  });
});
