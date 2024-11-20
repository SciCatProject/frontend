import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { PublisheddataDetailsComponent } from "./publisheddata-details.component";
import {
  MockStore,
  MockPublishedDataApi,
  MockRouter,
  MockActivatedRoute,
} from "shared/MockStubs";
import { Store } from "@ngrx/store";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { Router, ActivatedRoute } from "@angular/router";
import { LinkyModule } from "ngx-linky";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { AppConfigService } from "app-config.service";
import { PublishedDataService } from "@scicatproject/scicat-sdk-ts";

const getConfig = () => ({
  editMetadataEnabled: true,
  editPublishedData: true,
  jsonMetadataEnabled: true,
});

describe("PublisheddataDetailsComponent", () => {
  let component: PublisheddataDetailsComponent;
  let fixture: ComponentFixture<PublisheddataDetailsComponent>;

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
    });
    TestBed.overrideComponent(PublisheddataDetailsComponent, {
      set: {
        providers: [
          { provide: Store, useClass: MockStore },
          { provide: Router, useClass: MockRouter },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: PublishedDataService, useClass: MockPublishedDataApi },
          {
            provide: AppConfigService,
            useValue: { getConfig },
          },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisheddataDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("appconfig settings", () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PublisheddataDetailsComponent);
      component = fixture.componentInstance;
      component.appConfig.editPublishedData = false;
      component.appConfig.jsonMetadataEnabled = false;
      fixture.detectChanges();
      TestBed.compileComponents();
    });
    it("button should not appear if not loginFormEnabled", () => {
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector("#editBtn")).toBeNull();
      expect(compiled.querySelector("#jsonMetadataContainer")).toBeNull();
    });
  });
});
