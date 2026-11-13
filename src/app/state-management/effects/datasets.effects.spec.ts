import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { Action, MemoizedSelector } from "@ngrx/store";
import { Observable, Subject, of } from "rxjs";
import { selectFilesFilters } from "state-management/selectors/files.selectors";
import { cold, hot } from "jasmine-marbles";
import * as fromActions from "../actions/datasets.actions";
import { DatasetEffects } from "./datasets.effects";
import { FacetCounts } from "state-management/models";
import {
  selectFullqueryParams,
  selectFullfacetParams,
  selectCurrentDataset,
  selectRelatedDatasetsFilters,
} from "state-management/selectors/datasets.selectors";
import {
  loadingAction,
  loadingCompleteAction,
  updateUserSettingsAction,
} from "state-management/actions/user.actions";
import { ScientificCondition } from "state-management/models";
import { Type } from "@angular/core";
import {
  DatasetsService,
  OrigdatablocksV4Service,
  OrigdatablocksPublicV4Service,
  MetadataKeysV4Service,
  OutputDatasetDto,
  OrigDatablock,
  DatasetsV4Service,
  DatasetsPublicV4Service,
  AttachmentsV4Service,
} from "@scicatproject/scicat-sdk-ts-angular";
import { TestObservable } from "jasmine-marbles/src/test-observables";
import { createMock, mockAttachmentV4, mockDataset } from "shared/MockStubs";
import { AppConfigService } from "app-config.service";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { selectCurrentUser } from "state-management/selectors/user.selectors";
import { provideHttpClientTesting } from "@angular/common/http/testing";

const attachment = mockAttachmentV4;
const attachmentToAdd = { ...mockAttachmentV4, datasetId: "testId" };

const derivedData = createMock<OutputDatasetDto>({
  inputDatasets: [],
  usedSoftware: [],
  owner: "",
  contactEmail: "",
  sourceFolder: "",
  creationTime: new Date().toString(),
  type: "derived",
  ownerGroup: "",
  datasetName: "test name",
  createdAt: "",
  createdBy: "",
  creationLocation: "",
  numberOfFilesArchived: 0,
  principalInvestigators: [],
  updatedAt: "",
  updatedBy: "",
});
const derivedDataset = { pid: "testPid", ...derivedData };

const dataset = { pid: "testPid", datasetName: "test name", ...mockDataset };

