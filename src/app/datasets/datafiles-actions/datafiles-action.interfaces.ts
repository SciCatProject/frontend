export interface ActionConfig {
  id: string;
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
}

export interface ActionDataset {
  pid: string;
  sourceFolder: string;
}
