import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from "@angular/core";
import {
  JsonFormsAngularService,
  JsonFormsControlWithDetail,
} from "@jsonforms/angular";
import {
  ControlProps,
  findUISchema,
  Generate,
  GroupLayout,
  setReadonly,
  UISchemaElement,
} from "@jsonforms/core";
import {
  configuredRenderer,
  convertJSONFormsErrorToString,
} from "../ingestor-metadata-editor-helper";
import { cloneDeep, startCase } from "lodash-es";
import isEmpty from "lodash/isEmpty";

@Component({
  selector: "app-object-group-renderer",
  styleUrls: ["../ingestor-metadata-editor.component.scss"],
  template: `
    <mat-card class="anyof-group">
      <mat-card-title
        >{{ objectTitle }}
        <span class="spacer"></span>
        <mat-icon
          *ngIf="this.error !== null && this.error !== ''"
          color="warn"
          matBadgeColor="warn"
          matTooltip="{{ this.error }}"
          matTooltipClass="error-message-tooltip"
        >
          error_outline
        </mat-icon>
      </mat-card-title>
      <mat-card-content>
        <div *ngIf="errorRecursiveStructure === false">
          <jsonforms-outlet
            [uischema]="detailUiSchema"
            [schema]="scopedSchema"
            [path]="propsPath"
          >
          </jsonforms-outlet>
        </div>

        <p *ngIf="errorRecursiveStructure">
          <mat-icon color="warn">error_outline</mat-icon>
          Recursive data structure in selected JSON Schema detected.
        </p>
      </mat-card-content>
    </mat-card>
  `,
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomObjectControlRendererComponent extends JsonFormsControlWithDetail {
  rendererService: JsonFormsAngularService;
  detailUiSchema: UISchemaElement;

  defaultRenderer = configuredRenderer;
  objectTitle: string;
  errorRecursiveStructure: boolean;

  constructor(service: JsonFormsAngularService) {
    super(service);
    this.rendererService = service;
  }

  public mapAdditionalProps(props: ControlProps) {
    const pathTitle = props.path || "Object";

    this.errorRecursiveStructure = this.isRecursive();

    this.objectTitle = pathTitle
      .replaceAll(".", " ")
      .replaceAll("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    const isQuantityValue =
      props.schema.title == "QuantityValue" ||
      props.schema.title == "QuantitySI";

    this.detailUiSchema = findUISchema(
      undefined,
      props.schema,
      props.uischema.scope,
      props.path,
      () => {
        const newSchema = cloneDeep(props.schema);
        return Generate.uiSchema(
          newSchema,
          isQuantityValue ? "QuantityValueLayout" : "VerticalLayout",
          undefined,
          this.rootSchema,
        );
      },
      props.uischema,
      props.rootSchema,
    );
    if (isEmpty(props.path)) {
      this.detailUiSchema.type = "VerticalLayout";
    } else {
      (this.detailUiSchema as GroupLayout).label = startCase(props.path);
    }
    if (!this.isEnabled()) {
      setReadonly(this.detailUiSchema);
    }

    // Get error from child elements
    const path = props.path || "";
    const allErrors =
      this.rendererService.getState().jsonforms.core.errors ?? [];
    const filteredErrors = allErrors.filter(
      (e) =>
        (e.instancePath === "" && path === "") ||
        e.instancePath === "/" + path.replaceAll(".", "/") ||
        e.instancePath.startsWith("/" + path.replaceAll(".", "/") + "/"),
    );

    this.error = convertJSONFormsErrorToString(filteredErrors);
  }

  isRecursive(): boolean {
    const rootSchemaAsString = JSON.stringify(this.scopedSchema);
    const scopedSchemaAsString = JSON.stringify(this.rootSchema);

    // Check if root and scoped schema are equal and if expected type is object
    if (
      rootSchemaAsString === scopedSchemaAsString &&
      ((Array.isArray(this.scopedSchema.type) &&
        this.scopedSchema.type.includes("object")) ||
        (typeof this.scopedSchema.type === "string" &&
          this.scopedSchema.type === "object"))
    ) {
      return true;
    }

    return false;
  }
}
