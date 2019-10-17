import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";

import { PublisheddataDashboardComponent } from "./publisheddata-dashboard.component";
import { MockStore } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { StoreModule, Store } from "@ngrx/store";
import { rootReducer } from "state-management/reducers/root.reducer";
import { Router } from "@angular/router";
import { PageChangeEvent } from "shared/modules/table/table.component";
import { changePageAction } from "state-management/actions/published-data.actions";
import { PublishedData } from "shared/sdk";

describe("PublisheddataDashboardComponent", () => {
  let component: PublisheddataDashboardComponent;
  let fixture: ComponentFixture<PublisheddataDashboardComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [PublisheddataDashboardComponent],
      imports: [StoreModule.forRoot({ rootReducer })]
    });
    TestBed.overrideComponent(PublisheddataDashboardComponent, {
      set: {
        providers: [{ provide: Router, useValue: router }]
      }
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

  describe("#onPageChange()", () => {
    it("should dispatch a changePageAction action", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 25
      };
      component.onPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changePageAction({ page: event.pageIndex, limit: event.pageSize })
      );
    });
  });

  describe("#onRowClick", () => {
    it("should navigate to a Published Dataset", () => {
      const published = new PublishedData();
      const id = encodeURIComponent(published.doi);
      component.onRowClick(published);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/publishedDatasets/" + id
      );
    });
  });
});
