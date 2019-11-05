import { proposalsReducer } from "./proposals.reducer";
import { initialProposalsState } from "../state/proposals.store";
import * as fromActions from "../actions/proposals.actions";
import { Attachment, Dataset, DatasetInterface, Proposal } from "../models";
import { ProposalInterface } from "shared/sdk";

const proposalData: ProposalInterface = {
  proposalId: "testId",
  email: "testEmail",
  ownerGroup: "testGroup",
  attachments: []
};
const proposal = new Proposal(proposalData);

describe("ProposalsReducer", () => {
  describe("on fetchProposalsCompleteAction", () => {
    it("should set proposals", () => {
      const proposals = [proposal];
      const action = fromActions.fetchProposalsCompleteAction({ proposals });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.proposals).toEqual(proposals);
    });
  });

  describe("on fetchCountCompletAction", () => {
    it("should set proposalsCount", () => {
      const count = 100;
      const action = fromActions.fetchCountCompleteAction({ count });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.proposalsCount).toEqual(count);
    });
  });

  describe("on fetchProposalCompleteAction", () => {
    it("should set currentProposal", () => {
      const action = fromActions.fetchProposalCompleteAction({ proposal });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.currentProposal).toEqual(proposal);
    });
  });

  describe("on fetchProposalDatasetsCompleteAction", () => {
    it("should set datasets", () => {
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
    });
  });

  describe("on fetchProposalDatasetsCountCompletAction", () => {
    it("should set datasetsCount", () => {
      const count = 100;
      const action = fromActions.fetchProposalDatasetsCountCompleteAction({
        count
      });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.datasetsCount).toEqual(count);
    });
  });

  describe("on addAttachmentCompleteAction", () => {
    it("should set attachments of currentProposal", () => {
      initialProposalsState.currentProposal = proposal;
      const attachment = new Attachment();
      const action = fromActions.addAttachmentCompleteAction({ attachment });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.currentProposal.attachments).toContain(attachment);
    });
  });

  describe("on updateAttachmentCaptionCompleteAction", () => {
    it("should set attachments of currentProposal", () => {
      const attachmentId = "testId";
      const attachment = new Attachment({ id: attachmentId, thumbnail: "" });
      initialProposalsState.currentProposal = proposal;
      initialProposalsState.currentProposal.attachments = [attachment];

      const action = fromActions.updateAttachmentCaptionCompleteAction({
        attachment
      });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.currentProposal.attachments).toEqual([attachment]);
    });
  });

  describe("on removeAttachmentCompleteAction", () => {
    it("should remove an attachment from currentProposal", () => {
      const attachmentId = "testId";
      const attachment = new Attachment({ id: attachmentId, thumbnail: "" });
      initialProposalsState.currentProposal = proposal;
      initialProposalsState.currentProposal.attachments = [attachment];

      const action = fromActions.removeAttachmentCompleteAction({
        attachmentId
      });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.currentProposal.attachments.length).toEqual(0);
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

  describe("on setDateRangeFilterAction", () => {
    it("should set dateRange filter", () => {
      const begin = new Date().toISOString();
      const end = new Date().toISOString();
      const action = fromActions.setDateRangeFilterAction({
        begin,
        end
      });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.proposalFilters.dateRange.begin).toEqual(begin);
      expect(state.proposalFilters.dateRange.end).toEqual(end);
    });
  });

  describe("on clearFacetsAction", () => {
    it("should clear filters while saving the filters limit", () => {
      const limit = 10;
      const page = 1;
      const skip = limit * page;

      const act = fromActions.changePageAction({ page, limit });
      const sta = proposalsReducer(initialProposalsState, act);

      expect(sta.proposalFilters.skip).toEqual(skip);

      const action = fromActions.clearFacetsAction();
      const state = proposalsReducer(sta, action);

      expect(state.proposalFilters.skip).toEqual(0);
      expect(state.proposalFilters.limit).toEqual(limit);
      expect(state.proposalFilters.text).toEqual("");
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
      const sortField = column + ":" + direction;
      const action = fromActions.sortByColumnAction({ column, direction });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.proposalFilters.sortField).toEqual(sortField);
      expect(state.proposalFilters.skip).toEqual(0);
    });
  });
});
