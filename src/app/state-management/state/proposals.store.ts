import {
  OutputDatasetObsoleteDto,
  ProposalClass,
} from "@scicatproject/scicat-sdk-ts-angular";
import { TableField } from "shared/modules/dynamic-material-table/models/table-field.model";

export interface DateRange {
  begin: string;
  end: string;
}

export interface FacetCount {
  _id?: string;
  count: number;
}
export interface FacetCounts {
  [field: string]: FacetCount[];
}

export interface ProposalFilters {
  fields: Record<string, string | DateRange>;
  skip: number;
  limit: number;
  sortField: string;
}

export interface ProposalDatesetFilters {
  text: string;
  skip: number;
  limit: number;
  sortField: string;
}

export interface ProposalsState {
  proposals: ProposalClass[];
  currentProposal: ProposalClass | undefined;
  parentProposal: ProposalClass | undefined;
  relatedProposals: (ProposalClass & { relation: string })[];
  relatedProposalsCount: number;
  datasets: OutputDatasetObsoleteDto[];

  columns: TableField<any>[];
  proposalsCount: number;
  datasetsCount: number;
  facetCounts: FacetCounts;

  hasPrefilledFilters: boolean;
  proposalFilters: ProposalFilters;
  datasetFilters: ProposalDatesetFilters;

  relatedProposalsFilters: {
    skip: number;
    limit: number;
    sortField: string;
  };
}

export const initialProposalsState: ProposalsState = {
  proposals: [],
  currentProposal: undefined,
  parentProposal: undefined,
  relatedProposals: [],
  relatedProposalsCount: 0,
  datasets: [],

  facetCounts: {},

  proposalsCount: 0,
  datasetsCount: 0,

  hasPrefilledFilters: false,

  proposalFilters: {
    fields: {},
    skip: 0,
    limit: 25,
    sortField: "createdAt:desc",
  },

  datasetFilters: {
    text: "",
    skip: 0,
    limit: 25,
    sortField: "creationTime:desc",
  },

  relatedProposalsFilters: {
    skip: 0,
    limit: 25,
    sortField: "creationTime:desc",
  },

  columns: [
    {
      name: "proposalId",
      icon: "perm_device_information",
      width: 250,
      enabled: true,
    },
    {
      name: "startTime",
      icon: "date_range",
      width: 250,
      enabled: true,
    },
    {
      name: "endTime",
      icon: "date_range",
      width: 250,
      enabled: true,
    },
    { name: "type", icon: "badge", width: 200, enabled: true },
    {
      name: "title",
      icon: "description",
      width: 250,
      enabled: true,
    },
    {
      name: "abstract",
      icon: "chrome_reader_mode",
      width: 250,
      enabled: true,
    },
    {
      name: "firstname",
      icon: "person",
      enabled: true,
    },
    {
      name: "lastname",
      enabled: true,
    },
    { name: "email", icon: "email", width: 200, enabled: true },
    {
      name: "parentProposalId",
      icon: "badge",
      enabled: true,
    },
    {
      name: "pi_firstname",
      icon: "person_pin",
      enabled: true,
    },
    {
      name: "pi_lastname",
      icon: "person_pin",
      enabled: true,
    },
    {
      name: "pi_email",
      icon: "email",
      enabled: true,
    },
  ],
};
