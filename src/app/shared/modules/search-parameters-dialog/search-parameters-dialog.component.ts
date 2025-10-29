import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AppConfigService } from "app-config.service";
import { map, startWith } from "rxjs/operators";
import { UnitsService } from "shared/services/units.service";
import { ScientificCondition } from "../../../state-management/models";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConnectedPosition } from "@angular/cdk/overlay";

export interface SearchParametersDialogData {
  parameterKeys: string[];
  usedFields: string[];
  condition?: ScientificCondition;
  humanNameMap?: { [key: string]: string };
}

@Component({
  selector: "search-parameters-dialog",
  templateUrl: "./search-parameters-dialog.component.html",
  styleUrls: ["./search-parameters-dialog.component.scss"],
  standalone: false,
})
export class SearchParametersDialogComponent {
  appConfig = this.appConfigService.getConfig();
  unitsEnabled = this.appConfig.scienceSearchUnitsEnabled;

  parameterKeys = this.data.parameterKeys;
  units: string[] = [];
  humanNameMap: { [key: string]: string } = {};
  hoverKey: string | null = null;

  overlayPositions: ConnectedPosition[] = [
    {
      originX: "end",
      originY: "center",
      overlayX: "start",
      overlayY: "center",
      offsetX: 8,
    },
    {
      originX: "center",
      originY: "center",
      overlayX: "end",
      overlayY: "top",
      offsetY: 8,
    },
  ];

  parametersForm = new FormGroup({
    lhs: new FormControl(this.data.condition?.lhs || "", [
      Validators.required,
      Validators.minLength(2),
    ]),
    relation: new FormControl(this.data.condition?.relation || "GREATER_THAN", [
      Validators.required,
      Validators.minLength(9),
    ]),
    rhs: new FormControl<string | number | number[]>(
      this.data.condition?.rhs || "",
      [Validators.required, Validators.minLength(1)],
    ),
    unit: new FormControl(""),
  });

  filteredUnits$ = this.parametersForm.get("unit")?.valueChanges.pipe(
    startWith(""),
    map((value: string) =>
      this.units.filter((unit) =>
        unit.toLowerCase().includes(value.toLowerCase()),
      ),
    ),
  );

  filteredKeys$ = this.parametersForm.get("lhs")?.valueChanges.pipe(
    startWith(""),
    map((value: string) =>
      this.parameterKeys.filter((key) =>
        key.toLowerCase().includes(value.toLowerCase()),
      ),
    ),
  );

  constructor(
    public appConfigService: AppConfigService,
    @Inject(MAT_DIALOG_DATA)
    public data: SearchParametersDialogData,
    public dialogRef: MatDialogRef<SearchParametersDialogComponent>,
    private unitsService: UnitsService,
    private snackBar: MatSnackBar,
  ) {
    if (this.data.condition?.lhs) {
      this.getUnits(this.data.condition.lhs);
    }
    this.humanNameMap = data.humanNameMap || {};
  }

  add = (): void => {
    const { lhs, relation, unit } = this.parametersForm.value;
    if (this.data.usedFields && this.data.usedFields.includes(lhs)) {
      this.snackBar.open("Field already used", "Close", {
        duration: 2000,
        panelClass: ["snackbar-warning"],
      });
      return;
    } else if (!this.parameterKeys.includes(lhs)) {
      this.snackBar.open("Field does not exist", "Close", {
        duration: 2000,
        panelClass: ["snackbar-warning"],
      });
      return;
    }

    const rawRhs = this.parametersForm.get("rhs")?.value;
    const rhs =
      relation === "EQUAL_TO_STRING" ? String(rawRhs) : Number(rawRhs);
    this.parametersForm.patchValue({ rhs });
    this.dialogRef.close({ data: { lhs, relation, rhs, unit } });
  };

  cancel = (): void => this.dialogRef.close();

  getUnits = (parameterKey: string): void => {
    this.units = this.unitsService.getUnits(parameterKey);
    this.toggleUnitField();
  };

  toggleUnitField = (): void => {
    const lhsInvalid = this.parametersForm.get("lhs")?.invalid;
    const { relation } = this.parametersForm.value;
    const isStringRelation = relation === "EQUAL_TO_STRING" ? true : false;
    const unitField = this.parametersForm.get("unit");
    unitField?.enable();
    if (lhsInvalid || isStringRelation) {
      unitField?.disable();
    }
  };

  get lhs(): string {
    return this.parametersForm.get("lhs")?.value;
  }

  getHumanName(key: string): string {
    return this.humanNameMap[key] || key;
  }
}
