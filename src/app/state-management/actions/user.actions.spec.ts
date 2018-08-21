import { Message, User, Settings } from "../models";
import { LoginAction, LOGIN } from "./user.actions";
import { ActiveDirLoginAction, AD_LOGIN } from "./user.actions";
import { LoginCompleteAction, LOGIN_COMPLETE } from "./user.actions";
import { LoginFailedAction, LOGIN_FAILED } from "./user.actions";
import { LogoutAction, LOGOUT } from "./user.actions";
import { LogoutCompleteAction, LOGOUT_COMPLETE } from "./user.actions";
import { RetrieveUserAction, RETRIEVE_USER } from "./user.actions";
import {
  RetrieveUserCompleteAction,
  RETRIEVE_USER_COMPLETE
} from "./user.actions";
import { RetrieveUserFailedAction, RETRIEVE_USER_FAILED } from "./user.actions";
import { AccessUserEmailAction, ACCESS_USER_EMAIL } from "./user.actions";
import {
  AccessUserEmailCompleteAction,
  ACCESS_USER_EMAIL_COMPLETE
} from "./user.actions";
import {
  AccessUserEmailFailedAction,
  ACCESS_USER_EMAIL_FAILED
} from "./user.actions";
import { ShowMessageAction, SHOW_MESSAGE } from "./user.actions";
import { ClearMessageAction, CLEAR_MESSAGE } from "./user.actions";
import { SaveSettingsAction, SAVE_SETTINGS } from "./user.actions";

describe("LoginAction", () => {
  it("should create an action", () => {
    const form = {
      username: "user",
      password: "user",
      rememberMe: true
    };
    const action = new LoginAction(form);
    expect({ ...action }).toEqual({ type: LOGIN, form });
  });
});

describe("ActiveDirLoginAction", () => {
  it("should create an action", () => {
    const form = { username: "", password: "", rememberMe: true };
    const action = new ActiveDirLoginAction(form);
    expect({ ...action }).toEqual({ type: AD_LOGIN, form });
  });
});

describe("LoginCompleteAction", () => {
  it("should create an action", () => {
    const user: User = new User({ username: "", email: "" });
    const action = new LoginCompleteAction(user);
    expect({ ...action }).toEqual({ type: LOGIN_COMPLETE, user });
  });
});

describe("LoginFailedAction", () => {
  it("should create an action", () => {
    const message = "";
    const errSrc = "";
    const action = new LoginFailedAction(message, errSrc);
    expect({ ...action }).toEqual({ type: LOGIN_FAILED, message, errSrc });
  });
});

describe("LogoutAction", () => {
  it("should create an action", () => {
    const action = new LogoutAction();
    expect({ ...action }).toEqual({ type: LOGOUT });
  });
});

describe("LogoutCompleteAction", () => {
  it("should create an action", () => {
    const action = new LogoutCompleteAction();
    expect({ ...action }).toEqual({ type: LOGOUT_COMPLETE });
  });
});

describe("RetrieveUserAction", () => {
  it("should create an action", () => {
    const action = new RetrieveUserAction();
    expect({ ...action }).toEqual({ type: RETRIEVE_USER });
  });
});

describe("RetrieveUserCompleteAction", () => {
  it("should create an action", () => {
    const user = new User();
    const action = new RetrieveUserCompleteAction(user);
    expect({ ...action }).toEqual({ type: RETRIEVE_USER_COMPLETE, user });
  });
});

describe("RetrieveUserFailedAction", () => {
  it("should create an action", () => {
    const error = new Error();
    const action = new RetrieveUserFailedAction(error);
    expect({ ...action }).toEqual({ type: RETRIEVE_USER_FAILED, error });
  });
});

describe("AccessUserEmailAction", () => {
  it("should create an action", () => {
    const userId = "emailstring";
    const action = new AccessUserEmailAction(userId);
    expect({ ...action }).toEqual({ type: ACCESS_USER_EMAIL, userId });
  });
});

describe("AccessUserEmailCompleteAction", () => {
  it("should create an action", () => {
    const email = "emailstring";
    const action = new AccessUserEmailCompleteAction(email);
    expect({ ...action }).toEqual({ type: ACCESS_USER_EMAIL_COMPLETE, email });
  });
});

describe("AccessUserEmailFailedAction", () => {
  it("should create an action", () => {
    const error = new Error();
    const action = new AccessUserEmailFailedAction(error);
    expect({ ...action }).toEqual({ type: ACCESS_USER_EMAIL_FAILED, error });
  });
});

describe("ShowMessageAction", () => {
  it("should create an action", () => {
    const message = new Message();
    const action = new ShowMessageAction(message);
    expect({ ...action }).toEqual({ type: SHOW_MESSAGE, message });
  });
});

describe("ClearMessageAction", () => {
  it("should create an action", () => {
    const action = new ClearMessageAction();
    expect({ ...action }).toEqual({ type: CLEAR_MESSAGE });
  });
});

describe("SaveSettingsAction", () => {
  it("should create an action", () => {
    const values: Settings = {
      tapeCopies: "",
      datasetCount: 0,
      jobCount: 0,
      darkTheme: false
    };
    const action = new SaveSettingsAction(values);
    expect({ ...action }).toEqual({ type: SAVE_SETTINGS, values });
  });
});
