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
    fromActions.fetchParentProposalCompleteAction,
    (state, { proposal }): ProposalsState => ({
      ...state,
      parentProposal: proposal,
    }),
  ),

  on(
    fromActions.clearCurrentProposalAction,
    (state): ProposalsState => ({
      ...state,
      currentProposal: null,
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
        // TODO: Check this type here because on the proposals there are no attachements. Maybe we need to improve the backend type instead of returning ProposalClass
        const attachments = (state.currentProposal as any).attachments;
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
        const attachments = (state.currentProposal as any).attachments.filter(
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
        const attachments = (state.currentProposal as any).attachments.filter(
          (attachment) => attachment.id !== attachmentId,
        );
        const currentProposal = { ...state.currentProposal, attachments };
        return { ...state, currentProposal };
      }
      return { ...state };
    },
  ),

  on(
    fromActions.clearProposalsStateAction,
    (): ProposalsState => ({
      ...initialProposalsState,
    }),
  ),

  on(
    fromActions.clearCurrentProposalStateAction,
    (state): ProposalsState => ({
      ...state,
      currentProposal: undefined,
    }),
  ),

  on(
    fromActions.fetchRelatedProposalsCompleteAction,
    (state, { relatedProposals }): ProposalsState => ({
      ...state,
      relatedProposals,
    }),
  ),
  on(
    fromActions.fetchRelatedProposalsCountCompleteAction,
    (state, { count }): ProposalsState => ({
      ...state,
      relatedProposalsCount: count,
    }),
  ),
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
