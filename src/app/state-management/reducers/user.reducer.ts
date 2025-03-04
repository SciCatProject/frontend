import { UserState, initialUserState } from "state-management/state/user.store";
import { Action, createReducer, on } from "@ngrx/store";
import * as fromActions from "state-management/actions/user.actions";
import { TableColumn } from "state-management/models";

const reducer = createReducer(
  initialUserState,
  on(
    fromActions.setDatasetTableColumnsAction,
    (state, { columns }): UserState => ({
      ...state,
      columns,
    }),
  ),

  on(
    fromActions.loginAction,
    (state): UserState => ({
      ...state,
      isLoggingIn: true,
      isLoggedIn: false,
    }),
  ),

  on(
    fromActions.loginCompleteAction,
    (state, { user, accountType }): UserState => ({
      ...state,
      currentUser: user,
      accountType,
      isLoggingIn: false,
      isLoggedIn: true,
    }),
  ),
  on(
    fromActions.loginFailedAction,
    (state): UserState => ({
      ...state,
      isLoggingIn: false,
      isLoggedIn: false,
    }),
  ),

  on(
    fromActions.fetchCurrentUserCompleteAction,
    (state, { user }): UserState => ({
      ...state,
      currentUser: user,
      isLoggedIn: true,
    }),
  ),

  on(
    fromActions.fetchUserIdentityCompleteAction,
    (state, { userIdentity }): UserState => ({
      ...state,
      profile: userIdentity.profile,
    }),
  ),

  on(
    fromActions.fetchUserSettingsCompleteAction,
    (state, { userSettings }): UserState => {
      const { datasetCount, jobCount, columns, externalSettings } =
        userSettings as any;
      const settings = {
        ...state.settings,
        datasetCount,
        jobCount,
      };
      if (columns.length > 0) {
        return {
          ...state,
          settings,
          columns,
          tablesSettings: externalSettings?.tablesSettings,
        };
      } else {
        return {
          ...state,
          settings,
          tablesSettings: externalSettings?.tablesSettings,
        };
      }
    },
  ),

  on(
    fromActions.updateUserSettingsCompleteAction,
    (state, { userSettings }): UserState => {
      const {
        datasetCount,
        jobCount,
        columns = [],
        externalSettings,
      } = userSettings as any;
      const settings = { ...state.settings, datasetCount, jobCount };
      if (columns.length > 0) {
        return {
          ...state,
          settings,
          columns,
          tablesSettings: externalSettings?.tablesSettings,
        };
      } else {
        return {
          ...state,
          settings,
          tablesSettings: externalSettings?.tablesSettings,
        };
      }
    },
  ),

  on(
    fromActions.fetchScicatTokenCompleteAction,
    (state, { token }): UserState => ({
      ...state,
      scicatToken: token,
    }),
  ),

  on(
    fromActions.logoutAction,
    (): UserState => ({
      ...initialUserState,
    }),
  ),

  on(
    fromActions.logoutCompleteAction,
    (): UserState => ({
      ...initialUserState,
    }),
  ),

  on(fromActions.addCustomColumnsAction, (state, { names }): UserState => {
    const existingColumns = [...state.columns];

    const standardColumns = existingColumns.filter(
      (column) => column.type === "standard",
    );

    let order = standardColumns.length;

    const enabledCustomColumns = existingColumns.filter(
      (column) => column.type === "custom" && column.enabled,
    );

    enabledCustomColumns.forEach((column) => {
      column.order = order;
      order++;
    });

    const enabledCustomColumnNames = enabledCustomColumns.map(
      (column) => column.name,
    );

    const newColumns = names
      .filter((name) => !enabledCustomColumnNames.includes(name))
      .map((name) => {
        const column: TableColumn = {
          name,
          order,
          type: "custom",
          enabled: false,
        };
        order++;
        return column;
      });

    const columns = standardColumns
      .concat(enabledCustomColumns)
      .concat(newColumns);

    return { ...state, columns };
  }),

  on(
    fromActions.selectColumnAction,
    (state, { name, columnType }): UserState => {
      const columns = [...state.columns];
      columns.forEach((item) => {
        if (item.name === name && item.type === columnType) {
          item.enabled = true;
        }
      });
      return { ...state, columns };
    },
  ),
  on(
    fromActions.deselectColumnAction,
    (state, { name, columnType }): UserState => {
      const columns = [...state.columns];
      columns.forEach((item) => {
        if (item.name === name && item.type === columnType) {
          item.enabled = false;
        }
      });
      return { ...state, columns };
    },
  ),
  on(fromActions.deselectAllCustomColumnsAction, (state): UserState => {
    const customColumns = [...state.columns].filter(
      (column) => column.type !== "standard",
    );
    customColumns.forEach((column) => (column.enabled = false));
    const customColumnNames = customColumns.map((column) => column.name);

    const columns = [...state.columns]
      .filter((column) => !customColumnNames.includes(column.name))
      .concat(customColumns);
    return { ...state, columns };
  }),

  on(
    fromActions.showMessageAction,
    (state, { message }): UserState => ({
      ...state,
      message,
    }),
  ),
  on(
    fromActions.clearMessageAction,
    (state): UserState => ({
      ...state,
      message: initialUserState.message,
    }),
  ),

  on(
    fromActions.saveSettingsAction,
    (state, { settings }): UserState => ({
      ...state,
      settings,
    }),
  ),

  on(
    fromActions.loadingAction,
    (state): UserState => ({
      ...state,
      isLoading: true,
    }),
  ),
  on(
    fromActions.loadingCompleteAction,
    (state): UserState => ({
      ...state,
      isLoading: false,
    }),
  ),
  on(
    fromActions.updateFilterConfigs,
    (state, { filterConfigs }): UserState => ({
      ...state,
      filters: filterConfigs,
    }),
  ),
  on(
    fromActions.updateConditionsConfigs,
    (state, { conditionConfigs }): UserState => ({
      ...state,
      conditions: conditionConfigs,
    }),
  ),
);

export const userReducer = (state: UserState | undefined, action: Action) => {
  if (action.type.indexOf("[User]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
};
