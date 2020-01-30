import { UserState, initialUserState } from "state-management/state/user.store";
import { Action, createReducer, on } from "@ngrx/store";
import * as fromActions from "state-management/actions/user.actions";
import { TableColumn } from "state-management/models";

const reducer = createReducer(
  initialUserState,
  on(fromActions.loginAction, state => ({
    ...state,
    isLoggingIn: true,
    isLoggedIn: false
  })),

  on(fromActions.loginCompleteAction, (state, { user, accountType }) => ({
    ...state,
    currentUser: user,
    accountType,
    isLoggingIn: false,
    isLoggedIn: true
  })),
  on(fromActions.loginFailedAction, state => ({
    ...state,
    isLoggingIn: false,
    isLoggedIn: false
  })),

  on(fromActions.fetchCurrentUserCompleteAction, (state, { user }) => ({
    ...state,
    currentUser: user,
    isLoggedIn: true
  })),

  on(
    fromActions.fetchUserIdentityCompleteAction,
    (state, { userIdentity }) => ({
      ...state,
      profile: userIdentity.profile
    })
  ),

  on(fromActions.fetchUserSettingsCompleteAction, (state, { userSettings }) => {
    const { datasetCount, jobCount, columns } = userSettings;
    const settings = { ...state.settings, datasetCount, jobCount };
    if (columns.length > 0) {
      return { ...state, settings, columns };
    } else {
      return { ...state, settings };
    }
  }),

  on(
    fromActions.updateUserSettingsCompleteAction,
    (state, { userSettings }) => {
      const { datasetCount, jobCount, columns } = userSettings;
      const settings = { ...state.settings, datasetCount, jobCount };
      if (columns.length > 0) {
        return { ...state, settings, columns };
      } else {
        return { ...state, settings };
      }
    }
  ),

  on(fromActions.fetchCatamelTokenCompleteAction, (state, { token }) => ({
    ...state,
    catamelToken: token
  })),

  on(fromActions.logoutCompleteAction, () => ({
    ...initialUserState
  })),

  on(fromActions.addCustomColumnsAction, (state, { names }) => {
    const existingColumns = [...state.columns];

    const standardColumns = existingColumns.filter(
      column => column.type === "standard"
    );

    const enabledCustomColumns = existingColumns.filter(
      column => column.type === "custom" && column.enabled
    );
    const enabledCustomColumnNames = enabledCustomColumns.map(
      column => column.name
    );

    const order = existingColumns.length;

    const newColumns = names
      .filter(name => !enabledCustomColumnNames.includes(name))
      .map(name => ({ name, order, type: "custom", enabled: false }));

    const columns = standardColumns
      .concat(enabledCustomColumns)
      .concat(newColumns);

    return { ...state, columns };
  }),

  on(fromActions.selectColumnAction, (state, { name, columnType }) => {
    const columns = [...state.columns];
    columns.forEach(item => {
      if (item.name === name && item.type === columnType) {
        item.enabled = true;
      }
    });
    return { ...state, columns };
  }),
  on(fromActions.deselectColumnAction, (state, { name, columnType }) => {
    const columns = [...state.columns];
    columns.forEach(item => {
      if (item.name === name && item.type === columnType) {
        item.enabled = false;
      }
    });
    return { ...state, columns };
  }),
  on(fromActions.deselectAllCustomColumnsAction, state => {
    const initialColumnNames = [...initialUserState.columns].map(
      column => column.name
    );
    const customColumns = [...state.columns].filter(
      column => !initialColumnNames.includes(column.name)
    );
    customColumns.forEach(column => (column.enabled = false));
    const customColumnNames = customColumns.map(column => column.name);

    const columns = [...state.columns]
      .filter(column => !customColumnNames.includes(column.name))
      .concat(customColumns);
    return { ...state, columns };
  }),

  on(fromActions.showMessageAction, (state, { message }) => ({
    ...state,
    message
  })),
  on(fromActions.clearMessageAction, state => ({
    ...state,
    message: initialUserState.message
  })),

  on(fromActions.saveSettingsAction, (state, { settings }) => ({
    ...state,
    settings
  })),

  on(fromActions.loadingAction, state => ({
    ...state,
    isLoading: true
  })),
  on(fromActions.loadingCompleteAction, state => ({
    ...state,
    isLoading: false
  }))
);

export function userReducer(state: UserState | undefined, action: Action) {
  if (action.type.indexOf("[User]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
}
