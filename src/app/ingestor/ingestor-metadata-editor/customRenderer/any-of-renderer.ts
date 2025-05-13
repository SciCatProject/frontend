import { Component } from "@angular/core";
import { JsonFormsAngularService, JsonFormsControl } from "@jsonforms/angular";
import {
  ControlProps,
  findUISchema,
  Generate,
  GroupLayout,
  JsonSchema,
  setReadonly,
  UISchemaElement,
} from "@jsonforms/core";
import { configuredRenderer } from "../ingestor-metadata-editor-helper";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { cloneDeep, isEmpty, startCase } from "lodash-es";

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
            <div class="mat-tab-content-renderer" *ngIf="option !== 'null'">
              <jsonforms-outlet
                [uischema]="getUISchema(option)"
                [schema]="getTabSchema(option)"
                [path]="propsPath"
              >
              </jsonforms-outlet>
            </div>
          </mat-tab>
        </mat-tab-group>

        <div *ngIf="tabAmount === 1">
          <jsonforms-outlet
            [uischema]="getUISchema(options[0])"
            [schema]="getTabSchema(options[0])"
            [path]="propsPath"
          >
          </jsonforms-outlet>
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

  public getUISchema(tabOption: string): UISchemaElement {
    const selectedSchema = this.getTabSchema(tabOption);

    const isQuantityValue =
      selectedSchema.title == "QuantityValue" ||
      selectedSchema.title == "QuantitySI";

    const detailUiSchema = findUISchema(
      undefined,
      selectedSchema,
      this.passedProps.uischema.scope,
      this.passedProps.path,
      () => {
        const newSchema = cloneDeep(selectedSchema);
        return Generate.uiSchema(
          newSchema,
          isQuantityValue ? "QuantityValueLayout" : "VerticalLayout",
          undefined,
          this.rootSchema,
        );
      },
      this.passedProps.uischema,
      this.passedProps.rootSchema,
    );
    if (isEmpty(this.passedProps.path)) {
      detailUiSchema.type = "VerticalLayout";
    } else {
      (detailUiSchema as GroupLayout).label = startCase(this.passedProps.path);
    }
    if (!this.isEnabled()) {
      setReadonly(detailUiSchema);
    }

    return detailUiSchema;
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

    const updatedData =
      this.rendererService.getState().jsonforms.core.data ?? {};

    // Update the data in the correct path
    const pathSegments = this.passedProps.path.split(".");
    let current = updatedData ?? {};
    for (let i = 0; i < pathSegments.length - 1; i++) {
      current = current[pathSegments[i]];
    }
    current[pathSegments[pathSegments.length - 1]] = this.nullOptionSelected
      ? null
      : {};

    this.rendererService.setData(updatedData);
  }
}
