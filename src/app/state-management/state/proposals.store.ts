import { Proposal } from "../models";

export interface ProposalFilters {
  text: string;
  skip: number;
  limit: number;
  sortField: string;
}

export interface ProposalsState {
  proposals: { [proposalId: string]: Proposal };
  currentProposal: Proposal;
  datasets: { [datasetId: string]: any };
  hasFetched: boolean;
  selectedId: string;
  datasetCount: number;
  proposalCount: number;
  filters: ProposalFilters;
  propFilters: ProposalFilters;
  proposalsLoading: boolean;

  addingAttachment: boolean;
  deletingAttachment: boolean;
}

export const initialProposalsState: ProposalsState = {
  proposals: {},
  currentProposal: null,
  datasets: {},
  hasFetched: false,
  selectedId: null,
  datasetCount: null,
  proposalCount: null,
  filters: {
    text: "",
    skip: 0,
    limit: 30,
    sortField: "createdAt desc"
  },
  propFilters: {
    text: "",
    skip: 0,
    limit: 30,
    sortField: "createdAt desc"
  },
  proposalsLoading: false,

  addingAttachment: false,
  deletingAttachment: false
};
