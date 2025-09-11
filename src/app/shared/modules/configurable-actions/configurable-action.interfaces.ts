import { DatasetClass } from "@scicatproject/scicat-sdk-ts-angular";

export interface ActionConfig {
  id: string;
  description?: string;
  order: number;
  label: string;
  files: string;
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
}

// export interface ActionItem {
//   pid: string;
//   sourceFolder?: string;
//   isPublished?: boolean;
// }

export interface ActionItems {
  datasets: {
    pid: string;
    sourceFolder?: string;
    isPublished?: boolean;
    files?: DataFiles_File[];
  }[],
}