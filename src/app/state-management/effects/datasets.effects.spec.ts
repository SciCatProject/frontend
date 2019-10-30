import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { provideMockStore } from "@ngrx/store/testing";
import { cold, hot } from "jasmine-marbles";
import { DatasetInterface, Dataset, DatasetApi, Attachment } from "shared/sdk";
import * as fromActions from "../actions/datasets.actions";
import { Observable } from "rxjs";
import { DatasetEffects } from "./datasets.effects";
import { FacetCounts } from "state-management/state/datasets.store";
import {
  getFullqueryParams,
  getFullfacetParams
} from "state-management/selectors/datasets.selectors";
import {
  loadingAction,
  loadingCompleteAction
} from "state-management/actions/user.actions";

const data: DatasetInterface = {
  owner: "",
  contactEmail: "",
  sourceFolder: "",
  creationTime: new Date(),
  type: "",
  ownerGroup: "",
  attachments: []
};
const dataset = new Dataset({ pid: "testPid", ...data });

describe("DatasetEffects", () => {
  let actions: Observable<any>;
  let effects: DatasetEffects;
  let datasetApi: jasmine.SpyObj<DatasetApi>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatasetEffects,
        provideMockActions(() => actions),
        provideMockStore({
          selectors: [
            { selector: getFullqueryParams, value: {} },
            { selector: getFullfacetParams, value: {} }
          ]
        }),
        {
          provide: DatasetApi,
          useValue: jasmine.createSpyObj("datasetApi", [
            "fullquery",
            "fullfacet",
            "findOne",
            "updateAttributes",
            "createAttachments",
            "updateByIdAttachments",
            "destroyByIdAttachments",
            "reduceDataset"
          ])
        }
      ]
    });

    effects = TestBed.get(DatasetEffects);
    datasetApi = TestBed.get(DatasetApi);
  });

  describe("fetchDatasets$", () => {
    it("should result in a fetchDatasetsCompleteAction", () => {
      const datasets = [dataset];
      const action = fromActions.fetchDatasetsAction();
      const outcome = fromActions.fetchDatasetsCompleteAction({ datasets });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: datasets });
      datasetApi.fullquery.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchDatasets$).toBeObservable(expected);
    });

    it("should result in a fetchDatasetsFailedAction", () => {
      const action = fromActions.fetchDatasetsAction();
      const outcome = fromActions.fetchDatasetsFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetApi.fullquery.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchDatasets$).toBeObservable(expected);
    });
  });

  describe("fetchFacetCounts$", () => {
    it("should result in a fetchFacetCountsCompleteAction", () => {
      const facetCounts: FacetCounts = {
        creationLocation: [{ count: 0 }],
        creationTime: [{ count: 0 }],
        keywords: [{ count: 0 }],
        ownerGroup: [{ count: 0 }],
        type: [{ count: 0 }]
      };
      const allCounts = 0;
      const action = fromActions.fetchFacetCountsAction();
      const outcome = fromActions.fetchFacetCountsCompleteAction({
        facetCounts,
        allCounts
      });

      const responseArray = [
        {
          all: [{ totalSets: 0 }],
          creationLocation: [{ count: 0 }],
          creationTime: [{ count: 0 }],
          keywords: [{ count: 0 }],
          ownerGroup: [{ count: 0 }],
          type: [{ count: 0 }]
        }
      ];
      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: responseArray });
      datasetApi.fullfacet.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchFacetCounts$).toBeObservable(expected);
    });

    it("should result in a fetchFacetCountsFailedAction", () => {
      const action = fromActions.fetchFacetCountsAction();
      const outcome = fromActions.fetchFacetCountsFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetApi.fullfacet.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchFacetCounts$).toBeObservable(expected);
    });
  });

  describe("fetchDataset$", () => {
    const pid = "testPid";

    it("should result in a fetchDatasetCompleteAction", () => {
      const action = fromActions.fetchDatasetAction({ pid });
      const outcome = fromActions.fetchDatasetCompleteAction({ dataset });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: dataset });
      datasetApi.findOne.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchDataset$).toBeObservable(expected);
    });

    it("should result in a fetchDatasetFailedAction", () => {
      const action = fromActions.fetchDatasetAction({ pid });
      const outcome = fromActions.fetchDatasetFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetApi.findOne.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchDataset$).toBeObservable(expected);
    });
  });

  describe("updateProperty$", () => {
    const pid = "testPid";
    const property = { isPublished: true };
    it("should result in a updatePropertyCompleteAction and a fetchDatasetAction", () => {
      const action = fromActions.updatePropertyAction({
        pid,
        property
      });
      const outcome1 = fromActions.updatePropertyCompleteAction();
      const outcome2 = fromActions.fetchDatasetAction({ pid });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: dataset });
      datasetApi.updateAttributes.and.returnValue(response);

      const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
      expect(effects.updateProperty$).toBeObservable(expected);
    });

    it("should result in a updatePropertyFailedAction", () => {
      const action = fromActions.updatePropertyAction({
        pid,
        property
      });
      const outcome = fromActions.updatePropertyFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetApi.updateAttributes.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.updateProperty$).toBeObservable(expected);
    });
  });

  describe("addAttachment$", () => {
    const attachment = new Attachment();

    it("should result in a addAttachmentCompleteAction", () => {
      const action = fromActions.addAttachmentAction({ attachment });
      const outcome = fromActions.addAttachmentCompleteAction({ attachment });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: attachment });
      datasetApi.createAttachments.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.addAttachment$).toBeObservable(expected);
    });

    it("should result in a addAttachmentFailedAction", () => {
      const action = fromActions.addAttachmentAction({ attachment });
      const outcome = fromActions.addAttachmentFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetApi.createAttachments.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.addAttachment$).toBeObservable(expected);
    });
  });

  describe("updateAttachmentCaption$", () => {
    const datasetId = "testPid";
    const attachmentId = "testId";
    const caption = "test";
    const attachment = new Attachment();

    it("should result in an addAttachmentCaptionCompleteAction", () => {
      const action = fromActions.updateAttachmentCaptionAction({
        datasetId,
        attachmentId,
        caption
      });
      const outcome = fromActions.updateAttachmentCaptionCompleteAction({
        attachment
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: attachment });
      datasetApi.updateByIdAttachments.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.updateAttchmentCaption$).toBeObservable(expected);
    });

    it("should result in an addAttachmentCaptionFailedAction", () => {
      const action = fromActions.updateAttachmentCaptionAction({
        datasetId,
        attachmentId,
        caption
      });
      const outcome = fromActions.updateAttachmentCaptionFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetApi.updateByIdAttachments.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.updateAttchmentCaption$).toBeObservable(expected);
    });
  });

  describe("removeAttachment$", () => {
    const datasetId = "testPid";
    const attachmentId = "testId";

    it("should result in a removeAttachmentCompleteAction", () => {
      const action = fromActions.removeAttachmentAction({
        datasetId,
        attachmentId
      });
      const outcome = fromActions.removeAttachmentCompleteAction({
        attachmentId
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: attachmentId });
      datasetApi.destroyByIdAttachments.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.removeAttachment$).toBeObservable(expected);
    });

    it("should result in a removeAttachmentFailedAction", () => {
      const action = fromActions.removeAttachmentAction({
        datasetId,
        attachmentId
      });
      const outcome = fromActions.removeAttachmentFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetApi.destroyByIdAttachments.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.removeAttachment$).toBeObservable(expected);
    });
  });

  describe("reduceDataset$", () => {
    it("should result in a reduceDatasetCompleteAction", () => {
      const result = { status: "success" };
      const action = fromActions.reduceDatasetAction({ dataset });
      const outcome = fromActions.reduceDatasetCompleteAction({ result });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: result });
      datasetApi.reduceDataset.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.reduceDataset$).toBeObservable(expected);
    });

    it("should result in a reduceDatasetFailedAction", () => {
      const action = fromActions.reduceDatasetAction({ dataset });
      const outcome = fromActions.reduceDatasetFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetApi.reduceDataset.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.reduceDataset$).toBeObservable(expected);
    });
  });

  describe("loading$", () => {
    describe("ofType fetchDatasetsAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchDatasetsAction();
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchFacetCountsAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchFacetCountsAction();
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType fetchDatasetAction", () => {
      it("should dispatch a loadingAction", () => {
        const pid = "testPid";
        const action = fromActions.fetchDatasetAction({ pid });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType updatePropertyAction", () => {
      it("should dispatch a loadingAction", () => {
        const pid = "testPid";
        const property = { isPublished: true };
        const action = fromActions.updatePropertyAction({
          pid,
          property
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
        const datasetId = "testId";
        const attachmentId = "testId";
        const caption = "test";
        const action = fromActions.updateAttachmentCaptionAction({
          datasetId,
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
        const datasetId = "testId";
        const attachmentId = "testId";
        const action = fromActions.removeAttachmentAction({
          datasetId,
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
    describe("ofType fetchDatasetsCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const datasets = [dataset];
        const action = fromActions.fetchDatasetsCompleteAction({ datasets });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchDatasetsFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchDatasetsFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchFacetCountsCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const facetCounts: FacetCounts = {
          creationLocation: [{ count: 0 }],
          creationTime: [{ count: 0 }],
          keywords: [{ count: 0 }],
          ownerGroup: [{ count: 0 }],
          type: [{ count: 0 }]
        };
        const allCounts = 0;
        const action = fromActions.fetchFacetCountsCompleteAction({
          facetCounts,
          allCounts
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchFacetCountsFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchFacetCountsFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchDatasetCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchDatasetCompleteAction({ dataset });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchDatasetFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchDatasetFailedAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType updatePropertyCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.updatePropertyCompleteAction();
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType updatePropertyFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.updatePropertyFailedAction();
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

    describe("ofType removeAttachmentCompleteAction", () => {
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
