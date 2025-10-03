import { Component, Injector } from "@angular/core";

export interface ExportOptions {
  exportSciCat: boolean;
  exportOrganizational: boolean;
  exportSample: boolean;
  exportAll: boolean;
  exportAsJSON: boolean;
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
      <mat-divider></mat-divider>
      <i>Additional options</i>
      <mat-checkbox [(ngModel)]="data.exportAll" (change)="onExportAllChange()"
        >Export All (includes extracted metadata)</mat-checkbox
      >
      <mat-checkbox [(ngModel)]="data.exportAsJSON"
        >Export As JSON (not a template format)</mat-checkbox
      >
      <mat-divider></mat-divider>
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
  standalone: false,
})
export class ExportTemplateHelperComponent {
  data: ExportOptions;

  constructor(public injector: Injector) {
    this.data = injector.get("data");
  }

  onExportAllChange() {
    if (this.data.exportAll) {
      this.data.exportSciCat = true;
      this.data.exportOrganizational = true;
      this.data.exportSample = true;
    }
  }
}
