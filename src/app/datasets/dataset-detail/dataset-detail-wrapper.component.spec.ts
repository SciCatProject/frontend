import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AppConfigInterface, AppConfigService } from "app-config.service";
import { DatasetDetailWrapperComponent } from "./dataset-detail-wrapper.component";
import { DatasetDetailComponent } from "./dataset-detail/dataset-detail.component";
import { DatasetDetailDynamicComponent } from "./dataset-detail-dynamic/dataset-detail-dynamic.component";
import { MatDialogModule } from "@angular/material/dialog";
import { StoreModule } from "@ngrx/store";
import {
  TranslateModule,
  TranslateLoader,
  TranslationObject,
} from "@ngx-translate/core";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { Observable, of } from "rxjs";
import { LinkyPipe } from "ngx-linky";

class MockTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<TranslationObject> {
    return of({});
  }
}

describe("DatasetDetailWrapperComponent", () => {
  let component: DatasetDetailWrapperComponent;
  let fixture: ComponentFixture<DatasetDetailWrapperComponent>;
  let appConfigService: jasmine.SpyObj<AppConfigService>;

  beforeEach(() => {
    const appConfigServiceSpy = jasmine.createSpyObj("AppConfigService", [
      "getConfig",
    ]);

    TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        SharedScicatFrontendModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: MockTranslateLoader,
          },
        }),
        StoreModule.forRoot({}),
      ],
      declarations: [
        DatasetDetailWrapperComponent,
        DatasetDetailComponent,
        DatasetDetailDynamicComponent,
        LinkyPipe,
      ],
      providers: [{ provide: AppConfigService, useValue: appConfigServiceSpy }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DatasetDetailWrapperComponent);
    component = fixture.componentInstance;
    appConfigService = TestBed.inject(
      AppConfigService,
    ) as jasmine.SpyObj<AppConfigService>;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should load DatasetDetailDynamicComponent when enableCustomizedComponent is true", () => {
    appConfigService.getConfig.and.returnValue({
      datasetDetailComponent: {
        enableCustomizedComponent: true,
      },
    } as AppConfigInterface);

    fixture.detectChanges();

    const componentInstance = component.getDatasetDetailsComponent();
    expect(componentInstance).toBe(DatasetDetailDynamicComponent);
  });

  it("should load DatasetDetailComponent when enableCustomizedComponent is false", () => {
    appConfigService.getConfig.and.returnValue({
      datasetDetailComponent: {
        enableCustomizedComponent: false,
      },
    } as AppConfigInterface);

    fixture.detectChanges();

    const componentInstance = component.getDatasetDetailsComponent();
    expect(componentInstance).toBe(DatasetDetailComponent);
  });
});
