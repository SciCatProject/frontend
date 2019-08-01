import {
  initialProposalsState,
  ProposalsState
} from "../state/proposals.store";
import {
  FETCH_DATASETS_FOR_PROPOSAL_COMPLETE,
  FETCH_PROPOSAL_COMPLETE,
  FETCH_PROPOSALS_COMPLETE,
  FetchDatasetsForProposalCompleteAction,
  FetchProposalCompleteAction,
  FetchProposalsCompleteAction,
  ProposalsAction,
  SELECT_PROPOSAL,
  SelectProposalAction,
  CHANGE_PAGE,
  ChangePageAction,
  FETCH_COUNT_PROPOSALS_SUCCESS,
  FetchCountOfProposalsSuccess,
  SEARCH_PROPOSALS,
  SORT_PROPOSALS_BY_COLUMN,
  SortProposalByColumnAction,
  SearchProposalAction
} from "../actions/proposals.actions";
import { LOGOUT_COMPLETE, LogoutCompleteAction } from "../actions/user.actions";

export function proposalsReducer(
  state: ProposalsState = initialProposalsState,
  action: ProposalsAction | LogoutCompleteAction
): ProposalsState {
  if (action.type.indexOf("[Proposals]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  switch (action.type) {
    case SEARCH_PROPOSALS: {
      const { query } = action as SearchProposalAction;
      const propFilters = { ...state.propFilters, text: query };
      const proposalsLoading = true;
      return { ...state, propFilters , proposalsLoading};
    }

    case SORT_PROPOSALS_BY_COLUMN: {
      const { column, direction } = action as SortProposalByColumnAction;
      const sortField = column + (direction ? " " + direction : "");
      const propFilters = { ...state.propFilters, sortField, skip: 0 };
      const proposalsLoading = true;
      return { ...state, propFilters, proposalsLoading };
    }

    case SELECT_PROPOSAL:
      const selectedId = (action as SelectProposalAction).proposalId;
      return { ...state, selectedId };

    case FETCH_COUNT_PROPOSALS_SUCCESS: {
      const proposalCount = (action as FetchCountOfProposalsSuccess).count;
      return { ...state, proposalCount };
    }
    case FETCH_PROPOSALS_COMPLETE: {
      const list = (action as FetchProposalsCompleteAction).proposals;
      const proposalsLoading = false;
      const proposals = list.reduce(
        (proposals, proposal) => ({
          ...proposals,
          [proposal.proposalId]: proposal
        }),
        {}
      );
      return { ...state, proposals,proposalsLoading, hasFetched: true };
    }
    case FETCH_PROPOSAL_COMPLETE: {
      const proposal = (action as FetchProposalCompleteAction).proposal;
      const proposals = { ...state.proposals, [proposal.proposalId]: proposal };
      return { ...state, proposals };
    }
    case FETCH_DATASETS_FOR_PROPOSAL_COMPLETE: {
      const list = (action as FetchDatasetsForProposalCompleteAction).datasets;
      const datasets = list.reduce(
        (datasets, dataset) => ({ ...datasets, [dataset.pid]: dataset }),
        {}
      );
      const datasetCount = Object.keys(datasets).length;
      return { ...state, datasets, datasetCount };
    }
    case CHANGE_PAGE: {
      const { page, limit } = action as ChangePageAction;
      const skip = page * limit;
      const filters = { ...state.filters, skip, limit };

      const proposalsLoading = true;
      return { ...state, filters, proposalsLoading };
    }
    case LOGOUT_COMPLETE:
      return { ...initialProposalsState };

    default:
      return state;
  }
}
