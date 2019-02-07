import { Proposal, RawDataset } from "../models";

export interface ProposalsState {
  proposals: { [proposalId: string]: Proposal };
  datasets: { [datasetId: string]: RawDataset };
  hasFetched: boolean;
  selectedId: string;
}

export const initialProposalsState: ProposalsState = {
  proposals: {},
  datasets: {},
  hasFetched: false,
  selectedId: null
};
