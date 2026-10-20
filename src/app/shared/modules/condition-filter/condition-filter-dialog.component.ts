import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  computed,
  effect,
  signal,
} from "@angular/core";
import { CdkDragDrop } from "@angular/cdk/drag-drop";
import { DateTime } from "luxon";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {
  ConditionSettingScope,
  FilterCondition,
} from "state-management/models";
import { ConditionConfig } from "state-management/state/user.store";
import { UnitsService } from "shared/services/units.service";
import {
  DATASET_FIELDS,
  METADATA_FIELD,
  getDatasetField,
  getFieldOptions,
} from "./condition-filter.fields";
import { ConditionKeySource } from "./condition-filter.keys";
import {
  RELATION_OPTIONS,
  describeCondition,
  getRelationOption,
  groupByJoin,
  isConditionComplete,
  isDatasetCondition,
  normalizeCondition,
} from "./condition-filter.utils";

export interface ConditionFilterDialogData {
  scope: ConditionSettingScope;
  configs: ConditionConfig[];
  /** Loads the scientific metadata keys, page by page. */
  keySource: ConditionKeySource;
  unitsEnabled: boolean;
  /** The filter to draw attention to, e.g. the one whose chip was clicked. */
  highlightIndex?: number;
  /** Tells the host about the edits, so they are kept when the dialog is closed without applying. */
  draftChange?: (configs: ConditionConfig[]) => void;
}

export { METADATA_FIELD };

/** What a row filters on: nothing yet, a dataset field or scientific metadata. */
export type RowKind = "none" | "dataset" | "metadata";

/** A condition being edited, `id` keeps the row stable while its field changes. */
interface Row extends ConditionConfig {
  id: number;
}

interface RowError {
  key?: string;
  /** Only shown once the user tried to apply. */
  quiet?: boolean;
  value?: string;
}

/** Rows are edited as a draft with plain strings, `normalizeCondition` converts them on apply. */
const toDraft = ({ condition, enabled }: ConditionConfig): ConditionConfig => {
  if (isDatasetCondition(condition)) {
    if (condition.relation === "RANGE") {
      const [from, to] = Array.isArray(condition.rhs) ? condition.rhs : [];
      return {
        enabled,
        condition: {
          ...condition,
          rhs: [String(from ?? ""), String(to ?? "")],
        },
      };
    }

    const rhs = Array.isArray(condition.rhs)
      ? condition.rhs.join(", ")
      : String(condition.rhs ?? "");
    return { enabled, condition: { ...condition, rhs } };
  }

  const rhs = Array.isArray(condition.rhs)
    ? condition.rhs.map((bound) => String(bound ?? ""))
    : String(condition.rhs ?? "");
  return {
    enabled,
    condition: {
      ...condition,
      relation: getRelationOption(condition.relation).value,
      rhs:
        condition.relation === "RANGE" && !Array.isArray(rhs) ? ["", ""] : rhs,
    },
  };
};

/** Said when a date is not a date, the picker keeps what was typed. */
const DATE_HELP = "Enter dates as yyyy-mm-dd, e.g. 2026-01-31";

/** How long the filter that was clicked stays highlighted. */
const HIGHLIGHT_MS = 2500;

/** Days only, the default format of the app also shows the time. */
const DATE_FORMATS = {
  parse: { dateInput: "yyyy-MM-dd" },
  display: {
    dateInput: "yyyy-MM-dd",
    monthYearLabel: "LLL yyyy",
    dateA11yLabel: "DD",
    monthYearA11yLabel: "LLLL yyyy",
  },
};

const blankDraft = (): ConditionConfig => ({
  enabled: true,
  condition: { lhs: "", relation: "EQUAL_TO", rhs: "", unit: "" },
});

/** The rows of the groups: the first filter of a group is joined by OR, the others by AND. */
const toRows = (groups: Row[][]): Row[] =>
  groups
    .filter((group) => group.length)
    .flatMap((group, groupIndex) =>
      group.map((row, index) => {
        const first = index === 0;
        const join =
          groupIndex === 0 && first ? undefined : first ? "OR" : "AND";
        return { ...row, condition: { ...row.condition, join } };
      }),
    );

