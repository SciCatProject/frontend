import { Component } from "@angular/core";
import {
  JsonFormsRendererRegistryEntry,
  rankWith,
  scopeEndsWith,
} from "@jsonforms/core";
import { FormsModule } from "@angular/forms"; // Import FormsModule here
import { NgFor, NgIf } from "@angular/common";

@Component({
  selector: "app-cross-ref-component",
  standalone: true,
  imports: [FormsModule, NgIf, NgFor], // Ensure FormsModule is available in the standalone component
  template: `
    <div>
      <p>EMDB reference</p>
      <div *ngFor="let ref of data; let i = index">
        <label for="name-{{ i }}">Reference {{ i + 1 }} </label>
        <input
          type="text"
          id="name-{{ i }}"
          [(ngModel)]="ref.name"
          [placeholder]="'EMD-XXXX'"
          [pattern]="pattern"
          [attr.title]="title"
        />
        <div *ngIf="!isValid(i)" style="color: red;">
          Invalid reference name
        </div>
      </div>
    </div>
  `,
})
export class CrossRefComponent {
  pattern = "^(EMD)-[0-9]{4,}$";
  title = "The Name Schema";

  data = [{ name: "EMD-8001" }, { name: "EMD-8002" }];

  isValid(index: number): boolean {
    const ref = this.data[index];
    const regex = new RegExp(this.pattern);
    return regex.test(ref?.name);
  }
}

export const emdbRefRendererEntry: JsonFormsRendererRegistryEntry = {
  tester: rankWith(10, scopeEndsWith("cross_references")),
  renderer: CrossRefComponent,
};
