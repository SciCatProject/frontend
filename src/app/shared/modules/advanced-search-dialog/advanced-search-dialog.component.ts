import {
  Component,
  Inject,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { cloneDeep } from "lodash-es";
import {
  ConditionConfig,
  ScientificCondition,
  ScientificConditionRelation,
} from "state-management/models";
import { UnitsService } from "shared/services/units.service";
import { UnitsOptionsService } from "shared/services/units-options.service";

export interface AdvancedSearchDialogData {
  conditions: ConditionConfig[];
  metadataKeys: string[];
  unitsEnabled?: boolean;
  dialogTitle?: string;
  conditionSettingScope?: "dataset" | "sample";
  humanNameMap?: { [key: string]: string };
  focusConditionLhs?: string;
}

export interface ConditionCategoryGroup {
  name: string;
  icon: string;
  keys: string[];
}

@Component({
  selector: "advanced-search-dialog",
  templateUrl: "./advanced-search-dialog.component.html",
  styleUrls: ["./advanced-search-dialog.component.scss"],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class AdvancedSearchDialogComponent implements OnInit {
  dialogTitle: string;
  metadataKeys: string[] = [];
  unitsEnabled = false;
  humanNameMap: { [key: string]: string } = {};

  configuredConditions: ConditionConfig[] = [];
  focusedConditionLhs = "";
  searchTerm = "";
  selectedCategory = "all";

  operatorOptions: { value: ScientificConditionRelation; label: string; symbol: string }[] = [
    { value: "EQUAL_TO", label: "Equals", symbol: "=" },
    { value: "GREATER_THAN", label: "Greater than", symbol: ">" },
    { value: "LESS_THAN", label: "Less than", symbol: "<" },
    { value: "GREATER_THAN_OR_EQUAL", label: "Greater or equal", symbol: "≥" },
    { value: "LESS_THAN_OR_EQUAL", label: "Less or equal", symbol: "≤" },
    { value: "RANGE", label: "In range", symbol: "<->" },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AdvancedSearchDialogData,
    public dialogRef: MatDialogRef<AdvancedSearchDialogComponent>,
    private unitsService: UnitsService,
    private unitsOptionsService: UnitsOptionsService,
  ) {
    this.dialogTitle = data.dialogTitle || "Advanced Search";
    this.metadataKeys = data.metadataKeys || [];
    this.unitsEnabled = Boolean(data.unitsEnabled);
    this.humanNameMap = data.humanNameMap || {};
    this.configuredConditions = cloneDeep(data.conditions || []);
    this.focusedConditionLhs = data.focusConditionLhs || "";
  }

  ngOnInit(): void {
    // Ensure all range conditions have array rhs
    this.configuredConditions.forEach((c) => {
      if (c.condition.relation === "RANGE" && !Array.isArray(c.condition.rhs)) {
        c.condition.rhs = [c.condition.rhs || "", ""];
      }
    });

    if (this.focusedConditionLhs) {
      setTimeout(() => {
        document
          .querySelector(
            `[data-condition-key="${CSS.escape(this.focusedConditionLhs)}"]`,
          )
          ?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
    }
  }

  getHumanName(key: string): string {
    if (!key) return "";
    if (this.humanNameMap[key]) return this.humanNameMap[key];

    const parts = key.split(".");
    const lastPart = parts[parts.length - 1];
    return lastPart
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }

  getUnits(parameterKey: string): string[] {
    const stored = this.unitsOptionsService.getUnitsOptions(parameterKey);
    if (stored?.length) return stored;
    return this.unitsService.getUnits(parameterKey);
  }

  getCategories(): ConditionCategoryGroup[] {
    const term = (this.searchTerm || "").trim().toLowerCase();
    const allKeys = this.metadataKeys || [];

    const filtered = allKeys.filter((key) => {
      if (!term) return true;
      const human = (this.getHumanName(key) || "").toLowerCase();
      const raw = (key || "").toLowerCase();
      return raw.includes(term) || human.includes(term);
    });

    const sampleKeys: string[] = [];
    const instrumentKeys: string[] = [];
    const timingKeys: string[] = [];
    const motionKeys: string[] = [];
    const polarizationKeys: string[] = [];
    const otherKeys: string[] = [];

    for (const key of filtered) {
      const text = `${key} ${this.getHumanName(key)}`.toLowerCase();

      if (
        /gonio|stage|omega|kappa|phi|rotation|translation|cradle|motor|axis|tilt|yaw|pitch|position/i.test(
          text,
        )
      ) {
        motionKeys.push(key);
      } else if (/polariz|spin|flipper|magnet|guide_field/i.test(text)) {
        polarizationKeys.push(key);
      } else if (
        /time|date|start|stop|duration|timestamp|period|interval|delay|epoch/i.test(
          text,
        )
      ) {
        timingKeys.push(key);
      } else if (
        /sample|space_group|spacegroup|crystal|chemical|formula|compound|mass|density|lattice|solute|solvent|composition|structure/i.test(
          text,
        )
      ) {
        sampleKeys.push(key);
      } else if (
        /instrument|detector|beam|source|wavelength|energy|filter|slit|attenuator|collimator|flux|aperture|monochromator|chopper|technique|mode|measurement/i.test(
          text,
        )
      ) {
        instrumentKeys.push(key);
      } else {
        otherKeys.push(key);
      }
    }

    const groups: ConditionCategoryGroup[] = [];
    if (sampleKeys.length)
      groups.push({ name: "Sample", icon: "science", keys: sampleKeys });
    if (instrumentKeys.length)
      groups.push({ name: "Instrument", icon: "precision_manufacturing", keys: instrumentKeys });
    if (timingKeys.length)
      groups.push({ name: "Timing", icon: "schedule", keys: timingKeys });
    if (motionKeys.length)
      groups.push({ name: "Motion Stages", icon: "open_with", keys: motionKeys });
    if (polarizationKeys.length)
      groups.push({ name: "Polarization", icon: "alt_route", keys: polarizationKeys });
    if (otherKeys.length)
      groups.push({ name: "Other", icon: "category", keys: otherKeys });

    return groups;
  }

  trackByCategory(index: number, group: ConditionCategoryGroup): string {
    return group.name;
  }

  trackByKey(index: number, key: string): string {
    return key;
  }

  isKeyConfigured(key: string): boolean {
    return this.configuredConditions.some((c) => c.condition.lhs === key);
  }

  addCondition(key: string): void {
    const existingIndex = this.configuredConditions.findIndex(
      (c) => c.condition.lhs === key,
    );

    if (existingIndex !== -1) {
      this.configuredConditions[existingIndex].enabled = true;
      return;
    }

    const availableUnits = this.getUnits(key);
    const newCondition: ConditionConfig = {
      condition: {
        lhs: key,
        relation: "EQUAL_TO",
        rhs: "",
        unit: availableUnits.length ? availableUnits[0] : "",
        human_name: this.getHumanName(key),
      },
      enabled: true,
    };

    this.configuredConditions = [...this.configuredConditions, newCondition];
  }

  removeCondition(index: number): void {
    const updated = [...this.configuredConditions];
    updated.splice(index, 1);
    this.configuredConditions = updated;
  }

  clearAll(): void {
    this.configuredConditions = [];
  }

  toggleEnabled(index: number, checked: boolean): void {
    if (this.configuredConditions[index]) {
      this.configuredConditions[index].enabled = checked;
    }
  }

  updateOperator(index: number, relation: ScientificConditionRelation): void {
    const item = this.configuredConditions[index];
    if (!item) return;

    item.condition.relation = relation;
    if (relation === "RANGE") {
      if (!Array.isArray(item.condition.rhs)) {
        item.condition.rhs = [item.condition.rhs || "", ""];
      }
    } else {
      if (Array.isArray(item.condition.rhs)) {
        item.condition.rhs = item.condition.rhs[0] || "";
      }
    }
  }

  updateValue(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.configuredConditions[index]) {
      this.configuredConditions[index].condition.rhs = input.value;
    }
  }

  updateRangeValue(index: number, rangeIdx: 0 | 1, event: Event): void {
    const input = event.target as HTMLInputElement;
    const item = this.configuredConditions[index];
    if (!item) return;

    if (!Array.isArray(item.condition.rhs)) {
      item.condition.rhs = ["", ""];
    }
    const current = [...item.condition.rhs];
    current[rangeIdx] = input.value;
    item.condition.rhs = current;
  }

  updateUnit(index: number, unit: string): void {
    if (this.configuredConditions[index]) {
      this.configuredConditions[index].condition.unit = unit;
    }
  }

  getOperatorUIValue(relation: string): ScientificConditionRelation {
    if (relation === "EQUAL_TO_NUMERIC" || relation === "EQUAL_TO_STRING") {
      return "EQUAL_TO";
    }
    return (relation as ScientificConditionRelation) || "EQUAL_TO";
  }

  apply(): void {
    this.dialogRef.close({
      applied: true,
      conditions: this.configuredConditions,
    });
  }

  cancel(): void {
    this.dialogRef.close({ applied: false });
  }

  trackByCondition(index: number, item: ConditionConfig): string {
    return `${item.condition.lhs}-${index}`;
  }
}
