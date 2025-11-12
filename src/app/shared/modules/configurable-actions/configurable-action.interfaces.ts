import { DataFiles_File } from "datasets/datafiles/datafiles.interfaces";

export interface ActionConfig {
  id: string;
  description?: string;
  order: number;
  label: string;
  files?: string;
  mat_icon?: string;
  icon?: string;
  type?: string;
  url: string;
  target: string;
  authorization: string[];
  method?: string;
  enabled?: string;
  disabled?: string;
  payload?: string;
  filename?: string;
  hidden?: string;
  variables?: Record<string, string>;
  inputs?: Record<string, string>;
  headers?: Record<string, string>;
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
}
