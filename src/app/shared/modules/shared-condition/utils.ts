import * as Math from "mathjs";

export interface ScientificCondition {
  lhs: string;
  rhs: any;
  relation: string;
  unit?: string;
  enabled?: boolean;
}

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
  condition: ScientificCondition,
): Record<string, any> {
  const { lhs, rhs, relation, unit } = condition;

  if (!lhs || rhs === null || rhs === undefined) {
    return {};
  }

  const query: Record<string, any> = {};
  const valuePath = unit
    ? `scientificMetadata.${lhs}.valueSI`
    : `scientificMetadata.${lhs}.value`;

  let queryValue = rhs;
  let queryUnit = unit;

  if (unit) {
    const converted = convertToSIUnit(lhs, rhs, unit);
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
          convertedMin = convertToSIUnit(lhs, min, unit).value;
          convertedMax = convertToSIUnit(lhs, max, unit).value;
          queryUnit = convertToSIUnit(lhs, min, unit).siUnit;
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
    query[`scientificMetadata.${lhs}.unitSI`] = { $eq: queryUnit };
  }
  return query;
}

export function scientificConditionsToQuery(
  conditions: ScientificCondition[],
): Record<string, any> {
  return conditions
    .filter((c) => c.enabled !== false)
    .reduce(
      (query, condition) => ({
        ...query,
        ...conditionToMongoQuery(condition),
      }),
      {},
    );
}
