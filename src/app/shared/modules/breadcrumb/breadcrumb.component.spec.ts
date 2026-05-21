import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { MockStore } from "shared/MockStubs";
import { BreadcrumbComponent } from "./breadcrumb.component";
import { Store } from "@ngrx/store";
import { provideRouter, Router } from "@angular/router";

describe("BreadcrumbComponent", () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;
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
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should navigate to datasets page when datasets breadcrumb is clicked", () => {
    const navigateByUrlSpy = spyOn(router, "navigateByUrl").and.returnValue(
      Promise.resolve(true),
    );

    const datasetsCrumb = {
      label: "Datasets",
      path: "datasets",
      params: {},
      url: "/datasets",
      fallback: "/datasets",
    };

    component.breadcrumbs = [datasetsCrumb];
    component.crumbClick(0, datasetsCrumb);
    component.crumbClick(0, datasetsCrumb);

    expect(navigateByUrlSpy).toHaveBeenCalledTimes(2);
    expect(navigateByUrlSpy).toHaveBeenCalledWith("/datasets");
  });
});
