import { NO_ERRORS_SCHEMA } from "@angular/compiler";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfigService } from "app-config.service";
import {
  MockActivatedRoute,
  MockHttp,
  MockLoopBackAuth,
  MockRouter,
} from "shared/MockStubs";
import { ExportExcelService } from "shared/services/export-excel.service";
import { JobsDashboardNewComponent } from "./jobs-dashboard-new.component";
import { SharedTableModule } from "shared/modules/shared-table/shared-table.module";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { InternalStorage, LoopBackAuth } from "shared/sdk";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("JobsDashboardNewComponent", () => {
  let component: JobsDashboardNewComponent;
  let fixture: ComponentFixture<JobsDashboardNewComponent>;

  const getConfig = () => ({});

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [JobsDashboardNewComponent],
      imports: [
        SharedTableModule,
        SharedScicatFrontendModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: AppConfigService, useValue: { getConfig } },
        { provide: ExportExcelService, useValue: {} },
        { provide: Router, useClass: MockRouter },
        { provide: HttpClient, useClass: MockHttp },
        { provide: LoopBackAuth, useClass: MockLoopBackAuth },
        { provide: InternalStorage },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsDashboardNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
