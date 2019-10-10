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
  getDatasetsQueryParams
} from "state-management/selectors/proposals.selectors";
import * as fromActions from "state-management/actions/proposals.actions";
import { hot, cold } from "jasmine-marbles";

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
            }
          ]
        }),
        {
          provide: ProposalApi,
          useValue: jasmine.createSpyObj("proposalApi", [
            "fullquery",
            "count",
            "findById",
            "createAttachments",
            "updateByIdAttachments",
            "destroyByIdAttachments"
          ])
        },
        {
          provide: DatasetApi,
          useValue: jasmine.createSpyObj("datasetApi", ["find", "count"])
        }
      ]
    });

    effects = TestBed.get(ProposalEffects);
    proposalApi = TestBed.get(ProposalApi);
    datasetApi = TestBed.get(DatasetApi);
  });

  describe("fetchProposals$", () => {
    it("should result in a fetchProposalsCompleteAction", () => {
      const proposals = [proposal];
      const action = fromActions.fetchProposalsAction();
      const outcome = fromActions.fetchProposalsCompleteAction({ proposals });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: proposals });
      proposalApi.fullquery.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
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

  describe("fetchCount$", () => {
    it("should result in a fetchCountCompleteAction", () => {
      const count = 100;
      const action = fromActions.fetchProposalsAction();
      const outcome = fromActions.fetchCountCompleteAction({ count });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: { count } });
      proposalApi.count.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });

    it("should result in a fetchProposalsFailedAction", () => {
      const action = fromActions.fetchProposalsAction();
      const outcome = fromActions.fetchCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      proposalApi.count.and.returnValue(response);

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

    it("should result in a fetchProposalDatasetsCompleteAction", () => {
      const datasets = [new Dataset()];
      const action = fromActions.fetchProposalDatasetsAction({ proposalId });
      const outcome = fromActions.fetchProposalDatasetsCompleteAction({
        datasets
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: datasets });
      datasetApi.find.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
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
      const count = 100;
      const action = fromActions.fetchProposalDatasetsAction({ proposalId });
      const outcome = fromActions.fetchProposalDatasetsCountCompleteAction({
        count
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: { count } });
      datasetApi.count.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchProposalDatasetsCount$).toBeObservable(expected);
    });

    it("should result in a fetchProposalDatasetsCountFailedAction", () => {
      const action = fromActions.fetchProposalDatasetsAction({ proposalId });
      const outcome = fromActions.fetchProposalDatasetsCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetApi.count.and.returnValue(response);

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
});
