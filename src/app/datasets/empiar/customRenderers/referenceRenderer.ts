import { Component } from "@angular/core";
import { JsonFormsControl } from "@jsonforms/angular";
import { and, rankWith, schemaTypeIs, schemaMatches } from "@jsonforms/core";
import { ExtendedJsonSchema } from "../depositionEMPIAR";

@Component({
  selector: "custom-reference-control",
  template: `
    <div style="width: 20%;">
      <mat-form-field appearance="outline" style="width: 100%;">
        <input
          matInput
          [(ngModel)]="referenceValue"
          (ngModelChange)="onReferenceChange()"
          [required]="isRequired"
          [pattern]="pattern"
        />
        <mat-error *ngIf="isRequired && !referenceValue"
          >This field is required.</mat-error
        >
        <mat-error *ngIf="referenceValue && !referenceValue.match(pattern)">
          Please enter a valid reference.
        </mat-error>
      </mat-form-field>
    </div>
  `,
})
export class CustomReferenceControlComponent extends JsonFormsControl {
  referenceValue = "";
  isRequired = false;
  pattern: string | undefined;

  override ngOnInit() {
    super.ngOnInit();
    this.initializeValue();
    console.log(this.schema);
    if (
      this.schema.required &&
      this.schema.required.includes(this.uischema.scope.split("/").pop())
    ) {
      this.isRequired = true;
    }
    if (this.schema?.properties?.name?.pattern) {
      this.pattern = this.schema.properties.name.pattern;
    }
  }

  initializeValue() {
    if (this.data) {
      this.referenceValue = this.data;
    }
  }

  onReferenceChange() {
    if (this.onChange) {
      this.onChange({
        path: this.path,
        value: this.referenceValue,
      });
    }
  }
}

export const customReferenceControlRenderer = {
  tester: rankWith(
    5,
    and(
      schemaTypeIs("string"),
      schemaMatches((schema) => {
        const schemaId = (schema as ExtendedJsonSchema).$id;
        return schemaId.includes("reference");
      }),
      schemaMatches((schema) => {
        return schema.title === "The Name Schema "; // careful with space at the end..
      }),
    ),
  ),
  renderer: CustomReferenceControlComponent,
};
