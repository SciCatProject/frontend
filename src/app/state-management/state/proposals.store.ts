import { Proposal, Dataset } from "../models";

export interface ProposalFilters {
  text: string;
  skip: number;
  limit: number;
  sortField: string;
  dateRange: {
    begin: string;
    end: string;
  };
}

export interface ProposalDatesetFilters {
  text: string;
  skip: number;
  limit: number;
  sortField: string;
}

export interface ProposalsState {
  proposals: Proposal[];
  currentProposal: Proposal;
  datasets: Dataset[];

  proposalsCount: number;
  datasetsCount: number;

  proposalFilters: ProposalFilters;
  datasetFilters: ProposalDatesetFilters;
}

export const initialProposalsState: ProposalsState = {
  proposals: [],
  currentProposal: null,
  datasets: [],

  proposalsCount: null,
  datasetsCount: null,

  proposalFilters: {
    text: "",
    skip: 0,
    limit: 25,
    sortField: "createdAt:desc",
    dateRange: null
  },

  datasetFilters: {
    text: "",
    skip: 0,
    limit: 25,
    sortField: "creationTime:desc"
  }
};
