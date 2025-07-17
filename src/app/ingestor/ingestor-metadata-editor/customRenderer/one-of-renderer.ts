import { Component } from "@angular/core";
import { JsonFormsAngularService, JsonFormsControl } from "@jsonforms/angular";
import { ControlProps, JsonSchema } from "@jsonforms/core";
import { configuredRenderer } from "../ingestor-metadata-editor-helper";

@Component({
  selector: "app-oneof-component",
  styleUrls: ["../ingestor-metadata-editor.component.scss"],
  template: `
    <div class="anyof-group">
      <p>{{ anyOfTitle }}</p>
      <mat-radio-group [(ngModel)]="selectedOption" (change)="onOptionChange()">
        <mat-radio-button
          *ngFor="let option of options"
          [value]="option"
          style="margin-right: 10px;"
        >
          {{ option }}
        </mat-radio-button>
      </mat-radio-group>
      <div
        style="margin-top: 20px;"
        *ngIf="selectedAnyOption && selectedOption !== 'null'"
      >
        <jsonforms
          [schema]="selectedAnyOption"
          [data]="passedProps.data"
          [renderers]="defaultRenderer"
          (dataChange)="onInnerJsonFormsChange($event)"
        ></jsonforms>
      </div>
    </div>
  `,
})
export class OneOfRendererComponent extends JsonFormsControl {
  dataAsString: string;
  options: string[] = [];
  anyOfTitle: string;
  selectedOption: string;
  selectedAnyOption: JsonSchema;

  rendererService: JsonFormsAngularService;

  defaultRenderer = configuredRenderer;
  passedProps: ControlProps;

  constructor(service: JsonFormsAngularService) {
    super(service);
    this.rendererService = service;
  }

  public mapAdditionalProps(props: ControlProps) {
    this.passedProps = props;
    this.anyOfTitle = props.label || "AnyOf";
    this.options = props.schema.anyOf.map(
      (option: any) => option.title || option.type || JSON.stringify(option),
    );
    if (!props.data) {
      this.selectedOption = "null"; // Auf "null" setzen, wenn die Daten leer sind
    }
  }

  public onOptionChange() {
    this.selectedAnyOption = (this.passedProps.schema.anyOf as any).find(
      (option: any) =>
        option.title === this.selectedOption ||
        option.type === this.selectedOption ||
        JSON.stringify(option) === this.selectedOption,
    );
  }

  public onInnerJsonFormsChange(event: any) {
    // Check if data is equal to the passedProps.data
    if (event !== this.passedProps.data) {
      const updatedData = this.rendererService.getState().jsonforms.core.data;

      // aktualisiere das aktuelle Datenobjekt
      const pathSegments = this.passedProps.path.split(".");
      let current = updatedData;
      for (let i = 0; i < pathSegments.length - 1; i++) {
        current = current[pathSegments[i]];
      }
      current[pathSegments[pathSegments.length - 1]] = event;

      this.rendererService.setData(updatedData);
    }
  }
}
