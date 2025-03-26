import { Component } from "@angular/core";
import { JsonFormsControl } from "@jsonforms/angular";
import { rankWith, isEnumControl } from "@jsonforms/core";

@Component({
  selector: "app-custom-enum-renderer",
  template: `
    <mat-form-field appearance="outline">
      <mat-label>{{ label }}</mat-label>
      <mat-select [value]="data" (selectionChange)="onChange($event.value)">
        <mat-option
          *ngFor="let option of transformedOptions"
          [value]="option.value"
        >
          {{ option.label }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  `,
})
export class CustomEnumRenderer extends JsonFormsControl {
  transformedOptions = [];

  override ngOnInit() {
    super.ngOnInit();
    this.transformEnumOptions();
  }

  private transformEnumOptions() {
    const valueMap = {
      RE: "Directly after the submission has been processed",
      EP: "After the related EMDB entry has been released",
      HP: "After the related primary citation has been published",
      HO: "Delay release of entry by one year from the date of deposition",
    };

    this.transformedOptions = this.scopedSchema.enum.map((val) => ({
      value: val,
      label: valueMap[val] || val,
    }));
  }

  onChange(value: any) {
    this.onChange({ value });
  }
}

export const customEnumRenderer = {
  renderer: CustomEnumRenderer,
  tester: rankWith(3, isEnumControl),
};
