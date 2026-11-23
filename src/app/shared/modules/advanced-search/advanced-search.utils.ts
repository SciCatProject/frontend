import { escapeRegExp } from "lodash-es";
import * as Math from "mathjs";
import {
  FilterCondition,
  FilterConditionRelation,
  RangeType,
} from "state-management/models";
import { ConditionConfig } from "state-management/state/user.store";
import {
  METADATA_PREFIX,
  getDatasetField,
  getDatasetFields,
  hasConfiguredFields,
  isMetadataFieldKey,
  toConditionRelation,
} from "./advanced-search.fields";

export interface RelationOption {
  value: FilterConditionRelation;
  label: string;
  symbol: string;
}

/** Operators offered in the UI. Equality is normalized when applying. */
export const RELATION_OPTIONS: RelationOption[] = [
  { value: "EQUAL_TO", label: "Equals", symbol: "=" },
  { value: "GREATER_THAN", label: "Greater than", symbol: ">" },
  { value: "LESS_THAN", label: "Less than", symbol: "<" },
  {
    value: "GREATER_THAN_OR_EQUAL",
    label: "Greater than or equal to",
    symbol: "≥",
  },
  {
    value: "LESS_THAN_OR_EQUAL",
    label: "Less than or equal to",
    symbol: "≤",
  },
  { value: "RANGE", label: "Between", symbol: "↔" },
];

const EQUALITY_RELATIONS: FilterConditionRelation[] = [
  "EQUAL_TO",
  "EQUAL_TO_NUMERIC",
  "EQUAL_TO_STRING",
];

// spaces only are no value, they would be read as the number 0
const isBlank = (value: unknown): boolean =>
  value === undefined ||
  value === null ||
  (typeof value === "string" && value.trim() === "");

const isNumeric = (value: unknown): boolean =>
  !isBlank(value) && !isNaN(Number(value));

/** The two bounds of a range, none when the value is not a range. */
export const getBounds = (rhs: FilterCondition["rhs"]): (string | number)[] =>
  Array.isArray(rhs) ? rhs : [];

/** Dataset fields hold lists and text, scientific metadata holds measurements. */
export const isDatasetCondition = (condition: FilterCondition): boolean =>
  condition.source === "dataset";

/** What a range compares: dates on a dataset field and numbers on metadata, unless it says so. */
export const getRangeType = (condition: FilterCondition): RangeType =>
  condition.rangeType ?? (isDatasetCondition(condition) ? "date" : "number");

/** A range of dates gets a date picker, any other range a min and a max. */
export const isDateRange = (condition: FilterCondition): boolean =>
  condition.relation === "RANGE" && getRangeType(condition) === "date";

/** A bound a range can use: a day that exists, or a number. */
const isValidBound = (condition: FilterCondition, bound: unknown): boolean =>
  !isBlank(bound) &&
  (getRangeType(condition) === "date"
    ? !!startOfDay(String(bound).trim())
    : isNumeric(bound));

/** The value as text, a list is shown as `a, b`. */
export const getText = (rhs: FilterCondition["rhs"]): string =>
  Array.isArray(rhs) ? rhs.join(", ") : String(rhs ?? "");

