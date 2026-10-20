import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MatDialog } from "@angular/material/dialog";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { Subject, of } from "rxjs";
import {
  ConditionConfig,
  initialUserState,
} from "state-management/state/user.store";
import { ConditionFilterModule } from "./condition-filter.module";
import { ConditionFilterButtonComponent } from "./condition-filter-button.component";
import { ConditionFilterService } from "./condition-filter.service";
import { ConditionFilterDialogComponent } from "./condition-filter-dialog.component";

describe("ConditionFilterButtonComponent", () => {
  let component: ConditionFilterButtonComponent;
  let fixture: ComponentFixture<ConditionFilterButtonComponent>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let conditionFilterService: jasmine.SpyObj<ConditionFilterService>;
  let applied: jasmine.Spy;

  const config = (
    lhs: string,
    overrides: Partial<ConditionConfig> = {},
  ): ConditionConfig => ({
    enabled: true,
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
    conditionFilterService = jasmine.createSpyObj("ConditionFilterService", [
      "save",
    ]);

    TestBed.configureTestingModule({
      imports: [ConditionFilterModule, NoopAnimationsModule],
      providers: [
        provideMockStore({ initialState: { users: initialUserState } }),
        { provide: MatDialog, useValue: dialog },
        { provide: ConditionFilterService, useValue: conditionFilterService },
      ],
    });

    fixture = TestBed.createComponent(ConditionFilterButtonComponent);
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

  it("should count the filters that are applied", () => {
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

  it("should open the dialog with the saved filters and save what was applied", () => {
    const saved = [config("temperature")];
    const result = [config("pressure")];
    dialog.open.and.returnValue({ afterClosed: () => of(result) } as never);
    render(saved);

    clickSearchButton();

    expect(dialog.open).toHaveBeenCalledWith(
      ConditionFilterDialogComponent,
      jasmine.objectContaining({
        data: jasmine.objectContaining({
          scope: "dataset",
          configs: saved,
          keySource: component.keySource,
        }),
      }),
    );
    expect(conditionFilterService.save).toHaveBeenCalledOnceWith(
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

    expect(conditionFilterService.save).not.toHaveBeenCalled();
    expect(applied).not.toHaveBeenCalled();
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

    expect(conditionFilterService.save).toHaveBeenCalledOnceWith("dataset", [
      second,
    ]);
    expect(applied).toHaveBeenCalledOnceWith([
      { lhs: "pressure", relation: "GREATER_THAN", rhs: 20, unit: "" },
    ]);
  });

  it("should clear all filters", () => {
    render([config("temperature")]);

    component.clearFilters();

    expect(conditionFilterService.save).toHaveBeenCalledOnceWith("dataset", []);
    expect(applied).toHaveBeenCalledOnceWith([]);
  });
});
