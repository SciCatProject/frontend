import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { provideLuxonDateAdapter } from "@angular/material-luxon-adapter";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { of } from "rxjs";
import { ConditionSettingScope } from "state-management/models";
import { ConditionConfig } from "state-management/state/user.store";
import { ConditionFilterModule } from "./condition-filter.module";
import {
  ConditionFilterDialogComponent,
  ConditionFilterDialogData,
  METADATA_FIELD,
} from "./condition-filter-dialog.component";

describe("ConditionFilterDialogComponent", () => {
  let component: ConditionFilterDialogComponent;
  let fixture: ComponentFixture<ConditionFilterDialogComponent>;
  let dialogData: ConditionFilterDialogData;
  const dialogRef = jasmine.createSpyObj("MatDialogRef", ["close"]);

  const saved = (
    overrides: Partial<ConditionConfig["condition"]> = {},
  ): ConditionConfig => ({
    enabled: true,
    condition: {
      lhs: "temperature",
      relation: "EQUAL_TO_NUMERIC",
      rhs: 5,
      unit: "celsius",
      ...overrides,
    },
  });

  const savedDatasetField = (
    overrides: Partial<ConditionConfig["condition"]> = {},
  ): ConditionConfig =>
    saved({
      lhs: "keywords",
      relation: "IN",
      rhs: ["beam", "test"],
      source: "dataset",
      unit: "",
      ...overrides,
    });

  const createComponent = (
    configs: ConditionConfig[] = [],
    scope: ConditionSettingScope = "dataset",
    unitsEnabled = true,
    draftChange?: (configs: ConditionConfig[]) => void,
  ) => {
    dialogData = {
      scope,
      configs,
      keySource: () => of([]),
      unitsEnabled,
      draftChange,
    };
    fixture = TestBed.createComponent(ConditionFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const row = (index = 0) => component.rows()[index];
  const id = (index = 0) => row(index).id;
  const closedWith = () => dialogRef.close.calls.mostRecent().args[0];
  // minmax(a, b) is one column
  const tracks = () =>
    component.gridColumns.match(/minmax\([^)]+\)|\S+/g).length;
  const cells = (selector: string): HTMLElement[] =>
    Array.from(fixture.nativeElement.querySelectorAll(selector));

  /** Picks scientific metadata and a key, like the user does. */
  const setMetadata = (index: number, key: string) => {
    component.setField(id(index), METADATA_FIELD);
    component.setKey(id(index), key);
  };

  beforeEach(() => {
    dialogRef.close.calls.reset();

    TestBed.configureTestingModule({
      imports: [ConditionFilterModule, NoopAnimationsModule],
      providers: [
        provideLuxonDateAdapter(),
        { provide: MAT_DIALOG_DATA, useFactory: () => dialogData },
        { provide: MatDialogRef, useValue: dialogRef },
      ],
    });
  });

  it("should start with one empty row that does not block applying", () => {
    createComponent();

    expect(component.rows().length).toBe(1);
    expect(component.getKind(row().condition)).toBe("none");
    expect(component.canApply()).toBeTrue();
  });

  it("should show the saved conditions as editable rows", () => {
    createComponent([saved()]);

    const { condition } = row();
    expect(component.getKind(condition)).toBe("metadata");
    expect(condition.lhs).toBe("temperature");
    // equality is a single operator while editing
    expect(condition.relation).toBe("EQUAL_TO");
    expect(condition.rhs).toBe("5");
    expect(condition.unit).toBe("celsius");
  });

  it("should show the list of a dataset field as text", () => {
    createComponent([savedDatasetField()]);

    expect(row().condition.rhs).toBe("beam, test");
    expect(component.getKind(row().condition)).toBe("dataset");
  });

  describe("kinds of fields", () => {
    beforeEach(() => createComponent());

    it("should only show the field of a new row, the other cells follow its kind", () => {
      expect(cells("[data-cy=condition-key]").length).toBe(0);
      expect(cells("[data-cy=condition-operator]").length).toBe(0);
      expect(cells("[data-cy=condition-value]").length).toBe(0);
      expect(cells("[data-cy=condition-unit]").length).toBe(0);
    });

    it("should list scientific metadata with the other fields, in alphabetical order", () => {
      const labels = component.fieldOptions.map(({ label }) => label);

      expect(labels).toContain("Scientific metadata");
      expect(labels).toEqual([...labels].sort((a, b) => a.localeCompare(b)));
      expect(labels.length).toBe(component.datasetFields.length + 1);
    });

    it("should switch exclude on and off with its button", () => {
      setMetadata(0, "temperature");
      fixture.detectChanges();
      const button = cells("[data-cy=condition-exclude]")[0];

      button.click();
      fixture.detectChanges();
      expect(row().condition.exclude).toBeTrue();

      button.click();
      expect(row().condition.exclude).toBeFalse();
    });

    it("should show the key, operator, value and unit for scientific metadata", () => {
      component.setField(id(), METADATA_FIELD);
      fixture.detectChanges();

      expect(component.getKind(row().condition)).toBe("metadata");
      expect(component.getFieldValue(row().condition)).toBe(METADATA_FIELD);
      expect(cells("[data-cy=condition-key]").length).toBe(1);
      expect(cells("[data-cy=condition-operator]").length).toBe(1);
      expect(cells("[data-cy=condition-value]").length).toBe(1);
      expect(cells("[data-cy=condition-unit]").length).toBe(1);
    });

    it("should only show a value for a dataset field", () => {
      component.setField(id(), "keywords");
      fixture.detectChanges();

      expect(component.getKind(row().condition)).toBe("dataset");
      expect(component.getFieldValue(row().condition)).toBe("keywords");
      expect(cells("[data-cy=condition-value]").length).toBe(1);
      expect(cells("[data-cy=condition-key]").length).toBe(0);
      expect(cells("[data-cy=condition-operator]").length).toBe(0);
      expect(cells("[data-cy=condition-unit]").length).toBe(0);
    });

    it("should show two dates for creation time", () => {
      component.setField(id(), "creationTime");
      fixture.detectChanges();

      expect(row().condition.relation).toBe("RANGE");
      expect(row().condition.rhs).toEqual(["", ""]);
      expect(cells("[data-cy=condition-date-range]").length).toBe(1);
      expect(cells("[data-cy=condition-date-from]").length).toBe(1);
      expect(cells("[data-cy=condition-date-to]").length).toBe(1);
      expect(cells("[data-cy=condition-value]").length).toBe(0);

      component.setField(id(), "keywords");
      fixture.detectChanges();
      expect(row().condition.rhs).toBe("");
      expect(cells("[data-cy=condition-date-from]").length).toBe(0);
    });

    it("should say how to write a date and when the dates are the wrong way round", () => {
      component.setField(id(), "creationTime");
      expect(component.firstError()).toContain("yyyy-mm-dd");

      component.setBound(id(), 0, "2026-03-01");
      component.setBound(id(), 1, "2026-02-01");
      expect(component.canApply()).toBeFalse();
      expect(component.firstError()).toBe(
        "The start date is after the end date",
      );

      component.setBound(id(), 1, "2026-03-01");
      expect(component.canApply()).toBeTrue();
    });

    it("should apply creation time with one date", () => {
      component.setField(id(), "creationTime");
      expect(component.canApply()).toBeFalse();

      component.setBound(id(), 0, "2026-01-01");
      expect(component.canApply()).toBeTrue();
    });

    it("should match a dataset field by its list or text", () => {
      component.setField(id(), "keywords");
      expect(row().condition).toEqual(
        jasmine.objectContaining({
          lhs: "keywords",
          source: "dataset",
          relation: "IN",
        }),
      );

      component.setField(id(), "datasetName");
      expect(row().condition.relation).toBe("CONTAINS");
    });

    it("should let the user pick the key once scientific metadata is chosen", () => {
      component.setField(id(), METADATA_FIELD);
      expect(row().condition.lhs).toBe("");

      component.setKey(id(), "pressure");
      expect(row().condition.lhs).toBe("pressure");
      expect(row().condition.source).toBe("scientificMetadata");
    });

    it("should keep a key that has the name of a dataset field", () => {
      setMetadata(0, "keywords");

      expect(component.getKind(row().condition)).toBe("metadata");
    });

    it("should start over when the kind of field changes", () => {
      setMetadata(0, "temperature");
      component.setValue(id(), "5");
      component.setUnit(id(), "celsius");

      component.setField(id(), "keywords");
      expect(row().condition.lhs).toBe("keywords");
      expect(row().condition.rhs).toBe("");
      expect(row().condition.unit).toBe("");

      component.setValue(id(), "beam");
      component.setField(id(), METADATA_FIELD);
      expect(row().condition.lhs).toBe("");
      expect(row().condition.rhs).toBe("");
      expect(row().condition.relation).toBe("EQUAL_TO");
    });

    it("should keep the key and value when metadata is chosen again", () => {
      setMetadata(0, "temperature");
      component.setValue(id(), "5");
      component.setField(id(), METADATA_FIELD);

      expect(row().condition.lhs).toBe("temperature");
      expect(row().condition.rhs).toBe("5");
    });

    it("should keep the value when another dataset field of the same kind is picked", () => {
      component.setField(id(), "keywords");
      component.setValue(id(), "beam");
      component.setField(id(), "proposalIds");

      expect(row().condition.lhs).toBe("proposalIds");
      expect(row().condition.rhs).toBe("beam");
    });

    it("should describe how a dataset field is matched in the placeholder", () => {
      component.setField(id(), "keywords");
      expect(component.getValuePlaceholder(row().condition)).toContain(
        "separated by commas",
      );

      component.setField(id(), "datasetName");
      expect(component.getValuePlaceholder(row().condition)).toContain(
        "Contains",
      );
    });
  });

  describe("layout", () => {
    it("should have a column for every cell of a row", () => {
      createComponent();

      // join, exclude, field, key, operator, value, unit, actions
      expect(tracks()).toBe(8);
      expect(component.wideValueSpan).toBe(4);
    });

    it("should leave out the unit column without units", () => {
      createComponent([], "dataset", false);

      expect(tracks()).toBe(7);
      expect(component.wideValueSpan).toBe(3);
    });

    it("should only have the cells of metadata for samples", () => {
      createComponent([], "sample");

      // key, operator, value, unit, actions
      expect(tracks()).toBe(5);
    });
  });

  describe("samples", () => {
    beforeEach(() => createComponent([], "sample"));

    it("should only offer metadata keys, without joins and exclude", () => {
      expect(component.advanced).toBeFalse();
      expect(component.datasetFields).toEqual([]);
      expect(cells("[data-cy=condition-field]").length).toBe(0);
      expect(cells("[data-cy=condition-include]").length).toBe(0);
      expect(cells("[data-cy=condition-key]").length).toBe(1);
    });

    it("should always be about metadata", () => {
      expect(component.getKind(row().condition)).toBe("metadata");
    });

    it("should not allow the same key twice, the conditions would be merged", () => {
      component.setKey(id(), "temperature");
      component.setValue(id(), "5");
      component.addRow();
      component.setKey(id(1), "temperature");
      component.setValue(id(1), "6");

      expect(component.errors().get(id(1))?.key).toBeDefined();
      expect(component.canApply()).toBeFalse();
    });
  });

  describe("groups", () => {
    const mk = (lhs: string, join?: "OR" | "AND"): ConditionConfig => ({
      enabled: true,
      condition: {
        lhs,
        relation: "EQUAL_TO_NUMERIC",
        rhs: 1,
        unit: "",
        ...(join && { join }),
      },
    });

    it("should give every group a box and divide the groups with OR", () => {
      createComponent([mk("a"), mk("b", "OR"), mk("c", "AND"), mk("d", "AND")]);

      const boxes = cells("[data-cy=condition-row-group]");

      expect(component.groups().map((group) => group.length)).toEqual([1, 3]);
      expect(boxes.length).toBe(2);
      // a filter on its own has its box too, so the add icon belongs to it
      expect(boxes[0].classList).toContain("boxed");
      expect(boxes[1].classList).toContain("boxed");
      expect(cells("[data-cy=condition-or-divider]").length).toBe(1);
      expect(cells("[data-cy=condition-row]").length).toBe(4);
    });

    const fakeDrop = (
      fromGroup: number,
      previousIndex: number,
      toGroup: number,
      currentIndex: number,
    ) =>
      ({
        previousContainer: { data: fromGroup },
        container: { data: toGroup },
        previousIndex,
        currentIndex,
      }) as unknown as CdkDragDrop<number>;

    const lhsOrder = () =>
      component.rows().map(({ condition }) => condition.lhs);
    const joins = () => component.rows().map(({ condition }) => condition.join);

    it("should add a filter to a group, joined by AND", () => {
      createComponent([mk("a"), mk("b", "OR")]);

      component.addRowToGroup(0);

      expect(component.groups().map((group) => group.length)).toEqual([2, 1]);
      expect(lhsOrder()).toEqual(["a", "", "b"]);
      expect(joins()).toEqual([undefined, "AND", "OR"]);
    });

    it("should only offer Add AND in a group where every filter has a field", () => {
      createComponent();
      fixture.detectChanges();
      expect(cells("[data-cy=condition-add-and]").length).toBe(0);

      component.setField(id(), "keywords");
      fixture.detectChanges();

      expect(cells("[data-cy=condition-add-and]").length).toBe(1);
    });

    it("should start a new group with Add filter, joined by OR", () => {
      createComponent([mk("a"), mk("b", "AND")]);

      component.addRow();

      expect(component.groups().map((group) => group.length)).toEqual([2, 1]);
      expect(joins()).toEqual([undefined, "AND", "OR"]);
    });

    it("should not join the rows of samples", () => {
      createComponent([mk("a")], "sample");

      component.addRow();

      expect(joins()).toEqual([undefined, undefined]);
    });

    it("should name the bottom button Add filter, it starts a new group", () => {
      createComponent([mk("a")]);

      expect(cells("[data-cy=condition-add]")[0].textContent).toContain(
        "Add filter",
      );
    });

    it("should show a new filter and put the cursor in it", fakeAsync(() => {
      createComponent([mk("a")]);
      const added = jasmine.createSpy("scrollIntoView");
      Element.prototype.scrollIntoView = added;

      component.addRow();
      fixture.detectChanges();
      tick();

      const [, second] = cells("[data-cy=condition-row]");
      expect(added).toHaveBeenCalled();
      expect(second.getAttribute("data-row-id")).toBe(String(id(1)));
    }));

    it("should move a filter to another group", () => {
      createComponent([mk("a"), mk("b", "AND"), mk("c", "OR")]);

      // b leaves the first group and is put in front of c
      component.drop(fakeDrop(0, 1, 1, 0));

      expect(lhsOrder()).toEqual(["a", "b", "c"]);
      expect(component.groups().map((group) => group.length)).toEqual([1, 2]);
      expect(joins()).toEqual([undefined, "OR", "AND"]);
    });

    it("should remove a group that is left empty", () => {
      createComponent([mk("a"), mk("b", "OR")]);

      component.drop(fakeDrop(1, 0, 0, 1));
      fixture.detectChanges();

      expect(component.groups().length).toBe(1);
      expect(joins()).toEqual([undefined, "AND"]);
      expect(cells("[data-cy=condition-or-divider]").length).toBe(0);
    });

    it("should move a filter within its group", () => {
      createComponent([mk("a"), mk("b", "AND"), mk("c", "OR")]);

      component.drop(fakeDrop(0, 0, 0, 1));

      expect(lhsOrder()).toEqual(["b", "a", "c"]);
      expect(joins()).toEqual([undefined, "AND", "OR"]);
    });

    it("should offer a drag handle for each filter and an AND icon for each group", () => {
      createComponent([mk("a"), mk("b", "OR")]);
      fixture.detectChanges();
      expect(cells("[data-cy=condition-drag-handle]").length).toBe(2);
      expect(cells("[data-cy=condition-add-and]").length).toBe(2);
      expect(cells("[data-cy=condition-add]").length).toBe(1);
    });

    it("should not box the rows of samples", () => {
      createComponent([mk("a"), mk("b")], "sample");

      expect(cells("[data-cy=condition-row-group]")[0].classList).not.toContain(
        "boxed",
      );
    });
  });

  describe("validation", () => {
    beforeEach(() => createComponent());

    it("should not apply a condition without a value", () => {
      setMetadata(0, "temperature");

      expect(component.canApply()).toBeFalse();
      expect(component.errors().get(id())?.value).toBeDefined();

      component.setValue(id(), "5");
      expect(component.canApply()).toBeTrue();
    });

    it("should explain what is missing when applying fails", () => {
      component.setField(id(), "keywords");
      fixture.detectChanges();
      expect(cells("[data-cy=condition-apply-hint]").length).toBe(0);
      expect(cells("[data-cy=condition-error]").length).toBe(0);

      component.apply();
      fixture.detectChanges();

      expect(dialogRef.close).not.toHaveBeenCalled();
      expect(cells("[data-cy=condition-apply-hint]").length).toBe(1);
      expect(cells("[data-cy=condition-error]").length).toBe(1);

      component.setValue(id(), "beam");
      fixture.detectChanges();
      expect(cells("[data-cy=condition-apply-hint]").length).toBe(0);
    });

    it("should not apply a dataset field without a value", () => {
      component.setField(id(), "keywords");
      expect(component.canApply()).toBeFalse();

      component.setValue(id(), " , ");
      expect(component.canApply()).toBeFalse();

      component.setValue(id(), "beam");
      expect(component.canApply()).toBeTrue();
    });

    it("should not apply a value without a key", () => {
      component.setField(id(), METADATA_FIELD);
      component.setValue(id(), "5");

      expect(component.errors().get(id())?.key).toBeDefined();
      expect(component.canApply()).toBeFalse();
    });

    it("should not apply scientific metadata without a key", () => {
      component.setField(id(), METADATA_FIELD);
      fixture.detectChanges();

      expect(component.canApply()).toBeFalse();
      expect(cells("[data-cy=condition-error]").length).toBe(0);

      component.apply();
      fixture.detectChanges();

      expect(dialogRef.close).not.toHaveBeenCalled();
      expect(cells("[data-cy=condition-error]").length).toBe(1);
    });

    it("should not complain about a row with no field chosen", () => {
      expect(component.canApply()).toBeTrue();
    });

    it("should allow the same key twice, both conditions are kept", () => {
      setMetadata(0, "temperature");
      component.setValue(id(), "5");
      component.setRelation(id(), "GREATER_THAN");
      component.addRow();
      setMetadata(1, "temperature");
      component.setValue(id(1), "9");
      component.setRelation(id(1), "LESS_THAN");

      expect(component.canApply()).toBeTrue();
    });

    it("should let users switch off a condition instead of giving it a value", () => {
      setMetadata(0, "temperature");
      component.setEnabled(id(), false);

      expect(component.canApply()).toBeTrue();
    });

    it("should accept a range with only one bound", () => {
      setMetadata(0, "temperature");
      component.setRelation(id(), "RANGE");
      expect(component.canApply()).toBeFalse();

      component.setBound(id(), 1, "9");
      expect(component.canApply()).toBeTrue();
    });
  });

  describe("editing", () => {
    beforeEach(() => createComponent());

    it("should reset the value when switching to and from a range", () => {
      setMetadata(0, "temperature");
      component.setValue(id(), "5");
      component.setRelation(id(), "RANGE");
      expect(row().condition.rhs).toEqual(["", ""]);

      component.setRelation(id(), "LESS_THAN");
      expect(row().condition.rhs).toBe("");
    });

    it("should show no rows and a message when the last one is removed", () => {
      setMetadata(0, "temperature");
      component.removeRow(id());
      fixture.detectChanges();

      expect(component.rows().length).toBe(0);
      expect(cells("[data-cy=condition-row]").length).toBe(0);
      expect(cells("[data-cy=condition-empty]").length).toBe(1);
    });

    it("should mark a condition that is switched off", () => {
      setMetadata(0, "temperature");
      expect(cells("[data-cy=condition-off]").length).toBe(0);

      component.setEnabled(id(), false);
      fixture.detectChanges();

      expect(cells("[data-cy=condition-off]").length).toBe(1);
    });

    it("should clear all filters at once and close", () => {
      setMetadata(0, "temperature");
      component.addRow();
      component.clearAll();

      expect(dialogRef.close).toHaveBeenCalledOnceWith([]);
    });

    it("should only show a value error after the user left the value", () => {
      setMetadata(0, "temperature");
      fixture.detectChanges();
      expect(cells("[data-cy=condition-error]").length).toBe(0);

      component.markTouched(id());
      fixture.detectChanges();
      expect(cells("[data-cy=condition-error]").length).toBe(1);
    });
  });

  describe("keeping edits", () => {
    it("should tell the host about edits but not about the rows it opened with", () => {
      const draftChange = jasmine.createSpy("draftChange");
      createComponent([], "dataset", true, draftChange);
      expect(draftChange).not.toHaveBeenCalled();

      setMetadata(0, "temperature");
      fixture.detectChanges();

      expect(draftChange).toHaveBeenCalled();
      const [configs] = draftChange.calls.mostRecent().args;
      expect(configs[0].condition.lhs).toBe("temperature");
    });
  });

  describe("applying", () => {
    it("should close with the normalized conditions and without empty rows", () => {
      createComponent();
      setMetadata(0, "temperature");
      component.setValue(id(), "5");
      component.setUnit(id(), "celsius");
      component.addRow();

      component.apply();

      expect(dialogRef.close).toHaveBeenCalledOnceWith([saved()]);
    });

    it("should keep the switched off state", () => {
      createComponent([saved()]);
      component.setEnabled(id(), false);

      component.apply();

      expect(dialogRef.close).toHaveBeenCalledWith([
        { ...saved(), enabled: false },
      ]);
    });

    it("should close with an empty list when everything was cleared", () => {
      createComponent([saved()]);
      component.removeRow(id());

      component.apply();

      expect(dialogRef.close).toHaveBeenCalledOnceWith([]);
    });

    it("should convert the bounds of a range", () => {
      createComponent();
      setMetadata(0, "temperature");
      component.setRelation(id(), "RANGE");
      component.setBound(id(), 1, "9");

      component.apply();

      expect(closedWith()[0].condition.rhs).toEqual([undefined, 9]);
    });

    it("should close with the values of a dataset field as a list", () => {
      createComponent();
      component.setField(id(), "keywords");
      component.setValue(id(), "beam, test");

      component.apply();

      expect(closedWith()[0].condition).toEqual({
        lhs: "keywords",
        relation: "IN",
        rhs: ["beam", "test"],
        unit: "",
        source: "dataset",
      });
    });

    it("should close with exclude and the join of a new group", () => {
      createComponent();
      setMetadata(0, "temperature");
      component.setValue(id(), "5");
      component.addRow();
      setMetadata(1, "pressure");
      component.setValue(id(1), "2");
      component.setExclude(id(1), true);

      component.apply();

      const [first, second] = closedWith();
      expect("join" in first.condition).toBeFalse();
      expect("exclude" in first.condition).toBeFalse();
      expect(second.condition).toEqual(
        jasmine.objectContaining({ join: "OR", exclude: true }),
      );
    });
  });
});
