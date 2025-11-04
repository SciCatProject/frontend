import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { NO_ERRORS_SCHEMA, SimpleChange } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DateTime } from "luxon";
import { SharedFilterComponent } from "./shared-filter.component";
import { of } from "rxjs";

describe("SharedFilterComponent", () => {
  let component: SharedFilterComponent;
  let fixture: ComponentFixture<SharedFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SharedFilterComponent],
      imports: [ReactiveFormsModule],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedFilterComponent);
    component = fixture.componentInstance;
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should set textField value on ngOnChanges when filterType is text", () => {
    component.filterType = "text";
    component.prefilled = "hello world";
    component.ngOnChanges({
      filterType: new SimpleChange(undefined, component.filterType, true),
      prefilled: new SimpleChange(undefined, component.prefilled, true),
    });
    const textValue = component.filterForm.get("textField")!.value;
    expect(textValue).toBe("hello world");
  });

  it("should set dateRangeField values on ngOnChanges when filterType is dateRange", () => {
    const beginIso = "2020-01-01T00:00:00.000Z";
    const endIso = "2020-02-02T00:00:00.000Z";
    component.filterType = "dateRange";
    component.prefilled = { begin: beginIso, end: endIso };
    component.ngOnChanges({
      filterType: new SimpleChange(undefined, component.filterType, true),
      prefilled: new SimpleChange(undefined, component.prefilled, true),
    });
    const start = component.filterForm.get("dateRangeField.start")!.value;
    const end = component.filterForm.get("dateRangeField.end")!.value;
    expect(start).toEqual(new Date(beginIso));
    expect(end).toEqual(new Date(endIso));
  });

  it("should reset form when clear is set to true", () => {
    component.filterForm.setValue({
      textField: "test",
      dateRangeField: { start: new Date(), end: new Date() },
      multiSelectField: [],
      numberRange: { min: null, max: null },
      selectedIds: [],
    });
    component.clear = true;
    const text = component.filterForm.get("textField")!.value;
    const start = component.filterForm.get("dateRangeField.start")!.value;
    const end = component.filterForm.get("dateRangeField.end")!.value;
    expect(text).toBe("");
    expect(start).toBeNull();
    expect(end).toBeNull();
  });

  it("should emit textChange on onInput", () => {
    spyOn(component.textChange, "emit");
    const inputEl = document.createElement("input");
    inputEl.value = "foo";
    const event = { target: inputEl } as unknown as Event;
    component.onInput(event);
    expect(component.textChange.emit).toHaveBeenCalledWith("foo");
  });

  it("should emit dateRangeChange with correct begin and end on dateChanged", () => {
    spyOn(component.dateRangeChange, "emit");

    // Begin
    const dtBegin = DateTime.utc(2021, 5, 10, 12);
    const evBegin = { value: dtBegin } as MatDatepickerInputEvent<DateTime>;
    component.dateChanged(evBegin, "begin");
    expect(component.dateRangeChange.emit).toHaveBeenCalledWith({
      begin: dtBegin.toUTC().toISO(),
      end: null,
    });

    // End
    const dtEnd = DateTime.utc(2021, 6, 15, 8);
    const evEnd = { value: dtEnd } as MatDatepickerInputEvent<DateTime>;
    component.dateChanged(evEnd, "end");
    expect(component.dateRangeChange.emit).toHaveBeenCalledWith({
      begin: dtBegin.toUTC().toISO(),
      end: dtEnd.toUTC().toISO(),
    });
  });

  it("should handle null date (clear) in dateChanged", () => {
    spyOn(component.dateRangeChange, "emit");
    const evNull = { value: null } as MatDatepickerInputEvent<DateTime>;
    component.dateChanged(evNull, "begin");
    expect(component.dateRangeChange.emit).toHaveBeenCalledWith({
      begin: null,
      end: null,
    });
  });

  it("should set checkboxFacetCounts and selectedIds on ngOnChanges when filterType is checkbox", () => {
    const facets = [
      { _id: "a", label: "Alpha", count: 1 },
      { _id: "b", count: 2 },
    ];

    component.facetCounts$ = of(facets);
    component.filterType = "checkbox";
    component.prefilled = ["b"];
    component.ngOnChanges({
      filterType: new SimpleChange(undefined, component.filterType, true),
      prefilled: new SimpleChange(undefined, component.prefilled, true),
    });

    // ensure both facets are present (order may vary) and no duplicate _id values exist
    const ids = component.checkboxFacetCounts.map((f) => f._id);
    expect(ids).toContain("a");
    expect(ids).toContain("b");

    expect(new Set(ids).size).toBe(ids.length);

    expect(component.filterForm.get("selectedIds")!.value).toEqual(["b"]);
  });

  it("filteredFacetCounts should pin selected items to top and apply search (case-insensitive)", () => {
    component.checkboxFacetCounts = [
      { _id: "a", label: "First", count: 1 },
      { _id: "b", label: "Second", count: 2 },
      { _id: "c", label: "Third", count: 3 },
    ];
    component.filterForm.get("selectedIds")!.setValue(["a"]);
    component.filterForm.get("textField")!.setValue("sec");
    const result = component.filteredFacetCounts();
    expect(result[0]._id).toBe("a"); // pinned first
    expect(result.some((x) => x._id === "b")).toBeTrue(); // search matched
    // ensure pinned included even if doesn't match
    component.filterForm.get("textField")!.setValue("zzz");
    const res2 = component.filteredFacetCounts();
    expect(res2[0]._id).toBe("a");
    // since no other matches, length should be 1
    expect(res2.length).toBe(1);
  });

  it("filteredFacetCounts should de-duplicate by _id", () => {
    component.checkboxFacetCounts = [
      { _id: "a", label: "Alpha", count: 1 },
      { _id: "a", label: "Alpha Duplicate", count: 1 },
      { _id: "b", label: "Beta", count: 2 },
    ];
    component.filterForm.get("selectedIds")!.setValue(["b"]);
    component.filterForm.get("textField")!.setValue("");
    const merged = component.filteredFacetCounts();
    const ids = merged.map((m) => m._id);
    expect(ids).toEqual(["b", "a"]); // pinned b first, then a, duplicates removed
  });

  it("visibleFacetCounts and hasMore reflect checkboxDisplaylimit and onShowMore increases limit", () => {
    component.checkboxFacetCounts = Array.from({ length: 3 }, (_, i) => ({
      _id: `id${i}`,
      label: `Label${i}`,
      count: i + 1,
    }));
    component.checkboxDisplaylimit = 1;
    component.filterForm.get("textField")!.setValue("");
    const visibleBefore = component.visibleFacetCounts;
    expect(visibleBefore.length).toBe(1);
    expect(component.hasMore).toBeTrue();

    component.onShowMore();
    const visibleAfter = component.visibleFacetCounts;
    expect(component.checkboxDisplaylimit).toBe(11);
    expect(visibleAfter.length).toBe(3);
    expect(component.hasMore).toBeFalse();
  });

  it("onToggleCheckbox should add and remove ids and emit checkBoxChange", () => {
    spyOn(component.checkBoxChange, "emit");
    // start empty
    component.filterForm.get("selectedIds")!.setValue([]);
    component.onToggleCheckbox("x", true);
    expect(component.filterForm.get("selectedIds")!.value).toEqual(["x"]);
    expect(component.checkBoxChange.emit).toHaveBeenCalledWith(["x"]);

    component.onToggleCheckbox("x", false);
    expect(component.filterForm.get("selectedIds")!.value).toEqual([]);
    expect(component.checkBoxChange.emit).toHaveBeenCalledWith([]);
  });

  it("ngOnInit should subscribe to textField valueChanges and reset checkboxDisplaylimit on change", () => {
    component.checkboxDisplaylimit = 50;
    component.ngOnInit();
    // change the textField value to trigger subscription
    component.filterForm.get("textField")!.setValue("new value");
    expect(component.checkboxDisplaylimit).toBe(10);
  });

  it("onSelectionChange should emit selectionChange", () => {
    spyOn(component.selectionChange, "emit");
    const val = { selected: ["a"], label: "test" } as any;
    component.onSelectionChange(val);
    expect(component.selectionChange.emit).toHaveBeenCalledWith(val);
  });

  it("onNumericRangeChange should emit numericRangeChange", () => {
    spyOn(component.numericRangeChange, "emit");
    const range = { min: 1, max: 5 };
    component.onNumericRangeChange(range);
    expect(component.numericRangeChange.emit).toHaveBeenCalledWith(range);
  });

  it("trackById should return _id", () => {
    const item = { _id: "myid", label: "L", count: 1 };
    expect(component.trackById(0, item)).toBe("myid");
  });

  it("should set showCheckboxSearch = true when checkboxFacetCounts.length > checkboxDisplaylimit", () => {
    component.checkboxFacetCounts = Array.from({ length: 12 }, (_, i) => ({
      _id: `id${i}`,
      label: `Label${i}`,
      count: i,
    }));
    component.checkboxDisplaylimit = 10;
    // pass empty changes to trigger the length check branch
    component.ngOnChanges({} as any);
    expect(component.showCheckboxSearch).toBeTrue();
  });

  it("should set showCheckboxSearch = false when checkboxFacetCounts.length <= checkboxDisplaylimit", () => {
    component.checkboxFacetCounts = Array.from({ length: 5 }, (_, i) => ({
      _id: `id${i}`,
      label: `Label${i}`,
      count: i,
    }));
    component.checkboxDisplaylimit = 10;
    component.ngOnChanges({} as any);
    expect(component.showCheckboxSearch).toBeFalse();
  });

  it("should include prefilled id not present in facets with count 0 and set selectedIds", () => {
    const facets = [{ _id: "a", label: "Alpha", count: 1 }];
    component.facetCounts$ = of(facets);
    component.filterType = "checkbox";
    component.prefilled = ["TEST_INSTRUMENT"]; // not present in facets
    component.ngOnChanges({
      filterType: new SimpleChange(undefined, component.filterType, true),
      prefilled: new SimpleChange(undefined, component.prefilled, true),
    });

    const found = component.checkboxFacetCounts.find(
      (f) => f._id === "TEST_INSTRUMENT",
    );
    expect(found).toBeTruthy();
    expect(found!.count).toBe(0);
    expect(component.filterForm.get("selectedIds")!.value).toEqual([
      "TEST_INSTRUMENT",
    ]);
  });

  it("visibleFacetCounts should return top N items sorted by count desc", () => {
    component.checkboxFacetCounts = [
      { _id: "a", label: "A", count: 1 },
      { _id: "b", label: "B", count: 3 },
      { _id: "c", label: "C", count: 2 },
    ];
    component.checkboxDisplaylimit = 2;
    component.filterForm.get("textField")!.setValue("");
    const visible = component.visibleFacetCounts;
    expect(visible.length).toBe(2);
    expect(visible.map((v) => v._id)).toEqual(["b", "c"]);
  });
});
