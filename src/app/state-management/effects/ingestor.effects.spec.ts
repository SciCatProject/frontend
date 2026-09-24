import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Observable, of, throwError } from "rxjs";
import { IngestorEffects } from "state-management/effects/ingestor.effects";
import { Ingestor } from "shared/sdk/apis/ingestor.service";
import { DatasetsService } from "@scicatproject/scicat-sdk-ts-angular";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import * as fromActions from "state-management/actions/ingestor.actions";
import { showMessageAction } from "state-management/actions/user.actions";
import { MessageType } from "state-management/models";
import { HttpErrorResponse } from "@angular/common/http";
import { hot, cold } from "jasmine-marbles";

describe("IngestorEffects", () => {
  let actions$: Observable<any>;
  let effects: IngestorEffects;
  let ingestorService: jasmine.SpyObj<Ingestor>;
  let datasetsService: jasmine.SpyObj<DatasetsService>;
  let store: MockStore;

  const mockVersionResponse = { version: "1.0.0" };
  const mockHealthResponse = { status: "ok" };
  const mockUserInfoResponse = { logged_in: true };

  beforeEach(() => {
    const ingestorSpy = jasmine.createSpyObj("Ingestor", [
      "getVersion",
      "getHealth",
      "getUserInfo",
      "getTransferList",
      "getExtractionMethods",
      "getBrowseFilePath",
      "startIngestion",
      "cancelTransfer",
    ]);

    const datasetsSpy = jasmine.createSpyObj("DatasetsService", [
      "datasetsControllerCreateV3",
    ]);

    TestBed.configureTestingModule({
      providers: [
        IngestorEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            ingestor: {
              transferListRequestOptions: { page: 1, pageNumber: 50 },
            },
          },
        }),
        { provide: Ingestor, useValue: ingestorSpy },
        { provide: DatasetsService, useValue: datasetsSpy },
      ],
    });

    effects = TestBed.inject(IngestorEffects);
    ingestorService = TestBed.inject(Ingestor) as jasmine.SpyObj<Ingestor>;
    datasetsService = TestBed.inject(
      DatasetsService,
    ) as jasmine.SpyObj<DatasetsService>;
    store = TestBed.inject(MockStore);
  });

  describe("connectToIngestor$", () => {
    it("should dispatch connectIngestorSuccess on successful connection", (done) => {
      ingestorService.getVersion.and.returnValue(of(mockVersionResponse));
      ingestorService.getHealth.and.returnValue(of(mockHealthResponse));
      ingestorService.getUserInfo.and.returnValue(of(mockUserInfoResponse));

      actions$ = of(fromActions.connectIngestor());

      effects.connectToIngestor$.subscribe((action) => {
        expect(action).toEqual(
          fromActions.connectIngestorSuccess({
            versionResponse: mockVersionResponse,
            healthResponse: mockHealthResponse,
            userInfoResponse: mockUserInfoResponse,
            authIsDisabled: false,
          }),
        );
        done();
      });
    });

    it("should dispatch connectIngestorSuccess with authIsDisabled when getUserInfo fails with disabled message", (done) => {
      const error = new Error("Auth is disabled");
      ingestorService.getVersion.and.returnValue(of(mockVersionResponse));
      ingestorService.getHealth.and.returnValue(of(mockHealthResponse));
      ingestorService.getUserInfo.and.returnValue(throwError(() => error));

      actions$ = of(fromActions.connectIngestor());

      effects.connectToIngestor$.subscribe((action) => {
        expect(action).toEqual(
          fromActions.connectIngestorSuccess({
            versionResponse: mockVersionResponse,
            healthResponse: mockHealthResponse,
            userInfoResponse: null,
            authIsDisabled: true,
          }),
        );
        done();
      });
    });

    it("should dispatch connectIngestorFailure on connection failure", (done) => {
      const error = new Error("Connection failed");
      ingestorService.getVersion.and.returnValue(throwError(() => error));

      actions$ = of(fromActions.connectIngestor());

      effects.connectToIngestor$.subscribe((action) => {
        expect(action.type).toBe(fromActions.connectIngestorFailure.type);
        done();
      });
    });

    it("should dispatch setNoRightsError when session expired", (done) => {
      const error = { error: { error: "login session has expired" } };
      ingestorService.getVersion.and.returnValue(throwError(() => error));

      actions$ = of(fromActions.connectIngestor());

      effects.connectToIngestor$.subscribe((action) => {
        expect(action.type).toBe(fromActions.setNoRightsError.type);
        done();
      });
    });
  });

  describe("connectToIngestorSuccess$", () => {
    it("should dispatch showMessageAction with success message", (done) => {
      actions$ = of(
        fromActions.connectIngestorSuccess({
          versionResponse: mockVersionResponse,
          healthResponse: mockHealthResponse,
          userInfoResponse: mockUserInfoResponse,
          authIsDisabled: false,
        }),
      );

      effects.connectToIngestorSuccess$.subscribe((action) => {
        expect(action.type).toBe(showMessageAction.type);
        expect(action.message.type).toBe(MessageType.Success);
        expect(action.message.content).toContain("1.0.0");
        done();
      });
    });
  });

  describe("connectToIngestorFailure$", () => {
    it("should dispatch showMessageAction with error message", (done) => {
      const error = new Error("Connection failed");
      actions$ = of(fromActions.connectIngestorFailure({ err: error }));

      effects.connectToIngestorFailure$.subscribe((action) => {
        expect(action.type).toBe(showMessageAction.type);
        expect(action.message.type).toBe(MessageType.Error);
        expect(action.message.content).toContain("Failed to connect");
        done();
      });
    });
  });

  describe("updateTransferList$", () => {
    it("should dispatch updateTransferListSuccess on success", (done) => {
      const transferList = { transfers: [], total: 0 };
      ingestorService.getTransferList.and.returnValue(of(transferList));

      actions$ = of(fromActions.updateTransferList({}));

      effects.updateTransferList$.subscribe((action) => {
        expect(action).toEqual(
          fromActions.updateTransferListSuccess({
            transferList,
            page: 1,
            pageNumber: 50,
          }),
        );
        done();
      });
    });

    it("should dispatch updateTransferListDetailSuccess when transferId provided", (done) => {
      const transferList = { transfers: [], total: 0 };
      ingestorService.getTransferList.and.returnValue(of(transferList));

      actions$ = of(fromActions.updateTransferList({ transferId: "123" }));

      effects.updateTransferList$.subscribe((action) => {
        expect(action).toEqual(
          fromActions.updateTransferListDetailSuccess({
            transferListDetailView: transferList,
          }),
        );
        done();
      });
    });

    it("should dispatch updateTransferListFailure on error", (done) => {
      const error = new Error("Failed to fetch");
      ingestorService.getTransferList.and.returnValue(throwError(() => error));

      actions$ = of(fromActions.updateTransferList({}));

      effects.updateTransferList$.subscribe((action) => {
        expect(action.type).toBe(fromActions.updateTransferListFailure.type);
        done();
      });
    });
  });

  describe("getExtractionMethods$", () => {
    it("should dispatch getExtractionMethodsSuccess on success", (done) => {
      const methods = { methods: [], total: 0 };
      ingestorService.getExtractionMethods.and.returnValue(of(methods));

      actions$ = of(
        fromActions.getExtractionMethods({ page: 1, pageNumber: 50 }),
      );

      effects.getExtractionMethods$.subscribe((action) => {
        expect(action).toEqual(
          fromActions.getExtractionMethodsSuccess({
            extractionMethods: methods,
          }),
        );
        done();
      });
    });

    it("should dispatch setNoRightsError when session expired", (done) => {
      const error = { error: { error: "login session has expired" } };
      ingestorService.getExtractionMethods.and.returnValue(
        throwError(() => error),
      );

      actions$ = of(
        fromActions.getExtractionMethods({ page: 1, pageNumber: 50 }),
      );

      effects.getExtractionMethods$.subscribe((action) => {
        expect(action.type).toBe(fromActions.setNoRightsError.type);
        done();
      });
    });

    it("should dispatch getExtractionMethodsFailure on error", (done) => {
      const error = new Error("Failed");
      ingestorService.getExtractionMethods.and.returnValue(
        throwError(() => error),
      );

      actions$ = of(
        fromActions.getExtractionMethods({ page: 1, pageNumber: 50 }),
      );

      effects.getExtractionMethods$.subscribe((action) => {
        expect(action.type).toBe(fromActions.getExtractionMethodsFailure.type);
        done();
      });
    });
  });

  describe("getBrowseFilePath$", () => {
    it("should dispatch getBrowseFilePathSuccess on success", (done) => {
      const browseResult = { folders: [], total: 0 };
      ingestorService.getBrowseFilePath.and.returnValue(of(browseResult));

      actions$ = of(
        fromActions.getBrowseFilePath({
          path: "/test",
          page: 1,
          pageNumber: 50,
        }),
      );

      effects.getBrowseFilePath$.subscribe((action) => {
        expect(action).toEqual(
          fromActions.getBrowseFilePathSuccess({
            ingestorBrowserActiveNode: browseResult,
          }),
        );
        done();
      });
    });

    it("should dispatch getBrowseFilePathFailure on error", (done) => {
      const error = new Error("Browse failed");
      ingestorService.getBrowseFilePath.and.returnValue(
        throwError(() => error),
      );

      actions$ = of(
        fromActions.getBrowseFilePath({
          path: "/test",
          page: 1,
          pageNumber: 50,
        }),
      );

      effects.getBrowseFilePath$.subscribe((action) => {
        expect(action.type).toBe(fromActions.getBrowseFilePathFailure.type);
        done();
      });
    });
  });

  describe("setLoadingBeforeIngestion$", () => {
    it("should dispatch setIngestDatasetLoading", (done) => {
      const ingestionDataset = {
        metaData: "{}",
        userToken: "token",
        autoArchive: false,
      };
      actions$ = of(fromActions.ingestDataset({ ingestionDataset }));

      effects.setLoadingBeforeIngestion$.subscribe((action) => {
        expect(action).toEqual(
          fromActions.setIngestDatasetLoading({
            ingestionDatasetLoading: true,
          }),
        );
        done();
      });
    });
  });

  describe("ingestDataset$", () => {
    it("should dispatch success actions on successful ingestion", (done) => {
      const response = { transferId: "123", status: "success" };
      ingestorService.startIngestion.and.returnValue(of(response));

      const ingestionDataset = {
        metaData: "{}",
        userToken: "token",
        autoArchive: false,
      };
      actions$ = of(fromActions.ingestDataset({ ingestionDataset }));

      const actions: any[] = [];
      effects.ingestDataset$.subscribe((action) => {
        actions.push(action);
        if (actions.length === 3) {
          expect(actions[0].type).toBe(fromActions.ingestDatasetSuccess.type);
          expect(actions[1].type).toBe(fromActions.updateTransferList.type);
          expect(actions[2].type).toBe(
            fromActions.setIngestDatasetLoading.type,
          );
          done();
        }
      });
    });

    it("should dispatch failure actions on error", (done) => {
      const error = new Error("Ingestion failed");
      ingestorService.startIngestion.and.returnValue(throwError(() => error));

      const ingestionDataset = {
        metaData: "{}",
        userToken: "token",
        autoArchive: false,
      };
      actions$ = of(fromActions.ingestDataset({ ingestionDataset }));

      const actions: any[] = [];
      effects.ingestDataset$.subscribe((action) => {
        actions.push(action);
        if (actions.length === 2) {
          expect(actions[0].type).toBe(fromActions.ingestDatasetFailure.type);
          expect(actions[1].type).toBe(
            fromActions.setIngestDatasetLoading.type,
          );
          done();
        }
      });
    });
  });

  describe("ingestDatasetSuccess$", () => {
    it("should dispatch showMessageAction with success message", (done) => {
      const response = { transferId: "123", status: "success" };
      actions$ = of(fromActions.ingestDatasetSuccess({ response }));

      effects.ingestDatasetSuccess$.subscribe((action) => {
        expect(action.type).toBe(showMessageAction.type);
        expect(action.message.type).toBe(MessageType.Success);
        expect(action.message.content).toContain("123");
        done();
      });
    });
  });

  describe("ingestDatasetFailure$", () => {
    it("should dispatch showMessageAction with error message", (done) => {
      const error = new Error("Failed");
      actions$ = of(fromActions.ingestDatasetFailure({ err: error }));

      effects.ingestDatasetFailure$.subscribe((action) => {
        expect(action.type).toBe(showMessageAction.type);
        expect(action.message.type).toBe(MessageType.Error);
        expect(action.message.content).toContain("Failed to ingest");
        done();
      });
    });
  });

  describe("cancelTransfer$", () => {
    it("should dispatch success actions on successful cancel", (done) => {
      const deleteResponse = { transferId: "123" };
      ingestorService.cancelTransfer.and.returnValue(of(deleteResponse));

      const requestBody = { transferId: "123" };
      actions$ = of(fromActions.cancelTransfer({ requestBody }));

      const actions: any[] = [];
      effects.cancelTransfer$.subscribe((action) => {
        actions.push(action);
        if (actions.length === 2) {
          expect(actions[0].type).toBe(showMessageAction.type);
          expect((actions[0] as any).message.type).toBe(MessageType.Success);
          expect(actions[1].type).toBe(fromActions.updateTransferList.type);
          done();
        }
      });
    });

    it("should dispatch showMessageAction with error on failure", (done) => {
      const error = new Error("Cancel failed");
      ingestorService.cancelTransfer.and.returnValue(throwError(() => error));

      const requestBody = { transferId: "123" };
      actions$ = of(fromActions.cancelTransfer({ requestBody }));

      effects.cancelTransfer$.subscribe((action) => {
        expect(action.type).toBe(showMessageAction.type);
        expect((action as any).message.type).toBe(MessageType.Error);
        done();
      });
    });
  });

  describe("setRenderView$", () => {
    it("should dispatch showMessageAction", (done) => {
      actions$ = of(
        fromActions.setRenderViewFromThirdParty({ renderView: "requiredOnly" }),
      );

      effects.setRenderView$.subscribe((action) => {
        expect(action.type).toBe(showMessageAction.type);
        expect(action.message.content).toContain("requiredOnly");
        done();
      });
    });
  });

  describe("createDataset$", () => {
    it("should dispatch success actions on successful creation", (done) => {
      const dataset = { pid: "123", datasetName: "Test" } as any;
      datasetsService.datasetsControllerCreateV3.and.returnValue(of(dataset));

      actions$ = of(fromActions.createDatasetAction({ dataset }));

      const actions: any[] = [];
      effects.createDataset$.subscribe((action) => {
        actions.push(action);
        if (actions.length === 2) {
          expect(actions[0].type).toBe(fromActions.createDatasetSuccess.type);
          expect(actions[1].type).toBe(
            fromActions.setIngestDatasetLoading.type,
          );
          done();
        }
      });
    });

    it("should dispatch failure actions on error", (done) => {
      const error = new Error("Create failed");
      datasetsService.datasetsControllerCreateV3.and.returnValue(
        throwError(() => error),
      );

      const dataset = { datasetName: "Test" } as any;
      actions$ = of(fromActions.createDatasetAction({ dataset }));

      const actions: any[] = [];
      effects.createDataset$.subscribe((action) => {
        actions.push(action);
        if (actions.length === 2) {
          expect(actions[0].type).toBe(fromActions.ingestDatasetFailure.type);
          expect(actions[1].type).toBe(
            fromActions.setIngestDatasetLoading.type,
          );
          done();
        }
      });
    });
  });
});
