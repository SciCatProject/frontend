import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ConditionConfig } from "state-management/state/user.store";
import { AdvancedSearchModule } from "./advanced-search.module";
import { AdvancedSearchChipsComponent } from "./advanced-search-chips.component";

describe("AdvancedSearchChipsComponent", () => {
  let component: AdvancedSearchChipsComponent;
  let fixture: ComponentFixture<AdvancedSearchChipsComponent>;

  const config = (
    lhs: string,
    condition: Partial<ConditionConfig["condition"]> = {},
    enabled?: boolean,
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
      imports: [AdvancedSearchModule, NoopAnimationsModule],
    });
    fixture = TestBed.createComponent(AdvancedSearchChipsComponent);
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

  it("should show a chip for every filter, NOT only where it is set", () => {
    render([config("temperature"), config("pressure"), config("humidity")]);

    expect(chips().length).toBe(3);
    expect(find("[data-cy=condition-chip-not]")).toBeNull();
  });

  it("should show dataset fields and filters with NOT", () => {
    render([
      config("keywords", {
        relation: "IN",
        rhs: ["beam", "test"],
        source: "dataset",
        exclude: true,
      }),
    ]);

    expect(find("[data-cy=condition-chip-not]")).not.toBeNull();
    expect(find(".chip-text").textContent).toBe("Keywords: beam, test");
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
