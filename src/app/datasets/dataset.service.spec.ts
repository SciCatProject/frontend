import { MockAuthService, MockStore, MockUserApi } from "../shared/MockStubs";
import { AccessUserApi, LoopBackAuth, OrigDatablockApi } from "../shared/sdk";
import { inject, TestBed } from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import { DatasetService } from "./dataset.service";

import {
  DatablockApi,
  DatasetApi,
  DatasetLifecycleApi
} from "shared/sdk/services";
import {
  MockDatablockApi,
  MockDatasetApi,
  MockDatasetLifecycleApi
} from "shared/MockStubs";

describe("DatasetService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      providers: [
        DatasetService,
        {
          provide: DatablockApi,
          useClass: MockDatablockApi
        },
        {
          provide: DatasetApi,
          useClass: MockDatasetApi
        },
        {
          provide: DatasetLifecycleApi,
          useClass: MockDatasetLifecycleApi
        },
        {
          provide: OrigDatablockApi,
          useClass: MockDatablockApi
        },
        {
          provide: AccessUserApi,
          useClass: MockUserApi
        },
        {
          provide: LoopBackAuth,
          useClass: MockAuthService
        },
        {
          provide: Store,
          useClass: MockStore
        }
      ]
    });
  });

  it("should be created", inject(
    [DatasetService],
    (service: DatasetService) => {
      expect(service).toBeTruthy();
    }
  ));
});
