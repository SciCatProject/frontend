import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { MockStore } from "shared/MockStubs";
import { BreadcrumbComponent } from "./breadcrumb.component";
import { Store } from "@ngrx/store";
import { provideRouter, Router } from "@angular/router";
import { Location } from "@angular/common";
import {
  selectArchiveViewMode,
  selectFilters,
} from "state-management/selectors/datasets.selectors";
import { of } from "rxjs/internal/observable/of";
import { ArchViewMode } from "state-management/models";

describe("BreadcrumbComponent", () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
  let router: Router;
  let location: Location;
  let store: Store;

  const datasetsCrumb = {
    label: "Datasets",
    path: "datasets",
    params: {},
    url: "/datasets",
    fallback: "/datasets",
  };

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
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should navigateByUrl to fallback when mode is empty", () => {
    spyOn(store, "select").and.callFake((selector) => {
      if (selector === selectFilters) return of({});
      if (selector === selectArchiveViewMode) return of(ArchViewMode.all);
      return of(null);
    });
    spyOn(router, "navigateByUrl").and.returnValue(Promise.resolve(true));

    component.crumbClick(0, datasetsCrumb);

    expect(router.navigateByUrl).toHaveBeenCalledWith("/datasets");
  });

  it("should call location.back() when mode is not empty", () => {
    spyOn(store, "select").and.callFake((selector) => {
      if (selector === selectFilters) return of({});
      if (selector === selectArchiveViewMode)
        return of(ArchViewMode.archivable);
      return of(null);
    });
    spyOn(location, "back");

    component.crumbClick(0, datasetsCrumb);

    expect(location.back).toHaveBeenCalled();
  });
});
