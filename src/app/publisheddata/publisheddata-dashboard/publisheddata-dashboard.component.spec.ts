import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";

import { PublisheddataDashboardComponent } from "./publisheddata-dashboard.component";
import { MockStore, createMock, mockPublishedData } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { StoreModule, Store } from "@ngrx/store";
import { Router } from "@angular/router";
import { FlexLayoutModule } from "@ngbracket/ngx-layout";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { AppConfigService } from "app-config.service";
import { ScicatDataService } from "shared/services/scicat-data-service";
import { ExportExcelService } from "shared/services/export-excel.service";
import { RowEventType } from "shared/modules/dynamic-material-table/models/table-row.model";

const getConfig = () => ({});

describe("PublisheddataDashboardComponent", () => {
  let component: PublisheddataDashboardComponent;
  let fixture: ComponentFixture<PublisheddataDashboardComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        FlexLayoutModule,
        MatButtonModule,
        MatIconModule,
        StoreModule.forRoot({}),
      ],
      declarations: [PublisheddataDashboardComponent],
    });
    TestBed.overrideComponent(PublisheddataDashboardComponent, {
      set: {
        providers: [
          {
            provide: Router,
            useValue: router,
          },
          {
            provide: AppConfigService,
            useValue: { getConfig },
          },
          { provide: ScicatDataService, useValue: {} },
          { provide: ExportExcelService, useValue: {} },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisheddataDashboardComponent);
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

  describe("#onRowEvent", () => {
    it("should navigate to a Published Dataset", () => {
      const published = mockPublishedData;
      const id = encodeURIComponent(published.doi);

      component.onRowEvent({
        event: RowEventType.RowClick,
        sender: { row: published },
      } as any);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/publishedDatasets/" + id,
      );
    });
  });
});
