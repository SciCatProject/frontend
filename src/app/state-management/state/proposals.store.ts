import { Proposal, Dataset } from "../models";

export interface DateRange {
  begin: string;
  end: string;
}

export interface ProposalFilters {
  text: string;
  skip: number;
  limit: number;
  sortField: string;
  dateRange: DateRange;
}

export interface ProposalDatesetFilters {
  text: string;
  skip: number;
  limit: number;
  sortField: string;
}

export interface ProposalsState {
  proposals: Proposal[];
  currentProposal: Proposal | undefined;
  parentProposal: Proposal | undefined;
  datasets: Dataset[];

  proposalsCount: number;
  datasetsCount: number;

  hasPrefilledFilters: boolean;
  proposalFilters: ProposalFilters;
  datasetFilters: ProposalDatesetFilters;
}

export const initialProposalsState: ProposalsState = {
  proposals: [],
  currentProposal: undefined,
  parentProposal: undefined,
  datasets: [],

  proposalsCount: 0,
  datasetsCount: 0,

  hasPrefilledFilters: false,

  proposalFilters: {
    text: "",
    skip: 0,
    limit: 25,
    sortField: "createdAt:desc",
    dateRange: {
      begin: "",
      end: "",
    },
  },

  datasetFilters: {
    text: "",
    skip: 0,
    limit: 25,
    sortField: "creationTime:desc",
  },
};
