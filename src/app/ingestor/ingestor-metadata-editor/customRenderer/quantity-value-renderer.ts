import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import {
  JsonFormsAngularService,
  JsonFormsControlWithDetail,
} from "@jsonforms/angular";
import {
  ControlProps,
  ControlWithDetailProps,
  findUISchema,
  Generate,
  GroupLayout,
  JsonSchema,
  RankedTester,
  rankWith,
  schemaMatches,
  setReadonly,
  UISchemaElement,
} from "@jsonforms/core";
import { cloneDeep, startCase } from "lodash-es";
import isEmpty from "lodash/isEmpty";

@Component({
  selector: "quantity-value-renderer",
  styleUrls: ["../ingestor-metadata-editor.component.scss"],
  template: `
    <mat-card class="anyof-group">
      <mat-card-title>{{ objectTitle }}</mat-card-title>
      <mat-card-content>
        <jsonforms-outlet
          [uischema]="detailUiSchema"
          [schema]="scopedSchema"
          [path]="propsPath"
        >
        </jsonforms-outlet>
      </mat-card-content>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantityValueObjectComponent
  extends JsonFormsControlWithDetail
  implements OnInit
{
  detailUiSchema: UISchemaElement;
  focused = false;
  objectTitle: string;

  props: ControlProps;

  constructor(jsonformsService: JsonFormsAngularService) {
    super(jsonformsService);
  }

  public mapAdditionalProps(props: ControlWithDetailProps) {
    super.mapAdditionalProps(props);
    this.props = props;

    const pathTitle = props.path || "Quantity Value";

    this.objectTitle = pathTitle
      .replaceAll("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    this.detailUiSchema = findUISchema(
      props.uischemas,
      props.schema,
      props.uischema.scope,
      props.path,
      () => {
        const newSchema = cloneDeep(props.schema);
        return Generate.uiSchema(
          newSchema,
          "QuantityValueLayout",
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
  }

  ngOnInit() {
    // Call ngOnInit from super class
    super.ngOnInit();
    if (this.form.disabled) {
      this.form.enable();
    }
  }
}

export const quantityValueTester: RankedTester = rankWith(
  5,
  schemaMatches((schema: JsonSchema) => {
    return schema.title === "QuantityValue" || schema.title === "QuantitySI";
  }),
);
