import { Attachment, Dataset, Proposal } from "../models";
import * as fromActions from "./proposals.actions";

describe("Proposal Actions", () => {
  describe("#fetchProposalsAction()", () => {
    it("should create an action", () => {
      const action = fromActions.fetchProposalsAction();
      expect({ ...action }).toEqual({ type: "[Proposal] Fetch Proposals" });
    });
  });

  describe("#fetchProposalsCompleteAction()", () => {
    it("should create an action", () => {
      const proposals = [new Proposal()];
      const action = fromActions.fetchProposalsCompleteAction({ proposals });
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Proposals Complete",
        proposals
      });
    });
  });

  describe("#fetchProposalsFailedAction()", () => {
    it("should create an action", () => {
      const action = fromActions.fetchProposalsFailedAction();
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Proposals Failed"
      });
    });
  });

  describe("#fetchProposalAction()", () => {
    it("should create an action", () => {
      const proposalId = "string";
      const action = fromActions.fetchProposalAction({ proposalId });
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Proposal",
        proposalId
      });
    });
  });

  describe("#fetchProposalCompleteAction()", () => {
    it("should create an action", () => {
      const proposal = new Proposal();
      const action = fromActions.fetchProposalCompleteAction({ proposal });
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Proposal Complete",
        proposal
      });
    });
  });

  describe("#fetchProposalFailedAction()", () => {
    it("should create an action", () => {
      const action = fromActions.fetchProposalFailedAction();
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Proposal Failed"
      });
    });
  });

  describe("#fetchProposalDatasetsAction()", () => {
    it("should create an action", () => {
      const proposalId = "string";
      const action = fromActions.fetchProposalDatasetsAction({ proposalId });
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Proposal Datasets",
        proposalId
      });
    });
  });

  describe("#fetchProposalDatasetsCompleteAction()", () => {
    it("should create an action", () => {
      const datasets = [new Dataset()];
      const action = fromActions.fetchProposalDatasetsCompleteAction({
        datasets
      });
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Proposal Datasets Complete",
        datasets
      });
    });
  });

  describe("#fetchProposalDatasetsFailedAction()", () => {
    it("should create an action", () => {
      const action = fromActions.fetchProposalDatasetsFailedAction();
      expect({ ...action }).toEqual({
        type: "[Proposal] Fetch Proposal Datasets Failed"
      });
    });
  });

  describe("#addAttachmentAction()", () => {
    it("should create an action", () => {
      const attachment = new Attachment();
      const action = fromActions.addAttachmentAction({ attachment });
      expect({ ...action }).toEqual({
        type: "[Proposal] Add Attachment",
        attachment
      });
    });
  });

  describe("#addAttachmentCompleteAction()", () => {
    it("should create an action", () => {
      const attachment = new Attachment();
      const action = fromActions.addAttachmentCompleteAction({ attachment });
      expect({ ...action }).toEqual({
        type: "[Proposal] Add Attachment Complete",
        attachment
      });
    });
  });

  describe("#addAttachmentFailedAction()", () => {
    it("should create an action", () => {
      const action = fromActions.addAttachmentFailedAction();
      expect({ ...action }).toEqual({
        type: "[Proposal] Add Attachment Failed"
      });
    });
  });

  describe("#updateAttachmentCaptionAction()", () => {
    it("should create an action", () => {
      const proposalId = "123abc";
      const attachmentId = "abc123";
      const caption = "New caption";
      const action = fromActions.updateAttachmentCaptionAction({
        proposalId,
        attachmentId,
        caption
      });
      expect({ ...action }).toEqual({
        type: "[Proposal] Update Attachment Caption",
        proposalId,
        attachmentId,
        caption
      });
    });
  });

  describe("#updateAttachmentCompleteCaption()", () => {
    it("should create an action", () => {
      const attachment = new Attachment();
      const action = fromActions.updateAttachmentCaptionCompleteAction({
        attachment
      });
      expect({ ...action }).toEqual({
        type: "[Proposal] Update Attachment Caption Complete",
        attachment
      });
    });
  });

  describe("#updateAttachmentFailedCaption()", () => {
    it("should create an action", () => {
      const action = fromActions.updateAttachmentCaptionFailedAction();
      expect({ ...action }).toEqual({
        type: "[Proposal] Update Attachment Caption Failed"
      });
    });
  });

  describe("#removeAttachmentAction()", () => {
    it("should create an action", () => {
      const proposalId = "123abc";
      const attachmentId = "abc123";
      const action = fromActions.removeAttachmentAction({
        proposalId,
        attachmentId
      });
      expect({ ...action }).toEqual({
        type: "[Proposal] Remove Attachment",
        proposalId,
        attachmentId
      });
    });
  });

  describe("#removeAttachmentCompleteAction()", () => {
    it("should create an action", () => {
      const attachmentId = "abc123";
      const action = fromActions.removeAttachmentCompleteAction({
        attachmentId
      });
      expect({ ...action }).toEqual({
        type: "[Proposal] Remove Attachment Complete",
        attachmentId
      });
    });
  });

  describe("#removeAttachmentFailedAction()", () => {
    it("should create an action", () => {
      const action = fromActions.removeAttachmentFailedAction();
      expect({ ...action }).toEqual({
        type: "[Proposal] Remove Attachment Failed"
      });
    });
  });

  describe("#setTextFilterAction()", () => {
    it("should create an action", () => {
      const text = "test";
      const action = fromActions.setTextFilterAction({ text });
      expect({ ...action }).toEqual({
        type: "[Proposal] Set Text Filter",
        text
      });
    });
  });

  describe("#changePageAction()", () => {
    it("should create an action", () => {
      const page = 0;
      const limit = 25;
      const action = fromActions.changePageAction({ page, limit });
      expect({ ...action }).toEqual({
        type: "[Proposal] Change Page",
        page,
        limit
      });
    });
  });

  describe("#changeDatasetsPageAction()", () => {
    it("should create an action", () => {
      const page = 0;
      const limit = 25;
      const action = fromActions.changeDatasetsPageAction({ page, limit });
      expect({ ...action }).toEqual({
        type: "[Proposal] Change Datasets Page",
        page,
        limit
      });
    });
  });

  describe("#sortByColumnAction()", () => {
    it("should create an action", () => {
      const column = "test";
      const direction = "asc";
      const action = fromActions.sortByColumnAction({ column, direction });
      expect({ ...action }).toEqual({
        type: "[Proposal] Sort By Column",
        column,
        direction
      });
    });
  });
});
