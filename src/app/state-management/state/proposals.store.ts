import {
  OutputDatasetObsoleteDto,
  ProposalClass,
} from "@scicatproject/scicat-sdk-ts-angular";

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
};
