import { Proposal } from '../models';

export interface ProposalsState {
	list: Proposal[];
	hasFetched: boolean,
	selectedId: string,
};

export const initialProposalsState: ProposalsState = {
	list: [],
	hasFetched: false,
	selectedId: null,
};