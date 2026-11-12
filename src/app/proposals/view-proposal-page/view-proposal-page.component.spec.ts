import { ViewProposalPageComponent } from "./view-proposal-page.component";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MockDatasetsListService } from "shared/MockStubs";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { StoreModule } from "@ngrx/store";
import { BehaviorSubject, Subject } from "rxjs";
import { DatePipe, SlicePipe } from "@angular/common";
import { FileSizePipe } from "shared/pipes/filesize.pipe";
import { MatTabsModule } from "@angular/material/tabs";
import { MatIconModule } from "@angular/material/icon";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppConfigService } from "app-config.service";
import { TranslateService } from "@ngx-translate/core";
import { SharedScicatFrontendModule } from "shared/shared.module";
import { DatasetsListService } from "shared/services/datasets-list.service";

const getConfig = () => ({
  logbookEnabled: true,
});

describe("ViewProposalPageComponent", () => {
  let component: ViewProposalPageComponent;
  let fixture: ComponentFixture<ViewProposalPageComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
    navigate: jasmine.createSpy("navigate"),
  };
  let params$: Subject<{ id: string }>;
  let queryParams$: BehaviorSubject<Params>;

  beforeEach(waitForAsync(() => {
    router.navigate.calls.reset();
    params$ = new Subject<{ id: string }>();
    queryParams$ = new BehaviorSubject<Params>({});
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ViewProposalPageComponent],
      imports: [
        BrowserAnimationsModule,
        SharedScicatFrontendModule,
        MatIconModule,
        MatTabsModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        DatePipe,
        FileSizePipe,
        SlicePipe,
        { provide: TranslateService, useValue: { instant: (k: string) => k } },
      ],
    });
    TestBed.overrideComponent(ViewProposalPageComponent, {
      set: {
        providers: [
          { provide: Router, useValue: router },
          {
            provide: ActivatedRoute,
            useValue: { params: params$, queryParams: queryParams$ },
          },
          { provide: AppConfigService, useValue: { getConfig } },
          { provide: DatasetsListService, useClass: MockDatasetsListService },
        ],
      },
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProposalPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#onTabChanged()", () => {
    it("should clear the query params, a tab starts with none", () => {
      component.onTabChanged(1);

      expect(component.selectedTabIndex).toBe(1);
      expect(router.navigate).toHaveBeenCalledOnceWith([], {
        queryParams: {},
      });
    });
  });

  describe("table params in the url", () => {
    const datasetsTable = {
      pageIndex: "0",
      sortColumn: "creationTime",
      sortDirection: "asc",
    };
    const removeTableParams = {
      queryParams: {
        sortColumn: null,
        sortDirection: null,
        pageIndex: null,
        pageSize: null,
      },
      queryParamsHandling: "merge",
      replaceUrl: true,
    };

    it("should be removed when the page opens on a tab without a table", () => {
      params$.next({ id: "proposal" });

      queryParams$.next(datasetsTable);

      expect(component.selectedTabIndex).toBe(0);
      expect(router.navigate).toHaveBeenCalledOnceWith([], removeTableParams);
    });

    it("should stay when the datasets tab is open", () => {
      component.onTabChanged(1);
      router.navigate.calls.reset();

      queryParams$.next(datasetsTable);

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it("should stay when the related proposals tab is open", () => {
      component.onTabChanged(2);
      router.navigate.calls.reset();

      queryParams$.next(datasetsTable);

      expect(router.navigate).not.toHaveBeenCalled();
    });

    it("should be removed when the back button brings them to a tab without a table", () => {
      component.onTabChanged(1);
      queryParams$.next(datasetsTable);
      component.onTabChanged(0);
      queryParams$.next({});
      router.navigate.calls.reset();

      queryParams$.next(datasetsTable);

      expect(router.navigate).toHaveBeenCalledOnceWith([], removeTableParams);
    });

    it("should leave the other query params alone", () => {
      queryParams$.next({ other: "value" });

      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
