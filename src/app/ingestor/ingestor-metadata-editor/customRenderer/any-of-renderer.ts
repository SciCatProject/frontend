import { Component } from "@angular/core";
import { JsonFormsAngularService, JsonFormsControl } from "@jsonforms/angular";
import { ControlProps, JsonSchema } from "@jsonforms/core";
import { configuredRenderer } from "../ingestor-metadata-editor-helper";
import { MatCheckboxChange } from "@angular/material/checkbox";

@Component({
  selector: "app-anyof-renderer",
  styleUrls: ["../ingestor-metadata-editor.component.scss"],
  template: `
    <mat-card class="anyof-group">
      <mat-card-title
        >{{ anyOfTitle }}
        <span class="spacer"></span>
        <mat-checkbox
          *ngIf="options.includes('null')"
          [(ngModel)]="!nullOptionSelected"
          (change)="onEnableCheckboxChange($event)"
        >
          Enabled
        </mat-checkbox></mat-card-title
      >
      <mat-card-content *ngIf="!nullOptionSelected">
        <mat-tab-group *ngIf="tabAmount > 1">
          animationDuration="0ms" [selectedIndex]="selectedTabIndex" >
          <mat-tab *ngFor="let option of filteredOptions" label="{{ option }}">
            <div *ngIf="option !== 'null'">
              <jsonforms
                [schema]="getTabSchema(option)"
                [data]="passedProps.data"
                [renderers]="defaultRenderer"
                (dataChange)="onInnerJsonFormsChange($event)"
              ></jsonforms>
            </div>
          </mat-tab>
        </mat-tab-group>

        <div *ngIf="tabAmount === 1">
          <jsonforms
            [schema]="getTabSchema(options[0])"
            [data]="passedProps.data"
            [renderers]="defaultRenderer"
            (dataChange)="onInnerJsonFormsChange($event)"
          ></jsonforms>
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class AnyOfRendererComponent extends JsonFormsControl {
  dataAsString: string;
  options: string[] = [];
  filteredOptions: string[] = [];
  anyOfTitle: string;
  nullOptionSelected = false;
  selectedTabIndex = 0; // default value
  tabAmount = 0; // max tabs

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

    if (this.options.includes("null") && !props.data) {
      this.selectedTabIndex = this.options.indexOf("null");
      this.nullOptionSelected = true;
    }

    this.filteredOptions = this.options.filter((option) => option !== "null");
    this.tabAmount = this.filteredOptions.length;
  }

  public getTabSchema(tabOption: string): JsonSchema {
    const selectedSchema = (this.passedProps.schema.anyOf as any).find(
      (option: any) =>
        option.title === tabOption ||
        option.type === tabOption ||
        JSON.stringify(option) === tabOption,
    );
    return selectedSchema;
  }

  public onEnableCheckboxChange(event: MatCheckboxChange) {
    this.nullOptionSelected = !event.checked;

    if (this.nullOptionSelected) {
      const updatedData =
        this.rendererService.getState().jsonforms.core.data ?? {};

      // Update the data in the correct path
      const pathSegments = this.passedProps.path.split(".");
      let current = updatedData ?? {};
      for (let i = 0; i < pathSegments.length - 1; i++) {
        current = current[pathSegments[i]];
      }
      current[pathSegments[pathSegments.length - 1]] = null;

      this.rendererService.setData(updatedData);
    }
  }

  public onInnerJsonFormsChange(event: any) {
    if (event !== this.passedProps.data) {
      const updatedData =
        this.rendererService.getState().jsonforms.core.data ?? {};

      // Update the data in the correct path
      const pathSegments = this.passedProps.path.split(".");
      let current = updatedData ?? {};
      for (let i = 0; i < pathSegments.length - 1; i++) {
        current = current[pathSegments[i]];
      }
      current[pathSegments[pathSegments.length - 1]] = event;

      this.rendererService.setData(updatedData);
    }
  }
}
