import { Component } from "@angular/core";
import { JsonFormsControl } from "@jsonforms/angular";
import {
  and,
  schemaTypeIs,
  rankWith,
  schemaMatches,
  ControlElement,
} from "@jsonforms/core";

@Component({
  selector: "custom-author-name-control",
  template: `
    <div>
      <mat-form-field appearance="outline">
        <mat-label>Last Name<span *ngIf="isRequired">*</span></mat-label>
        <input
          matInput
          [(ngModel)]="lastName"
          (ngModelChange)="onNameChange()"
        />
        <mat-error *ngIf="error">{{ error }}</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>First Name(s)<span *ngIf="isRequired">*</span></mat-label>
        <input
          matInput
          [(ngModel)]="firstNames"
          (ngModelChange)="onNameChange()"
        />
        <mat-error *ngIf="error">{{ error }}</mat-error>
      </mat-form-field>
    </div>
  `,
})
export class CustomAuthorNameControlComponent extends JsonFormsControl {
  lastName = "";
  firstNames = "";
  isRequired = false;

  override ngOnInit() {
    super.ngOnInit();
    this.initializeValues();
    this.checkIfRequired();
  }
  initializeValues() {
    if (this.data) {
      const nameMatch = this.data?.match(/\('(.+)', '(.+)'\)/);
      if (nameMatch) {
        this.lastName = nameMatch[1];
        this.firstNames = nameMatch[2];
      }
    }
  }

  checkIfRequired() {
    const controlElement = this.uischema as ControlElement;
    const schemaProperties = this.schema?.properties;
    if (controlElement?.scope && schemaProperties) {
      const propertyKey = controlElement.scope.replace("#/properties/", "");
      this.isRequired = this.schema?.required?.includes(propertyKey);
    }
  }

  onNameChange() {
    const initials = this.firstNames
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");

    const formattedName = `('${this.lastName}', '${initials}')`;

    if (this.onChange) {
      this.onChange({
        path: this.path,
        value: formattedName,
      });
    }
  }
}
export const customNameControlRenderer = {
  tester: rankWith(
    4,
    and(
      schemaTypeIs("string"),
      schemaMatches((schema) => schema.title === "The Name Schema "), // careful with space at the end..
    ),
  ),
  renderer: CustomAuthorNameControlComponent,
};
