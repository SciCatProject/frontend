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

export type ActionType = "form" | "link" | "json-download" | "xhr" | "dialog";

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
  enabled?: string;
  disabled?: string;
  payload?: string;
  filename?: string;
  hidden?: string;
  inputs?: Record<string, string>;
  variables?: Record<string, unknown>;
  headers?: Record<string, string>;
  onSuccess?: ActionType;
  dialog?: DialogConfig;
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
