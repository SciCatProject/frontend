import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { APP_CONFIG, AppConfigModule } from "app-config.module";
import { PublisheddataDetailsComponent } from "./publisheddata-details.component";
import {
  MockStore,
  MockPublishedDataApi,
  MockRouter,
  MockActivatedRoute
} from "shared/MockStubs";
import { Store } from "@ngrx/store";
import { PublishedDataApi } from "shared/sdk";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { Router, ActivatedRoute } from "@angular/router";
import { LinkyModule } from "ngx-linky";
import { SharedCatanieModule } from "shared/shared.module";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

describe("PublisheddataDetailsComponent", () => {
  let component: PublisheddataDetailsComponent;
  let fixture: ComponentFixture<PublisheddataDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [PublisheddataDetailsComponent],
      imports: [
        AppConfigModule,
        MatCardModule,
        MatIconModule,
        NgxJsonViewerModule,
        LinkyModule,
        SharedCatanieModule
      ]
    });
    TestBed.overrideComponent(PublisheddataDetailsComponent, {
      set: {
        providers: [
          { provide: Store, useClass: MockStore },
          { provide: Router, useClass: MockRouter },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: PublishedDataApi, useClass: MockPublishedDataApi },
          {
            provide: APP_CONFIG,
            useValue: {
              editMetadataEnabled: true
            }
          }
        ]
      }
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
});
