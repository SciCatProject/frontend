import { Component } from "@angular/core";

@Component({
  selector: "export-tempalte-checkbox",
  template: `
    <div>
      <mat-checkbox>Export SciCat</mat-checkbox>
      <mat-checkbox>Export Organizational</mat-checkbox>
      <mat-checkbox>Export Sample</mat-checkbox>
    </div>
  `,
  styles: [
    `
      div {
        display: flex;
        flex-direction: column;
      }
    `,
  ],
})
export class ExportTemplateHelperComponent {}
