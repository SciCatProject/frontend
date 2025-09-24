import { ProposalDashboardComponent } from "./proposal-dashboard.component";
import { ActivatedRoute } from "@angular/router";
import { Store } from "@ngrx/store";
import { of } from "rxjs";

describe("ProposalDashboardComponent", () => {
  let component: ProposalDashboardComponent;
  let storeSpy: jasmine.SpyObj<Store<any>>;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(() => {
    storeSpy = jasmine.createSpyObj("Store", ["dispatch"]);
    activatedRouteStub = {
      queryParams: of({
        pageSize: "5",
        pageIndex: "2",
        searchQuery: '{"proposalId":"123"}',
        sortColumn: "proposalId",
        sortDirection: "asc",
      }),
    };

    component = new ProposalDashboardComponent(
      storeSpy as Store<any>,
      activatedRouteStub as ActivatedRoute,
    );
    component.filterLists = [
      {
        key: "test1",
        type: "text",
        description: "Filter by Unique identifier for the proposal",
        enabled: true,
      },
      {
        key: "pi_lastname",
        type: "text",
        description: "Filter by First name of the Principal Investigator",
        enabled: true,
      },
      {
        key: "startTime",
        type: "dateRange",
        description: "Filter by Start time of the proposal",
        enabled: true,
      },
      {
        key: "endTime",
        type: "dateRange",
        description: "Filter by End time of the proposal",
        enabled: true,
      },
    ];
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize filterLists correctly", () => {
    expect(component.filterLists.length).toBe(4);
    expect(component.filterLists[0].key).toBe("test1");
    expect(component.filterLists[3].type).toBe("dateRange");
  });

  it("should dispatch fetchProposalsAction and fetchFacetCountsAction on ngOnInit", () => {
    component.ngOnInit();

    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: jasmine.stringMatching(/\[Proposal\] Fetch Proposals/),
      }),
    );

    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        type: jasmine.stringMatching(/\[Proposal\] Fetch Facet Counts/),
      }),
    );
  });

  it("should unsubscribe from all subscriptions on ngOnDestroy", () => {
    const sub1 = jasmine.createSpyObj("Subscription", ["unsubscribe"]);
    const sub2 = jasmine.createSpyObj("Subscription", ["unsubscribe"]);
    component.subscriptions = [sub1, sub2];

    component.ngOnDestroy();

    expect(sub1.unsubscribe).toHaveBeenCalled();
    expect(sub2.unsubscribe).toHaveBeenCalled();
  });

  it("should use defaultPageSize if pageSize is not provided", () => {
    activatedRouteStub.queryParams = of({
      pageIndex: "1",
      searchQuery: "{}",
      sortColumn: "proposalId",
      sortDirection: "desc",
    });
    component = new ProposalDashboardComponent(
      storeSpy as Store<any>,
      activatedRouteStub as ActivatedRoute,
    );
    component.ngOnInit();

    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        limit: component.defaultPageSize,
      }),
    );
  });

  it("should parse searchQuery as JSON", () => {
    activatedRouteStub.queryParams = of({
      searchQuery: '{"email":"test@example.com"}',
    });
    component = new ProposalDashboardComponent(
      storeSpy as Store<any>,
      activatedRouteStub as ActivatedRoute,
    );
    component.ngOnInit();

    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      jasmine.objectContaining({
        search: { email: "test@example.com" },
      }),
    );
  });
});
