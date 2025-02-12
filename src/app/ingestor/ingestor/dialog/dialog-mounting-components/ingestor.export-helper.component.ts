import { Component, Injector } from "@angular/core";

export interface ExportOptions {
  exportSciCat: boolean;
  exportOrganizational: boolean;
  exportSample: boolean;
}

@Component({
  selector: "export-template-checkbox",
  template: `
    <div>
      <mat-checkbox [(ngModel)]="data.exportSciCat">Export SciCat</mat-checkbox>
      <mat-checkbox [(ngModel)]="data.exportOrganizational"
        >Export Organizational</mat-checkbox
      >
      <mat-checkbox [(ngModel)]="data.exportSample">Export Sample</mat-checkbox>
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
export class ExportTemplateHelperComponent {
  data: ExportOptions;

  constructor(public injector: Injector) {
    this.data = injector.get("data");
  }
}
