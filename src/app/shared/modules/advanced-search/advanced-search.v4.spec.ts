import { OutputDatasetDto } from "@scicatproject/scicat-sdk-ts-angular";
import { FilterCondition } from "state-management/models";
import {
  selectConditionsCountQuery,
  selectFullfacetParams,
  selectFullqueryParams,
} from "state-management/selectors/datasets.selectors";
import { initialDatasetState } from "state-management/state/datasets.store";
import { DATASET_FIELDS } from "./advanced-search.fields";
import { toActiveConditions } from "./advanced-search.utils";

// What the datasets API v4 takes, see ALLOWED_DATASET_FILTER_KEYS.where of the backend
const V4_OPERATORS = [
  "$in",
  "$or",
  "$and",
  "$nor",
  "$match",
  "$eq",
  "$gt",
  "$gte",
  "$lt",
  "$lte",
  "$ne",
  "$nin",
  "$not",
  "$exists",
  "$regex",
  "$options",
  "$text",
  "$search",
  "$date",
];

// A key that is not a field of the v4 dataset does not compile here
const V4_FILTER_FIELDS: Array<keyof OutputDatasetDto> = [
  "keywords",
  "proposalIds",
  "sampleIds",
  "instrumentIds",
  "type",
  "creationTime",
  "startTime",
  "endTime",
  "datasetName",
  "owner",
  "description",
];

const metadata = (
  relation: FilterCondition["relation"],
  rhs: FilterCondition["rhs"],
  extra: Partial<FilterCondition> = {},
) => ({
  condition: {
    lhs: "temperature",
    relation,
    rhs,
    unit: "",
    source: "scientificMetadata",
    ...extra,
  } as FilterCondition,
});

const dataset = (
  lhs: string,
  relation: FilterCondition["relation"],
  rhs: FilterCondition["rhs"],
  extra: Partial<FilterCondition> = {},
) => ({
  condition: {
    lhs,
    relation,
    rhs,
    unit: "",
    source: "dataset",
    ...extra,
  } as FilterCondition,
});

// One of every kind of condition the dialog can make
const CONDITIONS = [
  metadata("EQUAL_TO", "liquid"),
  metadata("EQUAL_TO", "300"),
  metadata("GREATER_THAN", "20", { unit: "celsius" }),
  metadata("LESS_THAN_OR_EQUAL", "5"),
  metadata("RANGE", ["10", "30"], { unit: "celsius" }),
  metadata("RANGE", ["", "7"]),
  metadata("EQUAL_TO", "x", { lhs: "my key:1.child", exclude: true }),
  dataset("keywords", "IN", "beam, test"),
  dataset("datasetName", "CONTAINS", "a.b(c)*[d]"),
  dataset("creationTime", "RANGE", ["2026-01-01", "2026-01-31"]),
  dataset("startTime", "RANGE", ["2026-01-01", ""]),
  dataset("endTime", "RANGE", ["", "2026-01-31"], { exclude: true }),
];

const stateWith = (configs: typeof CONDITIONS) => ({
  ...initialDatasetState,
  filters: {
    ...initialDatasetState.filters,
    text: "beam",
    scientific: toActiveConditions(configs),
  },
});

const operatorsOf = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.flatMap(operatorsOf)
    : value && typeof value === "object"
      ? Object.entries(value).flatMap(([key, item]) => [
          ...(key.startsWith("$") ? [key] : []),
          ...operatorsOf(item),
        ])
      : [];

describe("Advanced search with the datasets API v4", () => {
  it("should only search fields of the v4 dataset", () => {
    const keys = DATASET_FIELDS.map(({ key }) => key).sort();

    expect(keys).toEqual([...V4_FILTER_FIELDS].sort());
  });

  describe("the query of the datasets", () => {
    const query = selectFullqueryParams.projector(stateWith(CONDITIONS)).query;

    it("should only use operators that v4 takes", () => {
      const unknown = operatorsOf(query).filter(
        (operator) => !V4_OPERATORS.includes(operator),
      );

      expect(unknown).toEqual([]);
    });

    it("should put all conditions in one $and, v4 adds the access filter to it", () => {
      expect(Array.isArray(query.$and)).toBeTrue();
      expect(Object.keys(query)).toEqual(
        jasmine.arrayContaining(["$and", "$text"]),
      );
    });

    it("should write dates as $date, the list takes no other form", () => {
      expect(JSON.stringify(query)).toContain('"$date":"');
    });
  });

  describe("the count of the datasets", () => {
    const state = stateWith(CONDITIONS);
    const params = selectFullqueryParams.projector(state);
    const countQuery = selectConditionsCountQuery.projector(
      params,
      state.filters.scientific,
    );

    it("should use the same operators, without $date that the count refuses", () => {
      expect(JSON.stringify(countQuery)).not.toContain("$date");
      expect(
        operatorsOf(countQuery).filter(
          (operator) => !V4_OPERATORS.includes(operator),
        ),
      ).toEqual([]);
    });
  });

  describe("the facets", () => {
    const facets = (configs: typeof CONDITIONS) =>
      selectFullfacetParams.projector(stateWith(configs), []).fields as Record<
        string,
        unknown
      >;

    it("should take metadata conditions that are not a range", () => {
      const { scientific } = facets([
        metadata("GREATER_THAN", "20", { unit: "celsius" }),
      ]);

      expect(scientific).toEqual([
        {
          lhs: "temperature",
          relation: "GREATER_THAN",
          rhs: 20,
          unit: "celsius",
        },
      ]);
    });

    it("should not take what they count wrong, the total comes from the datasets", () => {
      for (const config of [
        metadata("RANGE", ["", "7"]),
        metadata("RANGE", ["10", "30"]),
        dataset("keywords", "IN", "beam"),
        metadata("EQUAL_TO", "x", { exclude: true }),
      ]) {
        expect(facets([config]).scientific).toBeUndefined();
      }
    });
  });
});
