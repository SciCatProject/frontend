import { TestBed } from "@angular/core/testing";

import { ExportExcelService } from "./export-excel.service";

describe("ExportExcelService", () => {
  let service: ExportExcelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportExcelService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
