import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync
} from "@angular/core/testing";

import { AnonymousDetailsDashboardComponent } from "./anonymous-details-dashboard.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { AppConfigModule, APP_CONFIG } from "app-config.module";
import { SharedCatanieModule } from "shared/shared.module";
import { StoreModule, Store } from "@ngrx/store";
import { ActivatedRoute, Router } from "@angular/router";
import { MockActivatedRoute, MockStore } from "shared/MockStubs";
import {
  clearFacetsAction,
  addKeywordFilterAction
} from "state-management/actions/datasets.actions";

describe("AnonymousDetailsDashboardComponent", () => {
  let component: AnonymousDetailsDashboardComponent;
  let fixture: ComponentFixture<AnonymousDetailsDashboardComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl")
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [AnonymousDetailsDashboardComponent],
      imports: [AppConfigModule, SharedCatanieModule, StoreModule.forRoot({})]
    });
    TestBed.overrideComponent(AnonymousDetailsDashboardComponent, {
      set: {
        providers: [
          { provide: Router, useValue: router },
          { provide: APP_CONFIG, useValue: { editMetadataEnabled: true } },
          { provide: ActivatedRoute, useClass: MockActivatedRoute }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonymousDetailsDashboardComponent);
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

  describe("#onClickKeyword()", () => {
    it("should update datasets keyword filter and navigate to datasets table", () => {
      dispatchSpy = spyOn(store, "dispatch");
      const keyword = "test";
      component.onClickKeyword(keyword);

      expect(dispatchSpy).toHaveBeenCalledTimes(2);
      expect(dispatchSpy).toHaveBeenCalledWith(clearFacetsAction());
      expect(dispatchSpy).toHaveBeenCalledWith(
        addKeywordFilterAction({ keyword })
      );
      expect(router.navigateByUrl).toHaveBeenCalledWith("/anonymous/datasets");
    });
  });
});
