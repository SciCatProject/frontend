import { TestBed } from "@angular/core/testing";

import { Depositor } from "./onedep-depositor.service";

describe("OnedepDepositorService", () => {
  let service: Depositor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Depositor);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
