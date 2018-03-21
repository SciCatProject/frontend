import { Proposal } from '../models';

export interface ProposalsState {
	list: Proposal[];
	selectedId: string,
};

export const initialProposalsState: ProposalsState = {
	list: [],
	selectedId: null,
};