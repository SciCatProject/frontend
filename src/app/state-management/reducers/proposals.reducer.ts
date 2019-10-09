import { Action, createReducer, on } from "@ngrx/store";
import {
  initialProposalsState,
  ProposalsState
} from "../state/proposals.store";
import * as fromActions from "../actions/proposals.actions";

const reducer = createReducer(
  initialProposalsState,
  on(fromActions.fetchProposalsAction, state => ({
    ...state,
    isLoading: true
  })),
  on(fromActions.fetchProposalsCompleteAction, (state, { proposals }) => {
    const proposalsCount = proposals.length;
    return {
      ...state,
      proposals,
      proposalsCount,
      isLoading: false
    };
  }),
  on(fromActions.fetchProposalsFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(fromActions.fetchProposalAction, state => ({ ...state, isLoading: true })),
  on(fromActions.fetchProposalCompleteAction, (state, { proposal }) => ({
    ...state,
    currentProposal: proposal,
    isLoading: false
  })),
  on(fromActions.fetchProposalFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(fromActions.fetchProposalDatasetsAction, state => ({
    ...state,
    isLoading: true
  })),
  on(fromActions.fetchProposalDatasetsCompleteAction, (state, { datasets }) => {
    const datasetsCount = datasets.length;
    return { ...state, datasets, datasetsCount, isLoading: false };
  }),
  on(fromActions.fetchProposalDatasetsFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(fromActions.addAttachmentAction, state => ({ ...state, isLoading: true })),
  on(fromActions.addAttachmentCompleteAction, (state, { attachment }) => {
    const attachments = state.currentProposal.attachments;
    attachments.push(attachment);
    return {
      ...state,
      currentProposal: { ...state.currentProposal, attachments },
      isLoading: false
    };
  }),
  on(fromActions.addAttachmentFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(fromActions.updateAttachmentCaptionAction, state => ({
    ...state,
    isLoading: true
  })),
  on(
    fromActions.updateAttachmentCaptionCompleteAction,
    (state, { attachment }) => {
      const attachments = state.currentProposal.attachments.filter(
        existingAttachment => existingAttachment.id !== attachment.id
      );
      attachments.push(attachment);
      return {
        ...state,
        currentProposal: { ...state.currentProposal, attachments },
        isLoading: false
      };
    }
  ),
  on(fromActions.updateAttachmentCaptionFailedAction, state => ({
    ...state,
    isLoading: false
  })),

  on(fromActions.removeAttachmentAction, state => ({
    ...state,
    isLoading: true
  })),
  on(fromActions.removeAttachmentCompleteAction, (state, { attachmentId }) => {
    const attachments = state.currentProposal.attachments.filter(
      attachment => attachment.id !== attachmentId
    );
    return {
      ...state,
      currentProposal: { ...state.currentProposal, attachments },
      isLoading: false
    };
  }),

  on(fromActions.setTextFilterAction, (state, { text }) => {
    const proposalFilters = { ...state.proposalFilters, text, skip: 0 };
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
    const sortField = column + (direction ? " " + direction : "");
    const proposalFilters = { ...state.proposalFilters, sortField, skip: 0 };
    return { ...state, proposalFilters };
  })
);

export function proposalsReducer(
  state: ProposalsState | undefined,
  action: Action
) {
  if (action.type.indexOf("[Proposals]") !== -1) {
    console.log("Action came in! " + action.type);
  }
  return reducer(state, action);
}
