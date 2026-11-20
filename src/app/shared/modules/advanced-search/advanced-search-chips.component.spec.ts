import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { ConditionConfig } from "state-management/state/user.store";
import { setDatasetFields } from "./advanced-search.fields";
import { getConfiguredConditions } from "./advanced-search.utils";
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

  describe("fields of the config with a value", () => {
    afterEach(() => setDatasetFields());

    it("should show a chip for the ones with a value and none for the empty ones", () => {
      setDatasetFields([
        { key: "keywords", relation: "IN", value: ["neutron", "beam"] },
        { key: "pid", relation: "IN" },
        { key: "creationTime", relation: "RANGE", value: ["2026-01-01", ""] },
        {
          key: "scientificMetadata.detector.distance",
          relation: "GREATER_THAN",
          value: 5,
          unit: "mm",
        },
        { key: "scientificMetadata.thickness", relation: "RANGE" },
      ]);

      render(getConfiguredConditions());

      expect(
        Array.from<HTMLElement>(
          fixture.nativeElement.querySelectorAll(
            "[data-cy=condition-chip] .chip-text",
          ),
        ).map((text) => text.textContent.trim()),
      ).toEqual([
        "Keywords: neutron, beam",
        "Creation time: 2026-01-01 – …",
        "detector.distance > 5 mm",
      ]);
    });

    it("should show nothing when no field has a value", () => {
      setDatasetFields([{ key: "pid", relation: "IN" }]);

      render(getConfiguredConditions());

      expect(find("[data-cy=condition-applied]")).toBeNull();
    });
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

  it("should show the text search as a chip of its own", () => {
    component.appliedText = "beam";
    render([config("temperature")]);

    expect(find("[data-cy=text-chip]").textContent).toContain("“beam”");
    expect(chips().length).toBe(1);
  });

  it("should show no text chip for an empty text", () => {
    component.appliedText = "";
    render([config("temperature")]);

    expect(find("[data-cy=text-chip]")).toBeNull();
  });

  it("should show no bar for the text alone", () => {
    component.appliedText = "beam";
    render([]);

    expect(find("[data-cy=condition-applied]")).toBeNull();
  });

  it("should tell when the text chip is removed", () => {
    const removed = jasmine.createSpy("textRemove");
    component.textRemove.subscribe(removed);
    component.appliedText = "beam";
    render([config("temperature")]);

    find("[data-cy=text-chip] [matChipRemove]").click();

    expect(removed).toHaveBeenCalledTimes(1);
  });

  it("should tell which filter was clicked or removed", () => {
    const [first, second] = [config("temperature"), config("pressure")];
    const selected = jasmine.createSpy("select");
    const removed = jasmine.createSpy("remove");
    component.filterSelect.subscribe(selected);
    component.filterRemove.subscribe(removed);
    render([first, second]);

    find("[data-cy=condition-chip]").click();
    fixture.nativeElement
      .querySelectorAll("[data-cy=condition-chip] [matChipRemove]")[1]
      .click();

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
