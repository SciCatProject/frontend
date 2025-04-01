import { Component } from "@angular/core";
import { JsonFormsControl } from "@jsonforms/angular";
import { rankWith, isEnumControl } from "@jsonforms/core";
import {
  ReleaseDate,
  Scale,
  ExperimentType,
  CountryEnum,
  ExtendedJsonSchema,
} from "../depositionEMPIAR";

@Component({
  selector: "custom-enum-renderer",
  styleUrls: ["./renderer.styles.scss"],
  template: `
    <mat-form-field appearance="outline" class="custom-dropdown">
      <mat-label>{{ label }}</mat-label>
      <mat-select [value]="data" (selectionChange)="onEnumChange($event.value)">
        <mat-option
          *ngFor="let option of transformedOptions"
          [value]="option.value"
        >
          <span class="option-text">{{ option.label }}</span>
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
})
export class CustomEnumRendererComponent extends JsonFormsControl {
  transformedOptions = [];
  $id?: string;

  override ngOnInit() {
    super.ngOnInit();
    const propertyId = (this.scopedSchema as ExtendedJsonSchema).$id;
    if (propertyId == "/properties/release_date") {
      this.transformedOptions = this.scopedSchema.enum.map((val: string) => ({
        value: val,
        label: ReleaseDate[val] || val,
      }));
    } else if (propertyId == "/properties/scale") {
      this.transformedOptions = this.scopedSchema.enum.map((val: string) => ({
        value: val,
        label: Scale["S" + val] || val,
      }));
    } else if (propertyId.split("/").at(-1) == "country") {
      this.transformedOptions = this.scopedSchema.enum
        .map((val: string) => ({
          value: val,
          label: CountryEnum[val] || val,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
    } else if (propertyId == "/properties/experiment_type") {
      this.transformedOptions = this.scopedSchema.enum.map((val: string) => ({
        value: val,
        label: ExperimentType["E" + val] || val,
      }));
    } else {
      this.transformedOptions = this.scopedSchema.enum.map((val: string) => ({
        value: val,
        label: val,
      }));
    }
  }

  onEnumChange(value: string) {
    this.onChange({ value });
  }
}

export const customEnumRenderer = {
  renderer: CustomEnumRendererComponent,
  tester: rankWith(3, isEnumControl),
};
