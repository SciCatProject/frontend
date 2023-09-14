import { DatePipe } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { provideMockStore } from "@ngrx/store/testing";
import { PageChangeEvent } from "shared/modules/table/table.component";
import { Dataset } from "shared/sdk";
import {
  changeRelatedDatasetsPageAction,
  fetchRelatedDatasetsAction,
} from "state-management/actions/datasets.actions";
import { selectRelatedDatasetsPageViewModel } from "state-management/selectors/datasets.selectors";

import { RelatedDatasetsComponent } from "./related-datasets.component";
import { TableModule } from "shared/modules/table/table.module";

describe("RelatedDatasetsComponent", () => {
  let component: RelatedDatasetsComponent;
  let fixture: ComponentFixture<RelatedDatasetsComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };
  let store: Store;
  let dispatchSpy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelatedDatasetsComponent],
      imports: [TableModule],
      providers: [
        DatePipe,
        provideMockStore({
          selectors: [
            {
              selector: selectRelatedDatasetsPageViewModel,
              value: {
                relatedDatasets: [],
                relatedDatasetsCount: 0,
                relatedDatasetsFilters: {
                  skip: 0,
                  limit: 25,
                  sortField: "creationTime:desc",
                },
              },
            },
          ],
        }),
        { provide: Router, useValue: router },
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

  describe("#onPageChange", () => {
    it("should dispatch a changeRelatedDatasetsPageAction and a fetchRelatedDatasetsAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 25,
      };

      component.onPageChange(event);

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

  describe("#onRowClick()", () => {
    it("should navigate to a dataset", () => {
      const dataset = new Dataset();

      component.onRowClick(dataset);

      expect(router.navigateByUrl).toHaveBeenCalledOnceWith(
        "/datasets/" + encodeURIComponent(dataset.pid),
      );
    });
  });
});
