import { Dataset } from 'state-management/models';

export const getFilterValues = (state: any) => state.root.datasets.filterValues;
export const getActiveFilters = (state: any) => state.root.datasets.activeFilters;
export const getText = (state: any) => state.root.datasets.activeFilters.text;

export const getDatasets = (state: any) => state.root.datasets.datasets;
export const getSelectedSets = (state: any) => state.root.datasets.selectedSets;

export const getLoading = (state: any) => state.root.datasets.loading;
export const getTotalSets = (state: any) => state.root.datasets.totalSets;

export const getCurrentSet = (state: any) => state.root.datasets.currentSet;

export const getSelectedProposalDatasets = selectedPID => (state: any) => {
 var proposalDatasets:Dataset[] = [];
  state.root.datasets.datasets.map(function(dset, i) {
    if (dset.proposalId == selectedPID) {
      proposalDatasets.push(dset);
    }
  });
  return proposalDatasets;
};
