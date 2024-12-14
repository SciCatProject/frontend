import { Component } from '@angular/core';
import { JsonFormsControl } from '@jsonforms/angular';
import { JsonSchema } from '@jsonforms/core';

@Component({
  selector: 'checkbox-with-price-control',
  template: `
    <div>
      <label>
        {{ label }}
        <input type="checkbox" [checked]="data" (change)="onCheckboxChange($event)" />
      </label>
    </div>
    <div *ngIf="schema.price > 50">
      <p>Versand ist kostenlos!</p>
    </div>
  `,
})
export class AnyOfRenderer extends JsonFormsControl {
  schema: JsonSchema;
  label: string;

  ngOnInit() {
    super.ngOnInit();
    this.schema = this.scopedSchema as JsonSchema;
    this.data = this.data || false;
    this.label = `${this.label} (${this.schema.title})`;
  }

  onCheckboxChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.data = input.checked;
    this.onChange(this.data);

    this.data = "TEST";
    
  }
}