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
      settings: {
        ...state.settings,
        fe_dataset_table_columns: columns,
      },
    }),
  ),

  on(
    fromActions.updateHasFetchedSettings,
    (state, { hasFetchedSettings }): UserState => ({
      ...state,
      hasFetchedSettings,
    }),
  ),

  on(
    fromActions.loginAction,
    (state): UserState => ({
      ...state,
      isLoggingIn: true,
      isLoggedIn: false,
      hasFetchedSettings: false,
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
      hasFetchedSettings: false,
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
      const { datasetCount, jobCount, externalSettings } = userSettings as any;

      return {
        ...state,
        settings: {
          ...state.settings,
          datasetCount,
          jobCount,
          ...externalSettings,
        },
        hasFetchedSettings: true,
      };
    },
  ),

  on(
    fromActions.updateUserSettingsCompleteAction,
    (state, { userSettings }): UserState => {
      const { datasetCount, jobCount, externalSettings } = userSettings as any;
      return {
        ...state,
        settings: {
          ...state.settings,
          datasetCount,
          jobCount,
          ...externalSettings,
        },
      };
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
    const existingColumns = [...state.settings.fe_dataset_table_columns];

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

    return {
      ...state,
      settings: { ...state.settings, fe_dataset_table_columns: columns },
    };
  }),

  on(
    fromActions.selectColumnAction,
    (state, { name, columnType }): UserState => {
      const columns = [...state.settings.fe_dataset_table_columns];
      columns.forEach((item) => {
        if (item.name === name && item.type === columnType) {
          item.enabled = true;
        }
      });
      return {
        ...state,
        settings: { ...state.settings, fe_dataset_table_columns: columns },
      };
    },
  ),
  on(
    fromActions.deselectColumnAction,
    (state, { name, columnType }): UserState => {
      const columns = [...state.settings.fe_dataset_table_columns];
      columns.forEach((item) => {
        if (item.name === name && item.type === columnType) {
          item.enabled = false;
        }
      });
      return {
        ...state,
        settings: { ...state.settings, fe_dataset_table_columns: columns },
      };
    },
  ),

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
      settings: {
        ...state.settings,
        fe_dataset_table_filters: filterConfigs,
      },
    }),
  ),
  on(
    fromActions.updateConditionsConfigs,
    (state, { conditionConfigs }): UserState => ({
      ...state,
      settings: {
        ...state.settings,
        fe_dataset_table_conditions: conditionConfigs,
      },
    }),
  ),
  on(
    fromActions.updateSampleConditionsConfigs,
    (state, { conditionConfigs }): UserState => ({
      ...state,
      settings: {
        ...state.settings,
        fe_sample_table_conditions: conditionConfigs,
      },
    }),
  ),
);

export const userReducer = (state: UserState | undefined, action: Action) => {
  if (action.type.indexOf("[User]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
};
