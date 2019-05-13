import { TestBed } from "@angular/core/testing";

import { PublisheddataService } from "./publisheddata.service";

describe("PublisheddataService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: PublisheddataService = TestBed.get(PublisheddataService);
    expect(service).toBeTruthy();
  });
});
