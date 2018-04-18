import { Proposal, Dataset } from '../models';

export interface ProposalsState {
	proposals: {[proposalId: string]: Proposal};
	datasets: {[datasetId: string]: Dataset};
	hasFetched: boolean,
	selectedId: string,
};

export const initialProposalsState: ProposalsState = {
	proposals: {},
	datasets: {},
	hasFetched: false,
	selectedId: null,
};
