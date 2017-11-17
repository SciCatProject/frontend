import {RawDataset} from 'shared/sdk/models';

// NOTE It IS ok to make up a state of other sub states
export interface DashboardUIState {
    dsTable: Array<RawDataset>;
    groupText: any;
    dateChoice: any;
    mode: string;
}

export const initialDashboardUIState: DashboardUIState = {
    dsTable: [],
    groupText: undefined,
    dateChoice: [],
    mode: 'view'
};
