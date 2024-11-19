import { throwError } from "rxjs";
import { ProposalEffects } from "./proposals.effects";
import { TestBed } from "@angular/core/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import {
  selectFullqueryParams,
  selectDatasetsQueryParams,
  selectCurrentProposal,
} from "state-management/selectors/proposals.selectors";
import * as fromActions from "state-management/actions/proposals.actions";
import { hot, cold } from "jasmine-marbles";
import {
  loadingAction,
  loadingCompleteAction,
} from "state-management/actions/user.actions";
import { Type } from "@angular/core";
import {
  Attachment,
  DatasetsService,
  OutputDatasetObsoleteDto,
  ProposalClass,
  ProposalsService,
} from "@scicatproject/scicat-sdk-ts";
import { TestObservable } from "jasmine-marbles/src/test-observables";

const proposal: ProposalClass = {
  accessGroups: [],
  createdAt: "",
  createdBy: "",
  email: "",
  isPublished: false,
  ownerGroup: "",
  proposalId: "",
  title: "Test proposal",
  type: "",
  updatedAt: "",
  updatedBy: "",
};

const dataset: OutputDatasetObsoleteDto = {
  pid: "testPid",
  owner: "",
  contactEmail: "",
  sourceFolder: "",
  creationTime: new Date().toString(),
  type: "raw",
  ownerGroup: "",
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
};

const attachment: Attachment = {
  accessGroups: [],
  caption: "Test",
  createdAt: "",
  updatedAt: "",
  createdBy: "",
  updatedBy: "",
  isPublished: false,
  ownerGroup: "",
  thumbnail: "",
  id: "",
};

