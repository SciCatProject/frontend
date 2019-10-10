import { Observable } from "rxjs";
import { SampleEffects } from "./samples.effects";
import {
  SampleApi,
  DatasetApi,
  SampleInterface,
  Sample,
  Dataset,
  Attachment
} from "shared/sdk";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { getFullqueryParams } from "state-management/selectors/samples.selectors";
import * as fromActions from "state-management/actions/samples.actions";
import { hot, cold } from "jasmine-marbles";

const data: SampleInterface = {
  sampleId: "testId",
  ownerGroup: "testGroup"
};
const sample = new Sample(data);

describe("SampleEffects", () => {
  let actions: Observable<any>;
  let effects: SampleEffects;
  let sampleApi: jasmine.SpyObj<SampleApi>;
  let datasetApi: jasmine.SpyObj<DatasetApi>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SampleEffects,
        provideMockActions(() => actions),
        provideMockStore({
          selectors: [{ selector: getFullqueryParams, value: {} }]
        }),
        {
          provide: SampleApi,
          useValue: jasmine.createSpyObj("sampleApi", [
            "fullquery",
            "findById",
            "create",
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

    effects = TestBed.get(SampleEffects);
    sampleApi = TestBed.get(SampleApi);
    datasetApi = TestBed.get(DatasetApi);
  });

  describe("fetchSamples$", () => {
    it("should result in a fetchSamplesCompleteAction", () => {
      const samples = [sample];
      const action = fromActions.fetchSamplesAction();
      const outcome = fromActions.fetchSamplesCompleteAction({ samples });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: samples });
      sampleApi.fullquery.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchSamples$).toBeObservable(expected);
    });

    it("should result in a fetchSamplesFailedAction", () => {
      const action = fromActions.fetchSamplesAction();
      const outcome = fromActions.fetchSamplesFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      sampleApi.fullquery.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchSamples$).toBeObservable(expected);
    });
  });

  describe("fetchCount$", () => {
    it("should result in a fetchSamplesCountCompleteAction", () => {
      const samples = [sample];
      const action = fromActions.fetchSamplesAction();
      const outcome = fromActions.fetchSamplesCountCompleteAction({
        count: samples.length
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: samples });
      sampleApi.fullquery.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });

    it("should result in a fetchSamplesCountFailedAction", () => {
      const action = fromActions.fetchSamplesAction();
      const outcome = fromActions.fetchSamplesCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      sampleApi.fullquery.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });
  });

  describe("fetchSample$", () => {
    const sampleId = "testId";

    it("should result in a fetchSampleCompleteAction", () => {
      const action = fromActions.fetchSampleAction({ sampleId });
      const outcome = fromActions.fetchSampleCompleteAction({ sample });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: sample });
      sampleApi.findById.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchSample$).toBeObservable(expected);
    });

    it("should result in a fetchSampleFailedAction", () => {
      const action = fromActions.fetchSampleAction({ sampleId });
      const outcome = fromActions.fetchSampleFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      sampleApi.findById.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchSample$).toBeObservable(expected);
    });
  });

  describe("fetchSampleDatasets$", () => {
    const sampleId = "testId";

    it("should result in a fetchSampleDatasetsCompleteAction", () => {
      const datasets = [new Dataset()];
      const action = fromActions.fetchSampleDatasetsAction({ sampleId });
      const outcome = fromActions.fetchSampleDatasetsCompleteAction({
        datasets
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: datasets });
      datasetApi.find.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchSampleDatasets$).toBeObservable(expected);
    });

    it("should result in a fetchSampleDatasetsFailedAction", () => {
      const action = fromActions.fetchSampleDatasetsAction({ sampleId });
      const outcome = fromActions.fetchSampleDatasetsFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetApi.find.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchSampleDatasets$).toBeObservable(expected);
    });
  });

  describe("addSample$", () => {
    it("should result in a addSampleCompleteAction", () => {
      const action = fromActions.addSampleAction({ sample });
      const outcome = fromActions.addSampleCompleteAction({ sample });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: sample });
      sampleApi.create.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.addSample$).toBeObservable(expected);
    });

    it("should result in a addSampleFailedAction", () => {
      const action = fromActions.addSampleAction({ sample });
      const outcome = fromActions.addSampleFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      sampleApi.create.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.addSample$).toBeObservable(expected);
    });
  });

  describe("addAttachment$", () => {
    const attachment = new Attachment();

    it("should result in a addAttachmentCompleteAction", () => {
      const action = fromActions.addAttachmentAction({ attachment });
      const outcome = fromActions.addAttachmentCompleteAction({ attachment });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: attachment });
      sampleApi.createAttachments.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.addAttachment$).toBeObservable(expected);
    });

    it("should result in a addAttachmentFailedAction", () => {
      const action = fromActions.addAttachmentAction({ attachment });
      const outcome = fromActions.addAttachmentFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      sampleApi.createAttachments.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.addAttachment$).toBeObservable(expected);
    });
  });

  describe("updateAttachmentCaption$", () => {
    const attachment = new Attachment();
    const sampleId = "testId";
    const attachmentId = "testId";
    const caption = "test";

    it("should result in a updateAttachmentCaptionCompleteAction", () => {
      const action = fromActions.updateAttachmentCaptionAction({
        sampleId,
        attachmentId,
        caption
      });
      const outcome = fromActions.updateAttachmentCaptionCompleteAction({
        attachment
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: attachment });
      sampleApi.updateByIdAttachments.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.updateAttachmentCaption$).toBeObservable(expected);
    });

    it("should result in a updateAttachmentCaptionFailedAction", () => {
      const action = fromActions.updateAttachmentCaptionAction({
        sampleId,
        attachmentId,
        caption
      });
      const outcome = fromActions.updateAttachmentCaptionFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      sampleApi.updateByIdAttachments.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.updateAttachmentCaption$).toBeObservable(expected);
    });
  });

  describe("removeAttachment$", () => {
    const sampleId = "testId";
    const attachmentId = "testId";

    it("should result in a removeAttachmentCompleteAction", () => {
      const action = fromActions.removeAttachmentAction({
        sampleId,
        attachmentId
      });
      const outcome = fromActions.removeAttachmentCompleteAction({
        attachmentId
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: attachmentId });
      sampleApi.destroyByIdAttachments.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.removeAttachment$).toBeObservable(expected);
    });

    it("should result in a removeAttachmentFailedAction", () => {
      const action = fromActions.removeAttachmentAction({
        sampleId,
        attachmentId
      });
      const outcome = fromActions.removeAttachmentFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      sampleApi.destroyByIdAttachments.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.removeAttachment$).toBeObservable(expected);
    });
  });
});
