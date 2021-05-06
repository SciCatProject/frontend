import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { MockRouter } from "shared/MockStubs";
import { ExportExcelService } from "shared/services/export-excel.service";
import { ScicatDataService } from "shared/services/scicat-data-service";

import { ProposalDashboardNewComponent } from "./proposal-dashboard-new.component";

fdescribe("ProposalDashboardNewComponent", () => {
  let component: ProposalDashboardNewComponent;
  let fixture: ComponentFixture<ProposalDashboardNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalDashboardNewComponent ],
      providers: [
        { provide: ExportExcelService, useValue: {} },
        { provide: Router, useClass: MockRouter },
        { provide: ScicatDataService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalDashboardNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
