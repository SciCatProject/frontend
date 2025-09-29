import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { NO_ERRORS_SCHEMA, SimpleChange } from "@angular/core";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";
import { DateTime } from "luxon";
import { SharedFilterComponent } from "./shared-filter.component";

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
});