@Component({
  selector: "condition-filter-dialog",
  templateUrl: "./condition-filter-dialog.component.html",
  styleUrls: ["./condition-filter-dialog.component.scss"],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }],
  standalone: false,
})
export class ConditionFilterDialogComponent implements AfterViewInit {
  private nextId = 0;
  // the picker resets what was typed when it gets a new date object, so the same text gives the same object
  private readonly dates = new Map<string, DateTime>();

  readonly keySource = this.data.keySource;
  /** Datasets can combine conditions and use dataset fields, samples can't. */
  readonly advanced = this.data.scope === "dataset";
  readonly relationOptions = RELATION_OPTIONS;
  readonly unitsEnabled = this.data.unitsEnabled;
  readonly datasetFields = this.advanced ? DATASET_FIELDS : [];
  /** Scientific metadata is one of the fields, it only asks for more once chosen. */
  readonly fieldOptions = getFieldOptions(this.datasetFields);
  /** One click starts a new row, the field dropdown has all other fields. */
  /** The columns of a row: only the cells in the middle differ per kind of field. */
  readonly gridColumns = [
    this.advanced && "72px", // AND / OR
    this.advanced && "84px", // exclude
    this.advanced && "170px", // field
    "minmax(150px, 1.4fr)", // key
    "minmax(120px, 1fr)", // operator
    "minmax(110px, 1.1fr)", // value
    this.unitsEnabled && "minmax(120px, 1fr)", // unit
    "64px", // use, remove
  ]
    .filter(Boolean)
    .join(" ");
  /** A dataset field only has a value, it takes the place of the key, operator and unit. */
  readonly wideValueSpan = this.unitsEnabled ? 4 : 3;
  readonly rows = signal<Row[]>(this.createRows(this.data.configs));
  // value errors are only shown once the user left the value, not while typing
  readonly touched = signal<ReadonlySet<number>>(new Set());
  /** Draws attention to a row for a moment. */
  readonly highlightId = signal<number | null>(null);

  /** The rows as they are evaluated: AND inside a group, OR between groups. */
  readonly groups = computed(() =>
    groupByJoin(this.rows(), ({ condition }) => condition.join),
  );

  readonly dropListIds = computed(() =>
    this.groups().map((_, index) => `condition-group-${index}`),
  );

  readonly errors = computed(() => {
    const rows = this.rows();
    const errors = new Map<number, RowError>();

    for (const { id, enabled, condition } of rows) {
      const hasKey = !!condition.lhs.trim();
      const isBlank = !hasKey && !this.hasValue(condition);
      // a row with nothing chosen yet is left out, scientific metadata needs its key
      if (isBlank && (!this.advanced || this.getKind(condition) === "none")) {
        continue;
      }

      if (!hasKey) {
        errors.set(id, { key: "Choose a key", quiet: isBlank });
      } else if (
        !this.advanced &&
        rows.some(
          (other) => other.id !== id && other.condition.lhs === condition.lhs,
        )
      ) {
        // samples merge the conditions of one key, datasets keep both
        errors.set(id, { key: "Key already used" });
      } else if (enabled && !isConditionComplete(condition)) {
        errors.set(id, {
          value:
            isDatasetCondition(condition) && condition.relation === "RANGE"
              ? DATE_HELP
              : "Enter a value",
        });
      } else if (enabled && this.isReversed(condition)) {
        errors.set(id, { value: "The start date is after the end date" });
      }
    }
    return errors;
  });

  readonly canApply = computed(() => this.errors().size === 0);
  /** What is wrong with the first row, for the message next to Apply. */
  readonly firstError = computed(() => {
    const [error] = this.errors().values();
    return error?.key ?? error?.value ?? "";
  });
  /** Set once the user tried to apply with something missing. */
  readonly attempted = signal(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConditionFilterDialogData,
    private dialogRef: MatDialogRef<ConditionFilterDialogComponent>,
    private unitsService: UnitsService,
    private host: ElementRef<HTMLElement>,
  ) {
    const target = this.rows()[this.data.highlightIndex ?? -1];
    if (target) {
      this.highlightId.set(target.id);
      setTimeout(() => this.highlightId.set(null), HIGHLIGHT_MS);
    }
    let first = true;
    effect(() => {
      const rows = this.rows();
      // the rows the dialog opened with are not an edit
      if (first) {
        first = false;
        return;
      }
      this.data.draftChange?.(
        rows.map(({ enabled, condition }) => ({ enabled, condition })),
      );
    });
  }

