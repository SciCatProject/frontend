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
  SearchProposalAction,
  ADD_ATTACHMENT,
  ADD_ATTACHMENT_COMPLETE,
  AddAttachmentCompleteAction,
  ADD_ATTACHMENT_FAILED,
  DELETE_ATTACHMENT,
  DELETE_ATTACHMENT_COMPLETE,
  DELETE_ATTACHMENT_FAILED,
  DeleteAttachmentCompleteAction,
  UPDATE_ATTACHMENT_CAPTION_COMPLETE,
  UPDATE_ATTACHMENT_CAPTION_FAILED,
  UpdateAttachmentCaptionCompleteAction
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
      return { ...state, propFilters, proposalsLoading };
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
        (existingProposals, proposal) => ({
          ...existingProposals,
          [proposal.proposalId]: proposal
        }),
        {}
      );
      return { ...state, proposals, proposalsLoading, hasFetched: true };
    }
    case FETCH_PROPOSAL_COMPLETE: {
      const currentProposal = (action as FetchProposalCompleteAction).proposal;
      return { ...state, currentProposal };
    }
    case FETCH_DATASETS_FOR_PROPOSAL_COMPLETE: {
      const list = (action as FetchDatasetsForProposalCompleteAction).datasets;
      const datasets = list.reduce(
        (existingDatasets, dataset) => ({
          ...existingDatasets,
          [dataset.pid]: dataset
        }),
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

    case ADD_ATTACHMENT: {
      return { ...state, addingAttachment: true };
    }

    case ADD_ATTACHMENT_COMPLETE: {
      const attachment = (action as AddAttachmentCompleteAction).attachment;
      const attachments = state.currentProposal.attachments;
      const attach2 = new Set(attachments);
      attach2.add(attachment);

      return {
        ...state,
        addingAttachment: false,
        currentProposal: {
          ...state.currentProposal,
          attachments: Array.from(attach2)
        }
      };
    }

    case ADD_ATTACHMENT_FAILED: {
      return { ...state };
    }

    case DELETE_ATTACHMENT: {
      return { ...state, deletingAttachment: true };
    }

    case DELETE_ATTACHMENT_COMPLETE: {
      const attachments = state.currentProposal.attachments;
      const attachmentId = (action as DeleteAttachmentCompleteAction)
        .attachmentId;
      const attach2 = attachments.filter(
        attachment => attachment.id !== attachmentId
      );

      return {
        ...state,
        deletingAttachment: false,
        currentProposal: { ...state.currentProposal, attachments: attach2 }
      };
    }

    case DELETE_ATTACHMENT_FAILED: {
      return { ...state };
    }

    case UPDATE_ATTACHMENT_CAPTION_COMPLETE: {
      const updatedAttachment = (action as UpdateAttachmentCaptionCompleteAction)
        .attachment;
      const attachments = state.currentProposal.attachments;
      const attach2 = attachments.filter(
        attachment => attachment.id !== updatedAttachment.id
      );
      attach2.push(updatedAttachment);

      return {
        ...state,
        currentProposal: {
          ...state.currentProposal,
          attachments: attach2
        }
      };
    }

    case UPDATE_ATTACHMENT_CAPTION_FAILED: {
      return { ...state };
    }

    case LOGOUT_COMPLETE:
      return { ...initialProposalsState };

    default:
      return state;
  }
}
