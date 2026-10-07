import { cloneDeepWith, get } from "lodash-es";
import { DatasetViewMode } from "state-management/models";

export interface ViewModeUser {
  email?: string;
  username?: string;
  accessGroups?: string[];
}

const USER = "#user.";
// same syntax as configurable action selectors: #user.<path>, e.g.
// #user.email or #user.accessGroups[0]
const PLACEHOLDER = /^#user\.[\w-]+(?:\.[\w-]+|\[\d+\])*$/;

function resolvePlaceholder(value: string, user?: ViewModeUser | null) {
  const resolved = get(user, value.slice(USER.length));
  if (resolved !== undefined) return resolved;
  // most likely a typo in the config; null keeps it visible in the query
  console.warn(`Dataset view mode placeholder ${value} has no value`);
  return null;
}

export function resolveUserPlaceholders(
  query: unknown,
  user?: ViewModeUser | null,
): unknown {
  return cloneDeepWith(query, (value) =>
    typeof value === "string" && PLACEHOLDER.test(value)
      ? resolvePlaceholder(value, user)
      : undefined,
  );
}

// exempt users (e.g. admins) don't get the checkbox and see the whole view
export function checkboxAppliesTo(
  viewMode: DatasetViewMode | undefined,
  user?: ViewModeUser | null,
): boolean {
  const checkbox = viewMode?.checkbox;
  if (!checkbox) return false;
  const groups = user?.accessGroups ?? [];
  return !(checkbox.exemptGroups ?? []).some((g) => groups.includes(g));
}

// the checkbox where is ANDed, not merged, so neither can overwrite the
// other's conditions
export function buildViewModeQuery(
  viewMode: DatasetViewMode | undefined,
  checked: boolean,
  user?: ViewModeUser | null,
): Record<string, unknown> {
  // placeholders only replace values, so the shapes are kept
  const query = resolveUserPlaceholders(viewMode?.where ?? {}, user) as Record<
    string,
    unknown
  >;
  if (!checked || !checkboxAppliesTo(viewMode, user)) return query;
  return {
    $and: [query, resolveUserPlaceholders(viewMode.checkbox.where, user)],
  };
}
