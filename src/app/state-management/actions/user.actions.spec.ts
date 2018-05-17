import { Message, MessageType, User, AccessGroup } from '../models';
import {LoginAction, LOGIN } from './user.actions'; 
import {ActiveDirLoginAction, AD_LOGIN } from './user.actions'; 
import {ActiveDirLoginCompleteAction, AD_LOGIN_COMPLETE } from './user.actions'; 
import {LoginCompleteAction, LOGIN_COMPLETE } from './user.actions'; 
import {LoginFailedAction, LOGIN_FAILED } from './user.actions'; 
import {LogoutAction, LOGOUT } from './user.actions'; 
import {LogoutCompleteAction, LOGOUT_COMPLETE } from './user.actions'; 
import {RetrieveUserAction, RETRIEVE_USER } from './user.actions'; 
import {RetrieveUserCompleteAction, RETRIEVE_USER_COMPLETE } from './user.actions'; 
import {RetrieveUserFailedAction, RETRIEVE_USER_FAILED } from './user.actions'; 
import {AddGroupsAction, ADD_GROUPS } from './user.actions'; 
import {AddGroupsCompleteAction, ADD_GROUPS_COMPLETE } from './user.actions'; 
import {AddGroupsFailedAction, ADD_GROUPS_FAILED } from './user.actions'; 
import {AccessUserEmailAction, ACCESS_USER_EMAIL } from './user.actions'; 
import {AccessUserEmailCompleteAction, ACCESS_USER_EMAIL_COMPLETE } from './user.actions'; 
import {AccessUserEmailFailedAction, ACCESS_USER_EMAIL_FAILED } from './user.actions'; 
import {ShowMessageAction, SHOW_MESSAGE } from './user.actions'; 
import {ClearMessageAction, CLEAR_MESSAGE } from './user.actions'; 
import {SaveSettingsAction, SAVE_SETTINGS } from './user.actions'; 


describe('LoginAction', () => { 
	it('should create an action', () => { 
		const payload ={"username" : "user",
		"password" : "user",
		"rememberMe" : true};
		const action = new LoginAction(payload); 
		expect({ ...action }).toEqual({ type: LOGIN,  payload }); 
	}); 
});


describe('ActiveDirLoginAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new ActiveDirLoginAction(payload); 
		expect({ ...action }).toEqual({ type: AD_LOGIN,  payload }); 
	}); 
});


describe('ActiveDirLoginCompleteAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new ActiveDirLoginCompleteAction(payload); 
		expect({ ...action }).toEqual({ type: AD_LOGIN_COMPLETE,  payload }); 
	}); 
});


describe('LoginCompleteAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new LoginCompleteAction(payload); 
		expect({ ...action }).toEqual({ type: LOGIN_COMPLETE,  payload }); 
	}); 
});


describe('LoginFailedAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new LoginFailedAction(payload); 
		expect({ ...action }).toEqual({ type: LOGIN_FAILED,  payload }); 
	}); 
});


describe('LogoutAction', () => { 
	it('should create an action', () => { 

		const action = new LogoutAction(); 
		expect({ ...action }).toEqual({ type: LOGOUT}); 
	}); 
});


describe('LogoutCompleteAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new LogoutCompleteAction(); 
		expect({ ...action }).toEqual({ type: LOGOUT_COMPLETE}); 
	}); 
});


describe('RetrieveUserAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new RetrieveUserAction(); 
		expect({ ...action }).toEqual({ type: RETRIEVE_USER}); 
	}); 
});


describe('RetrieveUserCompleteAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new RetrieveUserCompleteAction(payload); 
		expect({ ...action }).toEqual({ type: RETRIEVE_USER_COMPLETE,  payload }); 
	}); 
});


describe('RetrieveUserFailedAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new RetrieveUserFailedAction(payload); 
		expect({ ...action }).toEqual({ type: RETRIEVE_USER_FAILED,  payload }); 
	}); 
});


describe('AddGroupsAction', () => { 
	it('should create an action', () => { 
		const payload = new User(); 
		const action = new AddGroupsAction(payload); 
		expect({ ...action }).toEqual({ type: ADD_GROUPS,  payload }); 
	}); 
});


describe('AddGroupsCompleteAction', () => { 
	it('should create an action', () => { 
		const payload = [new AccessGroup()]; 
		const action = new AddGroupsCompleteAction(payload); 
		expect({ ...action }).toEqual({ type: ADD_GROUPS_COMPLETE,  payload }); 
	}); 
});


describe('AddGroupsFailedAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new AddGroupsFailedAction(payload); 
		expect({ ...action }).toEqual({ type: ADD_GROUPS_FAILED,  payload }); 
	}); 
});


describe('AccessUserEmailAction', () => { 
	it('should create an action', () => { 
		const payload = "emailstring"; 
		const action = new AccessUserEmailAction(payload); 
		expect({ ...action }).toEqual({ type: ACCESS_USER_EMAIL,  payload }); 
	}); 
});


describe('AccessUserEmailCompleteAction', () => { 
	it('should create an action', () => { 
		const payload = "emailstring"; 
		const action = new AccessUserEmailCompleteAction(payload); 
		expect({ ...action }).toEqual({ type: ACCESS_USER_EMAIL_COMPLETE,  payload }); 
	}); 
});


describe('AccessUserEmailFailedAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new AccessUserEmailFailedAction(payload); 
		expect({ ...action }).toEqual({ type: ACCESS_USER_EMAIL_FAILED,  payload }); 
	}); 
});


describe('ShowMessageAction', () => { 
	it('should create an action', () => { 
		const payload = new Message(); 
		const action = new ShowMessageAction(payload); 
		expect({ ...action }).toEqual({ type: SHOW_MESSAGE,  payload }); 
	}); 
});


describe('ClearMessageAction', () => { 
	it('should create an action', () => { 
		const action = new ClearMessageAction(); 
		expect({ ...action }).toEqual({ type: CLEAR_MESSAGE  }); 
	}); 
});


describe('SaveSettingsAction', () => { 
	it('should create an action', () => { 
		const payload = [{id:1}]; 
		const action = new SaveSettingsAction(payload); 
		expect({ ...action }).toEqual({ type: SAVE_SETTINGS,  payload }); 
	}); 
});
