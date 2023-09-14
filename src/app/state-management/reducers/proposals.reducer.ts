import { Action, createReducer, on } from "@ngrx/store";
import {
  initialProposalsState,
  ProposalsState,
} from "../state/proposals.store";
import * as fromActions from "../actions/proposals.actions";

const reducer = createReducer(
  initialProposalsState,

  on(
    fromActions.fetchProposalsCompleteAction,
    (state, { proposals }): ProposalsState => ({
      ...state,
      proposals,
    }),
  ),

  on(
    fromActions.fetchCountCompleteAction,
    (state, { count }): ProposalsState => ({
      ...state,
      proposalsCount: count,
    }),
  ),

  on(
    fromActions.fetchProposalCompleteAction,
    (state, { proposal }): ProposalsState => ({
      ...state,
      currentProposal: proposal,
    }),
  ),

  on(
    fromActions.fetchProposalDatasetsCompleteAction,
    (state, { datasets }): ProposalsState => ({ ...state, datasets }),
  ),

  on(
    fromActions.fetchProposalDatasetsCountCompleteAction,
    (state, { count }): ProposalsState => ({ ...state, datasetsCount: count }),
  ),

  on(
    fromActions.addAttachmentCompleteAction,
    (state, { attachment }): ProposalsState => {
      if (state.currentProposal) {
        const attachments = state.currentProposal.attachments;
        attachments.push(attachment);
        const currentProposal = { ...state.currentProposal, attachments };
        return { ...state, currentProposal };
      }
      return { ...state };
    },
  ),

  on(
    fromActions.updateAttachmentCaptionCompleteAction,
    (state, { attachment }): ProposalsState => {
      if (state.currentProposal) {
        const attachments = state.currentProposal.attachments.filter(
          (existingAttachment) => existingAttachment.id !== attachment.id,
        );
        attachments.push(attachment);
        const currentProposal = { ...state.currentProposal, attachments };
        return { ...state, currentProposal };
      }
      return { ...state };
    },
  ),

  on(
    fromActions.removeAttachmentCompleteAction,
    (state, { attachmentId }): ProposalsState => {
      if (state.currentProposal) {
        const attachments = state.currentProposal.attachments.filter(
          (attachment) => attachment.id !== attachmentId,
        );
        const currentProposal = { ...state.currentProposal, attachments };
        return { ...state, currentProposal };
      }
      return { ...state };
    },
  ),

  on(fromActions.prefillFiltersAction, (state, { values }): ProposalsState => {
    const proposalFilters = { ...state.proposalFilters, ...values };
    return { ...state, proposalFilters, hasPrefilledFilters: true };
  }),

  on(fromActions.setTextFilterAction, (state, { text }): ProposalsState => {
    const proposalFilters = { ...state.proposalFilters, text, skip: 0 };
    return { ...state, proposalFilters };
  }),
  on(
    fromActions.setDateRangeFilterAction,
    (state, { begin, end }): ProposalsState => {
      const dateRange = { begin, end };
      const proposalFilters = { ...state.proposalFilters, dateRange };
      return { ...state, proposalFilters };
    },
  ),

  on(fromActions.clearFacetsAction, (state): ProposalsState => {
    const limit = state.proposalFilters.limit; // Save limit
    const proposalFilters = {
      ...initialProposalsState.proposalFilters,
      skip: 0,
      limit,
    };
    return { ...state, proposalFilters };
  }),

  on(fromActions.changePageAction, (state, { page, limit }): ProposalsState => {
    const skip = page * limit;
    const proposalFilters = { ...state.proposalFilters, skip, limit };
    return { ...state, proposalFilters };
  }),
  on(
    fromActions.changeDatasetsPageAction,
    (state, { page, limit }): ProposalsState => {
      const skip = page * limit;
      const datasetFilters = { ...state.datasetFilters, skip, limit };
      return { ...state, datasetFilters };
    },
  ),

  on(
    fromActions.sortByColumnAction,
    (state, { column, direction }): ProposalsState => {
      const sortField = column + (direction ? ":" + direction : "");
      const proposalFilters = { ...state.proposalFilters, sortField, skip: 0 };
      return { ...state, proposalFilters };
    },
  ),

  on(fromActions.clearProposalsStateAction, () => ({
    ...initialProposalsState,
  })),

  on(fromActions.clearCurrentProposalStateAction, (state) => ({
    ...state,
    currentProposal: undefined,
  })),
);

export const proposalsReducer = (
  state: ProposalsState | undefined,
  action: Action,
) => {
  if (action.type.indexOf("[Proposal]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
};
