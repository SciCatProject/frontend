import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { of } from "rxjs";
import { ProposalSideFilterComponent } from "./proposal-side-filter.component";
import { Store } from "@ngrx/store";
import { ActivatedRoute, Router } from "@angular/router";
import { DateTime } from "luxon";
import { TranslateService } from "@ngx-translate/core";
import { SharedScicatFrontendModule } from "shared/shared.module";

describe("ProposalSideFilterComponent", () => {
  let component: ProposalSideFilterComponent;
  let fixture: ComponentFixture<ProposalSideFilterComponent>;
  let mockStore: any;
  let mockRoute: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockStore = {
      select: jasmine.createSpy("select").and.returnValue(of({ foo: [1, 2] })),
    };
    mockRoute = { snapshot: { queryParams: {} } };
    mockRouter = { navigate: jasmine.createSpy("navigate") };

    await TestBed.configureTestingModule({
      imports: [SharedScicatFrontendModule],
      declarations: [ProposalSideFilterComponent],
      providers: [
        { provide: Store, useValue: mockStore },
        { provide: ActivatedRoute, useValue: mockRoute },
        { provide: Router, useValue: mockRouter },
        { provide: TranslateService, useValue: { instant: (k: string) => k } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ProposalSideFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should have collapsed false by default", () => {
    expect(component.collapsed).toBeFalse();
  });

  it("should toggle collapsed from false to true", () => {
    component.collapsed = false;
    component.toggleCollapse();
    expect(component.collapsed).toBeTrue();
  });

  it("should toggle collapsed from true to false", () => {
    component.collapsed = true;
    component.toggleCollapse();
    expect(component.collapsed).toBeFalse();
  });

  it("should initialize activeFilters from queryParams.searchQuery in ngOnInit", () => {
    const data = { alpha: ["beta"] };
    mockRoute.snapshot.queryParams = { searchQuery: JSON.stringify(data) };
    component.activeFilters = {};
    component.ngOnInit();
    expect(component.activeFilters).toEqual(data);
  });

  it("should set a filter when value is provided", () => {
    component.activeFilters = {};
    component.setFilter("proposalId", ["test123"]);
    expect(component.activeFilters.proposalId).toEqual(["test123"]);
  });

  it("should remove a filter when value is empty", () => {
    component.activeFilters = { proposalId: ["test123"] };
    component.setFilter("status", []);
    expect("status" in component.activeFilters).toBeFalse();
  });

  it("should set a date filter when begin or end is provided", () => {
    const range = { begin: DateTime.now().toISO(), end: null };
    component.activeFilters = {};
    component.setDateFilter("created", range);
    expect(component.activeFilters.created).toEqual({
      begin: range.begin,
      end: range.end,
    });
  });

  it("should remove a date filter when neither begin nor end is provided", () => {
    component.activeFilters = {
      created: { begin: DateTime.now().toISO(), end: DateTime.now().toISO() },
    };
    component.setDateFilter("created", { begin: null, end: null });
    expect("created" in component.activeFilters).toBeFalse();
  });

  it("should apply filters and navigate with correct queryParams", () => {
    component.activeFilters = { a: ["1"] };
    mockRoute.snapshot.queryParams = {
      searchQuery: JSON.stringify({ text: "hello" }),
    };
    component.applyFilters();
    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        searchQuery: JSON.stringify({ a: ["1"], text: "hello" }),
        pageIndex: 0,
      },
      queryParamsHandling: "merge",
    });
  });

  it("getFacetCounts$ should return counts array for existing key", (done) => {
    component.getFacetCounts$("foo").subscribe((counts) => {
      expect(counts).toEqual([1, 2]);
      done();
    });
  });

  it("getFacetCounts$ should return empty array for missing key", (done) => {
    component.getFacetCounts$("bar").subscribe((counts) => {
      expect(counts).toEqual([]);
      done();
    });
  });

  it("should reset filters, call applyFilters and toggle clearFilters flag", fakeAsync(() => {
    component.activeFilters = { x: ["y"] };
    spyOn(component, "applyFilters");
    component.clearFilters = false;

    component.reset();
    expect(component.activeFilters).toEqual({});
    expect(component.clearFilters).toBeTrue();
    expect(component.applyFilters).toHaveBeenCalled();

    tick(0);
    expect(component.clearFilters).toBeFalse();
  }));
});
