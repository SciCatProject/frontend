import { ViewProposalPageComponent } from "./view-proposal-page.component";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MockActivatedRoute } from "shared/MockStubs";
import { Router, ActivatedRoute } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { DatePipe, SlicePipe } from "@angular/common";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppConfigService } from "app-config.service";
import { TranslateService } from "@ngx-translate/core";
import { SharedScicatFrontendModule } from "shared/shared.module";

const getConfig = () => ({
  logbookEnabled: true,
});

describe("ViewProposalPageComponent", () => {
  let component: ViewProposalPageComponent;
  let fixture: ComponentFixture<ViewProposalPageComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ViewProposalPageComponent],
      imports: [
        BrowserAnimationsModule,
        SharedScicatFrontendModule,
        MatIconModule,
        MatTabsModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        DatePipe,
        FileSizePipe,
        SlicePipe,
        { provide: TranslateService, useValue: { instant: (k: string) => k } },
      ],
    });
    TestBed.overrideComponent(ViewProposalPageComponent, {
      set: {
        providers: [
          { provide: Router, useValue: router },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: AppConfigService, useValue: { getConfig } },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProposalPageComponent);
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
