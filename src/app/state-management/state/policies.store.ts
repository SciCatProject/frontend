import { Policy } from 'state-management/models';



export interface PolicyState {
    policies: Policy[];
    selectedPolicies: Policy[];
    currentPolicy: Policy;
    policySubmission: Policy;
    totalCount: number;
    submitComplete: boolean;

    policiesLoading: boolean;
    error: Error;


}

export const initialPolicyState: PolicyState = {
    policies: [],
    selectedPolicies: [],
    currentPolicy: null,
    policySubmission: null,
    totalCount: 0,
    submitComplete: false,

    policiesLoading: true,
    error: undefined

};
