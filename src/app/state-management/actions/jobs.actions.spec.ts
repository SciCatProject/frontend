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
		const payload = [{id:1}]; 
		const action = new SubmitAction(payload); 
		expect({ ...action }).toEqual({ type: SUBMIT,  payload }); 
	}); 
});

describe('SubmitCompleteAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new SubmitCompleteAction(payload); 
		expect({ ...action }).toEqual({ type: SUBMIT_COMPLETE,  payload }); 
	}); 
});


describe('FailedAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new FailedAction(payload); 
		expect({ ...action }).toEqual({ type: FAILED,  payload }); 
	}); 
});


describe('RetrieveCompleteAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new RetrieveCompleteAction(payload); 
		expect({ ...action }).toEqual({ type: RETRIEVE_COMPLETE,  payload }); 
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
		const payload = "expectedstring";
		const action = new SearchIDAction(payload); 
		expect({ ...action }).toEqual({ type: SEARCH_ID,  payload }); 
	}); 
});


describe('SearchIDCompleteAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new SearchIDCompleteAction(payload); 
		expect({ ...action }).toEqual({ type: SEARCH_ID_COMPLETE,  payload }); 
	}); 
});


describe('SearchIDFailedAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new SearchIDFailedAction(payload); 
		expect({ ...action }).toEqual({ type: SEARCH_ID_FAILED,  payload }); 
	}); 
});


describe('CurrentJobAction', () => { 
	it('should create an action', () => { 
		const payload = new Job();
		const action = new CurrentJobAction(payload); 
		expect({ ...action }).toEqual({ type: SELECT_CURRENT,  payload }); 
	}); 
});


describe('SortUpdateAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new SortUpdateAction(payload); 
		expect({ ...action }).toEqual({ type: SORT_UPDATE,  payload }); 
	}); 
});