  /** Shows every error and takes the user to the first one. */
  private showErrors(): void {
    this.attempted.set(true);
    this.touched.set(new Set(this.rows().map(({ id }) => id)));

    setTimeout(() => {
      const field = this.host.nativeElement
        .querySelector(".error-icon")
        ?.closest("mat-form-field");
      field?.scrollIntoView({ block: "nearest" });
      field?.querySelector("input")?.focus();
    });
  }

  private isReversed({ rhs, relation, source }: FilterCondition): boolean {
    if (source !== "dataset" || relation !== "RANGE" || !Array.isArray(rhs)) {
      return false;
    }
    const [from, to] = rhs;
    return !!from && !!to && String(from) > String(to);
  }

  private hasValue({ rhs }: FilterCondition): boolean {
    return Array.isArray(rhs) ? rhs.some((bound) => !!bound) : !!rhs;
  }

  /** Shows a new row and puts the cursor in it, so there is no need to scroll to it. */
  private revealRow(id: number): void {
    setTimeout(() => {
      const row = this.host.nativeElement.querySelector(
        `[data-row-id="${id}"]`,
      );
      row?.scrollIntoView({ block: "nearest" });
      row
        ?.querySelector<HTMLElement>(
          "[data-cy=condition-field], [data-cy=condition-key]",
        )
        ?.focus();
    });
  }

  private setGroups(groups: Row[][]): void {
    this.rows.set(toRows(groups));
  }

  private createRows(configs: ConditionConfig[]): Row[] {
    const drafts = configs.length ? configs.map(toDraft) : [blankDraft()];
    return drafts.map((draft) => this.createRow(draft));
  }

  private createRow(draft: ConditionConfig): Row {
    return { ...draft, id: this.nextId++ };
  }

  /** Switching to another kind of field starts the value over. */
  private withField(
    condition: FilterCondition,
    field: string,
  ): FilterCondition {
    const datasetField = getDatasetField(field);

    if (datasetField) {
      const sameKind =
        isDatasetCondition(condition) &&
        condition.relation === datasetField.relation;
      return {
        ...condition,
        lhs: field,
        source: "dataset",
        relation: datasetField.relation,
        rhs: sameKind
          ? condition.rhs
          : datasetField.relation === "RANGE"
            ? ["", ""]
            : "",
        unit: "",
      };
    }

    return isDatasetCondition(condition)
      ? {
          ...condition,
          lhs: "",
          source: "scientificMetadata",
          relation: "EQUAL_TO",
          rhs: "",
          unit: "",
        }
      : { ...condition, source: "scientificMetadata" };
  }

  private patchCondition(
    id: number,
    change: (condition: FilterCondition) => FilterCondition,
  ): void {
    this.patch(id, (row) => ({ ...row, condition: change(row.condition) }));
  }

  private patch(id: number, change: (row: Row) => Row): void {
    this.rows.update((rows) =>
      rows.map((row) => (row.id === id ? change(row) : row)),
    );
  }

  ngAfterViewInit(): void {
    this.host.nativeElement
      .querySelector(".highlight")
      ?.scrollIntoView({ block: "nearest" });
  }

  getKind(condition: FilterCondition): RowKind {
    if (!this.advanced) return "metadata";
    if (isDatasetCondition(condition)) return "dataset";
    return condition.source === "scientificMetadata" || condition.lhs
      ? "metadata"
      : "none";
  }

  /** What the field dropdown shows: a dataset field or scientific metadata. */
  getFieldValue(condition: FilterCondition): string {
    switch (this.getKind(condition)) {
      case "dataset":
        return condition.lhs;
      case "metadata":
        return METADATA_FIELD;
      default:
        return "";
    }
  }

  /** A dataset field has no operator, the placeholder tells how it matches. */
  getValuePlaceholder(condition: FilterCondition): string {
    return condition.relation === "IN"
      ? "Any of these values, separated by commas"
      : "Contains this text";
  }

