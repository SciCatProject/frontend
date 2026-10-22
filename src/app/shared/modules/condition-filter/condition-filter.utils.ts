import * as Math from "mathjs";
import {
  FilterCondition,
  FilterConditionRelation,
} from "state-management/models";
import { ConditionConfig } from "state-management/state/user.store";
import { getDatasetField } from "./condition-filter.fields";

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
    label: "At least",
    symbol: "≥",
  },
  {
    value: "LESS_THAN_OR_EQUAL",
    label: "At most",
    symbol: "≤",
  },
  { value: "RANGE", label: "Between", symbol: "↔" },
];

const EQUALITY_RELATIONS: FilterConditionRelation[] = [
  "EQUAL_TO",
  "EQUAL_TO_NUMERIC",
  "EQUAL_TO_STRING",
];

const isBlank = (value: unknown): boolean =>
  value === undefined || value === null || value === "";

const isNumeric = (value: unknown): boolean =>
  !isBlank(value) && !isNaN(Number(value));

/** Dataset fields hold lists and text, scientific metadata holds measurements. */
export const isDatasetCondition = (condition: FilterCondition): boolean =>
  condition.source === "dataset";

/** What was typed for a dataset field, a list is shown as `a, b`. */
const datasetText = (rhs: FilterCondition["rhs"]): string =>
  Array.isArray(rhs) ? rhs.join(", ") : String(rhs ?? "");

