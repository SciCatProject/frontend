import { Observable } from "rxjs";
import { SampleEffects } from "./samples.effects";
import {
  SampleApi,
  DatasetApi,
  SampleInterface,
  Sample,
  Dataset,
  Attachment,
} from "shared/sdk";
import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import {
  selectFullqueryParams,
  selectDatasetsQueryParams,
} from "state-management/selectors/samples.selectors";
import * as fromActions from "state-management/actions/samples.actions";
import { hot, cold } from "jasmine-marbles";
import {
  loadingAction,
  loadingCompleteAction,
} from "state-management/actions/user.actions";
import { Type } from "@angular/core";

const data: SampleInterface = {
  sampleId: "testId",
  ownerGroup: "testGroup",
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
          selectors: [
            {
              selector: selectFullqueryParams,
              value: { query: JSON.stringify({ text: "" }) },
            },
            { selector: selectDatasetsQueryParams, value: {} },
          ],
        }),
        {
          provide: SampleApi,
          useValue: jasmine.createSpyObj("sampleApi", [
            "fullquery",
            "findById",
            "findByIdAccess",
            "metadataKeys",
            "patchAttributes",
            "create",
            "createAttachments",
            "updateByIdAttachments",
            "destroyByIdAttachments",
          ]),
        },
        {
          provide: DatasetApi,
          useValue: jasmine.createSpyObj("datasetApi", ["find"]),
        },
      ],
    });

    effects = TestBed.inject(SampleEffects);
    sampleApi = injectedStub(SampleApi);
    datasetApi = injectedStub(DatasetApi);
  });

  const injectedStub = <S>(service: Type<S>): jasmine.SpyObj<S> =>
    TestBed.inject(service) as jasmine.SpyObj<S>;

  describe("fetchSamples$", () => {
    describe("ofType fetchSamplesAction", () => {
      it("should result in a fetchSamplesCompleteAction and a fetchSamplesCountAction", () => {
        const samples = [sample];
        const action = fromActions.fetchSamplesAction();
        const outcome1 = fromActions.fetchSamplesCompleteAction({ samples });
        const outcome2 = fromActions.fetchSamplesCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: samples });
        sampleApi.fullquery.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
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

    describe("ofType changePageAction", () => {
      const page = 1;
      const limit = 25;

      it("should result in a fetchSamplesCompleteAction and a fetchSamplesCountAction", () => {
        const samples = [sample];
        const action = fromActions.changePageAction({ page, limit });
        const outcome1 = fromActions.fetchSamplesCompleteAction({ samples });
        const outcome2 = fromActions.fetchSamplesCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: samples });
        sampleApi.fullquery.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchSamples$).toBeObservable(expected);
      });

      it("should result in a fetchSamplesFailedAction", () => {
        const action = fromActions.changePageAction({ page, limit });
        const outcome = fromActions.fetchSamplesFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        sampleApi.fullquery.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchSamples$).toBeObservable(expected);
      });
    });

    describe("ofType sortByColumnAction", () => {
      const column = "test";
      const direction = "desc";

      it("should result in a fetchSamplesCompleteAction and a fetchSamplesCountAction", () => {
        const samples = [sample];
        const action = fromActions.sortByColumnAction({ column, direction });
        const outcome1 = fromActions.fetchSamplesCompleteAction({ samples });
        const outcome2 = fromActions.fetchSamplesCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: samples });
        sampleApi.fullquery.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchSamples$).toBeObservable(expected);
      });

      it("should result in a fetchSamplesFailedAction", () => {
        const action = fromActions.sortByColumnAction({ column, direction });
        const outcome = fromActions.fetchSamplesFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        sampleApi.fullquery.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchSamples$).toBeObservable(expected);
      });
    });

    describe("ofType setTextFilterAction", () => {
      const text = "test";

      it("should result in a fetchSamplesCompleteAction and a fetchSamplesCountAction", () => {
        const samples = [sample];
        const action = fromActions.setTextFilterAction({ text });
        const outcome1 = fromActions.fetchSamplesCompleteAction({ samples });
        const outcome2 = fromActions.fetchSamplesCountAction();

        actions = hot("-a", { a: action });
        const response = cold("-a|", { a: samples });
        sampleApi.fullquery.and.returnValue(response);

        const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
        expect(effects.fetchSamples$).toBeObservable(expected);
      });

      it("should result in a fetchSamplesFailedAction", () => {
        const action = fromActions.setTextFilterAction({ text });
        const outcome = fromActions.fetchSamplesFailedAction();

        actions = hot("-a", { a: action });
        const response = cold("-#", {});
        sampleApi.fullquery.and.returnValue(response);

        const expected = cold("--b", { b: outcome });
        expect(effects.fetchSamples$).toBeObservable(expected);
      });
    });
  });

  describe("fetchCount$", () => {
    it("should result in a fetchSamplesCountCompleteAction", () => {
      const samples = [sample];
      const action = fromActions.fetchSamplesCountAction();
      const outcome = fromActions.fetchSamplesCountCompleteAction({
        count: samples.length,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: samples });
      sampleApi.fullquery.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });

    it("should result in a fetchSamplesCountFailedAction", () => {
      const action = fromActions.fetchSamplesCountAction();
      const outcome = fromActions.fetchSamplesCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      sampleApi.fullquery.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchCount$).toBeObservable(expected);
    });
  });

  describe("fetchMetadataKeys$", () => {
    it("should result in a fetchMetadataKeysCompleteAction", () => {
      const metadataKeys = ["test"];
      const action = fromActions.fetchMetadataKeysAction();
      const outcome = fromActions.fetchMetadataKeysCompleteAction({
        metadataKeys,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: metadataKeys });
      sampleApi.metadataKeys.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchMetadataKeys$).toBeObservable(expected);
    });

    it("should result in a fetchMetadataKeysFailedAction", () => {
      const action = fromActions.fetchMetadataKeysAction();
      const outcome = fromActions.fetchMetadataKeysFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      sampleApi.metadataKeys.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchMetadataKeys$).toBeObservable(expected);
    });
  });

  describe("fetchSample$", () => {
    const sampleId = "testId";
    const permission = { canAccess: true };

    it("should result in a fetchSampleCompleteAction", () => {
      const action = fromActions.fetchSampleAction({ sampleId });
      const outcome = fromActions.fetchSampleCompleteAction({ sample });

      actions = hot("-a", { a: action });
      const permissionResponse = cold("--a|", { a: permission });
      const response = cold("---a|", { a: sample });
      sampleApi.findByIdAccess.and.returnValue(permissionResponse);
      sampleApi.findById.and.returnValue(response);

      const expected = cold("------b", { b: outcome });
      expect(effects.fetchSample$).toBeObservable(expected);
    });

    it("should result in a fetchSampleFailedAction", () => {
      const action = fromActions.fetchSampleAction({ sampleId });
      const outcome = fromActions.fetchSampleFailedAction();

      actions = hot("-a", { a: action });
      const permissionResponse = cold("--a|", { a: permission });
      const response = cold("---#", {});
      sampleApi.findByIdAccess.and.returnValue(permissionResponse);
      sampleApi.findById.and.returnValue(response);

      const expected = cold("------b", { b: outcome });
      expect(effects.fetchSample$).toBeObservable(expected);
    });

    it("should do nothing if findByIdAccess returns false", () => {
      const action = fromActions.fetchSampleAction({ sampleId });
      permission.canAccess = false;

      actions = hot("-a", { a: action });
      const permissionResponse = cold("--a|", { a: permission });
      sampleApi.findByIdAccess.and.returnValue(permissionResponse);

      const expected = cold("------"); // No emission

      expect(effects.fetchSample$).toBeObservable(expected);
    });
  });

  describe("fetchSampleDatasets$", () => {
    const sampleId = "testId";

    it("should result in a fetchSampleDatasetsCompleteAction and a fetchSampleDatasetsCountAction", () => {
      const datasets = [new Dataset()];
      const action = fromActions.fetchSampleDatasetsAction({ sampleId });
      const outcome1 = fromActions.fetchSampleDatasetsCompleteAction({
        datasets,
      });
      const outcome2 = fromActions.fetchSampleDatasetsCountAction({ sampleId });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: datasets });
      datasetApi.find.and.returnValue(response);

      const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
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

  describe("fetchSampleDatasetsCount$", () => {
    const sampleId = "testId";

    it("should result in a fetchSampleDatasetsCountCompleteAction", () => {
      const count = 1;
      const datasets = [new Dataset()];
      const action = fromActions.fetchSampleDatasetsCountAction({ sampleId });
      const outcome = fromActions.fetchSampleDatasetsCountCompleteAction({
        count,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: datasets });
      datasetApi.find.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchSampleDatasetsCount$).toBeObservable(expected);
    });

    it("should result in a fetchSampleDatasetsCountFailedAction", () => {
      const action = fromActions.fetchSampleDatasetsCountAction({ sampleId });
      const outcome = fromActions.fetchSampleDatasetsCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetApi.find.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchSampleDatasetsCount$).toBeObservable(expected);
    });
  });

  describe("addSample$", () => {
    it("should result in a addSampleCompleteAction and a fetchSamplesAction", () => {
      const action = fromActions.addSampleAction({ sample });
      const outcome1 = fromActions.addSampleCompleteAction({ sample });
      const outcome2 = fromActions.fetchSamplesAction();

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: sample });
      sampleApi.create.and.returnValue(response);

      const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
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

  describe("saveCharacteristics$", () => {
    it("should result in a saveCharacteristicsCompleteAction", () => {
      const sampleId = "testId";
      const characteristics = {};
      const action = fromActions.saveCharacteristicsAction({
        sampleId,
        characteristics,
      });
      const outcome = fromActions.saveCharacteristicsCompleteAction({ sample });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: sample });
      sampleApi.patchAttributes.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.saveCharacteristics$).toBeObservable(expected);
    });

    it("should result in a saveCharacteristicsFailedAction", () => {
      const sampleId = "testId";
      const characteristics = {};
      const action = fromActions.saveCharacteristicsAction({
        sampleId,
        characteristics,
      });
      const outcome = fromActions.saveCharacteristicsFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      sampleApi.patchAttributes.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.saveCharacteristics$).toBeObservable(expected);
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
        caption,
      });
      const outcome = fromActions.updateAttachmentCaptionCompleteAction({
        attachment,
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
        caption,
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
        attachmentId,
      });
      const outcome = fromActions.removeAttachmentCompleteAction({
        attachmentId,
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
        attachmentId,
      });
      const outcome = fromActions.removeAttachmentFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      sampleApi.destroyByIdAttachments.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.removeAttachment$).toBeObservable(expected);
    });
  });

  describe("loading$", () => {
    describe("ofType fetchSamplesAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchSamplesAction();
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchSamplesCountAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchSamplesCountAction();
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchSampleAction", () => {
      it("should dispatch a loadingAction", () => {
        const sampleId = "testId";
        const action = fromActions.fetchSampleAction({ sampleId });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchSampleDatasetsAction", () => {
      it("should dispatch a loadingAction", () => {
        const sampleId = "testId";
        const action = fromActions.fetchSampleDatasetsAction({ sampleId });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchSampleDatasetsCountAction", () => {
      it("should dispatch a loadingAction", () => {
        const sampleId = "testId";
        const action = fromActions.fetchSampleDatasetsCountAction({ sampleId });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType addSampleAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.addSampleAction({ sample });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType saveCharacteristicsAction", () => {
      it("should dispatch a loadingAction", () => {
        const sampleId = "testId";
        const characteristics = {};
        const action = fromActions.saveCharacteristicsAction({
          sampleId,
          characteristics,
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
        const sampleId = "testId";
        const attachmentId = "testId";
        const caption = "test";
        const action = fromActions.updateAttachmentCaptionAction({
          sampleId,
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
        const sampleId = "testId";
        const attachmentId = "testId";
        const action = fromActions.removeAttachmentAction({
          sampleId,
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
    describe("ofType fetchSamplesCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const samples = [sample];
        const action = fromActions.fetchSamplesCompleteAction({ samples });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchSamplesFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchSamplesFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchSamplesCountCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const count = 100;
        const action = fromActions.fetchSamplesCountCompleteAction({ count });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchSamplesCountFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchSamplesCountFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchSampleCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchSampleCompleteAction({ sample });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchSampleFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchSampleFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchSampleDatasetsCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const datasets = [new Dataset()];
        const action = fromActions.fetchSampleDatasetsCompleteAction({
          datasets,
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchSampleDatasetsFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchSampleDatasetsFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchSampleDatasetsCountCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const count = 100;
        const action = fromActions.fetchSampleDatasetsCountCompleteAction({
          count,
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchSampleDatasetsCountFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchSampleDatasetsCountFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType addSampleCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.addSampleCompleteAction({ sample });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType addSampleFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.addSampleFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType saveCharacteristicsCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.saveCharacteristicsCompleteAction({
          sample,
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType saveCharacteristicsFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.saveCharacteristicsFailedAction();
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

    describe("ofType removeAttachmentCompleteAction", () => {
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

    describe("ofType removeAttachmentFailedAction", () => {
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
