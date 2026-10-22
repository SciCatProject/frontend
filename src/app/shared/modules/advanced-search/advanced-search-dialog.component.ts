import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  computed,
  effect,
  signal,
} from "@angular/core";
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
  FIELD_GUIDE,
  FIELD_TYPES,
  FieldOption,
  METADATA_FIELD,
  getDatasetField,
  getFieldOptions,
} from "./advanced-search.fields";
import { ConditionKeySource } from "./advanced-search.keys";
import {
  RELATION_OPTIONS,
  getRelationOption,
  isConditionComplete,
  isDatasetCondition,
  normalizeCondition,
} from "./advanced-search.utils";

export interface AdvancedSearchDialogData {
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

/** What a row filters on: a dataset field or scientific metadata. */
export type RowKind = "dataset" | "metadata";

/** A condition being edited, `id` keeps the row stable while its field changes. */
interface Row extends ConditionConfig {
  id: number;
}

interface RowError {
  key?: string;
  value?: string;
}

/** Rows are edited as a draft with plain strings, `normalizeCondition` converts them on apply. */
const toDraft = ({ condition }: ConditionConfig): ConditionConfig => {
  if (isDatasetCondition(condition)) {
    if (condition.relation === "RANGE") {
      const [from, to] = Array.isArray(condition.rhs) ? condition.rhs : [];
      return {
        condition: {
          ...condition,
          rhs: [String(from ?? ""), String(to ?? "")],
        },
      };
    }

    const rhs = Array.isArray(condition.rhs)
      ? condition.rhs.join(", ")
      : String(condition.rhs ?? "");
    return { condition: { ...condition, rhs } };
  }

  const rhs = Array.isArray(condition.rhs)
    ? condition.rhs.map((bound) => String(bound ?? ""))
    : String(condition.rhs ?? "");
  return {
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

/** The width of the dialog, narrower windows get 95% of their width. */
export const DIALOG_WIDTH = "1200px";

/** A new filter is about scientific metadata, the field dropdown has the other fields. */
const blankDraft = (): ConditionConfig => ({
  condition: {
    lhs: "",
    relation: "EQUAL_TO",
    rhs: "",
    unit: "",
    source: "scientificMetadata",
  },
});

@Component({
  selector: "advanced-search-dialog",
  templateUrl: "./advanced-search-dialog.component.html",
  styleUrls: ["./advanced-search-dialog.component.scss"],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: DATE_FORMATS }],
  standalone: false,
})
export class AdvancedSearchDialogComponent implements AfterViewInit {
  private nextId = 0;
  // the picker resets what was typed when it gets a new date object, so the same text gives the same object
  private readonly dates = new Map<string, DateTime>();

  readonly keySource = this.data.keySource;
  /** Datasets can use dataset fields and NOT, samples can't. */
  readonly advanced = this.data.scope === "dataset";
  readonly relationOptions = RELATION_OPTIONS;
  readonly fieldTypes = FIELD_TYPES;
  readonly fieldGuide = FIELD_GUIDE;
  readonly unitsEnabled = this.data.unitsEnabled;
  readonly datasetFields = this.advanced ? DATASET_FIELDS : [];
  /** Scientific metadata is one of the fields, it only asks for more once chosen. */
  readonly fieldOptions = getFieldOptions(this.datasetFields);
  /** One click starts a new row, the field dropdown has all other fields. */
  readonly rows = signal<Row[]>(this.createRows(this.data.configs));
  // value errors are only shown once the user left the value, not while typing
  readonly touched = signal<ReadonlySet<number>>(new Set());
  /** Draws attention to a row for a moment. */
  readonly highlightId = signal<number | null>(null);

  readonly errors = computed(() => {
    const rows = this.rows();
    const errors = new Map<number, RowError>();

    for (const { id, condition } of rows) {
      const hasKey = !!condition.lhs.trim();
      const isBlank = !hasKey && !this.hasValue(condition);
      // a row that is still empty is left out
      if (isBlank) continue;

      if (!hasKey) {
        errors.set(id, { key: "Choose a key" });
      } else if (
        !this.advanced &&
        rows.some(
          (other) => other.id !== id && other.condition.lhs === condition.lhs,
        )
      ) {
        // samples merge the conditions of one key, datasets keep both
        errors.set(id, { key: "Key already used" });
      } else if (!isConditionComplete(condition)) {
        errors.set(id, {
          value:
            isDatasetCondition(condition) && condition.relation === "RANGE"
              ? DATE_HELP
              : "Enter a value",
        });
      } else if (this.isReversed(condition)) {
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
    @Inject(MAT_DIALOG_DATA) public data: AdvancedSearchDialogData,
    private dialogRef: MatDialogRef<AdvancedSearchDialogComponent>,
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
      this.data.draftChange?.(rows.map(({ condition }) => ({ condition })));
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
    return isDatasetCondition(condition) ? "dataset" : "metadata";
  }

  /** What the field dropdown shows: a dataset field or scientific metadata. */
  getFieldValue(condition: FilterCondition): string {
    return this.getKind(condition) === "dataset"
      ? condition.lhs
      : METADATA_FIELD;
  }

  /** The entry of the field dropdown a row shows. */
  getFieldOption(condition: FilterCondition): FieldOption | undefined {
    const value = this.getFieldValue(condition);
    return this.fieldOptions.find((option) => option.value === value);
  }

  /** A dataset field has one way of matching, shown where the operator would be. */
  getOperatorText({ relation }: FilterCondition): string {
    switch (relation) {
      case "RANGE":
        return "Between";
      case "IN":
        return "Any of";
      default:
        return "Contains";
    }
  }

  /** A dataset field has no operator, the placeholder tells how it matches. */
  getValuePlaceholder(condition: FilterCondition): string {
    return condition.relation === "IN"
      ? "beam, test (separated by commas)"
      : "Contains this text, e.g. beam";
  }

  /** The units of the key, narrowed down by what is typed, all of them when the unit is complete. */
  getUnits(condition: FilterCondition): string[] {
    const units = condition.unitsOptions?.length
      ? condition.unitsOptions
      : this.unitsService.getUnits(condition.lhs);
    const typed = (condition.unit || "").trim().toLowerCase();

    return !typed || units.some((unit) => unit.toLowerCase() === typed)
      ? units
      : units.filter((unit) => unit.toLowerCase().includes(typed));
  }

  addRow(): void {
    const row = this.createRow(blankDraft());
    this.rows.update((rows) => [...rows, row]);
    this.revealRow(row.id);
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
        .map(({ condition }) => ({
          condition: isConditionComplete(condition)
            ? normalizeCondition(condition)
            : condition,
        })),
    );
  }
}
