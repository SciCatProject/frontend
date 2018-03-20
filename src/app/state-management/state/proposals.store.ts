import { Proposal } from '../models';

export interface ProposalState {
	list: Proposal[];
};

export const initialProposalState: ProposalState = {
	list: [
		new Proposal({
			proposalId: '123456789',
			email: 'e@mail.com',
			title: 'My first proposal',
			abstract: 'Investigate something interesting',
			ownerGroup: '123456789-group'
		}),
		new Proposal({
			proposalId: '34234234',
			email: 'sddfs@sdfsd.com',
			title: 'Another proposal',
			abstract: 'Another abstract blablabla',
			ownerGroup: '34234234-group'
		})
	],
};