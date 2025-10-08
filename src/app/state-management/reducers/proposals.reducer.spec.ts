import { proposalsReducer } from "./proposals.reducer";
import {
  initialProposalsState,
  ProposalFilters,
} from "../state/proposals.store";
import * as fromActions from "../actions/proposals.actions";
import { createMock } from "shared/MockStubs";
import {
  OutputDatasetObsoleteDto,
  ProposalClass,
} from "@scicatproject/scicat-sdk-ts-angular";

const proposal = createMock<ProposalClass>({
  proposalId: "testId",
  email: "testEmail",
  ownerGroup: "testGroup",
  accessGroups: [],
  createdAt: "",
  createdBy: "",
  isPublished: false,
  title: "Test proposal",
  type: "",
  updatedAt: "",
  updatedBy: "",
});

const dataset = createMock<OutputDatasetObsoleteDto>({
  ownerGroup: "testGroup",
  owner: "testOwner",
  contactEmail: "testEmail",
  sourceFolder: "testFolder",
  creationTime: new Date(2019, 10, 7).toString(),
  type: "raw",
  pid: "testPid",
  attachments: [],
  createdAt: "",
  createdBy: "",
  creationLocation: "",
  inputDatasets: [],
  investigator: "",
  numberOfFilesArchived: 0,
  principalInvestigator: "",
  updatedAt: "",
  updatedBy: "",
  usedSoftware: [],
});

describe("ProposalsReducer", () => {
  describe("on fetchProposalsCompleteAction", () => {
    it("should set proposals", () => {
      const proposals = [proposal];
      const action = fromActions.fetchProposalsCompleteAction({ proposals });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.proposals).toEqual(proposals);
    });
  });

  describe("on fetchCountCompleteAction", () => {
    it("should set proposalsCount", () => {
      const count = { facetCounts: {}, allCounts: 100 };
      const action = fromActions.fetchFacetCountsCompleteAction(count);
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.proposalsCount).toEqual(count.allCounts);
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
      const datasets = [dataset];
      const skip = 50;
      const limit = 50;

      const action = fromActions.fetchProposalDatasetsCompleteAction({
        datasets,
        skip,
        limit,
      });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.datasets).toEqual(datasets);
      expect(state.datasetFilters.skip).toBe(skip);
      expect(state.datasetFilters.limit).toBe(limit);
    });
  });

  describe("on fetchProposalDatasetsCountCompleteAction", () => {
    it("should set datasetsCount", () => {
      const count = 100;
      const action = fromActions.fetchProposalDatasetsCountCompleteAction({
        count,
      });
      const state = proposalsReducer(initialProposalsState, action);

      expect(state.datasetsCount).toEqual(count);
    });
  });

  describe("on clearProposalsStateAction", () => {
    it("it should set proposals state to initialProposState", () => {
      const action = fromActions.clearProposalsStateAction();
      const state = proposalsReducer(initialProposalsState, action);

      expect(state).toEqual(initialProposalsState);
    });
  });
});
