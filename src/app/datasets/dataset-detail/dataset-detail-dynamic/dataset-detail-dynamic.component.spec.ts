import { LinkyPipe } from "ngx-linky";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { SharedScicatFrontendModule } from "shared/shared.module";

import { Observable, of } from "rxjs";

import { StoreModule } from "@ngrx/store";

import { ActivatedRoute, Router } from "@angular/router";
import { MockActivatedRoute } from "shared/MockStubs";
import { AppConfigService } from "app-config.service";
import {
  TranslateLoader,
  TranslateModule,
  TranslationObject,
} from "@ngx-translate/core";
import { DatasetDetailDynamicComponent } from "./dataset-detail-dynamic.component";
class MockTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({});
  }
}

describe("DatasetDetailDynamicComponent", () => {
  let component: DatasetDetailDynamicComponent;
  let fixture: ComponentFixture<DatasetDetailDynamicComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };

  const getConfig = () => ({});

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        SharedScicatFrontendModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader,
          },
        }),
        StoreModule.forRoot({}),
      ],
      declarations: [DatasetDetailDynamicComponent, LinkyPipe],
    });
    TestBed.overrideComponent(DatasetDetailDynamicComponent, {
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
        ],
      },
    });

    TestBed.compileComponents();
    fixture = TestBed.createComponent(DatasetDetailDynamicComponent);
    component = fixture.componentInstance;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