describe("ProposalEffects", () => {
  let actions: TestObservable;
  let effects: ProposalEffects;
  let proposalApi: jasmine.SpyObj<ProposalsService>;
  let datasetApi: jasmine.SpyObj<DatasetsService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProposalEffects,
        provideMockActions(() => actions),
        provideMockStore({
          selectors: [
            { selector: selectFullqueryParams, value: {} },
            {
              selector: selectDatasetsQueryParams,
              value: {
                query: JSON.stringify({ text: "" }),
                limits: { order: "", skip: 0, limit: 25 },
              },
            },
            { selector: selectCurrentProposal, value: {} },
          ],
        }),
        {
          provide: ProposalsService,
          useValue: jasmine.createSpyObj("proposalApi", [
            "fullquery",
            "findById",
            "findByIdAccess",
            "createAttachments",
            "updateByIdAttachments",
            "destroyByIdAttachments",
          ]),
        },
        {
          provide: DatasetsService,
          useValue: jasmine.createSpyObj("datasetApi", ["find"]),
        },
      ],
    });

    effects = TestBed.inject(ProposalEffects);
    proposalApi = injectedStub(ProposalsService);
    datasetApi = injectedStub(DatasetsService);
  });

  const injectedStub = <S>(service: Type<S>): jasmine.SpyObj<S> =>
    TestBed.inject(service) as jasmine.SpyObj<S>;

  describe("fetchProposals$", () => {
    describe("ofType fetchProposalsAction", () => {
      it("should result in a fetchProposalsCompleteAction and a fetchCountAction", () => {
        const proposals = [proposal];
        const action = fromActions.fetchProposalsAction();
        const outcome1 = fromActions.fetchProposalsCompleteAction({
          proposals,
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: proposals });
        proposalApi.proposalsControllerFullfacet.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchProposals$).toBeObservable(expected);
      });

      it("should result in a fetchProposalsFailedAction", () => {
        const action = fromActions.fetchProposalsAction();
        const outcome = fromActions.fetchProposalsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        proposalApi.proposalsControllerFullfacet.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchProposals$).toBeObservable(expected);
      });
    });

    describe("ofType changePageAction", () => {
      const page = 1;
      const limit = 25;

      it("should result in a fetchProposalsCompleteAction and a fetchCountAction", () => {
        const proposals = [proposal];
        const action = fromActions.changePageAction({ page, limit });
        const outcome1 = fromActions.fetchProposalsCompleteAction({
          proposals,
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: proposals });
        proposalApi.proposalsControllerFullfacet.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchProposals$).toBeObservable(expected);
      });

      it("should result in a fetchProposalsFailedAction", () => {
        const action = fromActions.changePageAction({ page, limit });
        const outcome = fromActions.fetchProposalsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        proposalApi.proposalsControllerFullfacet.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchProposals$).toBeObservable(expected);
      });
    });

    describe("ofType sortByColumnAction", () => {
      const column = "test";
      const direction = "desc";

      it("should result in a fetchProposalsCompleteAction and a fetchCountAction", () => {
        const proposals = [proposal];
        const action = fromActions.sortByColumnAction({ column, direction });
        const outcome1 = fromActions.fetchProposalsCompleteAction({
          proposals,
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: proposals });
        proposalApi.proposalsControllerFullfacet.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchProposals$).toBeObservable(expected);
      });

      it("should result in a fetchProposalsFailedAction", () => {
        const action = fromActions.sortByColumnAction({ column, direction });
        const outcome = fromActions.fetchProposalsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        proposalApi.proposalsControllerFullfacet.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchProposals$).toBeObservable(expected);
      });
    });

    describe("ofType clearFacetsAction", () => {
      it("should result in a fetchProposalsCompleteAction and a fetchCountAction", () => {
        const proposals = [proposal];
        const action = fromActions.clearFacetsAction();
        const outcome1 = fromActions.fetchProposalsCompleteAction({
          proposals,
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: proposals });
        proposalApi.proposalsControllerFullfacet.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchProposals$).toBeObservable(expected);
      });

      it("should result in a fetchProposalsFailedAction", () => {
        const action = fromActions.clearFacetsAction();
        const outcome = fromActions.fetchProposalsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        proposalApi.proposalsControllerFullfacet.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchProposals$).toBeObservable(expected);
      });
    });
  });

  describe("fetchCount$", () => {
    it("should result in a fetchCountCompleteAction", () => {
      const proposals = [proposal];
      const action = fromActions.fetchCountAction();
      const outcome = fromActions.fetchCountCompleteAction({
        count: proposals.length,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: proposals });
      proposalApi.proposalsControllerFullfacet.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });

    it("should result in a fetchProposalsFailedAction", () => {
      const action = fromActions.fetchCountAction();
      const outcome = fromActions.fetchCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      proposalApi.proposalsControllerFullfacet.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });
  });

  describe("fetchProposal$", () => {
    const proposalId = "testId";
    const permission = {
      accepted: { canAccess: true },
      rejected: { canAccess: false },
    };

    it("should result in a fetchProposalCompleteAction", () => {
      const action = fromActions.fetchProposalAction({ proposalId });
      const outcome = fromActions.fetchProposalCompleteAction({ proposal });

      const responseAccess = cold("-#", permission.accepted);
      const responseProposal = cold("-#", proposal);

      proposalApi.proposalsControllerFindByIdAccess
        .withArgs(proposalId)
        .and.returnValue(responseAccess);
      proposalApi.proposalsControllerFindById
        .withArgs(encodeURIComponent(proposalId))
        .and.returnValue(responseProposal);

      actions = hot("a", { a: action });
      const expected = cold("b", { b: outcome });

      expect(effects.fetchProposal$).toBeObservable(expected);
    });

    it("should result in a fetchProposalFailedAction", () => {
      const action = fromActions.fetchProposalAction({ proposalId });
      const failure = fromActions.fetchProposalFailedAction();

      const responseAccess = cold("-#", permission.accepted);

      proposalApi.proposalsControllerFindByIdAccess
        .withArgs(proposalId)
        .and.returnValue(responseAccess);
      proposalApi.proposalsControllerFindById.and.returnValue(
        throwError(() => new Error()),
      );

      actions = hot("a", { a: action });
      const expected = cold("b", { b: failure });

      expect(effects.fetchProposal$).toBeObservable(expected);
    });

    it("should do nothing if findByIdAccess returns false", () => {
      const action = fromActions.fetchProposalAction({ proposalId });

      const responseAccess = cold("-#", permission.rejected);

      proposalApi.proposalsControllerFindByIdAccess
        .withArgs(proposalId)
        .and.returnValue(responseAccess);

      actions = hot("a", { a: action });
      const expected = cold("------");

      expect(effects.fetchProposal$).toBeObservable(expected);
      expect(proposalApi.proposalsControllerFindById).not.toHaveBeenCalled();
    });

    it("should result in fetchProposalAccessFailedAction if findByIdAccess failed", () => {
      const action = fromActions.fetchProposalAction({ proposalId });
      const failure = fromActions.fetchProposalAccessFailedAction();

      proposalApi.proposalsControllerFindByIdAccess
        .withArgs(proposalId)
        .and.returnValue(throwError(() => new Error()));

      actions = hot("a", { a: action });
      const expected = cold("b", { b: failure });

      expect(effects.fetchProposal$).toBeObservable(expected);
      expect(proposalApi.proposalsControllerFindById).not.toHaveBeenCalled();
    });
  });

  describe("fetchProposalDatasets$", () => {
    const proposalId = "testId";

    it("should result in a fetchProposalDatasetsCompleteAction and a fetchProposalDatasetsCountAction", () => {
      const datasets = [dataset];
      const action = fromActions.fetchProposalDatasetsAction({ proposalId });
      const outcome1 = fromActions.fetchProposalDatasetsCompleteAction({
        datasets,
      });
      const outcome2 = fromActions.fetchProposalDatasetsCountAction({
        proposalId,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: datasets });
      datasetApi.datasetsControllerFindAll.and.returnValue(response);

      const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
      expect(effects.fetchProposalDatasets$).toBeObservable(expected);
    });

    it("should result in a fetchProposalDatasetsFailedAction", () => {
      const action = fromActions.fetchProposalDatasetsAction({ proposalId });
      const outcome = fromActions.fetchProposalDatasetsFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetApi.datasetsControllerFindAll.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchProposalDatasets$).toBeObservable(expected);
    });
  });

  describe("fetchProposalDatasetsCount$", () => {
    const proposalId = "testId";

    it("should result in a fetchProposalDatasetsCountCompleteAction", () => {
      const datasets = [dataset];
      const count = 1;
      const action = fromActions.fetchProposalDatasetsCountAction({
        proposalId,
      });
      const outcome = fromActions.fetchProposalDatasetsCountCompleteAction({
        count,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: datasets });
      datasetApi.datasetsControllerFindAll.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchProposalDatasetsCount$).toBeObservable(expected);
    });

    it("should result in a fetchProposalDatasetsCountFailedAction", () => {
      const action = fromActions.fetchProposalDatasetsCountAction({
        proposalId,
      });
      const outcome = fromActions.fetchProposalDatasetsCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetApi.datasetsControllerFindAll.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchProposalDatasetsCount$).toBeObservable(expected);
    });
  });

  describe("addAttachment$", () => {
    it("should result in an addAttachmentCompleteAction", () => {
      const action = fromActions.addAttachmentAction({ attachment });
      const outcome = fromActions.addAttachmentCompleteAction({ attachment });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: attachment });
      proposalApi.proposalsControllerCreateAttachment.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.addAttachment$).toBeObservable(expected);
    });

    it("should result in an addAttachmentFailedAction", () => {
      const action = fromActions.addAttachmentAction({ attachment });
      const outcome = fromActions.addAttachmentFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      proposalApi.proposalsControllerCreateAttachment.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.addAttachment$).toBeObservable(expected);
    });
  });

  describe("updateAttachmentCaption$", () => {
    const proposalId = "testId";
    const attachmentId = "testId";
    const caption = "test";

    it("should result in an updateAttachmentCaptionCompleteAction", () => {
      const action = fromActions.updateAttachmentCaptionAction({
        proposalId,
        attachmentId,
        caption,
      });
      const outcome = fromActions.updateAttachmentCaptionCompleteAction({
        attachment,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: attachment });
      proposalApi.proposalsControllerFindOneAttachmentAndUpdate.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.updateAttachmentCaption$).toBeObservable(expected);
    });

    it("should result in an updateAttachmentCaptionFailedAction", () => {
      const action = fromActions.updateAttachmentCaptionAction({
        proposalId,
        attachmentId,
        caption,
      });
      const outcome = fromActions.updateAttachmentCaptionFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      proposalApi.proposalsControllerFindOneAttachmentAndUpdate.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.updateAttachmentCaption$).toBeObservable(expected);
    });
  });

  describe("removeAttachment$", () => {
    const proposalId = "testId";
    const attachmentId = "testId";

    it("should result in a removeAttachmentCompleteAction", () => {
      const action = fromActions.removeAttachmentAction({
        proposalId,
        attachmentId,
      });
      const outcome = fromActions.removeAttachmentCompleteAction({
        attachmentId,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: attachmentId });
      proposalApi.proposalsControllerFindOneAttachmentAndRemove.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.removeAttachment$).toBeObservable(expected);
    });

    it("should result in a removeAttachmentFailedAction", () => {
      const action = fromActions.removeAttachmentAction({
        proposalId,
        attachmentId,
      });
      const outcome = fromActions.removeAttachmentFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      proposalApi.proposalsControllerFindOneAttachmentAndRemove.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.removeAttachment$).toBeObservable(expected);
    });
  });

  describe("loading$", () => {
    describe("ofType fetchProposalsAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchProposalsAction();
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchCountAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchCountAction();
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchProposalAction", () => {
      it("should dispatch a loadingAction", () => {
        const proposalId = "testId";
        const action = fromActions.fetchProposalAction({ proposalId });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchProposalDatasetsAction", () => {
      it("should dispatch a loadingAction", () => {
        const proposalId = "testId";
        const action = fromActions.fetchProposalDatasetsAction({ proposalId });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchProposalDatasetsCountAction", () => {
      it("should dispatch a loadingAction", () => {
        const proposalId = "testId";
        const action = fromActions.fetchProposalDatasetsCountAction({
          proposalId,
        });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType addAttachmentAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.addAttachmentAction({ attachment });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType updateAttachmentCaptionAction", () => {
      it("should dispatch a loadingAction", () => {
        const proposalId = "testId";
        const attachmentId = "testId";
        const caption = "test";
        const action = fromActions.updateAttachmentCaptionAction({
          proposalId,
          attachmentId,
          caption,
        });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType removeAttachmentAction", () => {
      it("should dispatch a loadingAction", () => {
        const proposalId = "testId";
        const attachmentId = "testId";
        const action = fromActions.removeAttachmentAction({
          proposalId,
          attachmentId,
        });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });
  });

  describe("loadingComplete$", () => {
    describe("ofType fetchProposalsCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const proposals = [proposal];
        const action = fromActions.fetchProposalsCompleteAction({ proposals });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchProposalsFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchProposalsFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchCountCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const count = 100;
        const action = fromActions.fetchCountCompleteAction({ count });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchCountFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchCountFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchProposalCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchProposalCompleteAction({ proposal });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchProposalFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchProposalFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchProposalDatasetsCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const datasets = [dataset];
        const action = fromActions.fetchProposalDatasetsCompleteAction({
          datasets,
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchProposalDatasetsFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchProposalDatasetsFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchProposalDatasetsCountCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const count = 100;
        const action = fromActions.fetchProposalDatasetsCountCompleteAction({
          count,
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchProposalDatasetsCountFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchProposalDatasetsCountFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType addAttachmentCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.addAttachmentCompleteAction({ attachment });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType addAttachmentFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.addAttachmentFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType updateAttachmentCaptionCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.updateAttachmentCaptionCompleteAction({
          attachment,
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType updateAttachmentCaptionFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.updateAttachmentCaptionFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType reomveAttachmentCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const attachmentId = "testId";
        const action = fromActions.removeAttachmentCompleteAction({
          attachmentId,
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType reomveAttachmentFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.removeAttachmentFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });
  });
});
