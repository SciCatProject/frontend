import {
  ProposalInterface,
  Proposal,
  ProposalApi,
  DatasetApi,
  Dataset,
  Attachment
} from "shared/sdk";
import { Observable } from "rxjs";
import { ProposalEffects } from "./proposals.effects";
import { TestBed } from "@angular/core/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import {
  getFullqueryParams,
  getDatasetsQueryParams,
  getCurrentProposal
} from "state-management/selectors/proposals.selectors";
import * as fromActions from "state-management/actions/proposals.actions";
import { hot, cold } from "jasmine-marbles";
import {
  loadingAction,
  loadingCompleteAction
} from "state-management/actions/user.actions";
import { Type } from "@angular/core";

const data: ProposalInterface = {
  proposalId: "testId",
  email: "testEmail",
  ownerGroup: "testGroup",
  attachments: []
};
const proposal = new Proposal(data);

describe("ProposalEffects", () => {
  let actions: Observable<any>;
  let effects: ProposalEffects;
  let proposalApi: jasmine.SpyObj<ProposalApi>;
  let datasetApi: jasmine.SpyObj<DatasetApi>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProposalEffects,
        provideMockActions(() => actions),
        provideMockStore({
          selectors: [
            { selector: getFullqueryParams, value: {} },
            {
              selector: getDatasetsQueryParams,
              value: {
                query: JSON.stringify({ text: "" }),
                limits: { order: "", skip: 0, limit: 25 }
              }
            },
            { selector: getCurrentProposal, value: {} }
          ]
        }),
        {
          provide: ProposalApi,
          useValue: jasmine.createSpyObj("proposalApi", [
            "fullquery",
            "findById",
            "createAttachments",
            "updateByIdAttachments",
            "destroyByIdAttachments"
          ])
        },
        {
          provide: DatasetApi,
          useValue: jasmine.createSpyObj("datasetApi", ["find"])
        }
      ]
    });

    effects = TestBed.inject(ProposalEffects);
    proposalApi = injectedStub(ProposalApi);
    datasetApi = injectedStub(DatasetApi);
  });

  function injectedStub<S>(service: Type<S>): jasmine.SpyObj<S> {
    return TestBed.inject(service) as jasmine.SpyObj<S>;
  }

  describe("fetchProposals$", () => {
    describe("ofType fetchProposalsAction", () => {
      it("should result in a fetchProposalsCompleteAction and a fetchCountAction", () => {
        const proposals = [proposal];
        const action = fromActions.fetchProposalsAction();
        const outcome1 = fromActions.fetchProposalsCompleteAction({
          proposals
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: proposals });
        proposalApi.fullquery.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchProposals$).toBeObservable(expected);
      });

      it("should result in a fetchProposalsFailedAction", () => {
        const action = fromActions.fetchProposalsAction();
        const outcome = fromActions.fetchProposalsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        proposalApi.fullquery.and.returnValue(response);

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
          proposals
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: proposals });
        proposalApi.fullquery.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchProposals$).toBeObservable(expected);
      });

      it("should result in a fetchProposalsFailedAction", () => {
        const action = fromActions.changePageAction({ page, limit });
        const outcome = fromActions.fetchProposalsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        proposalApi.fullquery.and.returnValue(response);

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
          proposals
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: proposals });
        proposalApi.fullquery.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchProposals$).toBeObservable(expected);
      });

      it("should result in a fetchProposalsFailedAction", () => {
        const action = fromActions.sortByColumnAction({ column, direction });
        const outcome = fromActions.fetchProposalsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        proposalApi.fullquery.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchProposals$).toBeObservable(expected);
      });
    });

    describe("ofType clearFacetsAction", () => {
      it("should result in a fetchProposalsCompleteAction and a fetchCountAction", () => {
        const proposals = [proposal];
        const action = fromActions.clearFacetsAction();
        const outcome1 = fromActions.fetchProposalsCompleteAction({
          proposals
        });
        const outcome2 = fromActions.fetchCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: proposals });
        proposalApi.fullquery.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchProposals$).toBeObservable(expected);
      });

      it("should result in a fetchProposalsFailedAction", () => {
        const action = fromActions.clearFacetsAction();
        const outcome = fromActions.fetchProposalsFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        proposalApi.fullquery.and.returnValue(response);

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
        count: proposals.length
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: proposals });
      proposalApi.fullquery.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });

    it("should result in a fetchProposalsFailedAction", () => {
      const action = fromActions.fetchCountAction();
      const outcome = fromActions.fetchCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      proposalApi.fullquery.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });
  });

  describe("fetchProposal$", () => {
    const proposalId = "testId";

    it("should result in a fetchCountCompleteAction", () => {
      const action = fromActions.fetchProposalAction({ proposalId });
      const outcome = fromActions.fetchProposalCompleteAction({ proposal });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: proposal });
      proposalApi.findById.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchProposal$).toBeObservable(expected);
    });

    it("should result in a fetchProposalFailedAction", () => {
      const action = fromActions.fetchProposalAction({ proposalId });
      const outcome = fromActions.fetchProposalFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      proposalApi.findById.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchProposal$).toBeObservable(expected);
    });
  });

  describe("fetchProposalDatasets$", () => {
    const proposalId = "testId";

    it("should result in a fetchProposalDatasetsCompleteAction and a fetchProposalDatasetsCountAction", () => {
      const datasets = [new Dataset()];
      const action = fromActions.fetchProposalDatasetsAction({ proposalId });
      const outcome1 = fromActions.fetchProposalDatasetsCompleteAction({
        datasets
      });
      const outcome2 = fromActions.fetchProposalDatasetsCountAction({
        proposalId
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: datasets });
      datasetApi.find.and.returnValue(response);

      const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
      expect(effects.fetchProposalDatasets$).toBeObservable(expected);
    });

    it("should result in a fetchProposalDatasetsFailedAction", () => {
      const action = fromActions.fetchProposalDatasetsAction({ proposalId });
      const outcome = fromActions.fetchProposalDatasetsFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetApi.find.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchProposalDatasets$).toBeObservable(expected);
    });
  });

  describe("fetchProposalDatasetsCount$", () => {
    const proposalId = "testId";

    it("should result in a fetchProposalDatasetsCountCompleteAction", () => {
      const datasets = [new Dataset()];
      const count = 1;
      const action = fromActions.fetchProposalDatasetsCountAction({
        proposalId
      });
      const outcome = fromActions.fetchProposalDatasetsCountCompleteAction({
        count
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: datasets });
      datasetApi.find.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchProposalDatasetsCount$).toBeObservable(expected);
    });

    it("should result in a fetchProposalDatasetsCountFailedAction", () => {
      const action = fromActions.fetchProposalDatasetsCountAction({
        proposalId
      });
      const outcome = fromActions.fetchProposalDatasetsCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetApi.find.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchProposalDatasetsCount$).toBeObservable(expected);
    });
  });

  describe("addAttachment$", () => {
    const attachment = new Attachment();

    it("should result in an addAttachmentCompleteAction", () => {
      const action = fromActions.addAttachmentAction({ attachment });
      const outcome = fromActions.addAttachmentCompleteAction({ attachment });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: attachment });
      proposalApi.createAttachments.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.addAttachment$).toBeObservable(expected);
    });

    it("should result in an addAttachmentFailedAction", () => {
      const action = fromActions.addAttachmentAction({ attachment });
      const outcome = fromActions.addAttachmentFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      proposalApi.createAttachments.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.addAttachment$).toBeObservable(expected);
    });
  });

  describe("updateAttachmentCaption$", () => {
    const proposalId = "testId";
    const attachmentId = "testId";
    const caption = "test";

    it("should result in an updateAttachmentCaptionCompleteAction", () => {
      const attachment = new Attachment();
      const action = fromActions.updateAttachmentCaptionAction({
        proposalId,
        attachmentId,
        caption
      });
      const outcome = fromActions.updateAttachmentCaptionCompleteAction({
        attachment
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: attachment });
      proposalApi.updateByIdAttachments.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.updateAttachmentCaption$).toBeObservable(expected);
    });

    it("should result in an updateAttachmentCaptionFailedAction", () => {
      const action = fromActions.updateAttachmentCaptionAction({
        proposalId,
        attachmentId,
        caption
      });
      const outcome = fromActions.updateAttachmentCaptionFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      proposalApi.updateByIdAttachments.and.returnValue(response);

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
        attachmentId
      });
      const outcome = fromActions.removeAttachmentCompleteAction({
        attachmentId
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: attachmentId });
      proposalApi.destroyByIdAttachments.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.removeAttachment$).toBeObservable(expected);
    });

    it("should result in a removeAttachmentFailedAction", () => {
      const action = fromActions.removeAttachmentAction({
        proposalId,
        attachmentId
      });
      const outcome = fromActions.removeAttachmentFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      proposalApi.destroyByIdAttachments.and.returnValue(response);

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
          proposalId
        });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType addAttachmentAction", () => {
      it("should dispatch a loadingAction", () => {
        const attachment = new Attachment();
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
          caption
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
          attachmentId
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
        const datasets = [new Dataset()];
        const action = fromActions.fetchProposalDatasetsCompleteAction({
          datasets
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
          count
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
        const attachment = new Attachment();
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
        const attachment = new Attachment();
        const action = fromActions.updateAttachmentCaptionCompleteAction({
          attachment
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
          attachmentId
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
