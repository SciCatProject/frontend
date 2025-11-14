import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from "@angular/core";
import { JsonFormsControl, JsonFormsAngularService } from "@jsonforms/angular";
import { JsonSchema, RankedTester, rankWith } from "@jsonforms/core";

/**
 * Custom renderer for objects with additionalProperties that allows
 * users to dynamically add/remove key-value pairs
 */
@Component({
  selector: "app-dynamic-object-renderer",
  styleUrls: ["./ingestor-renderer.component.scss"],
  templateUrl: "./dynamic-object-renderer.html",
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicObjectRendererComponent extends JsonFormsControl {
  newKey = "";
  newValue: any = "";
  rendererService: JsonFormsAngularService;

  constructor(
    service: JsonFormsAngularService,
    private cdr: ChangeDetectorRef,
  ) {
    super(service);
    this.rendererService = service;
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  get keys(): string[] {
    return this.data && typeof this.data === "object"
      ? Object.keys(this.data)
      : [];
  }

  getDataValue(): Record<string, any> {
    return this.data || {};
  }

  addProperty(): void {
    if (!this.newKey || this.newKey.trim() === "") {
      return;
    }

    const key = this.newKey.trim();
    const currentData = this.getDataValue();
    const updated = { ...currentData, [key]: this.newValue };

    this.updateData(updated);

    this.newKey = "";
    this.newValue = "";
    this.cdr.markForCheck();
  }

  removeProperty(key: string): void {
    const currentData = this.getDataValue();
    const updated = { ...currentData };
    delete updated[key];

    this.updateData(updated);
    this.cdr.markForCheck();
  }

  onKeyChange(oldKey: string, event: Event): void {
    const newKey = (event.target as HTMLInputElement).value;
    if (!newKey || newKey.trim() === "" || oldKey === newKey) {
      return;
    }

    const currentData = this.getDataValue();
    const updated = { ...currentData };
    updated[newKey] = updated[oldKey];
    delete updated[oldKey];

    this.updateData(updated);
    this.cdr.markForCheck();
  }

  onValueChange(key: string, event: Event): void {
    const newValue = (event.target as HTMLInputElement).value;
    const currentData = this.getDataValue();
    const updated = { ...currentData, [key]: newValue };

    this.updateData(updated);
    this.cdr.markForCheck();
  }

  updateData(updated: Record<string, any>): void {
    this.rendererService.setData(updated);
  }

  trackByKey(_index: number, key: string): string {
    return key;
  }
}

/**
 * Tester that checks if schema is an object with additionalProperties
 * and no defined properties (or empty properties)
 */
export const dynamicObjectRendererTester: RankedTester = rankWith(
  100,
  (uischema, schema: JsonSchema) => {
    return (
      schema?.type === "object" &&
      schema?.additionalProperties !== undefined &&
      schema?.additionalProperties !== false &&
      (!schema?.properties || Object.keys(schema.properties).length === 0)
    );
  },
);
