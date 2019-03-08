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
  ChangePageAction
} from "../actions/proposals.actions";
import { LOGOUT_COMPLETE, LogoutCompleteAction } from "../actions/user.actions";

export function proposalsReducer(
  state: ProposalsState = initialProposalsState,
  action: ProposalsAction | LogoutCompleteAction
): ProposalsState {
  switch (action.type) {
    case SELECT_PROPOSAL:
      const selectedId = (action as SelectProposalAction).proposalId;
      return { ...state, selectedId };

    case FETCH_PROPOSALS_COMPLETE: {
      const list = (action as FetchProposalsCompleteAction).proposals;
      const proposals = list.reduce((proposals, proposal) => ({ ...proposals, [proposal.proposalId]: proposal }), {});
      return { ...state, proposals, hasFetched: true };
    }
    case FETCH_PROPOSAL_COMPLETE: {
      const proposal = (action as FetchProposalCompleteAction).proposal;
      const proposals = { ...state.proposals, [proposal.proposalId]: proposal };
      return { ...state, proposals };
    }
    case FETCH_DATASETS_FOR_PROPOSAL_COMPLETE: {
      const list = (action as FetchDatasetsForProposalCompleteAction).datasets;
      const datasets = list.reduce((datasets, dataset) => ({ ...datasets, [dataset.pid]: dataset }), {});
      const datasetCount = Object.keys(datasets).length;
      return { ...state, datasets, datasetCount };
    }
    case CHANGE_PAGE: {
      const { page, limit } = action as ChangePageAction;
      const skip = page * limit;
      const filters = { ...state.filters, skip, limit };
      return { ...state, filters };
    }
    case LOGOUT_COMPLETE:
      return { ...initialProposalsState };

    default:
      return state;
  }
}
