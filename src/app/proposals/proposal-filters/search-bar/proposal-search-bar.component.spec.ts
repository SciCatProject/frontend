import { TestBed } from "@angular/core/testing";
import { Router, ActivatedRoute } from "@angular/router";
import { ProposalSearchBarComponent } from "./proposal-search-bar.component";

describe("ProposalSearchBarComponent", () => {
  let component: ProposalSearchBarComponent;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    activatedRouteStub = {
      snapshot: {
        queryParams: {},
      } as any,
    };

    TestBed.configureTestingModule({
      providers: [
        ProposalSearchBarComponent,
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    });

    component = TestBed.inject(ProposalSearchBarComponent);
  });

  it("should initialize with empty textSearch", () => {
    expect(component.textSearch).toBe("");
  });

  it("onTextChange should update textSearch", () => {
    component.onTextChange("hello");
    expect(component.textSearch).toBe("hello");
  });

  it("getTextSearchParam should return undefined when no searchQuery", () => {
    activatedRouteStub.snapshot.queryParams = {};
    expect(component.getTextSearchParam()).toBeUndefined();
  });

  it("getTextSearchParam should return the text from searchQuery", () => {
    const payload = { text: "find-me", other: 123 };
    activatedRouteStub.snapshot.queryParams = {
      searchQuery: JSON.stringify(payload),
    };
    expect(component.getTextSearchParam()).toBe("find-me");
  });

  it("onSearchAction should navigate with merged query params including textSearch", () => {
    // existing query params
    const existing = { foo: "bar" };
    activatedRouteStub.snapshot.queryParams = {
      searchQuery: JSON.stringify(existing),
    };
    component.textSearch = "new-text";

    component.onSearchAction();

    const expectedSearchQuery = JSON.stringify({
      ...existing,
      text: "new-text",
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        searchQuery: expectedSearchQuery,
        pageIndex: 0,
      },
      queryParamsHandling: "merge",
    });
  });

  it("onSearchAction should omit text when textSearch is empty", () => {
    const existing = { foo: "bar" };
    activatedRouteStub.snapshot.queryParams = {
      searchQuery: JSON.stringify(existing),
    };
    component.textSearch = "";

    component.onSearchAction();

    const expectedSearchQuery = JSON.stringify(existing); // text omitted
    expect(routerSpy.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        searchQuery: expectedSearchQuery,
        pageIndex: 0,
      },
      queryParamsHandling: "merge",
    });
  });
});
