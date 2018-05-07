import {Dataset} from 'shared/sdk/models';

// NOTE It IS ok to make up a state of other sub states
export interface DashboardUIState {
    dsTable: Array<Dataset>;
    groupText: any;
    dateChoice: any;
    mode: string;
    darkTheme: boolean;
}

export const initialDashboardUIState: DashboardUIState = {
    dsTable: [],
    groupText: undefined,
    dateChoice: [],
    mode: 'view',
    darkTheme: true
};
