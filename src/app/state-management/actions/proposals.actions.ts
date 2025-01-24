import { createAction, props } from "@ngrx/store";
import {
  Attachment,
  OutputDatasetObsoleteDto,
  ProposalClass,
} from "@scicatproject/scicat-sdk-ts-angular";
import { ProposalFilters } from "state-management/state/proposals.store";

export const fetchProposalsAction = createAction("[Proposal] Fetch Proposals");
export const clearCurrentProposalAction = createAction(
  "[Proposal] Clear proposal",
);
export const fetchProposalsCompleteAction = createAction(
  "[Proposal] Fetch Proposals Complete",
  props<{ proposals: ProposalClass[] }>(),
);
export const fetchProposalsFailedAction = createAction(
  "[Proposal] Fetch Proposals Failed",
);

export const fetchCountAction = createAction("[Proposal] Fetch Count");
export const fetchCountCompleteAction = createAction(
  "[Proposal] Fetch Count Complete",
  props<{ count: number }>(),
);
export const fetchCountFailedAction = createAction(
  "[Proposal] Fetch Count Failed",
);

export const fetchProposalAction = createAction(
  "[Proposal] Fetch Proposal",
  props<{ proposalId: string }>(),
);
export const fetchProposalCompleteAction = createAction(
  "[Proposal] Fetch Proposal Complete",
  props<{ proposal: ProposalClass }>(),
);
export const fetchProposalFailedAction = createAction(
  "[Proposal] Fetch Proposal Failed",
);
export const fetchProposalAccessFailedAction = createAction(
  "[Proposal] Fetch Proposal Access Failed",
);

export const fetchParentProposalAction = createAction(
  "[Proposal] Fetch Parent Proposal",
  props<{ proposalId: string }>(),
);
export const fetchParentProposalCompleteAction = createAction(
  "[Proposal] Fetch Parent Proposal Complete",
  props<{ proposal: ProposalClass }>(),
);
export const fetchParentProposalFailedAction = createAction(
  "[Proposal] Fetch Parent Proposal Failed",
);
export const fetchParentProposalAccessFailedAction = createAction(
  "[Proposal] Fetch Parent Proposal Access Failed",
);

export const fetchProposalDatasetsAction = createAction(
  "[Proposal] Fetch Datasets",
  props<{ proposalId: string }>(),
);
export const fetchProposalDatasetsCompleteAction = createAction(
  "[Proposal] Fetch Datasets Complete",
  props<{ datasets: OutputDatasetObsoleteDto[] }>(),
);
export const fetchProposalDatasetsFailedAction = createAction(
  "[Proposal] Fetch Datasets Failed",
);

export const fetchProposalDatasetsCountAction = createAction(
  "[Proposal] Fetch Datasets Count",
  props<{ proposalId: string }>(),
);
export const fetchProposalDatasetsCountCompleteAction = createAction(
  "[Proposal] Fetch Datasets Count Complete",
  props<{ count: number }>(),
);
export const fetchProposalDatasetsCountFailedAction = createAction(
  "[Proposal] Fetch Datasets Count Failed",
);

export const addAttachmentAction = createAction(
  "[Proposal] Add Attachment",
  props<{ attachment: Attachment }>(),
);
export const addAttachmentCompleteAction = createAction(
  "[Proposal] Add Attachment Complete",
  props<{ attachment: Attachment }>(),
);
export const addAttachmentFailedAction = createAction(
  "[Proposal] Add Attachment Failed",
);

export const updateAttachmentCaptionAction = createAction(
  "[Proposal] Update Attachment Caption",
  props<{ proposalId: string; attachmentId: string; caption: string }>(),
);
export const updateAttachmentCaptionCompleteAction = createAction(
  "[Proposal] Update Attachment Caption Complete",
  props<{ attachment: Attachment }>(),
);
export const updateAttachmentCaptionFailedAction = createAction(
  "[Proposal] Update Attachment Caption Failed",
);

export const updateProposalPropertyAction = createAction(
  "[Proposal] Update Proposal Property",
  // TODO: Most probably with the new sdk the property should be of type UpdateProposalDto or something similar
  props<{ proposalId: string; property: Record<string, unknown> }>(),
);
export const updateProposalPropertyCompleteAction = createAction(
  "[Proposal] Update Proposal Property Complete",
);
export const updateProposalPropertyFailedAction = createAction(
  "[Proposal] Update Proposal Property Failed",
);

export const removeAttachmentAction = createAction(
  "[Proposal] Remove Attachment",
  props<{ proposalId: string; attachmentId: string }>(),
);
export const removeAttachmentCompleteAction = createAction(
  "[Proposal] Remove Attachment Complete",
  props<{ attachmentId: string }>(),
);
export const removeAttachmentFailedAction = createAction(
  "[Proposal] Remove Attachment Failed",
);

export const prefillFiltersAction = createAction(
  "[Proposal] Prefill Filters",
  props<{ values: Partial<ProposalFilters> }>(),
);

export const setTextFilterAction = createAction(
  "[Proposal] Set Text Filter",
  props<{ text: string }>(),
);
export const setDateRangeFilterAction = createAction(
  "[Proposal] Set Date Range Filter",
  props<{ begin: string; end: string }>(),
);

export const clearFacetsAction = createAction("[Proposal] Clear Facets");

export const changePageAction = createAction(
  "[Proposal] Change Page",
  props<{ page: number; limit: number }>(),
);
export const changeDatasetsPageAction = createAction(
  "[Proposal] Change Datasets Page",
  props<{ page: number; limit: number }>(),
);

export const sortByColumnAction = createAction(
  "[Proposal] Sort By Column",
  props<{ column: string; direction: string }>(),
);

export const clearProposalsStateAction = createAction("[Proposal] Clear State");
export const clearCurrentProposalStateAction = createAction(
  "[Proposal] Clear Current Proposal State",
);

export const fetchRelatedProposalsAction = createAction(
  "[Proposal] Fetch Related Proposals",
);
export const fetchRelatedProposalsCompleteAction = createAction(
  "[Proposal] Fetch Related Proposals Complete",
  props<{
    relatedProposals: (ProposalClass & { relation: string })[];
  }>(),
);
export const fetchRelatedProposalsFailedAction = createAction(
  "[Proposal] Fetch Related Proposals Failed",
);

export const fetchRelatedProposalsCountCompleteAction = createAction(
  "[Proposal] Fetch Related Proposals Count Complete",
  props<{ count: number }>(),
);
export const fetchRelatedProposalsCountFailedAction = createAction(
  "[Proposal] Fetch Related Proposals Count Failed",
);

export const changeRelatedProposalsPageAction = createAction(
  "[Proposal] Change Related Proposals Page",
  props<{ page: number; limit: number }>(),
);
