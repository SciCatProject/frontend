import { proposalsReducer } from "./proposals.reducer";
import { ProposalsState } from "../state/proposals.store";
import * as fromActions from "../actions/proposals.actions";
import { Attachment, Dataset, DatasetInterface, Proposal } from "../models";
import { ProposalInterface } from "shared/sdk";

const data: ProposalInterface = {
  proposalId: "testId",
  email: "testEmail",
  ownerGroup: "testGroup",
  attachments: []
};
const proposal = new Proposal(data);

const initialProposalsState: ProposalsState = {
  proposals: [],
  currentProposal: proposal,
  datasets: [],

  proposalsCount: 0,
  datasetsCount: 0,

  isLoading: false,

  proposalFilters: {
    text: "test",
    sortField: "test asc",
    skip: 0,
    limit: 25
  },
  datasetFilters: {
    text: "test",
    sortField: "test asc",
    skip: 0,
    limit: 25
  }
};

describe("ProposalsReducer", () => {
  describe("on fetchProposalsAction", () => {
    it("should set isLoading to true", () => {
      const action = fromActions.fetchProposalsAction();
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on fetchProposalsCompleteAction", () => {
    it("should set proposals and set isLoading to false", () => {
      const proposals = [proposal];
      const action = fromActions.fetchProposalsCompleteAction({ proposals });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.proposals).toEqual(proposals);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchProposalsFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchProposalsFailedAction();
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchCountCompletAction", () => {
    it("should set proposalsCount and set isLoading to false", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.proposalsCount).toEqual(count);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchCountFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchCountFailedAction();
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchProposalAction", () => {
    it("should set isLoading to true", () => {
      const proposalId = "testId";
      const action = fromActions.fetchProposalAction({ proposalId });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on fetchProposalCompleteAction", () => {
    it("should set currentProposal and set isLoading to false", () => {
      const action = fromActions.fetchProposalCompleteAction({ proposal });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.currentProposal).toEqual(proposal);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchProposalFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchProposalFailedAction();
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchProposalDatasetsAction", () => {
    it("should set isLoading to true", () => {
      const proposalId = "testId";
      const action = fromActions.fetchProposalDatasetsAction({ proposalId });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on fetchProposalDatasetsCompleteAction", () => {
    it("should set datasets and set isLoading to false", () => {
      const data: DatasetInterface = {
        ownerGroup: "testGroup",
        owner: "testOwner",
        contactEmail: "testEmail",
        sourceFolder: "testFolder",
        creationTime: new Date(2019, 10, 7),
        type: "raw"
      };
      const datasets = [new Dataset(data)];
      const action = fromActions.fetchProposalDatasetsCompleteAction({
        datasets
      });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.datasets).toEqual(datasets);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchProposalDatasetsFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchProposalDatasetsFailedAction();
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchProposalDatasetsCountCompletAction", () => {
    it("should set datasetsCount and set isLoading to false", () => {
      const count = 100;
      const action = fromActions.fetchProposalDatasetsCountCompleteAction({
        count
      });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.datasetsCount).toEqual(count);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on fetchProposalDatasetsCountFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.fetchProposalDatasetsCountFailedAction();
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on addAttachmentAction", () => {
    it("should set isLoading to true", () => {
      const attachment = new Attachment();
      const action = fromActions.addAttachmentAction({ attachment });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on addAttachmentCompleteAction", () => {
    it("should set attachments of currentProposal and set isLoading to false", () => {
      const attachment = new Attachment();
      const action = fromActions.addAttachmentCompleteAction({ attachment });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.currentProposal.attachments).toContain(attachment);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on addAttachmentFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.addAttachmentFailedAction();
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on updateAttachmentCaptionAction", () => {
    it("should set isLoading to true", () => {
      const proposalId = "testId";
      const attachmentId = "testId";
      const caption = "test";
      const action = fromActions.updateAttachmentCaptionAction({
        proposalId,
        attachmentId,
        caption
      });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on updateAttachmentCaptionCompleteAction", () => {
    it("should set attachments of currentProposal and set isLoading to false", () => {
      const attachmentId = "testId";
      const attachment = new Attachment({ id: attachmentId, thumbnail: "" });
      initialProposalsState.currentProposal.attachments = [attachment];

      const action = fromActions.updateAttachmentCaptionCompleteAction({
        attachment
      });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.currentProposal.attachments).toEqual([attachment]);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on updateAttachmentCaptionFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.updateAttachmentCaptionFailedAction();
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on removeAttachmentAction", () => {
    it("should set isLoading to true", () => {
      const proposalId = "testId";
      const attachmentId = "testId";
      const action = fromActions.removeAttachmentAction({
        proposalId,
        attachmentId
      });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.isLoading).toEqual(true);
    });
  });

  describe("on removeAttachmentCompleteAction", () => {
    it("should remove an attachment from currentProposal and set isLoading to false", () => {
      const attachmentId = "testId";
      const attachment = new Attachment({ id: attachmentId, thumbnail: "" });
      initialProposalsState.currentProposal.attachments = [attachment];

      const action = fromActions.removeAttachmentCompleteAction({
        attachmentId
      });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.currentProposal.attachments.length).toEqual(0);
      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on removeAttachmentFailedAction", () => {
    it("should set isLoading to false", () => {
      const action = fromActions.removeAttachmentFailedAction();
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.isLoading).toEqual(false);
    });
  });

  describe("on setTextFilterAction", () => {
    it("should set text filter", () => {
      const text = "test";
      const action = fromActions.setTextFilterAction({ text });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.proposalFilters.text).toEqual(text);
    });
  });

  describe("on changePageAction", () => {
    it("should set skip and limit filters", () => {
      const page = 1;
      const limit = 25;
      const skip = page * limit;
      const action = fromActions.changePageAction({ page, limit });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.proposalFilters.skip).toEqual(skip);
      expect(state.proposalFilters.limit).toEqual(limit);
    });
  });

  describe("on changeDatasetsPageAction", () => {
    it("should set skip and limit dataset filters", () => {
      const page = 1;
      const limit = 25;
      const skip = page * limit;
      const action = fromActions.changeDatasetsPageAction({ page, limit });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.datasetFilters.skip).toEqual(skip);
      expect(state.datasetFilters.limit).toEqual(limit);
    });
  });

  describe("on sortByColumnAction", () => {
    it("should set sortField filter and set skip to 0", () => {
      const column = "test";
      const direction = "asc";
      const sortField = column + " " + direction;
      const action = fromActions.sortByColumnAction({ column, direction });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.proposalFilters.sortField).toEqual(sortField);
      expect(state.proposalFilters.skip).toEqual(0);
    });
  });
});
