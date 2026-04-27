import { DatePipe } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import {
  changeRelatedDatasetsPageAction,
  fetchRelatedDatasetsAction,
} from "state-management/actions/datasets.actions";
import {
  selectRelatedDatasetsCurrentPage,
  selectRelatedDatasetsPageViewModel,
  selectRelatedDatasetsPerPage,
} from "state-management/selectors/datasets.selectors";

import { RelatedDatasetsComponent } from "./related-datasets.component";
import { MockActivatedRoute, createMock } from "shared/MockStubs";
import { DatasetClass } from "@scicatproject/scicat-sdk-ts-angular";
import { RowEventType } from "shared/modules/dynamic-material-table/models/table-row.model";
import { DynamicMatTableModule } from "shared/modules/dynamic-material-table/table/dynamic-mat-table.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TranslateService } from "@ngx-translate/core";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { TablePagination } from "shared/modules/dynamic-material-table/models/table-pagination.model";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("RelatedDatasetsComponent", () => {
  let component: RelatedDatasetsComponent;
  let fixture: ComponentFixture<RelatedDatasetsComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
    navigate: jasmine.createSpy("navigate"),
  };
  let store: Store;
  let dispatchSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelatedDatasetsComponent],
      imports: [
        BrowserAnimationsModule,
        DynamicMatTableModule.forRoot({}),
        SharedScicatFrontendModule,
      ],
      providers: [
        DatePipe,
        provideMockStore({
          selectors: [
            {
              selector: selectRelatedDatasetsPageViewModel,
              value: {
                relatedDatasets: [],
                relatedDatasetsCount: 0,
              },
            },
            {
              selector: selectRelatedDatasetsCurrentPage,
              value: 0,
            },
            {
              selector: selectRelatedDatasetsPerPage,
              value: 25,
            },
          ],
        }),
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: TranslateService, useValue: { instant: (k: string) => k } },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    store = TestBed.inject(Store);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedDatasetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#onPaginationChange()", () => {
    it("should dispatch changeRelatedDatasetsPageAction and fetchRelatedDatasetsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: TablePagination = {
        pageIndex: 0,
        pageSize: 25,
        length: 25,
      };

      component.onPaginationChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changeRelatedDatasetsPageAction({
          page: event.pageIndex,
          limit: event.pageSize,
        }),
      );
      expect(dispatchSpy).toHaveBeenCalledWith(fetchRelatedDatasetsAction());
    });
  });

  describe("#onRowEvent()", () => {
    it("should navigate to a dataset", () => {
      const dataset = createMock<DatasetClass>({ pid: "PID-123" });

      component.onRowEvent({
        event: RowEventType.RowClick,
        sender: { row: dataset },
      } as any);

      expect(router.navigateByUrl).toHaveBeenCalledOnceWith(
        "/datasets/" + encodeURIComponent(dataset.pid),
      );
    });
  });
});
