import { Component, Inject } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AppConfigService } from "app-config.service";
import { map, startWith } from "rxjs/operators";
import { UnitsService } from "shared/services/units.service";
import { ScientificCondition } from "../../../state-management/models";
import { UnitsOptionsService } from "shared/services/units-options.service";
import { MatSnackBar } from "@angular/material/snack-bar";

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

  parametersForm = new FormGroup({
    lhs: new FormControl(this.data.condition?.lhs || "", [
      Validators.required,
      Validators.minLength(2),
    ]),
    relation: new FormControl(this.data.condition?.relation || "GREATER_THAN", [
      Validators.required,
      Validators.minLength(9),
    ]),
    rhs: new FormControl<string | number>(this.data.condition?.rhs || "", [
      Validators.required,
      Validators.minLength(1),
    ]),
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
    public data: {
      parameterKeys: string[];
      usedFields: string[];
      condition?: ScientificCondition;
    },
    public dialogRef: MatDialogRef<SearchParametersDialogComponent>,
    private unitsService: UnitsService,
    private unitsOptionsService: UnitsOptionsService,
    private snackBar: MatSnackBar,
  ) {
    this.applyUnitsOptions();
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

  applyUnitsOptions(): void {
    const lhs = this.data.condition?.lhs;
    const unitsOptions = this.data.condition?.unitsOptions;

    // if pre-configured condition has unitsOptions, store and use them.
    if (lhs && unitsOptions?.length) {
      this.unitsOptionsService.setUnitsOptions(lhs, unitsOptions);
      this.units = unitsOptions;
    } else if (lhs) {
      this.units =
        this.unitsOptionsService.getUnitsOptions(lhs) ??
        this.unitsService.getUnits(lhs);
    }
  }

  getUnits = (parameterKey: string): void => {
    const stored = this.unitsOptionsService.getUnitsOptions(parameterKey);
    if (stored?.length) {
      this.units = stored;
    } else if (this.data.condition?.unitsOptions?.length) {
      this.unitsOptionsService.setUnitsOptions(
        parameterKey,
        this.data.condition.unitsOptions,
      );
      this.units = this.data.condition.unitsOptions;
    } else {
      this.units = this.unitsService.getUnits(parameterKey);
    }
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
}
