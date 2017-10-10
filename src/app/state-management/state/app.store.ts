import {DatasetState, initialDatasetState} from 'state-management/state/datasets.store';
import {initialUserState, UserState} from 'state-management/state/user.store';
import {DashboardUIState, initialDashboardUIState} from 'state-management/state/dashboard-ui.store';

// NOTE It IS ok to make up a state of other sub states
export interface AppState {
    datasets: DatasetState;
    user: UserState;
    dashboardUI: DashboardUIState;
}

export const initialState: AppState = {
    datasets: initialDatasetState,
    user: initialUserState,
    dashboardUI: initialDashboardUIState
};
