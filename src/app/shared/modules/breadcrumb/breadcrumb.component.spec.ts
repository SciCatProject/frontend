import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { Location } from "@angular/common";
import { of } from "rxjs";
import { MockStore } from "shared/MockStubs";
import { BreadcrumbComponent } from "./breadcrumb.component";
import { Store } from "@ngrx/store";
import { provideRouter, Router } from "@angular/router";
import { ArchViewMode } from "state-management/models";
import {
  setArchiveViewModeAction,
  setFiltersAction,
} from "state-management/actions/datasets.actions";

describe("BreadcrumbComponent", () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let store: MockStore;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbComponent],
      imports: [],
      providers: [
        { provide: Store, useClass: MockStore },
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter([]),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store) as unknown as MockStore;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should dispatch setFiltersAction and setArchiveViewModeAction for datasets breadcrumb", () => {
    const dispatchSpy = spyOn(store, "dispatch");
    const selectSpy = spyOn(store, "select").and.returnValues(
      of({ text: "abc", skip: 7 }) as unknown as ReturnType<
        MockStore["select"]
      >,
      of(ArchViewMode.deleted) as unknown as ReturnType<MockStore["select"]>,
    );
    const backSpy = spyOn(TestBed.inject(Location), "back");
    const crumb = {
      label: "datasets",
      path: "datasets",
      params: {},
      url: "/datasets",
      fallback: "/datasets",
    };

    component.crumbClick(0, crumb);

    expect(selectSpy).toHaveBeenCalledTimes(2);
    expect(dispatchSpy).toHaveBeenCalledTimes(2);
    expect((dispatchSpy.calls.argsFor(0) as object)[0]).toEqual(
      setFiltersAction({
        datasetFilters: {
          text: "abc",
          skip: 7,
        },
      }),
    );
    expect((dispatchSpy.calls.argsFor(1) as object)[0]).toEqual(
      setArchiveViewModeAction({ modeToggle: ArchViewMode.deleted }),
    );
    expect(backSpy).toHaveBeenCalled();
  });

  it("should navigate by url for non-datasets breadcrumb", async () => {
    const navigateSpy = spyOn(router, "navigateByUrl").and.returnValue(
      Promise.resolve(true),
    );
    const crumb = {
      label: "about",
      path: "about",
      params: {},
      url: "/about",
      fallback: "/about",
    };

    component.crumbClick(0, crumb);
    await fixture.whenStable();

    expect(navigateSpy).toHaveBeenCalledWith("/about");
  });
});
