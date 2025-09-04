import { Component } from "@angular/core";
import { JsonFormsControl } from "@jsonforms/angular";
import {
  and,
  or,
  rankWith,
  schemaTypeIs,
  schemaMatches,
  scopeEndsWith,
} from "@jsonforms/core";
import { ExtendedJsonSchema } from "../depositionEMPIAR";
@Component({
  selector: "custom-semi-enum-control",
  styleUrls: ["./renderer.styles.scss"],
  template: `
    <div class="voxel-type-container">
      <label class="voxel-type-label">{{ title }}</label>
      <mat-radio-group
        [(ngModel)]="selectedType"
        (change)="onVoxelTypeChange()"
        class="voxel-type-radio-group"
      >
        <mat-radio-button
          *ngFor="let option of options"
          [value]="option.code"
          class="voxel-type-radio-button"
        >
          {{ option.label }}
        </mat-radio-button>
        <mat-radio-button value="OT" class="voxel-type-radio-button"
          >Other</mat-radio-button
        >
      </mat-radio-group>
      <mat-form-field
        *ngIf="selectedType === 'OT'"
        appearance="outline"
        class="voxel-type-input"
      >
        <mat-label>Specify Voxel Type</mat-label>
        <input
          matInput
          [(ngModel)]="otherType"
          (ngModelChange)="onVoxelTypeChange()"
        />
      </mat-form-field>
    </div>
  `,
  standalone: false,
})
export class CustomSemiEnumControlComponent extends JsonFormsControl {
  voxelOptions = [
    { code: "T1", label: "Unsigned Byte" },
    { code: "T2", label: "Signed Byte" },
    { code: "T3", label: "Unsigned 16-bit Integer" },
    { code: "T4", label: "Signed 16-bit Integer" },
    { code: "T5", label: "Unsigned 32-bit Integer" },
    { code: "T6", label: "Signed 32-bit Integer" },
    { code: "T7", label: "32-bit Float" },
    { code: "T8", label: "Bit" },
    { code: "T9", label: "4-bit Integer" },
  ];
  dataFormatOptions = [
    { code: "T1", label: "MRC" },
    { code: "T2", label: "MRCS" },
    { code: "T3", label: "TIFF" },
    { code: "T4", label: "IMAGIC" },
    { code: "T5", label: "DM3" },
    { code: "T6", label: "DM4" },
    { code: "T7", label: "SPIDER" },
    { code: "T8", label: "BIG DATA VIEWER HDF5" },
    { code: "T9", label: "EER" },
    { code: "T10", label: "PNG" },
    { code: "T11", label: "JPEG" },
    { code: "T12", label: "SMV" },
    { code: "T13", label: "EM" },
    { code: "T14", label: "TPX3" },
  ];
  headerFormatOptions = [
    { code: "T1", label: "MRC" },
    { code: "T2", label: "MRCS" },
    { code: "T3", label: "TIFF" },
    { code: "T4", label: "IMAGIC" },
    { code: "T5", label: "DM3" },
    { code: "T6", label: "DM4" },
    { code: "T7", label: "SPIDER" },
    { code: "T8", label: "XML" },
    { code: "T9", label: "EER" },
    { code: "T10", label: "PNG" },
    { code: "T11", label: "JPEG" },
    { code: "T12", label: "SMV" },
    { code: "T13", label: "EM" },
    { code: "T14", label: "TPX3" },
  ];
  categoryOptions = [
    { code: "T1", label: "Micrographs - Single Frame" },
    { code: "T2", label: "Micrographs - Multiframe" },
    { code: "T3", label: "Micrographs - Focal Pairs - Unprocessed" },
    { code: "T4", label: "Micrographs - Focal Pairs - Contrast Inverted" },
    { code: "T5", label: "Picked Particles - Single Frame - Unprocessed" },
    { code: "T6", label: "Picked Particles - Multiframe - Unprocessed" },
    { code: "T7", label: "Picked Particles - Single Frame - Processed" },
    { code: "T8", label: "Picked Particles - Multiframe - Processed" },
    { code: "T9", label: "Tilt Series" },
    { code: "T10", label: "Class Averages" },
    { code: "T11", label: "Stitched Maps" },
    { code: "T12", label: "Diffraction Images" },
    { code: "T13", label: "Reconstructed Volumes" },
    { code: "T14", label: "Subtomograms" },
  ];

  selectedType = "";
  otherType = "";
  $id = "";
  options = [];
  title = "";

  override ngOnInit() {
    super.ngOnInit();
    const propertyId = (this.scopedSchema as ExtendedJsonSchema).$id;
    this.title = (this.scopedSchema as ExtendedJsonSchema).title;
    if (propertyId == "/properties/imagesets/items/properties/category") {
      this.options = this.categoryOptions;
    } else if (
      propertyId == "/properties/imagesets/items/properties/header_format"
    ) {
      this.options = this.headerFormatOptions;
    } else if (
      propertyId == "/properties/imagesets/items/properties/data_format"
    ) {
      this.options = this.dataFormatOptions;
    } else if (
      propertyId == "/properties/imagesets/items/properties/voxel_type"
    ) {
      this.options = this.voxelOptions;
    }
    this.initializeValue();
  }

  initializeValue() {
    if (this.data) {
      const match = this.data.match(/\('(.+)', '([^']*)'\)/);
      if (match) {
        this.selectedType = match[1];
        this.otherType = match[2] || "";
      }
    }
  }

  onVoxelTypeChange() {
    const formattedValue =
      this.selectedType === "OT"
        ? `('OT', '${this.otherType}')`
        : `('${this.selectedType}', '')`;

    if (this.onChange) {
      this.onChange({ path: this.path, value: formattedValue });
    }
  }
}

export const customSemiEnumControlRenderer = {
  tester: rankWith(
    5,
    and(
      schemaTypeIs("string"),
      schemaMatches((schema) => {
        const schemaId = (schema as ExtendedJsonSchema).$id;
        return schemaId.includes("imagesets");
      }),
      or(
        scopeEndsWith("category"),
        scopeEndsWith("header_format"),
        scopeEndsWith("data_format"),
        scopeEndsWith("voxel_type"),
      ),
    ),
  ),
  renderer: CustomSemiEnumControlComponent,
};
