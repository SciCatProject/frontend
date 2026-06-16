import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PublisheddataDetailsComponent } from "./publisheddata-details.component";
import {
  MockActivatedRoute,
  MockAuthService,
  MockPublishedDataApi,
  MockRouter,
  MockUserApi,
} from "shared/MockStubs";
import { UsersService } from "@scicatproject/scicat-sdk-ts-angular";
import { AuthService } from "shared/services/auth/auth.service";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { provideMockStore, MockStore } from "@ngrx/store/testing";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { Router, ActivatedRoute } from "@angular/router";
import { LinkyModule } from "ngx-linky";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { AppConfigService } from "app-config.service";
import {
  PublishedData,
  PublishedDataService,
} from "@scicatproject/scicat-sdk-ts-angular";
import { selectCurrentPublishedData } from "state-management/selectors/published-data.selectors";
import {
  selectIsAdmin,
  selectIsLoggedIn,
} from "state-management/selectors/user.selectors";

const getConfig = () => ({
  editMetadataEnabled: true,
  editPublishedData: true,
  jsonMetadataEnabled: true,
  publishedDataActionsEnabled: true,
  publishedDataActions: [
    {
      id: "test-action",
      label: "Test Action",
      type: "link",
      url: "https://example.com",
    },
  ],
});

const createPublishedData = (status: string) =>
  ({
    doi: "10.1234/test-doi",
    title: "Published data title",
    status,
    metadata: {},
  }) as PublishedData;

describe("PublisheddataDetailsComponent", () => {
  let component: PublisheddataDetailsComponent;
  let fixture: ComponentFixture<PublisheddataDetailsComponent>;
  let store: MockStore;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PublisheddataDetailsComponent],
      imports: [
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        NgxJsonViewerModule,
        LinkyModule,
        SharedScicatFrontendModule,
      ],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideMockStore(),
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: PublishedDataService, useClass: MockPublishedDataApi },
        { provide: UsersService, useClass: MockUserApi },
        { provide: AuthService, useClass: MockAuthService },
        { provide: AppConfigService, useValue: { getConfig } },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(
      selectCurrentPublishedData,
      createPublishedData("public"),
    );
    store.overrideSelector(selectIsAdmin, false);
    store.overrideSelector(selectIsLoggedIn, false);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisheddataDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("configurable actions", () => {
    it("should render configurable-actions element when publishedDataActions are configured", () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector("configurable-actions")).not.toBeNull();
    });
  });

  describe("appconfig settings", () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PublisheddataDetailsComponent);
      component = fixture.componentInstance;
      component.appConfig.jsonMetadataEnabled = false;
      fixture.detectChanges();
    });
    it("button should not appear if not loginFormEnabled", () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector("#editBtn")).toBeNull();
      expect(compiled.querySelector("#jsonMetadataContainer")).toBeNull();
    });
  });
});
