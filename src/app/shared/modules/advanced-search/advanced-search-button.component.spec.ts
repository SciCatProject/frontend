import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { By } from "@angular/platform-browser";
import { MatDialog } from "@angular/material/dialog";
import { MatTooltip } from "@angular/material/tooltip";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { Subject, of } from "rxjs";
import {
  ConditionConfig,
  initialUserState,
} from "state-management/state/user.store";
import { AdvancedSearchModule } from "./advanced-search.module";
import { AdvancedSearchButtonComponent } from "./advanced-search-button.component";
import { AdvancedSearchService } from "./advanced-search.service";
import { AdvancedSearchDialogComponent } from "./advanced-search-dialog.component";

describe("AdvancedSearchButtonComponent", () => {
  let component: AdvancedSearchButtonComponent;
  let fixture: ComponentFixture<AdvancedSearchButtonComponent>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let advancedSearchService: jasmine.SpyObj<AdvancedSearchService>;
  let applied: jasmine.Spy;

  const config = (
    lhs: string,
    overrides: Partial<ConditionConfig> = {},
  ): ConditionConfig => ({
    condition: { lhs, relation: "GREATER_THAN", rhs: 20, unit: "" },
    ...overrides,
  });

  const render = (configs: ConditionConfig[]) => {
    TestBed.inject(MockStore).setState({
      users: {
        ...initialUserState,
        settings: {
          ...initialUserState.settings,
          fe_dataset_table_conditions: configs,
        },
      },
    });
    fixture.detectChanges();
  };

  const clickSearchButton = () =>
    fixture.nativeElement
      .querySelector("[data-cy=advanced-search-button]")
      .click();

  const find = (selector: string) =>
    fixture.nativeElement.querySelector(selector);

  const lastDialogData = () =>
    (dialog.open.calls.mostRecent().args[1] as any).data;

  beforeEach(() => {
    dialog = jasmine.createSpyObj("MatDialog", ["open"]);
    advancedSearchService = jasmine.createSpyObj("AdvancedSearchService", [
      "save",
    ]);

    TestBed.configureTestingModule({
      imports: [AdvancedSearchModule, NoopAnimationsModule],
      providers: [
        provideMockStore({ initialState: { users: initialUserState } }),
        { provide: MatDialog, useValue: dialog },
        { provide: AdvancedSearchService, useValue: advancedSearchService },
      ],
    });

    fixture = TestBed.createComponent(AdvancedSearchButtonComponent);
    component = fixture.componentInstance;
    component.scope = "dataset";
    component.keySource = () => of([]);
    applied = jasmine.createSpy("conditionsApplied");
    component.conditionsApplied.subscribe(applied);
    fixture.detectChanges();
  });

  it("should show no count without applied filters", () => {
    render([]);

    expect(find("[data-cy=condition-count]")).toBeNull();
  });

  it("should only show the icon when asked to", () => {
    render([]);
    const label = () => find("[data-cy=advanced-search-button]").textContent;
    expect(label()).toContain("Advanced search");

    component.iconOnly = true;
    fixture.detectChanges();

    expect(label()).not.toContain("Advanced search");
    expect(find("[data-cy=advanced-search-button]").classList).toContain(
      "icon-only",
    );
  });

  it("should count the filters that are applied, not the ones older settings switched off", () => {
    render([
      config("temperature"),
      config("pressure", { enabled: false }),
      config("humidity", {
        condition: {
          lhs: "humidity",
          relation: "LESS_THAN",
          rhs: "",
          unit: "",
        },
      }),
    ]);

    expect(find("[data-cy=condition-count]").textContent).toBe("1");
  });

  it("should open the dialog without the filters older settings switched off, with the ones that need a value", () => {
    dialog.open.and.returnValue({ afterClosed: () => of(undefined) } as never);
    const applied = config("temperature");
    const incomplete = config("pressure", {
      condition: {
        lhs: "pressure",
        relation: "GREATER_THAN",
        rhs: "",
        unit: "",
      },
    });
    const switchedOff = config("old_filter", { enabled: false });
    render([incomplete, applied, switchedOff]);

    clickSearchButton();

    expect(lastDialogData().configs).toEqual([incomplete, applied]);
  });

  it("should highlight the filter of a chip by its place among the ones that are shown", () => {
    dialog.open.and.returnValue({ afterClosed: () => of(undefined) } as never);
    const switchedOff = config("old_filter", { enabled: false });
    const [first, second] = [config("temperature"), config("pressure")];
    render([switchedOff, first, second]);

    component.openFilter(second);

    expect(lastDialogData().highlightIndex).toBe(1);
  });

  it("should open the dialog with the saved filters and save what was applied", () => {
    const saved = [config("temperature")];
    const result = [config("pressure")];
    dialog.open.and.returnValue({ afterClosed: () => of(result) } as never);
    render(saved);

    clickSearchButton();

    expect(dialog.open).toHaveBeenCalledWith(
      AdvancedSearchDialogComponent,
      jasmine.objectContaining({
        data: jasmine.objectContaining({
          scope: "dataset",
          configs: saved,
          keySource: component.keySource,
        }),
      }),
    );
    expect(advancedSearchService.save).toHaveBeenCalledOnceWith(
      "dataset",
      result,
    );
    expect(applied).toHaveBeenCalledTimes(1);
  });

  it("should mark the button while the dialog is open", () => {
    const closed = new Subject<ConditionConfig[] | undefined>();
    dialog.open.and.returnValue({ afterClosed: () => closed } as never);
    render([]);
    const classes = () => find("[data-cy=advanced-search-button]").classList;

    clickSearchButton();
    fixture.detectChanges();
    expect(classes()).toContain("open");

    closed.next(undefined);
    fixture.detectChanges();
    expect(classes()).not.toContain("open");
  });

  it("should not change anything when the dialog is cancelled", () => {
    dialog.open.and.returnValue({ afterClosed: () => of(undefined) } as never);
    render([config("temperature")]);

    clickSearchButton();

    expect(advancedSearchService.save).not.toHaveBeenCalled();
    expect(applied).not.toHaveBeenCalled();
  });

  describe("the mark for filters that are not applied", () => {
    const withoutValue = (lhs: string) =>
      config(lhs, {
        condition: { lhs, relation: "GREATER_THAN", rhs: "", unit: "" },
      });
    const tooltipOf = () =>
      fixture.debugElement
        .query(By.css("[data-cy=advanced-search-button]"))
        .injector.get(MatTooltip).message;

    it("should show when a saved filter has no value yet", () => {
      render([config("temperature"), withoutValue("pressure")]);

      expect(find("[data-cy=condition-waiting]")).not.toBeNull();
      expect(find("[data-cy=condition-draft]")).toBeNull();
      expect(find("[data-cy=condition-count]").textContent).toBe("1");
      expect(tooltipOf()).toContain("has no value yet");
    });

    it("should count only the filters that wait for a value", () => {
      expect(
        component.getWaiting([
          config("temperature"),
          withoutValue("pressure"),
          withoutValue("humidity"),
          config("old_filter", { enabled: false }),
        ]),
      ).toBe(2);
    });

    it("should not show for filters that are complete or switched off", () => {
      render([config("temperature"), config("old", { enabled: false })]);

      expect(find("[data-cy=condition-waiting]")).toBeNull();
      expect(find("[data-cy=condition-draft]")).toBeNull();
    });

    it("should leave the mark of edits that were not applied as it is", () => {
      render([withoutValue("pressure")]);
      component.draft.set([config("humidity")]);
      fixture.detectChanges();

      expect(find("[data-cy=condition-draft]")).not.toBeNull();
      expect(find("[data-cy=condition-waiting]")).toBeNull();
      expect(tooltipOf()).toContain("Changes are not applied yet");
    });
  });

  it("should keep edits that were not applied and bring them back", () => {
    const draft = [config("pressure")];
    dialog.open.and.callFake(((_component: unknown, options: any) => {
      options.data.draftChange(draft);
      return { afterClosed: () => of(undefined) };
    }) as never);
    render([config("temperature")]);
    expect(find("[data-cy=condition-draft]")).toBeNull();

    clickSearchButton();
    fixture.detectChanges();
    expect(find("[data-cy=condition-draft]")).not.toBeNull();

    clickSearchButton();
    expect(lastDialogData().configs).toBe(draft);
  });

  it("should forget the edits once something is applied", () => {
    component.draft.set([config("pressure")]);
    dialog.open.and.returnValue({
      afterClosed: () => of([config("humidity")]),
    } as never);
    render([]);

    clickSearchButton();

    expect(component.draft()).toBeNull();
  });

  it("should open the dialog for the filter of a chip and highlight it", () => {
    dialog.open.and.returnValue({ afterClosed: () => of(undefined) } as never);
    const [first, second] = [config("temperature"), config("pressure")];
    render([first, second]);

    component.openFilter(second);

    expect(lastDialogData().highlightIndex).toBe(1);
  });

  it("should not highlight a position when edits are shown", () => {
    dialog.open.and.returnValue({ afterClosed: () => of(undefined) } as never);
    const [first] = [config("temperature")];
    render([first]);
    component.draft.set([config("humidity")]);

    component.openFilter(first);

    expect(lastDialogData().highlightIndex).toBe(-1);
  });

  it("should remove a filter and apply the rest", () => {
    const [first, second] = [config("temperature"), config("pressure")];
    render([first, second]);

    component.removeFilter(first);

    expect(advancedSearchService.save).toHaveBeenCalledOnceWith("dataset", [
      second,
    ]);
    expect(applied).toHaveBeenCalledOnceWith([
      { lhs: "pressure", relation: "GREATER_THAN", rhs: 20, unit: "" },
    ]);
  });

  it("should leave out the saved filters that are not applied when one is removed", () => {
    const switchedOff = config("old_filter", { enabled: false });
    const [first, second] = [config("temperature"), config("pressure")];
    render([switchedOff, first, second]);

    component.removeFilter(first);

    expect(advancedSearchService.save).toHaveBeenCalledOnceWith("dataset", [
      second,
    ]);
  });

  it("should clear all filters", () => {
    render([config("temperature")]);

    component.clearFilters();

    expect(advancedSearchService.save).toHaveBeenCalledOnceWith("dataset", []);
    expect(applied).toHaveBeenCalledOnceWith([]);
  });
});
