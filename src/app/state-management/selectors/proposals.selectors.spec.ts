import * as fromSelectors from "./proposals.selectors";
import { ProposalsState } from "state-management/state/proposals.store";
import { createMock } from "shared/MockStubs";
import { ProposalClass } from "@scicatproject/scicat-sdk-ts-angular";

const proposal = createMock<ProposalClass>({
  proposalId: "testId",
  email: "testEmail",
  ownerGroup: "testGroup",
  accessGroups: [],
  createdAt: "",
  createdBy: "",
  isPublished: false,
  title: "test",
  type: "",
  updatedAt: "",
  updatedBy: "",
});
const parentProposal = createMock<ProposalClass>({
  proposalId: "parentTestId",
  email: "parentTestEmail",
  ownerGroup: "parentTestGroup",
  accessGroups: [],
  createdAt: "",
  createdBy: "",
  isPublished: false,
  title: "test",
  type: "",
  updatedAt: "",
  updatedBy: "",
});

const initialProposalsState: ProposalsState = {
  proposals: [],
  currentProposal: proposal,
  parentProposal: parentProposal,
  datasets: [],

  relatedProposals: [],
  relatedProposalsCount: 0,
  relatedProposalsFilters: {
    skip: 0,
    limit: 25,
    sortField: "creationTime:desc",
  },

  proposalsCount: 0,
  datasetsCount: 0,
  facetCounts: {},

  hasPrefilledFilters: true,

  proposalFilters: {
    fields: {
      instrumentIds: ["test"],
      startTime: {
        begin: new Date(2019, 11, 1).toISOString(),
        end: new Date(2019, 11, 2).toISOString(),
      },
    },
    sortField: "test asc",
    skip: 0,
    limit: 25,
  },
  datasetFilters: {
    text: "test",
    sortField: "test asc",
    skip: 0,
    limit: 25,
  },
  columns: [
    {
      name: "proposalId",
      width: 250,
      enabled: true,
    },
    {
      name: "startTime",
      width: 250,
      enabled: true,
    },
    {
      name: "abstract",
      width: 250,
      enabled: true,
    },
  ],
};