/** The values of a list field, typed as `a, b, c`. */
export function splitValues(rhs: FilterCondition["rhs"]): string[] {
  return getText(rhs)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

/** The operator as shown in the UI, equality variants share one entry. */
export function getRelationOption(
  relation: FilterConditionRelation,
): RelationOption {
  const uiRelation = EQUALITY_RELATIONS.includes(relation)
    ? "EQUAL_TO"
    : relation;
  return (
    RELATION_OPTIONS.find((option) => option.value === uiRelation) ??
    RELATION_OPTIONS[0]
  );
}

/**
 * Only older settings can say a filter is off, a filter is on unless it says so. A filter that
 * is off is left out completely: it is not shown, not counted and not applied.
 */
export function withoutSwitchedOff(
  configs: ConditionConfig[],
): ConditionConfig[] {
  return configs.filter(({ enabled }) => enabled !== false);
}

const isActive = (config: ConditionConfig): boolean =>
  config.enabled !== false && isConditionComplete(config.condition);

/** The filters that are not switched off and complete, the ones that are applied. */
export function getActiveConfigs(
  configs: ConditionConfig[],
): ConditionConfig[] {
  return configs.filter(isActive);
}

/** A condition can only filter once it has a value (or a bound for ranges). */
export function isConditionComplete(condition: FilterCondition): boolean {
  if (!condition.lhs) return false;
  if (condition.relation === "RANGE") {
    // a bound that is not a date or a number (e.g. typed in the config) is no filter
    return (
      Array.isArray(condition.rhs) &&
      condition.rhs.some((bound) => isValidBound(condition, bound))
    );
  }
  if (isDatasetCondition(condition)) {
    return condition.relation === "IN"
      ? splitValues(condition.rhs).length > 0
      : getText(condition.rhs).trim() !== "";
  }
  return !isBlank(condition.rhs);
}

/** Leaves out the defaults, so saved conditions stay small and old ones look the same. */
function withoutDefaults({
  source,
  exclude,
  rangeType,
  ...condition
}: FilterCondition): FilterCondition {
  const isDefault =
    condition.relation !== "RANGE" ||
    rangeType === undefined ||
    rangeType === (source === "dataset" ? "date" : "number");
  return {
    ...condition,
    ...(source === "dataset" && { source }),
    ...(exclude && { exclude }),
    ...(!isDefault && { rangeType }),
  };
}

/** Converts what the user typed into the values the query needs. */
export function normalizeCondition(
  condition: FilterCondition,
): FilterCondition {
  return withoutDefaults(normalizeValue(condition));
}

function normalizeValue(condition: FilterCondition): FilterCondition {
  const isDataset = isDatasetCondition(condition);
  const unit = isDataset ? "" : condition.unit || "";

  if (condition.relation === "RANGE") {
    // dates stay text, numbers are numbers, a date has no unit
    const isDate = getRangeType(condition) === "date";
    const convert = isDate ? (bound: unknown) => String(bound).trim() : Number;
    const [min, max] = getBounds(condition.rhs);
    return {
      ...condition,
      rhs: [
        isValidBound(condition, min) ? convert(min) : undefined,
        isValidBound(condition, max) ? convert(max) : undefined,
      ],
      unit: isDate ? "" : unit,
    };
  }

  if (isDataset) {
    return {
      ...condition,
      rhs:
        condition.relation === "IN"
          ? splitValues(condition.rhs)
          : getText(condition.rhs).trim(),
      unit,
    };
  }

  const numeric = isNumeric(condition.rhs);
  const rhs = numeric ? Number(condition.rhs) : condition.rhs;

  if (EQUALITY_RELATIONS.includes(condition.relation)) {
    return {
      ...condition,
      rhs,
      relation: numeric ? "EQUAL_TO_NUMERIC" : "EQUAL_TO_STRING",
      unit: numeric ? unit : "",
    };
  }

  return { ...condition, rhs, unit };
}

/** The conditions that are sent to the backend, filled in and not switched off. */
export function toActiveConditions(
  configs: ConditionConfig[] = [],
): FilterCondition[] {
  return getActiveConfigs(configs).map(({ condition }) =>
    normalizeCondition(condition),
  );
}

/**
 * The fields of the config as conditions, when at least one of them has a value. They are the
 * filters of a user who has none saved: the ones with a value are applied, the others are rows
 * of the dialog.
 */
export function getConfiguredConditions(): ConditionConfig[] {
  const fields = getDatasetFields();
  if (
    !hasConfiguredFields() ||
    !fields.some(({ value }) => value !== undefined)
  ) {
    return [];
  }

  return fields.map(({ key, relation: fieldRelation, value, unit }) => {
    const metadata = isMetadataFieldKey(key);
    const { relation, rangeType } = toConditionRelation(fieldRelation);
    return {
      condition: {
        lhs: metadata ? key.slice(METADATA_PREFIX.length) : key,
        relation,
        rhs: value ?? (relation === "RANGE" ? ["", ""] : ""),
        unit: unit ?? "",
        source: metadata ? "scientificMetadata" : "dataset",
        ...(rangeType && { rangeType }),
      },
    };
  });
}

/** Short readable form, used for the chips: `temperature ≥ 20 celsius`. */
export function describeCondition(condition: FilterCondition): string {
  const description = describeValue(condition);
  return condition.exclude ? `not ${description}` : description;
}

function describeValue(condition: FilterCondition): string {
  const isDataset = isDatasetCondition(condition);
  const label = isDataset
    ? (getDatasetField(condition.lhs)?.label ?? condition.lhs)
    : condition.lhs;
  const unit = !isDataset && condition.unit ? ` ${condition.unit}` : "";

  if (condition.relation === "RANGE") {
    const [min, max] = getBounds(condition.rhs);
    return `${label}: ${isBlank(min) ? "…" : min} – ${isBlank(max) ? "…" : max}${unit}`;
  }

  if (isDataset) {
    return condition.relation === "IN"
      ? `${label}: ${splitValues(condition.rhs).join(", ")}`
      : `${label} contains "${getText(condition.rhs).trim()}"`;
  }

  const { symbol } = getRelationOption(condition.relation);
  return `${condition.lhs} ${symbol} ${condition.rhs}${unit}`;
}

/**
 * The path of a metadata key in the query. The backend stores the keys URL-encoded,
 * a key with a space or a colon is only found when it is written the same way.
 * A dot still goes one level down, the parts of the key are encoded one by one.
 */
export const metadataPath = (key: string): string =>
  `scientificMetadata.${key.split(".").map(encodeURIComponent).join(".")}`;

export function convertToSIUnit(
  lhs: string,
  rhs: number,
  unit: string,
): { value: number; siUnit: string } {
  try {
    const sourceQuantity = Math.unit(rhs, unit);

    const siQuantity = sourceQuantity.toSI();
    const siValue = siQuantity.value;

    const siString = siQuantity.toString();

    const siUnit = siString.replace(/^[\d.\s]+/, "").trim();

    return { value: siValue, siUnit };
  } catch (error) {
    console.warn(
      `Could not convert unit "${unit}" for parameter "${lhs}": ${error}`,
    );
    return { value: rhs, siUnit: unit };
  }
}

const MONGO_OPERATORS: Partial<Record<FilterConditionRelation, string>> = {
  EQUAL_TO: "$eq",
  EQUAL_TO_NUMERIC: "$eq",
  EQUAL_TO_STRING: "$eq",
  GREATER_THAN: "$gt",
  LESS_THAN: "$lt",
  GREATER_THAN_OR_EQUAL: "$gte",
  LESS_THAN_OR_EQUAL: "$lte",
};

export function conditionToMongoQuery(
  condition: FilterCondition,
): Record<string, any> {
  const { lhs, rhs, relation, unit } = condition;

  if (!lhs || rhs === null || rhs === undefined) {
    return {};
  }

  const query: Record<string, any> = {};
  const valuePath = unit
    ? `${metadataPath(lhs)}.valueSI`
    : `${metadataPath(lhs)}.value`;

  let queryValue = rhs;
  let queryUnit = unit;

  if (unit && relation !== "RANGE") {
    const converted = convertToSIUnit(lhs, Number(rhs), unit);
    queryValue = converted.value;
    queryUnit = converted.siUnit;
  }

  const operator = MONGO_OPERATORS[relation];

  if (operator) {
    query[valuePath] = { [operator]: queryValue };
  } else if (relation !== "RANGE") {
    console.warn(`Unknown relation type: ${relation}`);
  } else if (Array.isArray(rhs) && rhs.length === 2) {
    const [min, max] = rhs;
    let convertedMin = min;
    let convertedMax = max;

    if (unit) {
      const toSI = (bound: string | number | undefined) =>
        isBlank(bound)
          ? bound
          : convertToSIUnit(lhs, bound as number, unit).value;
      convertedMin = toSI(min);
      convertedMax = toSI(max);
      // a range can have only one bound, use the one that is set
      queryUnit = convertToSIUnit(
        lhs,
        (isBlank(min) ? max : min) as number,
        unit,
      ).siUnit;
    }

    if (!isBlank(convertedMin)) {
      query[valuePath] = { ...query[valuePath], $gte: convertedMin };
    }
    if (!isBlank(convertedMax)) {
      query[valuePath] = { ...query[valuePath], $lte: convertedMax };
    }
  }

  // a range without a bound is no filter, its unit alone must not be one either
  if (queryUnit && query[valuePath]) {
    query[`${metadataPath(lhs)}.unitSI`] = { $eq: queryUnit };
  }
  return query;
}

function datasetConditionToQuery(
  condition: FilterCondition,
): Record<string, unknown> {
  const { lhs, relation, rhs } = condition;
  if (relation === "RANGE" && !isDateRange(condition)) {
    return numberRangeToQuery(lhs, condition);
  }
  if (relation === "RANGE") {
    const [from, to] = getBounds(rhs);
    // a bound that is not a date (e.g. typed in the config) is left out
    const start = isBlank(from) ? undefined : startOfDay(String(from));
    // the end day is included, up to the start of the next day
    const end = isBlank(to) ? undefined : startOfDay(String(to), 1);
    const range = {
      ...(start && { $gte: { $date: start } }),
      ...(end && { $lt: { $date: end } }),
    };
    return Object.keys(range).length ? { [lhs]: range } : {};
  }

  return relation === "IN"
    ? { [lhs]: { $in: splitValues(rhs) } }
    : {
        [lhs]: {
          $regex: escapeRegExp(getText(rhs).trim()),
          $options: "i",
        },
      };
}

/** Both bounds included, a bound that is not a number is left out. */
function numberRangeToQuery(
  path: string,
  condition: FilterCondition,
): Record<string, unknown> {
  const [from, to] = getBounds(condition.rhs);
  const range = {
    ...(isNumeric(from) && { $gte: Number(from) }),
    ...(isNumeric(to) && { $lte: Number(to) }),
  };
  return Object.keys(range).length ? { [path]: range } : {};
}

/**
 * Dates in scientific metadata are text, an ISO date (`2026-01-31` or `2026-01-31T10:00:00Z`)
 * sorts like the date it is. The end day is included, up to the next day.
 */
function metadataDateRangeToQuery(
  condition: FilterCondition,
): Record<string, unknown> {
  const [from, to] = getBounds(condition.rhs);
  const day = (date: unknown, addDays = 0) => {
    if (isBlank(date) || !startOfDay(String(date).trim())) return undefined;
    const [year, month, dayOfMonth] = String(date)
      .trim()
      .split("-")
      .map(Number);
    return new Date(Date.UTC(year, month - 1, dayOfMonth + addDays))
      .toISOString()
      .slice(0, 10);
  };
  const start = day(from);
  const end = day(to, 1);
  const range = {
    ...(start && { $gte: start }),
    ...(end && { $lt: end }),
  };
  return Object.keys(range).length
    ? { [`${metadataPath(condition.lhs)}.value`]: range }
    : {};
}

/** The start of a day (`2026-01-31`) in the local time zone as an ISO string, undefined for no date. */
function startOfDay(date: string, addDays = 0): string | undefined {
  const [year, month, day] = date.split("-").map(Number);
  const given = new Date(year, month - 1, day);
  // a day that does not exist, e.g. 2026-02-31, is not moved into the next month
  if (
    isNaN(given.getTime()) ||
    given.getMonth() !== month - 1 ||
    given.getDate() !== day
  ) {
    return undefined;
  }
  return new Date(year, month - 1, day + addDays).toISOString();
}

/** The query of one condition, NOT leaves out what matches. */
function conditionToExpression(
  condition: FilterCondition,
): Record<string, unknown> {
  const expression = isDatasetCondition(condition)
    ? datasetConditionToQuery(condition)
    : isDateRange(condition)
      ? metadataDateRangeToQuery(condition)
      : conditionToMongoQuery(condition);

  return condition.exclude && Object.keys(expression).length
    ? { $nor: [expression] }
    : expression;
}

/** The query of all filters, every one of them has to match. */
export function conditionsToQuery(
  conditions: FilterCondition[],
): Record<string, unknown> {
  const expressions = conditions
    .map(conditionToExpression)
    .filter((expression) => Object.keys(expression).length);

  return expressions.length > 1
    ? { $and: expressions }
    : (expressions[0] ?? {});
}

/** The count takes plain dates, `{ $date: x }` as used by the list fails there. */
export function withPlainDates<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map(withPlainDates) as T;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    if (entries.length === 1 && entries[0][0] === "$date") {
      return entries[0][1] as T;
    }
    return Object.fromEntries(
      entries.map(([key, item]) => [key, withPlainDates(item)]),
    ) as T;
  }
  return value;
}

/**
 * The facets only take conditions on scientific metadata, without NOT. A range is left out too:
 * the facets of the backend need both bounds and leave them out of the match.
 */
export function isPlainConditionList(conditions: FilterCondition[]): boolean {
  return conditions.every(
    (condition) =>
      !isDatasetCondition(condition) &&
      !condition.exclude &&
      condition.relation !== "RANGE",
  );
}

/** The shape the facet request takes. */
export function toFacetConditions(
  conditions: FilterCondition[],
): Pick<FilterCondition, "lhs" | "relation" | "rhs" | "unit">[] {
  return conditions.map(({ lhs, relation, rhs, unit }) => ({
    lhs,
    relation,
    rhs,
    unit,
  }));
}
