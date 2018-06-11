import {SaveAction, SAVE } from './dashboard-ui.actions'; 
import {SaveModeAction, SAVE_MODE } from './dashboard-ui.actions'; 
import {RestoreAction, RESTORE } from './dashboard-ui.actions'; 


describe('SaveAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new SaveAction(payload); 
		expect({ ...action }).toEqual({ type: SAVE,  payload }); 
	}); 
});


describe('SaveModeAction', () => { 
	it('should create an action', () => { 
		const payload = "string";
		const action = new SaveModeAction(payload); 
		expect({ ...action }).toEqual({ type: SAVE_MODE,  payload }); 
	}); 
});


describe('RestoreAction', () => { 
	it('should create an action', () => { 
		const action = new RestoreAction(); 
		expect({ ...action }).toEqual({ type: RESTORE  }); 
	}); 
});