describe("Proposal Selectors", () => {
  describe("selectProposals", () => {
    it("should select proposals", () => {
      expect(
        fromSelectors.selectProposals.projector(initialProposalsState),
      ).toEqual([]);
    });
  });

  describe("selectCurrentProposal", () => {
    it("should select current proposal", () => {
      expect(
        fromSelectors.selectCurrentProposal.projector(initialProposalsState),
      ).toEqual(proposal);
    });
  });

  describe("selectProposalDatasets", () => {
    it("should select datasets belonging to current proposal", () => {
      expect(
        fromSelectors.selectProposalDatasets.projector(initialProposalsState),
      ).toEqual([]);
    });
  });

  describe("selectProposalsCount", () => {
    it("should select the number of proposals", () => {
      expect(
        fromSelectors.selectProposalsCount.projector(initialProposalsState),
      ).toEqual(0);
    });
  });

  describe("selectDatasetsCount", () => {
    it("should select the number of datasets", () => {
      expect(
        fromSelectors.selectDatasetsCount.projector(initialProposalsState),
      ).toEqual(0);
    });
  });

  describe("selectHasPrefilledFilters", () => {
    it("should select hasPrefilledFilters", () => {
      expect(
        fromSelectors.selectHasPrefilledFilters.projector(
          initialProposalsState,
        ),
      ).toEqual(true);
    });
  });

  describe("selectFilters", () => {
    it("should select the proposal filters", () => {
      expect(
        fromSelectors.selectFilters.projector(initialProposalsState),
      ).toEqual(initialProposalsState.proposalFilters);
    });
  });

  describe("selectDatasetFilters", () => {
    it("should select the dataset filters", () => {
      expect(
        fromSelectors.selectDatasetFilters.projector(initialProposalsState),
      ).toEqual(initialProposalsState.datasetFilters);
    });
  });

  describe("selectPage", () => {
    it("should select the current proposals page", () => {
      const { skip, limit } = initialProposalsState.proposalFilters;
      const page = skip / limit;
      expect(
        fromSelectors.selectPage.projector(
          initialProposalsState.proposalFilters,
        ),
      ).toEqual(page);
    });
  });

  describe("selectDatasetsPage", () => {
    it("should select the current datasets page", () => {
      const { skip, limit } = initialProposalsState.datasetFilters;
      const page = skip / limit;
      expect(
        fromSelectors.selectDatasetsPage.projector(
          initialProposalsState.datasetFilters,
        ),
      ).toEqual(page);
    });
  });

  describe("selectProposalsPerPage", () => {
    it("should select limit from proposal filters", () => {
      const { limit } = initialProposalsState.proposalFilters;
      expect(
        fromSelectors.selectProposalsPerPage.projector(
          initialProposalsState.proposalFilters,
        ),
      ).toEqual(limit);
    });
  });

  describe("selectDatasetsPerPage", () => {
    it("should select limit from datasets filters", () => {
      const { limit } = initialProposalsState.datasetFilters;
      expect(
        fromSelectors.selectDatasetsPerPage.projector(
          initialProposalsState.datasetFilters,
        ),
      ).toEqual(limit);
    });
  });

  describe("selectViewProposalPageViewModel", () => {
    it("should select view proposal page view model state", () => {
      expect(
        fromSelectors.selectViewProposalPageViewModel.projector(
          initialProposalsState.currentProposal,
          initialProposalsState.datasets,
          fromSelectors.selectDatasetsPage.projector(
            initialProposalsState.datasetFilters,
          ),
          initialProposalsState.datasetsCount,
          initialProposalsState.datasetFilters.limit,
        ),
      ).toEqual({
        proposal,
        datasets: [],
        currentPage: 0,
        datasetCount: 0,
        datasetsPerPage: 25,
      });
    });
  });

  describe("selectFullqueryParams", () => {
    it("should select query params for proposals", () => {
      const fullqueryKeys = Object.keys(
        fromSelectors.selectFullqueryParams.projector(
          initialProposalsState.proposalFilters,
        ),
      );
      expect(fullqueryKeys).toContain("query");
    });
  });

  describe("selectDatasetsQueryParams", () => {
    it("should select query params for datasets", () => {
      const { text, skip, limit, sortField } =
        initialProposalsState.datasetFilters;
      const limits = { order: sortField, skip, limit };
      const params = { query: JSON.stringify({ text }), limits };
      expect(
        fromSelectors.selectDatasetsQueryParams.projector(
          initialProposalsState.datasetFilters,
        ),
      ).toEqual(params);
    });
  });

  describe("selectParentProposal", () => {
    it("should select parent proposal", () => {
      expect(
        fromSelectors.selectParentProposal.projector(initialProposalsState),
      ).toEqual(parentProposal);
    });
  });

  describe("selectCurrentAttachments", () => {
    it("should return empty array when no proposal", () => {
      expect(fromSelectors.selectCurrentAttachments.projector(null)).toEqual(
        [],
      );
    });

    it("should return attachments when present on proposal", () => {
      const proposalWithAttachments = {
        ...proposal,
        attachments: [{ id: "a1" }, { id: "a2" }],
      } as any;
      expect(
        fromSelectors.selectCurrentAttachments.projector(
          proposalWithAttachments,
        ),
      ).toEqual([{ id: "a1" }, { id: "a2" }]);
    });
  });

  describe("selectDefaultProposalColumns", () => {
    it("should select default proposal columns", () => {
      expect(
        fromSelectors.selectDefaultProposalColumns.projector(
          initialProposalsState,
        ),
      ).toEqual(initialProposalsState.columns);
    });
  });

  describe("selectFilterByKey", () => {
    it("should select a specific filter field by key", () => {
      expect(
        fromSelectors
          .selectFilterByKey("instrumentIds")
          .projector(initialProposalsState),
      ).toEqual(["test"]);
    });

    it("should return empty array when key not present", () => {
      expect(
        fromSelectors
          .selectFilterByKey("nonExistingKey")
          .projector(initialProposalsState),
      ).toEqual([]);
    });
  });

  describe("selectFullfacetParams", () => {
    it("should return filtered fields for facets", () => {
      const result = fromSelectors.selectFullfacetParams.projector(
        initialProposalsState.proposalFilters,
      );
      expect(result).toEqual({
        fields: initialProposalsState.proposalFilters.fields,
      });
    });
  });

  describe("selectProposalsWithCountAndTableSettings", () => {
    it("should combine proposals, count and table settings into view model", () => {
      const proposalsSample = [
        { proposalId: "p1", instrumentIds: ["i1"] } as any,
      ];
      const count = 1;
      const tablesSettings = { col: "v" };
      const hasFetchedSettings = true;

      expect(
        fromSelectors.selectProposalsWithCountAndTableSettings.projector(
          proposalsSample,
          count,
          tablesSettings,
          hasFetchedSettings,
        ),
      ).toEqual({
        proposals: proposalsSample,
        count,
        tablesSettings,
        hasFetchedSettings,
      });
    });
  });

  describe("selectEnrichedProposals", () => {
    it("should enrich proposals with instrumentName from map", () => {
      const proposalsSample = [
        { proposalId: "p1", instrumentIds: ["i1"] } as any,
      ];
      const instrumentMap = new Map([["i1", "Instrument One"]]);
      const enriched = fromSelectors.selectEnrichedProposals.projector(
        proposalsSample,
        instrumentMap,
      );
      expect(enriched[0].instrumentName).toEqual("Instrument One");
    });

    it("should fallback to id when instrument name missing", () => {
      const proposalsSample = [
        { proposalId: "p2", instrumentIds: ["iX"] } as any,
      ];
      const instrumentMap = new Map<string, string>();
      const enriched = fromSelectors.selectEnrichedProposals.projector(
        proposalsSample,
        instrumentMap,
      );
      expect(enriched[0].instrumentName).toEqual("iX");
    });
  });

  describe("proposals facet counts with instrument name", () => {
    it("should map instrument facet labels using instrument name map", () => {
      const facets = {
        instrumentIds: [{ _id: "test", count: 2 }],
      } as any;
      const instrumentMap = new Map([["test", "Nice Instrument"]]);
      const result =
        fromSelectors.selectProposalsfacetCountsWithInstrumentName.projector(
          facets,
          instrumentMap,
        );
      expect(result.instrumentIds[0].label).toEqual("Nice Instrument");
    });

    it("factory selector should return facet array by key", () => {
      const facets = {
        instrumentIds: [{ _id: "x", count: 1 }],
      } as any;
      const selector =
        fromSelectors.selectProposalsfacetCountsWithInstrumentNameByKey(
          "instrumentIds",
        );
      expect(selector.projector(facets)).toEqual(facets.instrumentIds);
    });
  });

  describe("related proposals selectors", () => {
    it("should select related proposals page view model", () => {
      expect(
        fromSelectors.selectRelatedProposalsPageViewModel.projector(
          initialProposalsState,
        ),
      ).toEqual({
        relatedProposals: initialProposalsState.relatedProposals,
        relatedProposalsCount: initialProposalsState.relatedProposalsCount,
      });
    });

    it("should select related proposals filters", () => {
      expect(
        fromSelectors.selectRelatedProposalsFilters.projector(
          initialProposalsState,
        ),
      ).toEqual(initialProposalsState.relatedProposalsFilters);
    });

    it("should compute related proposals current page and per page", () => {
      const filters = initialProposalsState.relatedProposalsFilters;
      expect(
        fromSelectors.selectRelatedProposalsCurrentPage.projector(filters),
      ).toEqual(filters.skip / filters.limit);
      expect(
        fromSelectors.selectRelatedProposalsPerPage.projector(filters),
      ).toEqual(filters.limit);
    });
  });
});
