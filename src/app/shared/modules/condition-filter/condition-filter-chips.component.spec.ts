import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ConditionConfig } from "state-management/state/user.store";
import { ConditionFilterModule } from "./condition-filter.module";
import { ConditionFilterChipsComponent } from "./condition-filter-chips.component";

describe("ConditionFilterChipsComponent", () => {
  let component: ConditionFilterChipsComponent;
  let fixture: ComponentFixture<ConditionFilterChipsComponent>;

  const config = (
    lhs: string,
    condition: Partial<ConditionConfig["condition"]> = {},
    enabled = true,
  ): ConditionConfig => ({
    enabled,
    condition: {
      lhs,
      relation: "GREATER_THAN",
      rhs: 20,
      unit: "",
      ...condition,
    },
  });

  const render = (configs: ConditionConfig[]) => {
    component.configs = configs;
    fixture.detectChanges();
  };

  const find = (selector: string): HTMLElement =>
    fixture.nativeElement.querySelector(selector);

  const chips = (): string[] =>
    Array.from<HTMLElement>(
      fixture.nativeElement.querySelectorAll("[data-cy=condition-chip]"),
    ).map((chip) => chip.textContent.trim());

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConditionFilterModule, NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(ConditionFilterChipsComponent);
    component = fixture.componentInstance;
  });

  it("should show nothing without applied filters", () => {
    render([config("pressure", {}, false)]);

    expect(find("[data-cy=condition-applied]")).toBeNull();
  });

  it("should show a chip for every applied filter", () => {
    render([
      config("temperature"),
      config("pressure", {}, false),
      config("humidity", { relation: "LESS_THAN", rhs: "" }),
    ]);

    expect(chips().length).toBe(1);
    expect(chips()[0]).toContain("temperature > 20");
  });

  it("should show how the filters are combined between the chips", () => {
    render([
      config("temperature"),
      config("pressure"),
      config("humidity", { join: "OR" }),
    ]);

    const joins = Array.from<HTMLElement>(
      fixture.nativeElement.querySelectorAll("[data-cy=condition-join-label]"),
    ).map((join) => join.textContent.trim());

    expect(chips().length).toBe(3);
    expect(joins).toEqual(["and", "or"]);
  });

  it("should show dataset fields and filters that are not included", () => {
    render([
      config("keywords", {
        relation: "IN",
        rhs: ["beam", "test"],
        source: "dataset",
        exclude: true,
      }),
    ]);

    expect(chips()[0]).toContain("not Keywords: beam, test");
    expect(find("[data-cy=condition-chip]").classList).toContain("excluded");
  });

  it("should tell which filter was clicked or removed", () => {
    const [first, second] = [config("temperature"), config("pressure")];
    const selected = jasmine.createSpy("select");
    const removed = jasmine.createSpy("remove");
    component.filterSelect.subscribe(selected);
    component.filterRemove.subscribe(removed);
    render([first, second]);

    find("[data-cy=condition-chip]").click();
    fixture.nativeElement.querySelectorAll("[matChipRemove]")[1].click();

    expect(selected).toHaveBeenCalledOnceWith(first);
    expect(removed).toHaveBeenCalledOnceWith(second);
  });

  it("should tell when all filters are cleared", () => {
    const cleared = jasmine.createSpy("clearAll");
    component.clearAll.subscribe(cleared);
    render([config("temperature")]);

    find("[data-cy=condition-chips-clear]").click();

    expect(cleared).toHaveBeenCalledTimes(1);
  });
});
