import {
  User,
  UserIdentity,
  AccessGroup,
  Job,
  Dataset,
  RawDataset,
  Proposal,
  Policy,
  Sample
} from "shared/sdk/models";
export {
  User,
  UserIdentity,
  AccessGroup,
  Job,
  Dataset,
  RawDataset,
  Proposal,
  Policy,
  Sample
};

import { DatasetInterface } from "shared/sdk";
export { DatasetInterface };

export interface Settings {
  tapeCopies: string;
  datasetCount: number;
  jobCount: number;
  darkTheme: false;
}

export enum MessageType {
  Success = "success",
  Error = "error"
}

export class Message {
  content: string;
  type: MessageType;
  duration: number;
}

//export type ArchViewMode = "all" | "archivable" | "retrievable" | "erroneous";
export enum ArchViewMode {
  all = "all",
  archivable = "archivable",
  retrievable = "retrievable",
  erroneous = "erroneous"
}
export enum JobViewMode { myJobs = "my jobs", allJobs = "all jobs"}

type ScientificConditionRelation =
  | "EQUAL_TO_NUMERIC"
  | "EQUAL_TO_STRING"
  | "GREATER_THAN"
  | "LESS_THAN";

export interface ScientificCondition {
  lhs: string;
  relation: ScientificConditionRelation;
  rhs: string | number;
}

export interface DatasetFilters {
  text: string;
  ownerGroup: string[];
  type: string[];
  creationTime: { begin: string; end: string };
  creationLocation: string[];
  skip: number;
  limit: number;
  keywords: string[];
  sortField: string;
  mode: {};
  scientific: ScientificCondition[];
}

export interface SampleFilters {
  sortField: string;
}

export interface PolicyFilters {
  sortField: string;
  skip: number;
  limit: number;
}
