import * as fromSelectors from "./proposals.selectors";
import {
  Proposal,
  ProposalInterface,
  Attachment
} from "../../shared/sdk/models";
import { ProposalsState } from "state-management/state/proposals.store";

const data: ProposalInterface = {
  proposalId: "testId",
  email: "testEmail",
  ownerGroup: "testGroup"
};
const proposal = new Proposal(data);
const attachments = [new Attachment()];
proposal.attachments = attachments;

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

describe("Proposal Selectors", () => {
  describe("getProposals", () => {
    it("should get proposals", () => {
      expect(
        fromSelectors.getProposals.projector(initialProposalsState)
      ).toEqual([]);
    });
  });

  describe("getCurrentProposal", () => {
    it("should get current proposal", () => {
      expect(
        fromSelectors.getCurrentProposal.projector(initialProposalsState)
      ).toEqual(proposal);
    });
  });

  describe("getCurrentAttachments", () => {
    it("should get attachments from current proposal", () => {
      expect(
        fromSelectors.getCurrentAttachments.projector(
          initialProposalsState.currentProposal
        )
      ).toEqual(attachments);
    });
  });

  describe("getProposalDatasets", () => {
    it("should get datasets belonging to current proposal", () => {
      expect(
        fromSelectors.getProposalDatasets.projector(initialProposalsState)
      ).toEqual([]);
    });
  });

  describe("getProposalsCount", () => {
    it("should get the number of proposals", () => {
      expect(
        fromSelectors.getProposalsCount.projector(initialProposalsState)
      ).toEqual(0);
    });
  });

  describe("getDatasetsCount", () => {
    it("should get the number of datasets", () => {
      expect(
        fromSelectors.getDatasetsCount.projector(initialProposalsState)
      ).toEqual(0);
    });
  });

  describe("getIsLoading", () => {
    it("should get isLoading", () => {
      expect(
        fromSelectors.getIsLoading.projector(initialProposalsState)
      ).toEqual(false);
    });
  });

  describe("getFilters", () => {
    it("should get the proposal filters", () => {
      expect(fromSelectors.getFilters.projector(initialProposalsState)).toEqual(
        initialProposalsState.proposalFilters
      );
    });
  });

  describe("getDatasetFilters", () => {
    it("should get the dataset filters", () => {
      expect(
        fromSelectors.getDatasetFilters.projector(initialProposalsState)
      ).toEqual(initialProposalsState.datasetFilters);
    });
  });

  describe("getPage", () => {
    it("should get the current proposals page", () => {
      const { skip, limit } = initialProposalsState.proposalFilters;
      const page = skip / limit;
      expect(
        fromSelectors.getPage.projector(initialProposalsState.proposalFilters)
      ).toEqual(page);
    });
  });

  describe("getDatasetsPage", () => {
    it("should get the current datasets page", () => {
      const { skip, limit } = initialProposalsState.datasetFilters;
      const page = skip / limit;
      expect(
        fromSelectors.getDatasetsPage.projector(
          initialProposalsState.datasetFilters
        )
      ).toEqual(page);
    });
  });

  describe("getProposalsPerPage", () => {
    it("should get limit from proposal filters", () => {
      const { limit } = initialProposalsState.proposalFilters;
      expect(
        fromSelectors.getProposalsPerPage.projector(
          initialProposalsState.proposalFilters
        )
      ).toEqual(limit);
    });
  });

  describe("getDatasetsPerPage", () => {
    it("should get limit from datasets filters", () => {
      const { limit } = initialProposalsState.datasetFilters;
      expect(
        fromSelectors.getDatasetsPerPage.projector(
          initialProposalsState.datasetFilters
        )
      ).toEqual(limit);
    });
  });

  describe("getFullqueryParams", () => {
    it("should get query params for proposals", () => {
      const {
        text,
        skip,
        limit,
        sortField
      } = initialProposalsState.proposalFilters;
      const limits = { order: sortField, skip, limit };
      const params = { query: JSON.stringify({ text }), limits };
      expect(
        fromSelectors.getFullqueryParams.projector(
          initialProposalsState.proposalFilters
        )
      ).toEqual(params);
    });
  });

  describe("getDatasetsQueryParams", () => {
    it("should get query params for datasets", () => {
      const {
        text,
        skip,
        limit,
        sortField
      } = initialProposalsState.datasetFilters;
      const limits = { order: sortField, skip, limit };
      const params = { query: JSON.stringify({ text }), limits };
      expect(
        fromSelectors.getDatasetsQueryParams.projector(
          initialProposalsState.datasetFilters
        )
      ).toEqual(params);
    });
  });
});
