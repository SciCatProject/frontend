import { Proposal } from '../models';

export interface ProposalsState {
	proposals: {[proposalId: string]: Proposal};
	hasFetched: boolean,
	selectedId: string,
};

export const initialProposalsState: ProposalsState = {
	proposals: {},
	hasFetched: false,
	selectedId: null,
};
