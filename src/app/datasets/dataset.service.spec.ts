import { MockAuthService, MockStore, MockUserApi } from "../shared/MockStubs";
import { LoopBackAuth, OrigDatablockApi } from "../shared/sdk";
import { inject, TestBed } from "@angular/core/testing";
import { Store, StoreModule } from "@ngrx/store";
import { DatasetService } from "./dataset.service";

import {
  DatablockApi,
  DatasetApi,
  AttachmentApi
} from "shared/sdk/services";
import {
  MockDatablockApi,
  MockDatasetApi,
  MockAttachmentApi,
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
          provide: AttachmentApi,
          useClass: MockAttachmentApi
        },
        {
          provide: OrigDatablockApi,
          useClass: MockDatablockApi
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
