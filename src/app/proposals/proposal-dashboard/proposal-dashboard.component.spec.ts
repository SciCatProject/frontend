import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { AppConfigService } from "app-config.service";
import { MockRouter } from "shared/MockStubs";
import { ExportExcelService } from "shared/services/export-excel.service";
import { ScicatDataService } from "shared/services/scicat-data-service";

import { ProposalDashboardComponent } from "./proposal-dashboard.component";

describe("ProposalDashboardComponent", () => {
  let component: ProposalDashboardComponent;
  let fixture: ComponentFixture<ProposalDashboardComponent>;

  const getConfig = () => ({});

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProposalDashboardComponent],
      providers: [
        { provide: AppConfigService, useValue: { getConfig } },
        { provide: ExportExcelService, useValue: {} },
        { provide: Router, useClass: MockRouter },
        { provide: ScicatDataService, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
