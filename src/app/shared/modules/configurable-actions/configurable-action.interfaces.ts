import { DataFiles_File } from "datasets/datafiles/datafiles.interfaces";
import { Instrument } from "@scicatproject/scicat-sdk-ts-angular";
import { DynamicField } from "../dialog/dialog.component";
import { OutputDatasetObsoleteDto } from "@scicatproject/scicat-sdk-ts-angular";

export type DialogField = { key: string } & DynamicField;

export interface DialogConfig {
  title?: string;
  description?: string;
  width?: string;
  fields: DialogField[];
}

export const ACTION_TYPES = [
  "form",
  "link",
  "json-download",
  "xhr",
  "dialog",
] as const;

export type ActionType = (typeof ACTION_TYPES)[number];

export function isActionType(value: unknown): value is ActionType {
  return ACTION_TYPES.includes(value as ActionType);
}

export interface ActionConfig {
  id: string;
  description?: string;
  order: number;
  label: string;
  files?: "all" | "selected";
  mat_icon?: string;
  icon?: string;
  type?: ActionType;
  url: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  authorization: string[];
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  enabled?: string | boolean;
  disabled?: string | boolean;
  payload?: string;
  filename?: string;
  hidden?: string;
  inputs?: Record<string, string>;
  variables?: Record<string, unknown>;
  headers?: Record<string, string>;
  onSuccess?: ActionType;
  dialog?: DialogConfig;
}

function isActionConfig(value: unknown): value is ActionConfig {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as ActionConfig).id === "string" &&
    typeof (value as ActionConfig).order === "number" &&
    typeof (value as ActionConfig).label === "string" &&
    typeof (value as ActionConfig).url === "string" &&
    Array.isArray((value as ActionConfig).authorization)
  );
}

/**
 * Warns on the console about any `type`/`onSuccess` values that aren't in
 * ACTION_TYPES, so a typo or unsupported action type in a config file is
 * caught at config-load time instead of silently failing at click-time.
 */
export function validateActionConfigs(
  actions: ActionConfig[] | undefined,
  configKey: string,
): void {
  actions?.forEach((action) => {
    if (action.type !== undefined && !isActionType(action.type)) {
      console.warn(
        `${configKey}: action "${action.id}" has unknown type "${action.type}". ` +
          `Supported action types are: ${ACTION_TYPES.join(", ")}.`,
      );
    }
    if (action.onSuccess !== undefined && !isActionType(action.onSuccess)) {
      console.warn(
        `${configKey}: action "${action.id}" has unknown onSuccess type "${action.onSuccess}". ` +
          `Supported action types are: ${ACTION_TYPES.join(", ")}.`,
      );
    }
  });
}

/**
 * Scans every top-level property of the app config and validates any array
 * that looks like an ActionConfig[] (by shape, not by key name). This means
 * a new `somethingActions: ActionConfig[]` field on AppConfigInterface gets
 * validated automatically, without needing a matching call to be added here.
 */
export function validateAllActionConfigsIn(config: object): void {
  Object.entries(config as Record<string, unknown>).forEach(([key, value]) => {
    if (
      Array.isArray(value) &&
      value.length > 0 &&
      value.every(isActionConfig)
    ) {
      validateActionConfigs(value as ActionConfig[], key);
    }
  });
}

export interface ActionItemDataset extends OutputDatasetObsoleteDto {
  files?: DataFiles_File[];
}

export interface ActionItems {
  datasets: ActionItemDataset[];
  instruments?: Instrument[];
  [key: string]: unknown;
}

export interface ActionButtonStyle {
  raised?: boolean;
  color?: "primary" | "accent" | "warn";
}
