import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from "@angular/core/testing";

import { DatasetDetailsDashboardComponent } from "./dataset-details-dashboard.component";
import { MockActivatedRoute, MockUserApi } from "shared/MockStubs";
import { Store, StoreModule } from "@ngrx/store";
import { UserApi } from "shared/sdk";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { Router, ActivatedRoute } from "@angular/router";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MockStore } from "@ngrx/store/testing";
import { AppConfigService } from "app-config.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("DetailsDashboardComponent", () => {
  let component: DatasetDetailsDashboardComponent;
  let fixture: ComponentFixture<DatasetDetailsDashboardComponent>;
  let store: MockStore;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };

  const getConfig = () => ({
    editMetadataEnabled: true,
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [DatasetDetailsDashboardComponent],
      imports: [
        MatButtonModule,
        MatIconModule,
        MatSlideToggleModule,
        MatTabsModule,
        BrowserAnimationsModule,
        SharedScicatFrontendModule,
        StoreModule.forRoot({}),
      ],
      providers: [],
    });
    TestBed.overrideComponent(DatasetDetailsDashboardComponent, {
      set: {
        providers: [
          { provide: Router, useValue: router },
          {
            provide: AppConfigService,
            useValue: {
              getConfig,
            },
          },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: UserApi, useClass: MockUserApi },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetDetailsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));
  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
