import { Policy } from 'state-management/models';



export interface PolicyState {
    policies: Policy[];
    selectedPolicies: Policy[];
    currentPolicy: Policy;
    policySubmission: Policy;
    submissionResponse: Policy;
    totalCount: number;
    submitComplete: boolean;

    policiesLoading: boolean;
    error: Error;

    skip: number;
    limit: number;


}

export const initialPolicyState: PolicyState = {
    policies: [],
    selectedPolicies: [],
    currentPolicy: null,
    policySubmission: null,
    submissionResponse: null,
    totalCount: 0,
    submitComplete: false,

    policiesLoading: true,
    error: undefined,
    skip: 0,
    limit: 0

};
