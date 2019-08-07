import { TestBed } from "@angular/core/testing";

import { SampleService } from "./sample.service";
import { SampleApi, DatasetApi } from "../shared/sdk/services/custom";
import { MockSampleApi, MockDatasetApi } from "../shared/MockStubs";

describe("SampleService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      {
        provide: SampleApi,
        useClass: MockSampleApi
      },
      {
        provide: DatasetApi,
        useClass: MockDatasetApi
      }
    ]
  }));

  it("should be created", () => {
    const service: SampleService = TestBed.get(SampleService);
    expect(service).toBeTruthy();
  });
});
