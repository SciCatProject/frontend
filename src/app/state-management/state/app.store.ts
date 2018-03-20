import {DatasetState, initialDatasetState} from 'state-management/state/datasets.store';
import {UserState, initialUserState} from 'state-management/state/user.store';
import {DashboardUIState, initialDashboardUIState} from 'state-management/state/dashboard-ui.store';
import {ProposalState, initialProposalState} from 'state-management/state/proposal.store';
import {JobsState, initialJobsState} from 'state-management/state/jobs.store';

export interface AppState {
    datasets: DatasetState;
    user: UserState;
    dashboardUI: DashboardUIState;
    proposals: ProposalState;
    jobs: JobsState;
}

export const initialState: AppState = {
    datasets: initialDatasetState,
    user: initialUserState,
    dashboardUI: initialDashboardUIState,
    proposals: initialProposalState,
    jobs: initialJobsState,
};
