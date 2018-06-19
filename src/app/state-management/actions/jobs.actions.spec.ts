import {Job} from 'shared/sdk/models';
import {SubmitAction, SUBMIT } from './jobs.actions'; 
import {RETRIEVE } from './jobs.actions'; 
import {UI_STORE } from './jobs.actions'; 
import {SubmitCompleteAction, SUBMIT_COMPLETE } from './jobs.actions'; 
import {FailedAction, FAILED } from './jobs.actions'; 
import {RetrieveCompleteAction, RETRIEVE_COMPLETE } from './jobs.actions'; 
import {ChildRetrieveAction, CHILD_RETRIEVE } from './jobs.actions'; 
import {ChildRetrieveCompleteAction, CHILD_RETRIEVE_COMPLETE } from './jobs.actions'; 
import {SearchIDAction, SEARCH_ID } from './jobs.actions'; 
import {SearchIDCompleteAction, SEARCH_ID_COMPLETE } from './jobs.actions'; 
import {SearchIDFailedAction, SEARCH_ID_FAILED } from './jobs.actions'; 
import {CurrentJobAction, SELECT_CURRENT } from './jobs.actions'; 
import {SortUpdateAction, SORT_UPDATE } from './jobs.actions'; 
import {SORT_UPDATE_COMPLETE } from './jobs.actions'; 
import {SORT_FAILED } from './jobs.actions'; 
import {SORT_VALUE_UPDATE } from './jobs.actions'; 


describe('SubmitAction', () => { 
	it('should create an action', () => { 
		const job = new Job();
		const action = new SubmitAction(job); 
		expect({ ...action }).toEqual({ type: SUBMIT,  job }); 
	}); 
});

describe('SubmitCompleteAction', () => { 
	it('should create an action', () => { 
		const job = new Job();
		const action = new SubmitCompleteAction(job); 
		expect({ ...action }).toEqual({ type: SUBMIT_COMPLETE,  job }); 
	}); 
});


describe('FailedAction', () => { 
	it('should create an action', () => { 
		const error = new Error; 
		const action = new FailedAction(error); 
		expect({ ...action }).toEqual({ type: FAILED,  error }); 
	}); 
});


describe('RetrieveCompleteAction', () => { 
	it('should create an action', () => { 
		const jobsets = [{id:1}]; 
		const action = new RetrieveCompleteAction(jobsets); 
		expect({ ...action }).toEqual({ type: RETRIEVE_COMPLETE,  jobsets }); 
	}); 
});


describe('ChildRetrieveAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new ChildRetrieveAction(payload); 
		expect({ ...action }).toEqual({ type: CHILD_RETRIEVE,  payload }); 
	}); 
});


describe('ChildRetrieveCompleteAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new ChildRetrieveCompleteAction(payload); 
		expect({ ...action }).toEqual({ type: CHILD_RETRIEVE_COMPLETE,  payload }); 
	}); 
});


describe('SearchIDAction', () => { 
	it('should create an action', () => { 
		const id = "expectedstring";
		const action = new SearchIDAction(id); 
		expect({ ...action }).toEqual({ type: SEARCH_ID,  id }); 
	}); 
});


describe('SearchIDCompleteAction', () => { 
	it('should create an action', () => { 
		const jobset = [{id:1}]; 
		const action = new SearchIDCompleteAction(jobset); 
		expect({ ...action }).toEqual({ type: SEARCH_ID_COMPLETE,  jobset }); 
	}); 
});


describe('SearchIDFailedAction', () => { 
	it('should create an action', () => { 
		const error = new Error; 
		const action = new SearchIDFailedAction(error); 
		expect({ ...action }).toEqual({ type: SEARCH_ID_FAILED,  error }); 
	}); 
});


describe('CurrentJobAction', () => { 
	it('should create an action', () => { 
		const job = new Job();
		const action = new CurrentJobAction(job); 
		expect({ ...action }).toEqual({ type: SELECT_CURRENT,  job }); 
	}); 
});


describe('SortUpdateAction', () => { 
	it('should create an action', () => { 
		const limit = 0;
		const skip = 0;
		const action = new SortUpdateAction(skip, limit); 
		expect({ ...action }).toEqual({ type: SORT_UPDATE,  skip, limit }); 
	}); 
});

