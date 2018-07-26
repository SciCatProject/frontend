import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PolicyState } from '../state/policies.store'
import { config } from '../../../config/config';

const getPolicyState = createFeatureSelector<PolicyState>('policies');

export const getCurrentPolicy = createSelector(
    getPolicyState,
    state => state.currentPolicy
);

export const getPolicies = createSelector(
    getPolicyState,
    state => state.policies
);

export const getSelectedPolicies = createSelector(
    getPolicyState,
    state => state.selectedPolicies
);

export const isEmptySelection = createSelector(
    getSelectedPolicies,
    sets => sets.length === 0
);


export const getPoliciesPerPage = createSelector(
    getPolicyState,
    state => state
);