describe("DatasetEffects", () => {
  let actions: TestObservable;
  let effects: DatasetEffects;
  let datasetApi: jasmine.SpyObj<DatasetsService>;
  let origdatablocksApi: jasmine.SpyObj<OrigdatablocksV4Service>;
  let origdatablocksPublicApi: jasmine.SpyObj<OrigdatablocksPublicV4Service>;
  let metadataKeysApi: jasmine.SpyObj<MetadataKeysV4Service>;
  let datasetsV4Service: jasmine.SpyObj<DatasetsV4Service>;
  let datasetsPublicV4Service: jasmine.SpyObj<DatasetsPublicV4Service>;
  let attachmentsV4Service: jasmine.SpyObj<AttachmentsV4Service>;

  const getConfig = () => ({});

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DatasetEffects,
        provideMockActions(() => actions),
        provideMockStore({
          selectors: [
            { selector: selectCurrentDataset, value: dataset },
            {
              selector: selectRelatedDatasetsFilters,
              value: { skip: 0, limit: 25, sortField: "creationTime:desc" },
            },
            {
              selector: selectFullqueryParams,
              value: {
                query: {},
                limits: { skip: 0, limit: 25, sort: {} },
              },
            },
            { selector: selectFullfacetParams, value: {} },
            { selector: selectCurrentUser, value: { id: "testUser" } },
          ],
        }),
        {
          provide: DatasetsService,
          useValue: jasmine.createSpyObj("datasetApi", [
            "datasetsControllerAppendToArrayFieldV3",
          ]),
        },
        {
          provide: AttachmentsV4Service,
          useValue: jasmine.createSpyObj("attachmentsV4Service", [
            "attachmentsV4ControllerCreateAttachmentV4",
            "attachmentsV4ControllerFindOneAndUpdateV4",
            "attachmentsV4ControllerFindOneAttachmentAndRemoveV4",
          ]),
        },
        {
          provide: DatasetsV4Service,
          useValue: jasmine.createSpyObj("datasetsV4Service", [
            "datasetsV4ControllerFindAllV4",
            "datasetsV4ControllerFindByIdV4",
            "datasetsV4ControllerCreateV4",
            "datasetsV4ControllerCountV4",
            "datasetsV4ControllerFullfacetV4",
            "datasetsV4ControllerFindByIdAndUpdateV4",
          ]),
        },
        {
          provide: DatasetsPublicV4Service,
          useValue: jasmine.createSpyObj("datasetsPublicV4Service", [
            "datasetsPublicV4ControllerFindAllPublicV4",
            "datasetsPublicV4ControllerFindByIdPublicV4",
            "datasetsPublicV4ControllerCountPublicV4",
            "datasetsPublicV4ControllerFullfacetV4",
          ]),
        },
        {
          provide: OrigdatablocksV4Service,
          useValue: jasmine.createSpyObj("origdatablocksService", [
            "origDatablocksV4ControllerFindAllFilesV4",
            "origDatablocksV4ControllerCountFilesV4",
          ]),
        },
        {
          provide: OrigdatablocksPublicV4Service,
          useValue: jasmine.createSpyObj("origdatablocksPublicService", [
            "origDatablocksPublicV4ControllerFindAllFilesPublicV4",
            "origDatablocksPublicV4ControllerCountFilesPublicV4",
          ]),
        },
        {
          provide: MetadataKeysV4Service,
          useValue: jasmine.createSpyObj("metadataKeysApi", [
            "metadataKeysV4ControllerFindAllV4",
          ]),
        },
        { provide: AppConfigService, useValue: { getConfig } },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    effects = TestBed.inject(DatasetEffects);
    datasetApi = injectedStub(DatasetsService);
    origdatablocksApi = injectedStub(OrigdatablocksV4Service);
    origdatablocksPublicApi = injectedStub(OrigdatablocksPublicV4Service);
    metadataKeysApi = injectedStub(MetadataKeysV4Service);
    datasetsV4Service = injectedStub(DatasetsV4Service);
    datasetsPublicV4Service = injectedStub(DatasetsPublicV4Service);
    attachmentsV4Service = injectedStub(AttachmentsV4Service);
  });

  const injectedStub = <S>(service: Type<S>): jasmine.SpyObj<S> =>
    TestBed.inject(service) as jasmine.SpyObj<S>;

  describe("fetchDatasets$", () => {
    it("should result in a fetchDatasetsCompleteAction", () => {
      const datasets = [dataset];
      const action = fromActions.fetchDatasetsAction();
      const outcome = fromActions.fetchDatasetsCompleteAction({ datasets });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: datasets });
      datasetsV4Service.datasetsV4ControllerFindAllV4.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchDatasets$).toBeObservable(expected);
    });

    it("should result in a fetchDatasetsFailedAction", () => {
      const action = fromActions.fetchDatasetsAction();
      const outcome = fromActions.fetchDatasetsFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetsV4Service.datasetsV4ControllerFindAllV4.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchDatasets$).toBeObservable(expected);
    });

    it("should cancel a previous in-flight request when a new action is dispatched", () => {
      const datasets = [dataset];
      const action = fromActions.fetchDatasetsAction();
      const outcome = fromActions.fetchDatasetsCompleteAction({ datasets });

      // Second action at frame 3 cancels the first request (which would complete at frame 3).
      // Only the response to the second action, arriving at frame 5, is emitted.
      actions = hot("-a-b", { a: action, b: action });
      const response = cold("--a|", { a: datasets });
      datasetsV4Service.datasetsV4ControllerFindAllV4.and.returnValue(response);

      const expected = cold("-----b", { b: outcome });
      expect(effects.fetchDatasets$).toBeObservable(expected);
    });
  });

  describe("fetchFacetCounts$", () => {
    it("should result in a fetchFacetCountsCompleteAction", () => {
      const facetCounts: FacetCounts = {
        creationLocation: [],
        creationTime: [],
        keywords: [],
        ownerGroup: [],
        type: [],
      };
      const allCounts = 0;
      const action = fromActions.fetchFacetCountsAction();
      const outcome = fromActions.fetchFacetCountsCompleteAction({
        facetCounts,
        allCounts,
      });

      const responseArray = [
        {
          all: [{ totalSets: 0 }],
          creationLocation: [],
          creationTime: [],
          keywords: [],
          ownerGroup: [],
          type: [],
        },
      ];
      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: responseArray });
      datasetsV4Service.datasetsV4ControllerFullfacetV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchFacetCounts$).toBeObservable(expected);
    });

    it("should result in a fetchFacetCountsFailedAction", () => {
      const action = fromActions.fetchFacetCountsAction();
      const outcome = fromActions.fetchFacetCountsFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetsV4Service.datasetsV4ControllerFullfacetV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchFacetCounts$).toBeObservable(expected);
    });

    it("should cancel a previous in-flight request when a new action is dispatched", () => {
      const facetCounts: FacetCounts = {
        creationLocation: [],
        creationTime: [],
        keywords: [],
        ownerGroup: [],
        type: [],
      };
      const action = fromActions.fetchFacetCountsAction();
      const outcome = fromActions.fetchFacetCountsCompleteAction({
        facetCounts,
        allCounts: 0,
      });
      const responseArray = [
        {
          all: [{ totalSets: 0 }],
          creationLocation: [],
          creationTime: [],
          keywords: [],
          ownerGroup: [],
          type: [],
        },
      ];

      actions = hot("-a-b", { a: action, b: action });
      const response = cold("--a|", { a: responseArray });
      datasetsV4Service.datasetsV4ControllerFullfacetV4.and.returnValue(
        response,
      );

      const expected = cold("-----b", { b: outcome });
      expect(effects.fetchFacetCounts$).toBeObservable(expected);
    });
  });

  describe("fetchMetadataKeys$", () => {
    it("should result in a fetchMetadataKeysCompleteAction", () => {
      const metadataKeys = ["test"];
      const action = fromActions.fetchMetadataKeysAction({});
      const outcome = fromActions.fetchMetadataKeysCompleteAction({
        metadataKeys,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", {
        a: [{ key: "test", humanReadable: "Test" }],
      });
      metadataKeysApi.metadataKeysV4ControllerFindAllV4.and.returnValue(
        response,
      );
      const expected = cold("--b", { b: outcome });
      expect(effects.fetchMetadataKeys$).toBeObservable(expected);
    });

    it("should result in a fetchMetadataKeysFailedAction", () => {
      const action = fromActions.fetchMetadataKeysAction({});
      const outcome = fromActions.fetchMetadataKeysFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      metadataKeysApi.metadataKeysV4ControllerFindAllV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchMetadataKeys$).toBeObservable(expected);
    });

    it("should cancel a previous in-flight request when a new action is dispatched", () => {
      const metadataKeys = ["test"];
      const action = fromActions.fetchMetadataKeysAction({});
      const outcome = fromActions.fetchMetadataKeysCompleteAction({
        metadataKeys,
      });

      actions = hot("-a-b", { a: action, b: action });
      const response = cold("--a|", {
        a: [{ key: "test", humanReadable: "Test" }],
      });
      metadataKeysApi.metadataKeysV4ControllerFindAllV4.and.returnValue(
        response,
      );

      const expected = cold("-----b", { b: outcome });
      expect(effects.fetchMetadataKeys$).toBeObservable(expected);
    });
  });

  describe("updateUserDatasetsLimit$", () => {
    it("should result in an updateUserSettingsAction", () => {
      const page = 0;
      const limit = 25;
      const property = { datasetCount: limit };
      const action = fromActions.changePageAction({ page, limit });
      const outcome = updateUserSettingsAction({ property });

      actions = hot("-a", { a: action });

      const expected = cold("-b", { b: outcome });
      expect(effects.updateUserDatasetsLimit$).toBeObservable(expected);
    });
  });

  describe("updateMetadataKeys$", () => {
    describe("ofType addScientificConditionAction", () => {
      it("should result in a fetchMetadataKeysAction", () => {
        const condition: ScientificCondition = {
          lhs: "test",
          relation: "EQUAL_TO_NUMERIC",
          rhs: 1000,
          unit: "s",
        };
        const action = fromActions.addScientificConditionAction({ condition });
        const outcome = fromActions.fetchMetadataKeysAction({});

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.updateMetadataKeys$).toBeObservable(expected);
      });
    });

    describe("ofType removeScientificConditionAction", () => {
      it("should result in a fetchMetadataKeysAction", () => {
        const condition: ScientificCondition = {
          lhs: "test",
          relation: "EQUAL_TO_NUMERIC",
          rhs: 1000,
          unit: "s",
        };
        const action = fromActions.removeScientificConditionAction({
          condition,
        });
        const outcome = fromActions.fetchMetadataKeysAction({});

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.updateMetadataKeys$).toBeObservable(expected);
      });
    });

    describe("ofType clearFacetsAction", () => {
      it("should result in a fetchMetadataKeysAction", () => {
        const action = fromActions.clearFacetsAction();
        const outcome = fromActions.fetchMetadataKeysAction({});

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.updateMetadataKeys$).toBeObservable(expected);
      });
    });
  });

  describe("fetchDataset$", () => {
    const pid = "testPid";

    it("should result in a fetchDatasetCompleteAction", () => {
      const action = fromActions.fetchDatasetAction({ pid });
      const outcome = fromActions.fetchDatasetCompleteAction({ dataset });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: dataset });
      datasetsV4Service.datasetsV4ControllerFindByIdV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchDataset$).toBeObservable(expected);
    });

    it("should result in a fetchDatasetFailedAction", () => {
      const action = fromActions.fetchDatasetAction({ pid });
      const outcome = fromActions.fetchDatasetFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetsV4Service.datasetsV4ControllerFindByIdV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchDataset$).toBeObservable(expected);
    });
  });

  describe("effects waiting for the dataset", () => {
    let store: MockStore;
    let selectCurrentDatasetMo: MemoizedSelector<object, unknown>;
    const origdatablocks = [{ _id: "odb1" }] as unknown as OrigDatablock[];

    beforeEach(() => {
      store = TestBed.inject(MockStore);
      selectCurrentDatasetMo = store.overrideSelector(
        selectCurrentDataset,
        undefined,
      );
      store.overrideSelector(selectFilesFilters, {
        skip: 0,
        limit: 25,
        sortField: undefined,
      });
      origdatablocksApi.origDatablocksV4ControllerFindAllFilesV4.and.returnValue(
        of(origdatablocks) as never,
      );
      origdatablocksApi.origDatablocksV4ControllerCountFilesV4.and.returnValue(
        of({ count: 3 }) as never,
      );
    });

    const run = (effect$: Observable<unknown>) => {
      const emitted: unknown[] = [];
      effect$.subscribe((action) => emitted.push(action));
      return emitted;
    };

    it("fetchOrigDatablocksOfDataset$ should fetch right away when the dataset is loaded", () => {
      selectCurrentDatasetMo.setResult(dataset);
      store.refreshState();
      actions = of(
        fromActions.fetchOrigDatablocksAction({ pid: dataset.pid }),
      ) as unknown as TestObservable;

      expect(run(effects.fetchOrigDatablocksOfDataset$)).toEqual([
        fromActions.fetchOrigDatablocksCompleteAction({ origdatablocks }),
      ]);
    });

    it("fetchOrigDatablocksOfDataset$ should wait until the dataset of the pid is loaded", () => {
      selectCurrentDatasetMo.setResult({ ...dataset, pid: "previousPid" });
      store.refreshState();
      actions = of(
        fromActions.fetchOrigDatablocksAction({ pid: dataset.pid }),
      ) as unknown as TestObservable;

      const emitted = run(effects.fetchOrigDatablocksOfDataset$);
      expect(emitted).toEqual([]);
      expect(
        origdatablocksApi.origDatablocksV4ControllerFindAllFilesV4,
      ).not.toHaveBeenCalled();

      selectCurrentDatasetMo.setResult(dataset);
      store.refreshState();
      expect(emitted).toEqual([
        fromActions.fetchOrigDatablocksCompleteAction({ origdatablocks }),
      ]);
    });

    it("fetchOrigDatablocksOfDataset$ should give up when the dataset state is cleared", () => {
      const actions$ = new Subject<Action>();
      actions = actions$ as unknown as TestObservable;
      const emitted = run(effects.fetchOrigDatablocksOfDataset$);

      actions$.next(
        fromActions.fetchOrigDatablocksAction({ pid: dataset.pid }),
      );
      actions$.next(fromActions.clearCurrentDatasetStateAction());
      selectCurrentDatasetMo.setResult(dataset);
      store.refreshState();

      expect(emitted).toEqual([]);
      expect(
        origdatablocksApi.origDatablocksV4ControllerFindAllFilesV4,
      ).not.toHaveBeenCalled();
    });

    it("fetchOrigDatablocksCount$ should wait until the dataset of the pid is loaded", () => {
      actions = of(
        fromActions.fetchOrigDatablocksCountAction({ pid: dataset.pid }),
      ) as unknown as TestObservable;

      const emitted = run(effects.fetchOrigDatablocksCount$);
      expect(emitted).toEqual([]);

      selectCurrentDatasetMo.setResult(dataset);
      store.refreshState();
      expect(emitted).toEqual([
        fromActions.fetchOrigDatablocksCountCompleteAction({ count: 3 }),
      ]);
    });

    // the race of the details page: the related datasets are requested before
    // the dataset of the pid is in the store
    const notReadyStates = [
      { name: "no dataset is loaded yet", selected: undefined },
      {
        name: "another dataset is still selected",
        selected: {
          ...derivedDataset,
          pid: "previousPid",
          inputDatasets: ["previousInput"],
        },
      },
    ];
    const awaitedDataset = { ...dataset, type: "raw" };
    const queryOf = (spy: jasmine.Spy) =>
      JSON.parse(spy.calls.mostRecent().args[0] as string);

    notReadyStates.forEach(({ name, selected }) => {
      describe(`when ${name}`, () => {
        beforeEach(() => {
          selectCurrentDatasetMo.setResult(selected);
          store.refreshState();
        });

        it("fetchRelatedDatasets$ should wait for the dataset of the pid and query from it", () => {
          const relatedDatasets = [derivedDataset];
          const findAll = datasetsV4Service.datasetsV4ControllerFindAllV4;
          findAll.and.returnValue(of(relatedDatasets) as never);
          actions = of(
            fromActions.fetchRelatedDatasetsAction({ pid: dataset.pid }),
          ) as unknown as TestObservable;

          const emitted = run(effects.fetchRelatedDatasets$);
          expect(emitted).toEqual([]);
          expect(findAll).not.toHaveBeenCalled();

          selectCurrentDatasetMo.setResult(awaitedDataset);
          store.refreshState();

          expect(findAll).toHaveBeenCalledTimes(1);
          expect(queryOf(findAll).where).toEqual({
            type: "derived",
            inputDatasets: dataset.pid,
          });
          expect(emitted).toEqual([
            fromActions.fetchRelatedDatasetsCompleteAction({ relatedDatasets }),
          ]);
        });

        it("fetchRelatedDatasetsCount$ should wait for the dataset of the pid and query from it", () => {
          const count = datasetsV4Service.datasetsV4ControllerCountV4;
          count.and.returnValue(of({ count: 2 }) as never);
          actions = of(
            fromActions.fetchRelatedDatasetsCountAction({ pid: dataset.pid }),
          ) as unknown as TestObservable;

          const emitted = run(effects.fetchRelatedDatasetsCount$);
          expect(emitted).toEqual([]);
          expect(count).not.toHaveBeenCalled();

          selectCurrentDatasetMo.setResult(awaitedDataset);
          store.refreshState();

          expect(count).toHaveBeenCalledTimes(1);
          expect(queryOf(count).where).toEqual({
            type: "derived",
            inputDatasets: dataset.pid,
          });
          expect(emitted).toEqual([
            fromActions.fetchRelatedDatasetsCountCompleteAction({ count: 2 }),
          ]);
        });
      });
    });
  });

  describe("fetchRelatedDatasets$", () => {
    it("should result in a fetchRelatedDatasetsCompleteAction", () => {
      const relatedDatasets = [dataset];
      const action = fromActions.fetchRelatedDatasetsAction({
        pid: dataset.pid,
      });
      const outcome = fromActions.fetchRelatedDatasetsCompleteAction({
        relatedDatasets,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: relatedDatasets });
      datasetsV4Service.datasetsV4ControllerFindAllV4.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchRelatedDatasets$).toBeObservable(expected);
    });
    it("should result in a fetchRelatedDatasetsFailedAction", () => {
      const action = fromActions.fetchRelatedDatasetsAction({
        pid: dataset.pid,
      });
      const outcome = fromActions.fetchRelatedDatasetsFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetsV4Service.datasetsV4ControllerFindAllV4.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchRelatedDatasets$).toBeObservable(expected);
    });
  });

  describe("fetchRelatedDatasetsCount$", () => {
    it("should result in a fetchRelatedDatasetsCountCompleteAction", () => {
      const count = 3;
      const action = fromActions.fetchRelatedDatasetsCountAction({
        pid: dataset.pid,
      });
      const outcome = fromActions.fetchRelatedDatasetsCountCompleteAction({
        count,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: { count } });
      datasetsV4Service.datasetsV4ControllerCountV4.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchRelatedDatasetsCount$).toBeObservable(expected);
    });
    it("should result in a fetchRelatedDatasetsCountFailedAction", () => {
      const action = fromActions.fetchRelatedDatasetsCountAction({
        pid: dataset.pid,
      });
      const outcome = fromActions.fetchRelatedDatasetsCountFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetsV4Service.datasetsV4ControllerCountV4.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.fetchRelatedDatasetsCount$).toBeObservable(expected);
    });
  });

  describe("addDataset$", () => {
    it("should result in an addDatasetCompleteAction, a fetchDatasetsAction and a fetchDatasetAction", () => {
      const action = fromActions.addDatasetAction({
        dataset: derivedDataset as OutputDatasetDto,
      });
      const outcome1 = fromActions.addDatasetCompleteAction({
        dataset: derivedDataset,
      });
      const outcome2 = fromActions.fetchDatasetsAction();
      const outcome3 = fromActions.fetchDatasetAction({
        pid: derivedDataset.pid,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: derivedDataset });
      datasetsV4Service.datasetsV4ControllerCreateV4.and.returnValue(response);

      const expected = cold("--(bcd)", {
        b: outcome1,
        c: outcome2,
        d: outcome3,
      });
      expect(effects.addDataset$).toBeObservable(expected);
    });

    it("should result in an addDatasetFailedAction", () => {
      const action = fromActions.addDatasetAction({
        dataset: derivedDataset as OutputDatasetDto,
      });
      const outcome = fromActions.addDatasetFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetsV4Service.datasetsV4ControllerCreateV4.and.returnValue(response);

      const expected = cold("--b", { b: outcome });
      expect(effects.addDataset$).toBeObservable(expected);
    });
  });

  describe("updateProperty$", () => {
    const pid = "testPid";
    const property = { isPublished: true };
    it("should result in an updatePropertyCompleteAction and a fetchDatasetAction", () => {
      const action = fromActions.updatePropertyAction({
        pid,
        property,
      });
      const outcome1 = fromActions.updatePropertyCompleteAction();
      const outcome2 = fromActions.fetchDatasetAction({ pid });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: dataset });
      datasetsV4Service.datasetsV4ControllerFindByIdAndUpdateV4.and.returnValue(
        response,
      );

      const expected = cold("--(bc)", { b: outcome1, c: outcome2 });
      expect(effects.updateProperty$).toBeObservable(expected);
    });

    it("should result in a updatePropertyFailedAction", () => {
      const action = fromActions.updatePropertyAction({
        pid,
        property,
      });
      const outcome = fromActions.updatePropertyFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetsV4Service.datasetsV4ControllerFindByIdAndUpdateV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.updateProperty$).toBeObservable(expected);
    });
  });

  describe("updatePropertyInline$", () => {
    const pid = "testPid";
    const property = { isPublished: true };

    it("should result in an updatePropertyCompleteAction", () => {
      const action = fromActions.updatePropertyInlineAction({
        pid,
        property,
      });
      const outcome = fromActions.updatePropertyCompleteAction();

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: dataset });
      datasetsV4Service.datasetsV4ControllerFindByIdAndUpdateV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.updatePropertyInline$).toBeObservable(expected);
    });

    it("should result in an updatePropertyFailedAction", () => {
      const action = fromActions.updatePropertyInlineAction({
        pid,
        property,
      });
      const outcome = fromActions.updatePropertyFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetsV4Service.datasetsV4ControllerFindByIdAndUpdateV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.updatePropertyInline$).toBeObservable(expected);
    });
  });

  describe("addAttachment$", () => {
    it("should result in a addAttachmentCompleteAction", () => {
      const action = fromActions.addAttachmentAction({
        attachment: attachmentToAdd,
      });
      const outcome = fromActions.addAttachmentCompleteAction({ attachment });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: attachment });
      attachmentsV4Service.attachmentsV4ControllerCreateAttachmentV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.addAttachment$).toBeObservable(expected);
    });

    it("should result in a addAttachmentFailedAction", () => {
      const action = fromActions.addAttachmentAction({
        attachment: attachmentToAdd,
      });
      const outcome = fromActions.addAttachmentFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      attachmentsV4Service.attachmentsV4ControllerCreateAttachmentV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.addAttachment$).toBeObservable(expected);
    });
  });

  describe("updateAttachmentCaption$", () => {
    const datasetId = "testPid";
    const attachmentId = "testId";
    const caption = "test";
    const ownerGroup = "test";

    it("should result in an addAttachmentCaptionCompleteAction", () => {
      const action = fromActions.updateAttachmentCaptionAction({
        datasetId,
        attachmentId,
        caption,
        ownerGroup,
      });
      const outcome = fromActions.updateAttachmentCaptionCompleteAction({
        attachment,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: attachment });
      attachmentsV4Service.attachmentsV4ControllerFindOneAndUpdateV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.updateAttachmentCaption$).toBeObservable(expected);
    });

    it("should result in an addAttachmentCaptionFailedAction", () => {
      const action = fromActions.updateAttachmentCaptionAction({
        datasetId,
        attachmentId,
        caption,
        ownerGroup,
      });
      const outcome = fromActions.updateAttachmentCaptionFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      attachmentsV4Service.attachmentsV4ControllerFindOneAndUpdateV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.updateAttachmentCaption$).toBeObservable(expected);
    });
  });

  describe("removeAttachment$", () => {
    const attachmentId = "testId";

    it("should result in a removeAttachmentCompleteAction", () => {
      const action = fromActions.removeAttachmentAction({
        attachmentId,
      });
      const outcome = fromActions.removeAttachmentCompleteAction({
        attachmentId,
      });

      actions = hot("-a", { a: action });
      const response = cold("-a|", { a: attachmentId });
      attachmentsV4Service.attachmentsV4ControllerFindOneAttachmentAndRemoveV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.removeAttachment$).toBeObservable(expected);
    });

    it("should result in a removeAttachmentFailedAction", () => {
      const action = fromActions.removeAttachmentAction({
        attachmentId,
      });
      const outcome = fromActions.removeAttachmentFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      attachmentsV4Service.attachmentsV4ControllerFindOneAttachmentAndRemoveV4.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.removeAttachment$).toBeObservable(expected);
    });
  });

  describe("appendToArrayField$", () => {
    it("should result in a appendToDatasetArrayFieldCompleteAction", () => {
      const pid = "string";
      const fieldName = "test";
      const data = ["string"];
      const action = fromActions.appendToDatasetArrayFieldAction({
        pid,
        fieldName,
        data,
      });
      const outcome = fromActions.appendToDatasetArrayFieldCompleteAction();

      actions = hot("-a", { a: action });
      const response = cold("-a|", {});
      datasetApi.datasetsControllerAppendToArrayFieldV3.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.appendToArrayField$).toBeObservable(expected);
    });

    it("should result in a appendToDatasetArrayFieldFailedAction", () => {
      const pid = "string";
      const fieldName = "test";
      const data = ["string"];
      const action = fromActions.appendToDatasetArrayFieldAction({
        pid,
        fieldName,
        data,
      });
      const outcome = fromActions.appendToDatasetArrayFieldFailedAction();

      actions = hot("-a", { a: action });
      const response = cold("-#", {});
      datasetApi.datasetsControllerAppendToArrayFieldV3.and.returnValue(
        response,
      );

      const expected = cold("--b", { b: outcome });
      expect(effects.appendToArrayField$).toBeObservable(expected);
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

    describe("ofType fetchMetadataKeysAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.fetchMetadataKeysAction({});
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

    describe("ofType addDatasetAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.addDatasetAction({
          dataset: derivedDataset as OutputDatasetDto,
        });
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
          property,
        });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType addAttachmentAction", () => {
      it("should dispatch a loadingAction", () => {
        const action = fromActions.addAttachmentAction({
          attachment: attachmentToAdd,
        });
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
        const ownerGroup = "test";

        const action = fromActions.updateAttachmentCaptionAction({
          datasetId,
          attachmentId,
          caption,
          ownerGroup,
        });
        const outcome = loadingAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loading$).toBeObservable(expected);
      });
    });

    describe("ofType removeAttachmentAction", () => {
      it("should dispatch a loadingAction", () => {
        const attachmentId = "testId";
        const action = fromActions.removeAttachmentAction({
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
          creationLocation: [],
          creationTime: [],
          keywords: [],
          ownerGroup: [],
          type: [],
        };
        const allCounts = 0;
        const action = fromActions.fetchFacetCountsCompleteAction({
          facetCounts,
          allCounts,
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

    describe("ofType fetchMetadataKeysCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const metadataKeys = ["test"];
        const action = fromActions.fetchMetadataKeysCompleteAction({
          metadataKeys,
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType fetchMetadataKeysFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.fetchMetadataKeysFailedAction();
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

    describe("ofType addDatasetCompleteAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.addDatasetCompleteAction({
          dataset: derivedDataset,
        });
        const outcome = loadingCompleteAction();

        actions = hot("-a", { a: action });

        const expected = cold("-b", { b: outcome });
        expect(effects.loadingComplete$).toBeObservable(expected);
      });
    });

    describe("ofType addDatasetFailedAction", () => {
      it("should dispatch a loadingCompleteAction", () => {
        const action = fromActions.addDatasetFailedAction();
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
