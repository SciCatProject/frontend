import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { of } from "rxjs";
import { MockStore } from "shared/MockStubs";
import { BreadcrumbComponent } from "./breadcrumb.component";
import { Store } from "@ngrx/store";
import { provideRouter, Router } from "@angular/router";
import { ArchViewMode } from "state-management/models";
import {
  prefillFiltersAction,
  setArchiveViewModeAction,
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

  it("should dispatch prefillFiltersAction and setArchiveViewModeAction for datasets breadcrumb", () => {
    const dispatchSpy = spyOn(store as any, "dispatch");
    const selectSpy = spyOn(store as any, "select").and.returnValues(
      of({ text: "abc" }) as any,
      of(ArchViewMode.deleted) as any,
    );
    const backSpy = spyOn((component as any).location, "back");
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
    expect((dispatchSpy.calls.argsFor(0) as any[])[0]).toEqual(
      prefillFiltersAction({ values: { text: "abc" } }),
    );
    expect((dispatchSpy.calls.argsFor(1) as any[])[0]).toEqual(
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
