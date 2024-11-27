import * as fromActions from "./proposals.actions";
import { ProposalFilters } from "state-management/state/proposals.store";
import {
  mockAttachment as attachment,
  mockProposal as proposal,
  mockDataset,
} from "shared/MockStubs";

describe("Proposal Actions", () => {
  describe("fetchProposalsAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchProposalsAction();
      expect({ ...action }).toEqual({ type: "[Proposal] Fetch Proposals" });
    });
  });

  describe("fetchProposalsCompleteAction", () => {
    it("should create an action", () => {
      const proposals = [proposal];
      const action = fromActions.fetchProposalsCompleteAction({ proposals });
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Proposals Complete",
        proposals,
      });
    });
  });

  describe("fetchProposalsFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchProposalsFailedAction();
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Proposals Failed",
      });
    });
  });

  describe("fetchCountAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCountAction();
      expect({ ...action }).toEqual({ type: "[Proposal] Fetch Count" });
    });
  });

  describe("fetchCountCompleteAction", () => {
    it("should create an action", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Count Complete",
        count,
      });
    });
  });

  describe("fetchCountFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchCountFailedAction();
      expect({ ...action }).toEqual({ type: "[Proposal] Fetch Count Failed" });
    });
  });

  describe("fetchProposalAction", () => {
    it("should create an action", () => {
      const proposalId = "string";
      const action = fromActions.fetchProposalAction({ proposalId });
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Proposal",
        proposalId,
      });
    });
  });

  describe("fetchProposalCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchProposalCompleteAction({ proposal });
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Proposal Complete",
        proposal,
      });
    });
  });

  describe("fetchProposalFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchProposalFailedAction();
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Proposal Failed",
      });
    });
  });

  describe("fetchProposalDatasetsAction", () => {
    it("should create an action", () => {
      const proposalId = "string";
      const action = fromActions.fetchProposalDatasetsAction({ proposalId });
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Datasets",
        proposalId,
      });
    });
  });

  describe("fetchProposalDatasetsCompleteAction", () => {
    it("should create an action", () => {
      const datasets = [mockDataset];
      const action = fromActions.fetchProposalDatasetsCompleteAction({
        datasets,
      });
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Datasets Complete",
        datasets,
      });
    });
  });

  describe("fetchProposalDatasetsFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchProposalDatasetsFailedAction();
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Datasets Failed",
      });
    });
  });

  describe("fetchProposalDatasetsCountAction", () => {
    it("should create an action", () => {
      const proposalId = "testId";
      const action = fromActions.fetchProposalDatasetsCountAction({
        proposalId,
      });
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Datasets Count",
        proposalId,
      });
    });
  });

  describe("fetchProposalDatasetsCountCompleteAction", () => {
    it("should create an action", () => {
      const count = 100;
      const action = fromActions.fetchProposalDatasetsCountCompleteAction({
        count,
      });
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Datasets Count Complete",
        count,
      });
    });
  });

  describe("fetchProposalDatasetsCountFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.fetchProposalDatasetsCountFailedAction();
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Datasets Count Failed",
      });
    });
  });

  describe("addAttachmentAction", () => {
    it("should create an action", () => {
      const action = fromActions.addAttachmentAction({ attachment });
      expect({ ...action }).toEqual({
        type: "[Proposal] Add Attachment",
        attachment,
      });
    });
  });

  describe("addAttachmentCompleteAction", () => {
    it("should create an action", () => {
      const action = fromActions.addAttachmentCompleteAction({ attachment });
      expect({ ...action }).toEqual({
        type: "[Proposal] Add Attachment Complete",
        attachment,
      });
    });
  });

  describe("addAttachmentFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.addAttachmentFailedAction();
      expect({ ...action }).toEqual({
        type: "[Proposal] Add Attachment Failed",
      });
    });
  });

  describe("updateAttachmentCaptionAction", () => {
    it("should create an action", () => {
      const proposalId = "123abc";
      const attachmentId = "abc123";
      const caption = "New caption";
      const action = fromActions.updateAttachmentCaptionAction({
        proposalId,
        attachmentId,
        caption,
      });
      expect({ ...action }).toEqual({
        type: "[Proposal] Update Attachment Caption",
        proposalId,
        attachmentId,
        caption,
      });
    });
  });

  describe("updateAttachmentCompleteCaption", () => {
    it("should create an action", () => {
      const action = fromActions.updateAttachmentCaptionCompleteAction({
        attachment,
      });
      expect({ ...action }).toEqual({
        type: "[Proposal] Update Attachment Caption Complete",
        attachment,
      });
    });
  });

  describe("updateAttachmentFailedCaption", () => {
    it("should create an action", () => {
      const action = fromActions.updateAttachmentCaptionFailedAction();
      expect({ ...action }).toEqual({
        type: "[Proposal] Update Attachment Caption Failed",
      });
    });
  });

  describe("removeAttachmentAction", () => {
    it("should create an action", () => {
      const proposalId = "123abc";
      const attachmentId = "abc123";
      const action = fromActions.removeAttachmentAction({
        proposalId,
        attachmentId,
      });
      expect({ ...action }).toEqual({
        type: "[Proposal] Remove Attachment",
        proposalId,
        attachmentId,
      });
    });
  });

  describe("removeAttachmentCompleteAction", () => {
    it("should create an action", () => {
      const attachmentId = "abc123";
      const action = fromActions.removeAttachmentCompleteAction({
        attachmentId,
      });
      expect({ ...action }).toEqual({
        type: "[Proposal] Remove Attachment Complete",
        attachmentId,
      });
    });
  });

  describe("removeAttachmentFailedAction", () => {
    it("should create an action", () => {
      const action = fromActions.removeAttachmentFailedAction();
      expect({ ...action }).toEqual({
        type: "[Proposal] Remove Attachment Failed",
      });
    });
  });

  describe("prefillFiltersAction", () => {
    it("should create an action", () => {
      const values: Partial<ProposalFilters> = {
        text: "test",
      };
      const action = fromActions.prefillFiltersAction({ values });
      expect({ ...action }).toEqual({
        type: "[Proposal] Prefill Filters",
        values,
      });
    });
  });

  describe("setTextFilterAction", () => {
    it("should create an action", () => {
      const text = "test";
      const action = fromActions.setTextFilterAction({ text });
      expect({ ...action }).toEqual({
        type: "[Proposal] Set Text Filter",
        text,
      });
    });
  });

  describe("setDateRangeFilterAction", () => {
    it("should create an action", () => {
      const begin = new Date().toISOString();
      const end = new Date().toISOString();
      const action = fromActions.setDateRangeFilterAction({
        begin,
        end,
      });
      expect({ ...action }).toEqual({
        type: "[Proposal] Set Date Range Filter",
        begin,
        end,
      });
    });
  });

  describe("clearFacetsAction", () => {
    it("should create an action", () => {
      const action = fromActions.clearFacetsAction();
      expect({ ...action }).toEqual({ type: "[Proposal] Clear Facets" });
    });
  });

  describe("changePageAction", () => {
    it("should create an action", () => {
      const page = 0;
      const limit = 25;
      const action = fromActions.changePageAction({ page, limit });
      expect({ ...action }).toEqual({
        type: "[Proposal] Change Page",
        page,
        limit,
      });
    });
  });

  describe("changeDatasetsPageAction", () => {
    it("should create an action", () => {
      const page = 0;
      const limit = 25;
      const action = fromActions.changeDatasetsPageAction({ page, limit });
      expect({ ...action }).toEqual({
        type: "[Proposal] Change Datasets Page",
        page,
        limit,
      });
    });
  });

  describe("sortByColumnAction", () => {
    it("should create an action", () => {
      const column = "test";
      const direction = "asc";
      const action = fromActions.sortByColumnAction({ column, direction });
      expect({ ...action }).toEqual({
        type: "[Proposal] Sort By Column",
        column,
        direction,
      });
    });
  });

  describe("clearProposalsStateAction", () => {
    it("should create an action", () => {
      const action = fromActions.clearProposalsStateAction();

      expect({ ...action }).toEqual({ type: "[Proposal] Clear State" });
    });
  });
});
