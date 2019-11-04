import { Action, createReducer, on } from "@ngrx/store";
import {
  initialProposalsState,
  ProposalsState
} from "../state/proposals.store";
import * as fromActions from "../actions/proposals.actions";

const reducer = createReducer(
  initialProposalsState,

  on(fromActions.fetchProposalsCompleteAction, (state, { proposals }) => ({
    ...state,
    proposals
  })),

  on(fromActions.fetchCountCompleteAction, (state, { count }) => ({
    ...state,
    proposalsCount: count
  })),

  on(fromActions.fetchProposalCompleteAction, (state, { proposal }) => ({
    ...state,
    currentProposal: proposal
  })),

  on(
    fromActions.fetchProposalDatasetsCompleteAction,
    (state, { datasets }) => ({ ...state, datasets })
  ),

  on(
    fromActions.fetchProposalDatasetsCountCompleteAction,
    (state, { count }) => ({ ...state, datasetsCount: count })
  ),

  on(fromActions.addAttachmentCompleteAction, (state, { attachment }) => {
    const attachments = state.currentProposal.attachments;
    attachments.push(attachment);
    const currentProposal = { ...state.currentProposal, attachments };
    return { ...state, currentProposal };
  }),

  on(
    fromActions.updateAttachmentCaptionCompleteAction,
    (state, { attachment }) => {
      const attachments = state.currentProposal.attachments.filter(
        existingAttachment => existingAttachment.id !== attachment.id
      );
      attachments.push(attachment);
      const currentProposal = { ...state.currentProposal, attachments };
      return { ...state, currentProposal };
    }
  ),

  on(fromActions.removeAttachmentCompleteAction, (state, { attachmentId }) => {
    const attachments = state.currentProposal.attachments.filter(
      attachment => attachment.id !== attachmentId
    );
    const currentProposal = { ...state.currentProposal, attachments };
    return { ...state, currentProposal };
  }),

  on(fromActions.setTextFilterAction, (state, { text }) => {
    const proposalFilters = { ...state.proposalFilters, text, skip: 0 };
    return { ...state, proposalFilters };
  }),
  on(fromActions.setDateRangeFilterAction, (state, { begin, end }) => {
    const oldTime = state.proposalFilters.dateRange;
    const dateRange = { ...oldTime, begin, end };
    const proposalFilters = { ...state.proposalFilters, dateRange };
    return { ...state, proposalFilters };
  }),

  on(fromActions.clearFacetsAction, state => {
    const limit = state.proposalFilters.limit; // Save limit
    const proposalFilters = {
      ...initialProposalsState.proposalFilters,
      skip: 0,
      limit
    };
    return { ...state, proposalFilters };
  }),

  on(fromActions.changePageAction, (state, { page, limit }) => {
    const skip = page * limit;
    const proposalFilters = { ...state.proposalFilters, skip, limit };
    return { ...state, proposalFilters };
  }),
  on(fromActions.changeDatasetsPageAction, (state, { page, limit }) => {
    const skip = page * limit;
    const datasetFilters = { ...state.datasetFilters, skip, limit };
    return { ...state, datasetFilters };
  }),

  on(fromActions.sortByColumnAction, (state, { column, direction }) => {
    const sortField = column + (direction ? ":" + direction : "");
    const proposalFilters = { ...state.proposalFilters, sortField, skip: 0 };
    return { ...state, proposalFilters };
  })
);

export function proposalsReducer(
  state: ProposalsState | undefined,
  action: Action
) {
  if (action.type.indexOf("[Proposal]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
}
