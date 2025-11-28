import { TestBed } from "@angular/core/testing";

import { RouteTrackerService } from "./route-tracker.service";
import { provideRouter, Router } from "@angular/router";
import { Component } from "@angular/core";

@Component({})
class DummyComponent {}

describe("RouteTrackerService", () => {
  let service: RouteTrackerService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: "datasets/:pid", component: DummyComponent },
          { path: "login", component: DummyComponent },
        ]),
      ],
    });
    service = TestBed.inject(RouteTrackerService);
    router = TestBed.inject(Router);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should save the last route navigated from", async () => {
    expect(router).toBeTruthy();
    await router.navigateByUrl("/datasets/123");
    await router.navigateByUrl("/login");
    const previousRoute = service.getPreviousRoute();
    expect(previousRoute).toBe("/datasets/123");
  });

  it("should preserve query parameters in the previous route", async () => {
    expect(router).toBeTruthy();
    await router.navigateByUrl("/datasets/123?query=value");
    await router.navigateByUrl("/login");
    const previousRoute = service.getPreviousRoute();
    expect(previousRoute).toBe("/datasets/123?query=value");
  });
});
