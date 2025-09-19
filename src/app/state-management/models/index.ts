import {
  FilterConfig,
  ConditionConfig,
} from "state-management/state/user.store";

export interface Settings {
  tapeCopies: string;
  datasetCount: number;
  jobCount: number;
  darkTheme: false;
}

export interface TableColumn {
  name: string;
  header?: string;
  path?: string;
  order: number;
  type: "standard" | "custom";
  enabled: boolean;
  width?: number;
}

export interface LabelsLocalization {
  datasetDefault: Record<string, string>;
  datasetCustom: Record<string, string>;
  proposalDefault: Record<string, string>;
}

export interface DatasetDetailComponentConfig {
  enableCustomizedComponent: boolean;
  customization: CustomizationItem[];
}
export enum DatasetViewFieldType {
  TEXT = "text",
  DATE = "date",
  LINKY = "linky",
  COPY = "copy",
  TAG = "tag",
  INTERNALLINK = "internalLink",
}

export enum InternalLinkType {
  DATASETS = "inputDatasets",
  SAMPLES = "sampleIds",
  INSTRUMENTS = "instrumentIds",
  INSTRUMENTS_NAME = "instrumentName",
  PROPOSALS = "proposalIds",
}

interface AttachmentOptions {
  limit: number;
  size: "small" | "medium" | "large";
}
type viewModeOptions = "table" | "json" | "tree";

export interface CustomizationItem {
  type: CustomizationType;
  label: string;
  order: number;
  row: number;
  col: number;
  fields?: Field[];
  source?: string;
  options?: AttachmentOptions;
  viewMode?: viewModeOptions;
}

export interface Field {
  element: FieldType;
  source: string;
  order: number;
  path?: string;
}

// Type alias for allowed customization types
type CustomizationType =
  | "regular"
  | "scientificMetadata"
  | "datasetJsonView"
  | "attachments";

// Type alias for allowed field types
type FieldType = "text" | "copy" | "linky" | "tag" | "date";

export interface DatasetsListSettings {
  columns: TableColumn[];
  filters: FilterConfig[];
  conditions: ConditionConfig[];
}

export enum MessageType {
  Success = "success",
  Error = "error",
  Info = "info",
}

export interface Message {
  content: string;
  type: MessageType;
  duration: number;
}

export class Message implements Message {
  constructor(content: string, type: MessageType, duration: number) {
    this.content = content;
    this.type = type;
    this.duration = duration;
  }
}

export enum ArchViewMode {
  all = "all",
  archivable = "archivable",
  retrievable = "retrievable",
  work_in_progress = "work in progress",
  system_error = "system error",
  user_error = "user error",
}
export enum JobViewMode {
  myJobs = "my jobs",
  allJobs = "all jobs",
}

type ScientificConditionRelation =
  | "EQUAL_TO_NUMERIC"
  | "EQUAL_TO_STRING"
  | "GREATER_THAN"
  | "LESS_THAN"
  | "GREATER_THAN_OR_EQUAL"
  | "LESS_THAN_OR_EQUAL"
  | "RANGE"
  | "EQUAL_TO";

export interface ScientificCondition {
  lhs: string;
  relation: ScientificConditionRelation;
  rhs: string | number | number[];
  unit: string;
  unitsOptions?: string[];
}

export interface GenericFilters {
  sortField: string;
  skip: number;
  limit: number;
}

export interface DatasetFilters extends GenericFilters {
  modeToggle: ArchViewMode;
  text: string;
  ownerGroup: string[];
  type: string[];
  creationTime: { begin: string; end: string } | null;
  creationLocation: string[];
  keywords: string[];
  mode: Record<string, unknown>;
  scientific: ScientificCondition[];
  isPublished: boolean | "";
  pid: string | { $regex: string };
}

export interface SampleFilters extends GenericFilters {
  text: string;
  characteristics: ScientificCondition[];
}

export interface LogbookFilters extends GenericFilters {
  textSearch: string;
  showBotMessages: boolean;
  showUserMessages: boolean;
  showImages: boolean;
}

export interface JobFilters extends GenericFilters {
  mode: Record<string, string> | undefined;
}
