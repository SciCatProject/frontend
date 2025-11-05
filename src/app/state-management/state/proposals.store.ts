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
  _id: string;
  label?: string;
  count: number;
}
export interface FacetCounts {
  [field: string]: FacetCount[];
}

export interface ProposalFilters {
  fields: {
    proposalId?: string[];
    title?: string[];
    abstract?: string[];
    startTime?: DateRange | null;
    endTime?: DateRange | null;
    instrumentIds?: string[];
    pi_firstname?: string[];
    pi_lastname?: string[];
    pi_email?: string[];
    ownerGroup?: string[];
    accessGroups?: string[];
    isPublished?: boolean | null;
    type?: string[];
    text?: string;
  };
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
    fields: {
      startTime: null,
      instrumentIds: [],
      pi_lastname: [],
    },
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
      width: 180,
      enabled: true,
    },
    {
      name: "title",
      width: 250,
      enabled: true,
    },
    {
      name: "abstract",
      type: "hoverContent",
      width: 150,
      enabled: true,
    },
    {
      name: "startTime",
      type: "date",
      format: "yyyy/MM/dd",
      width: 200,
      enabled: true,
    },
    {
      name: "pi_lastname",
      enabled: true,
    },
    { name: "type", width: 200, enabled: true },
    {
      name: "numberOfDatasets",
      width: 150,
      enabled: true,
    },
  ],
};
