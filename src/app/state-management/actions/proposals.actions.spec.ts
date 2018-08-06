import { Proposal, Dataset } from '../models';
import {SelectProposalAction, SELECT_PROPOSAL } from './proposals.actions'; 
import {FetchProposalsAction, FETCH_PROPOSALS } from './proposals.actions'; 
import {FetchProposalsCompleteAction, FETCH_PROPOSALS_COMPLETE } from './proposals.actions'; 
import {FetchProposalsFailedAction, FETCH_PROPOSALS_FAILED } from './proposals.actions'; 
import {FetchProposalAction, FETCH_PROPOSAL } from './proposals.actions'; 
import {FetchProposalCompleteAction, FETCH_PROPOSAL_COMPLETE } from './proposals.actions'; 
import {FetchProposalFailedAction, FETCH_PROPOSAL_FAILED } from './proposals.actions'; 
import {FetchDatasetsForProposalAction, FETCH_DATASETS_FOR_PROPOSAL } from './proposals.actions'; 
import {FetchDatasetsForProposalCompleteAction, FETCH_DATASETS_FOR_PROPOSAL_COMPLETE } from './proposals.actions'; 
import {FetchDatasetsForProposalFailedAction, FETCH_DATASETS_FOR_PROPOSAL_FAILED } from './proposals.actions'; 


describe('SelectProposalAction', () => { 
	it('should create an action', () => { 
		const proposalId = "string";
		const action = new SelectProposalAction(proposalId); 
		expect({ ...action }).toEqual({ type: SELECT_PROPOSAL,  proposalId }); 
	}); 
});


describe('FetchProposalsAction', () => { 
	it('should create an action', () => { 
		
		const action = new FetchProposalsAction(); 
		expect({ ...action }).toEqual({ type: FETCH_PROPOSALS  }); 
	}); 
});


describe('FetchProposalsCompleteAction', () => { 
	it('should create an action', () => { 
		const proposals = [new Proposal() ]; 
		const action = new FetchProposalsCompleteAction(proposals); 
		expect({ ...action }).toEqual({ type: FETCH_PROPOSALS_COMPLETE,  proposals }); 
	}); 
});


describe('FetchProposalsFailedAction', () => { 
	it('should create an action', () => { 
		
		const action = new FetchProposalsFailedAction(); 
		expect({ ...action }).toEqual({ type: FETCH_PROPOSALS_FAILED  }); 
	}); 
});


describe('FetchProposalAction', () => { 
	it('should create an action', () => { 
		const proposalId = "string";
		const action = new FetchProposalAction(proposalId); 
		expect({ ...action }).toEqual({ type: FETCH_PROPOSAL,  proposalId }); 
	}); 
});


describe('FetchProposalCompleteAction', () => { 
	it('should create an action', () => { 
		const proposal = new Proposal(); 
		const action = new FetchProposalCompleteAction(proposal); 
		expect({ ...action }).toEqual({ type: FETCH_PROPOSAL_COMPLETE,  proposal }); 
	}); 
});


describe('FetchProposalFailedAction', () => { 
	it('should create an action', () => { 
		const action = new FetchProposalFailedAction();
		expect({ ...action }).toEqual({ type: FETCH_PROPOSAL_FAILED  }); 
	}); 
});


describe('FetchDatasetsForProposalAction', () => { 
	it('should create an action', () => { 
		const proposalId = "string";
		const action = new FetchDatasetsForProposalAction(proposalId); 
		expect({ ...action }).toEqual({ type: FETCH_DATASETS_FOR_PROPOSAL,  proposalId }); 
	}); 
});


describe('FetchDatasetsForProposalCompleteAction', () => { 
	it('should create an action', () => { 
		const datasets = [new Dataset()]; 
		const action = new FetchDatasetsForProposalCompleteAction(datasets); 
		expect({ ...action }).toEqual({ type: FETCH_DATASETS_FOR_PROPOSAL_COMPLETE,  datasets }); 
	}); 
});


describe('FetchDatasetsForProposalFailedAction', () => { 
	it('should create an action', () => { 
		
		const action = new FetchDatasetsForProposalFailedAction(); 
		expect({ ...action }).toEqual({ type: FETCH_DATASETS_FOR_PROPOSAL_FAILED  }); 
	}); 
});
