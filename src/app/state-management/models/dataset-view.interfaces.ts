/**
 * Config-driven replacement for the old hardcoded ArchViewMode switch-case.
 * Each entry drives one tab in the dataset list's lifecycle-view toggle group.
 *
 * `query` is merged into the same Mongo-style fullquery filter used for every
 * other dataset filter (search text, facets, pagination, ...), so it composes
 * with them automatically - a view is just one more filter predicate, and
 * predicate composition is the fullquery endpoint's job. This is how every
 * built-in view (see dataset-views.defaults.ts) is expressed, and it should
 * stay the default choice for anything that's genuinely a filter on the
 * Dataset collection.
 *
 * `url` is the escape hatch for a view whose dataset list can't come from a
 * `query` fragment alone - e.g. one that depends on a join against another
 * collection, resolved by a dedicated backend endpoint. Prefer extending the
 * backend's fullquery filter vocabulary instead where possible (see
 * docs/dataset-list-view-configuration.md) - it composes with search/sort/
 * pagination/other filters for free, a `url` view does not, unless its
 * template forwards them explicitly.
 *
 * `variables`/`url`/`headers` follow the same `#token` / `{{ @var }}`
 * conventions as ActionConfig in the configurable-actions module (see
 * configurable-actions.defaults.ts): each entry in `variables` is either a
 * `#token` selector, or a literal value passed through unchanged. `url` and
 * each value in `headers` are then templates with `{{@name}}` placeholders
 * filled in from the resolved variables.
 */
export interface DatasetViewConfig {
  id: string;
  label: string;
  order: number;
  enabled?: boolean;
  query?: Record<string, unknown>;
  url?: string;
  headers?: Record<string, string>;
  variables?: Record<string, string>;
}

/**
 * Page-state context a DatasetViewConfig's `variables` can pull from via
 * `#token` selectors - the dataset-view equivalent of ActionItems/
 * contextItems in the configurable-actions module. Resolved centrally (in
 * DatasetEffects) rather than passed down from one specific component,
 * because the state a view's URL needs (search text, sort, pagination, the
 * public/my-data toggle) is written by several different components on the
 * dataset list page, not just the one that owns the view toggle itself.
 */
export interface DatasetViewContext {
  apiBaseUrl: string;
  token: string;
  tokenBearer: string;
  searchText: string;
  skip: number;
  limit: number;
  order: string;
  isPublished: boolean | "";
  user: unknown;
}

const CONTEXT_TOKENS: Record<string, keyof DatasetViewContext> = {
  "#apiBaseUrl": "apiBaseUrl",
  "#token": "token",
  "#tokenBearer": "tokenBearer",
  "#searchText": "searchText",
  "#skip": "skip",
  "#limit": "limit",
  "#order": "order",
  "#isPublished": "isPublished",
};

function resolveSelector(
  selector: string,
  context: DatasetViewContext,
): unknown {
  if (selector.startsWith("#user.")) {
    return selector
      .slice("#user.".length)
      .split(".")
      .reduce<unknown>(
        (value, key) =>
          value && typeof value === "object"
            ? (value as Record<string, unknown>)[key]
            : undefined,
        context.user,
      );
  }
  const contextKey = CONTEXT_TOKENS[selector];
  return contextKey ? context[contextKey] : selector;
}

/**
 * Resolves a DatasetViewConfig.variables map into concrete values: a value
 * starting with "#" is a selector into DatasetViewContext (or "#user.<path>"
 * for a field on the current user), anything else is a literal passed
 * through unchanged - mirroring ActionConfig.variables' "#token" convention,
 * minus the dataset-selection/cross-reference machinery that's specific to
 * acting on selected datasets (a view builds the list itself, it doesn't act
 * on a selection).
 */
export function resolveDatasetViewVariables(
  variables: Record<string, string> | undefined,
  context: DatasetViewContext,
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};
  Object.entries(variables ?? {}).forEach(([key, selector]) => {
    resolved[key] = selector.startsWith("#")
      ? resolveSelector(selector, context)
      : selector;
  });
  return resolved;
}

const TOKEN_PATTERN = /\{\{\s*@([\w.]+)\s*\}\}/g;

/**
 * Replaces `{{@name}}` placeholders in a template with resolved variables -
 * same syntax as ActionConfig.url/.headers in the configurable-actions
 * module.
 */
export function interpolateDatasetViewTemplate(
  template: string,
  resolvedVariables: Record<string, unknown>,
): string {
  return template.replace(TOKEN_PATTERN, (_match, token) => {
    const value = resolvedVariables[token];
    return value === undefined || value === null ? "" : String(value);
  });
}
