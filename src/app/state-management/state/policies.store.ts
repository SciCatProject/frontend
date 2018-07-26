import { Policy } from 'state-management/models';



export interface PolicyState {
    policies: Policy[];
    selectedPolicies: Policy[];
    currentPolicy: Policy;
    totalCount: number;

    policiesLoading: boolean;


}

export const initialPolicyState: PolicyState = {
    policies: [],
    selectedPolicies: [],
    currentPolicy: null,
    totalCount: 0,

    policiesLoading: true,

};
