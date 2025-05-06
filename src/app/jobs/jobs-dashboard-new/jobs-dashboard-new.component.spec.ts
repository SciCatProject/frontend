import { NO_ERRORS_SCHEMA } from "@angular/compiler";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { AppConfigService } from "app-config.service";
import {
  MockActivatedRoute,
  MockAppConfigService,
  MockAuthService,
  MockHttp,
  MockRouter,
} from "shared/MockStubs";
import { ExportExcelService } from "shared/services/export-excel.service";
import { JobsDashboardNewComponent } from "./jobs-dashboard-new.component";
import { SharedTableModule } from "shared/modules/shared-table/shared-table.module";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { HttpClient } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { InternalStorage } from "shared/services/auth/base.storage";
import { AuthService } from "shared/services/auth/auth.service";
import { provideLuxonDateAdapter } from "@angular/material-luxon-adapter";

describe("JobsDashboardNewComponent", () => {
  let component: JobsDashboardNewComponent;
  let fixture: ComponentFixture<JobsDashboardNewComponent>;

  beforeEach(waitForAsync(() => {
    const appconfig = new MockAppConfigService(null);
    const authService = new MockAuthService();

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
        { provide: ExportExcelService, useValue: {} },
        { provide: Router, useClass: MockRouter },
        { provide: HttpClient, useClass: MockHttp },
        { provide: AppConfigService, useValue: appconfig },
        { provide: AuthService, useValue: authService },
        { provide: InternalStorage },
        provideLuxonDateAdapter(),
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
