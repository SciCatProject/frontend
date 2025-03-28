import { Component } from "@angular/core";
import { JsonFormsControl } from "@jsonforms/angular";
import { and, schemaTypeIs, rankWith, schemaMatches } from "@jsonforms/core";
@Component({
  selector: "custom-author-name-control",
  template: `
    <div>
      <mat-form-field appearance="outline">
        <mat-label>Last Name</mat-label>
        <input
          matInput
          [(ngModel)]="lastName"
          (ngModelChange)="onNameChange()"
        />
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>First Name(s)</mat-label>
        <input
          matInput
          [(ngModel)]="firstNames"
          (ngModelChange)="onNameChange()"
        />
      </mat-form-field>
    </div>
  `,
})
export class CustomAuthorNameControlComponent extends JsonFormsControl {
  lastName = "";
  firstNames = "";

  override ngOnInit() {
    super.ngOnInit();
    this.initializeValues();
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