/** The values of a list field, typed as `a, b, c`. */
export function splitValues(rhs: FilterCondition["rhs"]): string[] {
  return datasetText(rhs)
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

/** The filters that are switched on and complete, the ones that are applied. */
export function getActiveConfigs(
  configs: ConditionConfig[],
): ConditionConfig[] {
  return configs.filter(
    ({ enabled, condition }) => enabled && isConditionComplete(condition),
  );
}

/** A condition can only filter once it has a value (or a bound for ranges). */
export function isConditionComplete(condition: FilterCondition): boolean {
  if (!condition.lhs) return false;
  if (isDatasetCondition(condition)) {
    if (condition.relation === "RANGE") {
      return (
        Array.isArray(condition.rhs) &&
        condition.rhs.some((bound) => !isBlank(bound))
      );
    }
    return condition.relation === "IN"
      ? splitValues(condition.rhs).length > 0
      : datasetText(condition.rhs).trim() !== "";
  }
  if (condition.relation === "RANGE") {
    return (
      Array.isArray(condition.rhs) &&
      condition.rhs.some((bound) => !isBlank(bound))
    );
  }
  return !isBlank(condition.rhs);
}

/** Leaves out the defaults, so saved conditions stay small and old ones look the same. */
function withoutDefaults({
  source,
  exclude,
  ...condition
}: FilterCondition): FilterCondition {
  return {
    ...condition,
    ...(source === "dataset" && { source }),
    ...(exclude && { exclude }),
  };
}

/** Converts what the user typed into the values the query needs. */
export function normalizeCondition(
  condition: FilterCondition,
): FilterCondition {
  return withoutDefaults(normalizeValue(condition));
}

function normalizeValue(condition: FilterCondition): FilterCondition {
  const unit = condition.unit || "";

  if (isDatasetCondition(condition)) {
    if (condition.relation === "RANGE") {
      const [from, to] = Array.isArray(condition.rhs) ? condition.rhs : [];
      return {
        ...condition,
        rhs: [
          isBlank(from) ? undefined : String(from),
          isBlank(to) ? undefined : String(to),
        ],
        unit: "",
      };
    }
    return {
      ...condition,
      rhs:
        condition.relation === "IN"
          ? splitValues(condition.rhs)
          : datasetText(condition.rhs).trim(),
      unit: "",
    };
  }

  if (condition.relation === "RANGE") {
    const [min, max] = Array.isArray(condition.rhs) ? condition.rhs : [];
    return {
      ...condition,
      rhs: [
        isBlank(min) ? undefined : Number(min),
        isBlank(max) ? undefined : Number(max),
      ],
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

/** The conditions that are sent to the backend, enabled and filled in only. */
export function toActiveConditions(
  configs: ConditionConfig[] = [],
): FilterCondition[] {
  return configs
    .filter(
      ({ enabled, condition }) => enabled && isConditionComplete(condition),
    )
    .map(({ condition }) => normalizeCondition(condition));
}

/** Short readable form, used for the chips: `temperature ≥ 20 celsius`. */
export function describeCondition(condition: FilterCondition): string {
  const description = describeValue(condition);
  return condition.exclude ? `not ${description}` : description;
}

function describeValue(condition: FilterCondition): string {
  if (isDatasetCondition(condition)) {
    const label = getDatasetField(condition.lhs)?.label ?? condition.lhs;
    if (condition.relation === "RANGE") {
      const [from, to] = Array.isArray(condition.rhs) ? condition.rhs : [];
      return `${label}: ${isBlank(from) ? "…" : from} – ${isBlank(to) ? "…" : to}`;
    }
    return condition.relation === "IN"
      ? `${label}: ${splitValues(condition.rhs).join(", ")}`
      : `${label} contains "${datasetText(condition.rhs).trim()}"`;
  }

  const unit = condition.unit ? ` ${condition.unit}` : "";

  if (condition.relation === "RANGE") {
    const [min, max] = Array.isArray(condition.rhs) ? condition.rhs : [];
    const range = `${isBlank(min) ? "…" : min} – ${isBlank(max) ? "…" : max}`;
    return `${condition.lhs}: ${range}${unit}`;
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

  switch (relation) {
    case "EQUAL_TO":
    case "EQUAL_TO_NUMERIC":
    case "EQUAL_TO_STRING":
      query[valuePath] = { $eq: queryValue };
      break;

    case "GREATER_THAN":
      query[valuePath] = { $gt: queryValue };
      break;

    case "LESS_THAN":
      query[valuePath] = { $lt: queryValue };
      break;

    case "GREATER_THAN_OR_EQUAL":
      query[valuePath] = { $gte: queryValue };
      break;

    case "LESS_THAN_OR_EQUAL":
      query[valuePath] = { $lte: queryValue };
      break;

    case "RANGE":
      if (Array.isArray(rhs) && rhs.length === 2) {
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
          queryUnit = convertToSIUnit(lhs, (min ?? max) as number, unit).siUnit;
        }

        if (convertedMin !== null && convertedMin !== undefined) {
          query[valuePath] = { ...query[valuePath], $gte: convertedMin };
        }
        if (convertedMax !== null && convertedMax !== undefined) {
          query[valuePath] = { ...query[valuePath], $lte: convertedMax };
        }
      }
      break;

    default:
      console.warn(`Unknown relation type: ${relation}`);
  }

  if (queryUnit) {
    query[`${metadataPath(lhs)}.unitSI`] = { $eq: queryUnit };
  }
  return query;
}

export const escapeRegex = (text: string): string =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function datasetConditionToQuery({
  lhs,
  relation,
  rhs,
}: FilterCondition): Record<string, unknown> {
  if (relation === "RANGE") {
    const [from, to] = Array.isArray(rhs) ? rhs : [];
    const range = {
      // dates are typed like in the date filter of the sidebar, the list ignores plain text
      ...(!isBlank(from) && { $gte: { $date: startOfDay(String(from)) } }),
      // like the sidebar, the end day is included
      ...(!isBlank(to) && { $lte: { $date: startOfDay(String(to), 1) } }),
    };
    return Object.keys(range).length ? { [lhs]: range } : {};
  }

  return relation === "IN"
    ? { [lhs]: { $in: splitValues(rhs) } }
    : {
        [lhs]: {
          $regex: escapeRegex(datasetText(rhs).trim()),
          $options: "i",
        },
      };
}

/** The start of a day (`2026-01-31`) in the local time zone as an ISO string. */
function startOfDay(date: string, addDays = 0): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day + addDays).toISOString();
}

/** The query of one condition, NOT leaves out what matches. */
function conditionToExpression(
  condition: FilterCondition,
): Record<string, unknown> {
  const expression = isDatasetCondition(condition)
    ? datasetConditionToQuery(condition)
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

/** The facets only take conditions on scientific metadata, without NOT. */
export function isPlainConditionList(conditions: FilterCondition[]): boolean {
  return conditions.every(
    (condition) => !isDatasetCondition(condition) && !condition.exclude,
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
