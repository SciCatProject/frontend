import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from "@angular/core";
import {
  JsonFormsAngularService,
  JsonFormsControlWithDetail,
} from "@jsonforms/angular";
import {
  ControlProps,
  findUISchema,
  Generate,
  GroupLayout,
  RankedTester,
  setReadonly,
  UISchemaElement,
} from "@jsonforms/core";
import { ObjectControlRendererTester } from "@jsonforms/angular-material";
import { convertJSONFormsErrorToString } from "./ingestor-renderer-helper";
import { cloneDeep, startCase } from "lodash-es";
import isEmpty from "lodash/isEmpty";

@Component({
  selector: "app-object-group-renderer",
  styleUrls: ["./ingestor-renderer.component.scss"],
  templateUrl: "./object-group-renderer.html",
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomObjectControlRendererComponent extends JsonFormsControlWithDetail {
  rendererService: JsonFormsAngularService;
  detailUiSchema: UISchemaElement;

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

export const objectGroupRendererTester: RankedTester =
  ObjectControlRendererTester;