  getUnits(condition: FilterCondition): string[] {
    return condition.unitsOptions?.length
      ? condition.unitsOptions
      : this.unitsService.getUnits(condition.lhs);
  }

  /** Starts a new group, OR joins it to the ones above. */
  addRow(): void {
    const row = this.createRow(blankDraft());

    if (this.advanced) {
      this.setGroups([...this.groups(), [row]]);
    } else {
      this.rows.update((rows) => [...rows, row]);
    }
    this.revealRow(row.id);
  }

  /** A group that still has a row without a field has nothing to add AND to. */
  canAddAnd(group: Row[]): boolean {
    return group.every(({ condition }) => this.getKind(condition) !== "none");
  }

  /** Adds a filter to a group, AND joins it to the one before. */
  addRowToGroup(groupIndex: number): void {
    const row = this.createRow(blankDraft());
    const groups = this.groups().map((group) => [...group]);
    groups[groupIndex].push(row);
    this.setGroups(groups);
    this.revealRow(row.id);
  }

  /** Moves a filter into a group, or to another place in its own group. */
  drop(event: CdkDragDrop<number>): void {
    const groups = this.groups().map((group) => [...group]);
    const [moved] = groups[event.previousContainer.data].splice(
      event.previousIndex,
      1,
    );
    groups[event.container.data].splice(event.currentIndex, 0, moved);
    this.setGroups(groups);
  }

  /** What the dragged filter shows while it is moved. */
  previewText(condition: FilterCondition): string {
    return condition.lhs ? describeCondition(condition) : "New filter";
  }

  removeRow(id: number): void {
    this.rows.update((rows) => rows.filter((row) => row.id !== id));
  }

  /** Clearing removes the filters at once, there is nothing left to apply. */
  clearAll(): void {
    this.dialogRef.close([]);
  }

  markTouched(id: number): void {
    this.touched.update((touched) => new Set(touched).add(id));
  }

  setEnabled(id: number, enabled: boolean): void {
    this.patch(id, (row) => ({ ...row, enabled }));
  }

  setExclude(id: number, exclude: boolean): void {
    this.patchCondition(id, (condition) => ({ ...condition, exclude }));
  }

  /** The user chose a dataset field, or scientific metadata to pick a key for. */
  setField(id: number, field: string): void {
    this.patchCondition(id, (condition) => this.withField(condition, field));
  }

  setKey(id: number, lhs: string): void {
    this.patchCondition(id, (condition) => ({ ...condition, lhs }));
  }

  setRelation(id: number, relation: FilterCondition["relation"]): void {
    this.patchCondition(id, (condition) => {
      const wasRange = condition.relation === "RANGE";
      const isRange = relation === "RANGE";
      return {
        ...condition,
        relation,
        rhs: isRange ? ["", ""] : wasRange ? "" : condition.rhs,
      };
    });
  }

  setValue(id: number, rhs: string): void {
    this.patchCondition(id, (condition) => ({ ...condition, rhs }));
  }

  /** The date the date picker shows for a saved `2026-01-31`. */
  toDate(value: string | undefined): DateTime | null {
    if (!value) return null;
    if (!this.dates.has(value)) this.dates.set(value, DateTime.fromISO(value));
    return this.dates.get(value);
  }

  setDate(id: number, index: 0 | 1, date: DateTime | null): void {
    this.setBound(id, index, date?.toISODate() ?? "");
  }

  setBound(id: number, index: 0 | 1, value: string): void {
    this.patchCondition(id, (condition) => {
      const bounds = Array.isArray(condition.rhs)
        ? [...condition.rhs]
        : ["", ""];
      bounds[index] = value;
      return { ...condition, rhs: bounds };
    });
  }

  setUnit(id: number, unit: string): void {
    this.patchCondition(id, (condition) => ({ ...condition, unit }));
  }

  apply(): void {
    if (!this.canApply()) {
      this.showErrors();
      return;
    }

    this.dialogRef.close(
      this.rows()
        .filter(({ condition }) => condition.lhs.trim())
        .map(({ enabled, condition }) => ({
          enabled,
          condition: isConditionComplete(condition)
            ? normalizeCondition(condition)
            : condition,
        })),
    );
  }
}
