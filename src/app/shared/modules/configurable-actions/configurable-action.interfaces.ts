import { DataFiles_File } from "datasets/datafiles/datafiles.interfaces";

export type ActionValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: ActionValue }
  | ActionValue[];

export type ActionType =
  | "form"
  | "xhr"
  | "link"
  | "json-download"
  | "local"
  | "workflow";

export interface ActionExecutionContext {
  variables: Record<string, ActionValue>;
  actionItems: ActionItems;
  actionConfig: ActionConfig;
  result?: unknown;
  error?: unknown;
}

export type ActionHandlerResult =
  | void
  | boolean
  | Record<string, ActionValue>
  | Promise<void | boolean | Record<string, ActionValue>>;

export type ActionHandler = (
  context?: ActionExecutionContext,
) => ActionHandlerResult;

export interface ActionConfig {
  id: string;
  description?: string;
  order: number;
  label: string;
  files?: string;
  mat_icon?: string;
  icon?: string;
  type?: ActionType;
  handler?: string;
  archiveViewMode?: string | string[];
  requiresMarkForDeletionCodes?: boolean;
  url?: string;
  target?: string;
  authorization?: string[];
  method?: string;
  enabled?: string;
  disabled?: string;
  payload?: string;
  filename?: string;
  hidden?: string;
  variables?: Record<string, string>;
  inputs?: Record<string, string>;
  headers?: Record<string, string>;
  actions?: ActionConfig[];
  onSuccess?: ActionConfig[];
  onError?: ActionConfig[];
}

// export interface ActionItem {
//   pid: string;
//   sourceFolder?: string;
//   isPublished?: boolean;
// }

export interface ActionItemDataset {
  ownerGroup: string;
  pid: string;
  sourceFolder?: string;
  isPublished?: boolean;
  files?: DataFiles_File[];
}

export interface ActionItems {
  datasets: ActionItemDataset[];
  handlers?: Record<string, ActionHandler>;
}
